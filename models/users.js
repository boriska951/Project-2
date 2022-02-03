const mongoose = require('mongoose')

mongoose.connect( process.env.MONGODB_URI || "YOUR CURRENT LOCALHOST DB CONNECTION STRING HERE" );

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: String,
})

const User = mongoose.model('User', userSchema)

module.exports = User