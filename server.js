const express = require('express')
const app = express()
const methodOverride = require('method-override')
require('dotenv').config()
const cookieParser = require("cookie-parser");
const session = require('express-session')
const Chart = require('chart.js')


const mongoose = require('mongoose')

const mongoURI = process.env.MONGODB_URI

const db = mongoose.connection

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, ()=> {
    console.log('database connected')
})

db.on('error', err => { console.log('ERROR: ', err) })
db.on('connected', () => { console.log('mongo connected')})
db.on('disconnected', () => { console.log('mongo disconnected')})

app.use(express.static(__dirname + '/public'))

app.use(express.urlencoded({extended:true}))

app.use(methodOverride('_method'))

app.use(cookieParser());

const SESSION_SECRET = process.env.SESSION_SECRET

const oneHour = 1000*60*60  

app.use(
    session({
        secret: SESSION_SECRET,
        resave: false,
        cookie: {maxAge: oneHour},
        saveUninitialized: true       
    })
)

const stockController = require('./controllers/stockController')
const userController = require('./controllers/userController')


app.use('/users', userController)
app.use('/smarttrading', stockController)


app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server is listening on PORT : ${process.env.PORT}`)
})