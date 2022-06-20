const express = require ('express')
const dotenv = require ('dotenv')
const connectDB = require('./config/db')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const passport = require('passport')
const session = require('express-sesions')



// Load config 
dotenv.config({path: './config/config.env'})

connectDB()

const app = express()

if (process.env.NODE_ENV === 'developement'){
    app.use(morgan('dev'))
}

// Passport config
require('./config/passport')(passport)

// Handle bars
app.engine('.hbs', exphbs.engine({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

// Routes
app.use('/', require('./routes/index'))
app.use('/', require('./routes/auth'))

// Sessions
app.use(session({
    secret: 'Keyboard cat',
    resave: false,
    saveUninitialized: false
}))
// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// static
app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000// if port 3000 is not working redirect to port 5000

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`))