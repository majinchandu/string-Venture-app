const mongoose = require('mongoose')
const { type } = require('os')


const BookScehma = new mongoose.Schema({ //intiallising the schema of the users table

    bookName: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    publicationYear: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    photo: {
        type: String, // Store image path
        required: true,
    }

})

module.exports = mongoose.model("Book", BookScehma)