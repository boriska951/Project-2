const express = require('express')
const app = express()
const router = express.Router()

const Watchlist = require("../models/watchlist")

const authRequired = (req,res,next) =>{
    if(req.session.createdUser){
        next()
    } else {
        console.log('You must be logged in to do that')
        console.log(req.session)
    }
}

const pathArray = ['AAPL','AFRM','AMZN','CRM','FB','MDB','MSFT','NMRK','TSLA','UPST']

router.get('/', (req,res)=>{
    res.render('index.ejs')
})

router.get('/watchlists', (req,res)=>{
    console.log(req.session)
    Watchlist.find({}, (err, allWatchlist)=>{
        res.render('watchlist.ejs',{
            watchlist: allWatchlist
        })
    })
})

for( let i = 0; i < pathArray.length; i++){
router.get(`/${pathArray[i]}`, (req,res)=>{
    res.render('showchart.ejs')
})
}

router.get('/new', authRequired, (req,res) => {
    res.render('new.ejs')
})

router.post('/watchlists', (req,res)=>{
    const pathArray = ['AAPL','AFRM','AMZN','CRM','FB','MDB','MSFT','NMRK','TSLA','UPST']
    req.body.stocklist = []
    for(let i = 0; i < pathArray.length; i++){
        let stockTicker = pathArray[i]
    if (req.body[stockTicker] === "on") {
        req.body.stocklist.push(stockTicker)
    } else {    
        
    }
    } 
    
    req.body.amount = []
    req.body.period = []
    let sum = req.body.endyear - req.body.startyear 
    for(let i = 0; i < (sum)*12; i++) {
        let monthlyBalance = req.body.monthlyinvestment*((1+.1/12)**i-1)/(.1/12)*(1+.1/12)
        let addDates = (1+i)/12
        if(addDates % 1 != 0){
        
        } else {
        let dateOfTheBalance = Number(req.body.startyear) + Number(addDates)
        req.body.amount.push(Math.round(monthlyBalance))
        req.body.period.push(dateOfTheBalance)
        }
    }
   
    Watchlist.create(req.body, (error, createdWatchlist) => {
        
        if (error){
            console.log(error)
            res.send(error)
        } else {
            res.redirect('/smarttrading/watchlists')
        }
    })
})

router.get('/watchlists/:id', (req,res) => {
    Watchlist.findById(req.params.id, (error, foundWatchlist) =>{
        res.render('show.ejs', {watchlist: foundWatchlist})
    })
})

router.delete('/:id', authRequired,(req,res)=>{
    console.log(req.session)
    Watchlist.findByIdAndDelete(req.params.id, (error,deletedWatchlist)=>{
        if(error) {
            console.log(error)
            res.send(error)
        } else{
            res.redirect('/smarttrading/watchlists')
        }
    })
})

router.get('/:id/edit', authRequired,(req,res)=>{
    Watchlist.findById(req.params.id, (error, foundWatchlist) => {
        if(error) {
            res.send(error)
        } else {
            res.render('edit.ejs', {
                watchlist: foundWatchlist
            })
        }
    })
})

router.put('/watchlists/:id', (req,res)=>{
    const pathArray = ['AAPL','AFRM','AMZN','CRM','FB','MDB','MSFT','NMRK','TSLA','UPST']
    req.body.stocklist = []
    for(let i = 0; i < pathArray.length; i++){
        let stockTicker = pathArray[i]
    if (req.body[stockTicker] === "on") {
        req.body.stocklist.push(stockTicker)
    } else {    
        
    }
    }  
    
    Watchlist.findByIdAndUpdate(req.params.id, req.body,{
        new: true
    },
    (error, updatedWatchlist) => {
        if(error){
            console.log(error)
            res.send(error)
        } else {
            res.redirect('/smarttrading/watchlists')
        }
    })
})

module.exports = router

 