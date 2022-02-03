const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')

let session

router.get('/register', (req,res)=>{
    res.render('users/register.ejs')
})

router.post('/register',(req,res)=>{
    if(req.body.password === req.body.verifyPassword) {
    const salt = bcrypt.genSaltSync(10)
    req.body.password = bcrypt.hashSync(req.body.password, salt)
    req.body.verifyPassword = bcrypt.hashSync(req.body.verifyPassword, salt)
    
    User.findOne({username:req.body.username},(error,userExists)=>{
    if(userExists){
        console.log('This username is taken!')
        res.redirect('/users/register')
    } else {
        User.create(req.body, (error, createdUser) => {
            req.session.currentUser = createdUser
            res.redirect('/smarttrading')
        })
    }})
    } else {
        console.log('Please enter the same password for both fields!')
        res.redirect('/users/register')
    } 
})

router.get('/signin', (req,res)=>{
    session=req.session
    if(session.userid){
        console.log('Welcome User')
        res.redirect('/smarttrading')
    } else {
    res.render('users/signing.ejs')
    }
})

router.post('/signin', (req,res)=>{
    User.findOne({username:req.body.username},(error,foundUser)=>{
        if(foundUser){
            const validLogin = bcrypt.compareSync(req.body.password,foundUser.password)
            if(validLogin){
                req.session.createdUser = foundUser
                session = req.session
                session.userid = req.body.username
                console.log(req.session)  
                console.log('User logged in!')
                res.redirect('/smarttrading')
            } else {
                console.log('Invalid username or password')
            }
        } else{
            console.log('Invalid username or password')
        }
    })
})

router.get('/signout',(req,res)=>{
    req.session.destroy()
    res.redirect("/smarttrading")
})

module.exports = router