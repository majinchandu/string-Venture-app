const express = require('express')
var mongoose = require('mongoose');
const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
const cors = require("cors")//npm package to remove cors error
app.use(cors())//middleware to resolve cors issue
const Jwt = require('jsonwebtoken');
const { useParams } = require('react-router-dom');

// const params = useParams();

//Set up default mongoose connection
var mongoDB = 'mongodb+srv://GOFOOD:chauhan20@cluster0.vyzojrl.mongodb.net/String-Ventures';
mongoose.set('strictQuery', false);
mongoose.connect(mongoDB, { useNewUrlParser: true });
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
const jwtKey = 'String-Ventures'
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")
// const { useParams } = require('react-router-dom')

dotenv.config();
app.use(express.urlencoded({ extended: "true" }))

const multer = require("multer");
const path = require("path");

const User = require('./UserSchema');
const Admin = require('./AdminSchema');
const Book = require('./BookSchema');
const BorrowedBooks = require('./BorrowedBooksSchema');

// token generation
app.post('/user/generateToken', function (req, res) {
    try {
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = { // data is the payload 
            time: Date(),
            userId: 123
        }
        console.log(data)
        const token = jwt.sign(data, jwtSecretKey);
        // This function creates a JWT using the data object as the payload and jwtSecretKey as the secret key. The resulting token contains the encoded data object and can be used for authentication or authorization purposes in subsequent requests.
        res.send(token + ",," + data);
    } catch (error) {
        res.send("error occured", error)
    }
});

app.post('/registerUser', async function (req, res) {
    const { email, password, name  } = req.body;

    if (!email || !password || !name) {
        return res.send({ message: "Invalid input. Please provide a valid name, email, and password." });
    }

    try {
        const check = await User.findOne({ email });
        const jwtSecretKey = process.env.JWT_SECRET_KEY;

        if (!check) {
            let user = new User(req.body);
            let result = await user.save();

            // Sign JWT with essential details
            const token = jwt.sign({ email: result.email }, jwtSecretKey);

            return res.status(201).send({ result, auth: token });
        } else {
            return res.send({ message: "User already exists with this email." });
        }
    } catch (error) {
        return res.status(500).send({ message: "Internal server error", error: error.message });
    }
});

app.post('/loginUser', async function (req, res) {
    console.log(req.body);// jo input aaya hai usko dikhao
    if (req.body.password && req.body.email) { // agar input me email aur password aayi hai tabhi hi chale warna na chale 
        let result = await User.findOne(req.body)
        console.log(result);
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const tokenheaderkey = process.env.TOKEN_HEADER_KEY;
        if (result) {
            try {
                let token = jwt.sign({ result }, jwtSecretKey,);
                res.send({ result, auth: token })
            } catch (error) {
                res.send("internal server error ", error.message);
            }
        } else {
            res.send({ result: "No User found" })
        }

    } else {// email ya password me se koi ek cheez ya dono nhi daale
        res.send("Result not found")
    }
})

app.post('/loginAdmin', async function (req, res) {
    console.log(req.body);// jo input aaya hai usko dikhao
    if (req.body.password && req.body.email) { // agar input me email aur password aayi hai tabhi hi chale warna na chale 
        let exisUser = await Admin.findOne(req.body)
        console.log(exisUser);
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const tokenheaderkey = process.env.TOKEN_HEADER_KEY;
        if (exisUser) {
            try {
                let token = jwt.sign({ exisUser }, jwtSecretKey,);
                res.send({ exisUser, auth: token })
            } catch (error) {
                res.send("internal server error ", error.message);
            }
        } else {
            res.send({ result: "No User found" })
        }

    } else {// email ya password me se koi ek cheez ya dono nhi daale
        res.send("Result not found")
    }
})


// app.post('/addBook', async (req, res) => {
//     try {
//         if (req.body.bookName && req.body.author && req.body.publicationYear) {
//             let book = await new Book(req.body); // jo frontend se data aa rha hai wo nye user me store ho rha hai
//             let result = await book.save();// data mongodb ke user table me store ho rha hai
//             // we cant use .select to remove password because the user is being created here we are selecting it 
//             result = result.toObject() // converting to object
//             // delete result.password // deletes/hides password as it is good practice
//             console.log(req.body);
//             res.send(result);
//         }
//         else {
//             res.send("enter all details")
//         }
//     } catch (error) {
//         res.send("error occured", error)
//     }
// });


app.get('/booklist', async (req, res) => {
    try {
        const books = await Book.find();
        console.log("heelo");

        if (books.length > 0) {
            res.json(books); // Send the list of books as JSON
        } else {
            res.json({ message: "no books found" }); // Send a JSON response with a message
        }
    } catch (error) {
        log.error(error);
        res.status(500).json({ message: "error occurred", error: error.message }); // Send a JSON response with an error message
    }
});


// API to fetch all borrowed books for a specific user
app.get('/borrowedBooks/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; // Get user ID from query parameters

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Find all books borrowed by the user
        const borrowedBooks = await BorrowedBooks.find({ userId });

        if (borrowedBooks.length === 0) {
            return res.status(404).json({ message: "No borrowed books found for this user" });
        }

        res.status(200).json(borrowedBooks); // Return the list of borrowed books
    } catch (error) {
        console.error("Error fetching borrowed books:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Return borrowed book
app.delete('/returnBook/:borrowedBookId', async (req, res) => {
    const borrowedBookId = req.params.borrowedBookId;

    try {
        // Find the borrowed book by ID
        const borrowedBook = await BorrowedBooks.findById(borrowedBookId);
        if (!borrowedBook) {
            return res.status(404).json({ message: "Borrowed book not found" });
        }

        // Update the book's availability in the Books collection
        await Book.findOneAndUpdate(
            { _id: borrowedBook.BookId },
            { available: true },
            { new: true }
        );

        // Delete the borrowed book record
        await BorrowedBooks.findByIdAndDelete(borrowedBookId);

        res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
        console.error("Error returning book:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});



// API to borrow a book
app.post('/borrowBook', async (req, res) => {
    const { bookId, userId } = req.body;

    try {
        // Find the book by ID
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (!book.available) {
            return res.status(400).json({ message: "Book is not available" });
        }

        // Add the book to BorrowedBooks collection
        const borrowedBook = new BorrowedBooks({
            bookName: book.bookName,
            author: book.author,
            publicationYear: book.publicationYear,
            photo: book.photo,
            BookId: book._id,
            userId: userId,
        });

        await borrowedBook.save();

        // Update book availability to false
        book.available = false;
        await book.save();

        res.status(200).json({ message: "Book borrowed successfully!" });
    } catch (error) {
        console.error("Error borrowing book:", error.message);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

app.delete('/deleteBook/:bookId', async (req, res) => {
    const { bookId } = req.params;

    try {
        // Check if the book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Remove the book from the books collection
        await Book.findByIdAndDelete(bookId);

        // Remove all corresponding entries in the bookBorrowed collection
        await BorrowedBooks.deleteMany({ BookId: bookId });

        return res.status(200).json({ message: 'Book and corresponding records deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete book' });
    }
});

app.post('/addBook', async (req, res) => {
    try {
        const { bookName, author, publicationYear, photo } = req.body;
        if (!bookName || !author || !publicationYear || !photo) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newBook = new Book({
            bookName,
            author,
            publicationYear,
            photo,
        });

        await newBook.save();
        res.status(201).json({ message: "Book added successfully", book: newBook });
    } catch (err) {
        res.status(500).json({ message: "Failed to add book", error: err.message });
    }
});


