const mongoose = require('mongoose')

mongoose.connect( process.env.MONGODB_URI || "YOUR CURRENT LOCALHOST DB CONNECTION STRING HERE" );
const {Schema, model} = mongoose

const watchlistSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    stocklist:[{type: String}],
    period: [{type: Number}],
    amount: [{type: Number}]
})


const Watchlist = model('watchlist', watchlistSchema)

module.exports = Watchlist