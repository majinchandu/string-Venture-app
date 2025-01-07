import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImCross } from 'react-icons/im'
const BookListAdmin = () => {

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const [bookName, setbookName] = useState("")
    const [author, setauthor] = useState("")
    const [publicationYear, setpublicationYear] = useState("")
    const [photo, setphoto] = useState("")
    const [filter, setFilter] = useState("all"); // 'all', 'borrowed', 'available'

    const totalBooks = books.length;
    const availableBooks = books.filter((book) => book.available).length;
    const borrowedBooks = totalBooks - availableBooks;

    const validate = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setname(e.target.value);
    };

    useEffect(() => {
        // Safely retrieve the user ID from localStorage
        const auth = localStorage.getItem("user");
        if (auth) {
            try {
                const user = JSON.parse(auth);
                setUserId(user._id); // Set userId after parsing
            } catch (err) {
                console.error("Failed to parse user data:", err);
            }
        } else {
            console.error("User not found in localStorage.");
        }
    }, []);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(`http://localhost:5000/booklist`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBooks(data);
            } catch (err) {
                setError("Failed to fetch books. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const borrowBook = async (bookId) => {
        if (!userId) {
            alert("User not logged in or invalid.");
            return;
        }

        try {
            console.log(bookId, userId);
            const response = await fetch(`http://localhost:5000/borrowBook`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookId, userId }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to borrow the book");
            }

            // Navigate to borrowedBooks page after successful borrow
            navigate(`/borrowedBooks/${userId}`);
        } catch (err) {
            alert(err.message);
        }
    };

    // function handleDelete(bookId , bookAvailable) {
    //     if(!bookAvailable){
    //         console.log("Book is not available , you can delete once the user returns it back");
    //         alert("Book is not available , you can delete once the user returns it back");
    //     }
    //     else{
    //         const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    //         if (confirmDelete) {
    //             console.log("chauhan sabh ");
    //         }
    //     }
    // }
    const handleDelete = async (bookId, bookAvailable) => {
        if (!bookAvailable) {
            alert("Book is not available. You can delete it once the user returns it.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete this book?");
        if (!confirmDelete) {
            return;
        }

        try {
            // Make API request to delete the book
            const response = await fetch(`http://localhost:5000/deleteBook/${bookId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the book');
            }

            // Show success message
            alert('Book deleted successfully');

            // Refresh book list by filtering out the deleted book
            setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
        } catch (err) {
            alert(err.message);
        }
    };

    const collectData = async () => {
        if (!bookName || !author || !publicationYear || !photo) {
            alert("Please fill out all fields.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/addBook", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bookName, author, publicationYear, photo }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to add book");
            }

            // Add the new book to the state
            setBooks((prevBooks) => [...prevBooks, data.book]);

            // Clear the modal fields
            setbookName("");
            setauthor("");
            setpublicationYear("");
            setphoto("");

            alert("Book added successfully!");
        } catch (err) {
            alert(err.message);
        }
    };



    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const filteredBooks = books.filter((book) => {
        if (filter === "borrowed") return !book.available;
        if (filter === "available") return book.available;
        return true; // 'all'
    });

    const validate1 = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setbookName(e.target.value);
        setbookName(e.target.value);
    };

    const validate2 = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setname(e.target.value);
        setauthor(e.target.value);
    };

    const validate3 = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setname(e.target.value);
        setpublicationYear(e.target.value);
    };

    const validate4 = (e) => { // dont let first character to be a space 
        if (/^\s/.test(e.target.value))
            e.target.value = '';
        // setname(e.target.value);
        setphoto(e.target.value);
    };
    


    return (
        <div>
            <div className="container">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h1 style={{ textAlign: "center", margin: "20px 0", color: "#007BFF", fontWeight: "bold" }}>
                        Book List
                    </h1>
                    <string><h1 style={{ color: "green" }}>Hello Admin</h1></string>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">

                        <button
                            className={`btn btn-secondary mx-1 ${filter === "all" ? "btn-dark" : ""}`}
                            onClick={() => handleFilterChange("all")}
                        >
                            All Books
                        </button>
                        <button
                            className={`btn btn-secondary mx-1 ${filter === "borrowed" ? "btn-dark" : ""}`}
                            onClick={() => handleFilterChange("borrowed")}
                        >
                            Borrowed Books
                        </button>
                        <button
                            className={`btn btn-secondary mx-1 ${filter === "available" ? "btn-dark" : ""}`}
                            onClick={() => handleFilterChange("available")}
                        >
                            Available Books
                        </button>

                        <Link >
                            <button type="button" className="btn btn-danger mx-1" style={{ padding: "10px 20px", fontWeight: "bold" }} data-bs-toggle="modal" data-bs-target="#myModall">
                                Add Book
                            </button>
                        </Link>
                        <button
                            type="button"
                            className="btn btn-warning"
                            style={{ padding: "10px 20px", fontWeight: "bold" }}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                </div>
                {/* Dashboard Section */}
                <div
                    className="dashboard"
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "20px 0",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        marginLeft: "-30px"
                    }}
                >
                    <div
                        className="dashboard-card"
                        style={{
                            textAlign: "center",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            width: "30%",
                            backgroundColor: "#007bff",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <h4>Total Books</h4>
                        <p style={{ fontSize: "24px" }}>{totalBooks}</p>
                    </div>
                    <div
                        className="dashboard-card"
                        style={{
                            textAlign: "center",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            width: "30%",
                            backgroundColor: "#28a745",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <h4>Available Books</h4>
                        <p style={{ fontSize: "24px" }}>{availableBooks}</p>
                    </div>
                    <div
                        className="dashboard-card"
                        style={{
                            textAlign: "center",
                            padding: "10px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            width: "30%",
                            backgroundColor: "#dc3545",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        <h4>Borrowed Books</h4>
                        <p style={{ fontSize: "24px" }}>{borrowedBooks}</p>
                    </div>
                </div>
                {error && <p style={{ textAlign: "center", fontSize: "20px", color: "red", marginTop: "50px" }}>{error}</p>}
                {loading ? <div class="spinner-border text-success" role="status" style={{ height: "5rem", width: "5rem" }} >
                    <span class="visually-hidden">Loading...</span>
                </div> : filteredBooks.length === 0 ? <p style={{ textAlign: "center", fontSize: "20px", color: "#6c757d", marginTop: "50px" }}>No books found.</p> :
                    <div className="row" style={{ marginLeft: "20px" }}>
                        {filteredBooks.map((book) => (
                            <div className="col-md-4" key={book._id}>
                                <div className="card" style={{ width: "18rem", margin: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", overflow: "hidden" }}>
                                    <img src={book.photo} alt={`${book.bookName} cover`} className="card-img-top" style={{ height: "200px", objectFit: "contain" }} />
                                    <div className="card-body" style={{ padding: "15px" }}>
                                        <h5 className="card-title">{book.bookName}</h5>
                                        <p className="card-text"><strong>Author:</strong> {book.author}</p>
                                        <p className="card-text"><strong>Publication Year:</strong> {book.publicationYear}</p>
                                        <p className="card-text">
                                            <strong>Availability:</strong> {book.available ? "Available" : "Not Available"}
                                        </p>
                                        {/* {!book.available && (
                                        <p className="card-text">
                                            <strong>Borrowed By:</strong> {book.borrowerName || "Unknown"}
                                        </p>
                                    )} */}
                                        <div data-bs-toggle={!book.available ? "tooltip" : ""} data-bs-placement={!book.available ? "bottom" : ""} title={!book.available ? "This book can only be deleted when the borrower returns it " : ""}>
                                            <button
                                                type="button"
                                                className={`btn ${book.available ? "btn-primary" : "btn-outline-secondary"}`}
                                                disabled={!book.available}
                                                onClick={() => handleDelete(book._id, book.available)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div class="modal fade" id="myModall" role="dialog" >
                <div class="modal-dialog modal-dialog-centered" >

                    {/* NEW DATA */}

                    <div class="modal-content" style={{ backgroundColor: "#c4afaf" }}  >
                        <div class="modal-header">
                            <h1 class="modal-title" style={{ marginLeft: "auto", marginRight: "auto" }} >New Book</h1>
                            <button type="button" class="close" data-bs-dismiss="modal" style={{ border: "none" }}>{<ImCross />}</button>
                        </div>
                        <div class="modal-body" style={{ display: "grid" }}>
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} class="login-form-input my-1" type="text" value={bookName} onChange = {validate1}    placeholder="Enter Book Name " />
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} class="login-form-input my-1" type="text" value={author} onChange = {validate2}  placeholder="Enter Author Name  " />
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} class="login-form-input my-1" type="text" value={publicationYear} onChange = {validate3}  placeholder="Enter Publication Year" />
                            <textarea style={{ border: "solid black", borderRadius: "15px" }} class="login-form-input my-1" type="text" value={photo} onChange = {validate4}  placeholder="paste image address of the picture from google  " />
                            {/* <h3>itachi is best uchiha</h3> */}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default btn-light" data-bs-dismiss="modal" onClick={collectData}  >Save</button>
                        </div>
                    </div>



                </div>
            </div>
        </div>



    )
}

export default BookListAdmin