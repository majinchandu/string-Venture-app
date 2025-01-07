const mongoose = require('mongoose')
const { type } = require('os')


const BorrowedBooksSchema = new mongoose.Schema({ //intiallising the schema of the users table

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
    // available: {
    //     type: Boolean,
    //     required: true
    // },
    photo: {
        type: String, // Store image path
        required: true,
    },
    BookId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model("BookBorrowed", BorrowedBooksSchema)