

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imgg from './images (1).jpg'
const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [name, setname] = useState("")

    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    // useEffect(() => {
    //     // Safely retrieve the user ID from localStorage
    //     const auth = localStorage.getItem("user");
    //     if (auth) {
    //         try {
    //             const user = JSON.parse(auth);
    //             setUserId(user._id); // Set userId after parsing
    //         } catch (err) {
    //             console.error("Failed to parse user data:", err);
    //         }
    //     } else {
    //         console.error("User not found in localStorage.");
    //     }
    // }, []);
    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            try {
                const user = JSON.parse(auth);
                if (user.result && user.result._id) {
                    setUserId(user.result._id); // Correctly extract user ID
                    user.result.name ? setname(user.result.name) : setname("User")
                } else {
                    console.error("User ID not found in localStorage data.");
                }
            } catch (err) {
                console.error("Failed to parse user data:", err);
            }
        } else {
            console.error("User not found in localStorage.");
        }
    }, [userId]);


    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch(`https://string-venture-app.onrender.com/booklist`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBooks(data);
                // const auth = localStorage.getItem("user");
                // const user = JSON.parse(auth);
                // setUserId(user._id);
            } catch (err) {
                setError("Failed to fetch books. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const borrowBook = async (bookId) => {
        // const auth = localStorage.getItem("user");
        // const user = JSON.parse(auth);
        // console.log({"user is ":user});
        // console.log({"result is ":user.result});
        // console.log(user.result._id);
        // await setUserId(user.result._id);
        if (!userId) {
            alert("User not logged in or invalid.");
            return;
        }

        try {
            console.log(bookId, userId);
            const response = await fetch(`https://string-venture-app.onrender.com/borrowBook`, {
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

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={{ textAlign: "center", margin: "20px 0", color: "#007BFF", fontWeight: "bold" }}>
                    Book List
                </h1>
                <h3 style={{ textAlign: "center", margin: "20px 0", color: "green", fontWeight: "" }}> Hello , {name}</h3>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    {console.log(userId)}
                    <Link to={`/borrowedBooks/${userId}`}>
                        <button type="button" className="btn btn-danger mx-1" style={{ padding: "10px 20px", fontWeight: "bold" }}>
                            Your Books
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
            {/* {loading && <p style={{ textAlign: "center", fontSize: "20px", color: "#6c757d", marginTop: "50px" }}>Loading books...</p>} */}
            {error && <p style={{ textAlign: "center", fontSize: "20px", color: "red", marginTop: "50px" }}>{error}</p>}
            {
                loading ? <div class="spinner-border text-success" role="status" style={{ height: "5rem", width: "5rem" }} >
                    <span class="visually-hidden">Loading...</span>
                </div> : books.length === 0 ? <h1 className="text-center">No books available.</h1> :
                    <div className='row'>
                        {books.map((book) => (
                            <div className="col-md-4" key={book._id}>
                                <div className="card" style={{ width: "18rem", margin: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", overflow: "hidden" }}>
                                    <img src={book.photo} alt={`${book.bookName} cover`} className="card-img-top" style={{ height: "200px", objectFit: "contain" }} onError={(e) => {
                                        e.target.onerror = null; // Prevent infinite fallback loop
                                        e.target.src = {imgg}; // Fallback image
                                    }} />
                                    <div className="card-body" style={{ padding: "15px" }}>
                                        <h5 className="card-title">{book.bookName}</h5>
                                        <p className="card-text">
                                            <strong>Author:</strong> {book.author}
                                        </p>
                                        <p className="card-text">
                                            <strong>Publication Year:</strong> {book.publicationYear}
                                        </p>
                                        <p className="card-text">
                                            <strong>Availability:</strong> {book.available ? "Available" : "Not Available"}
                                        </p>
                                        <button
                                            type="button"
                                            className={`btn ${book.available ? "btn-primary" : "btn-outline-secondary"}`}
                                            disabled={!book.available}
                                            onClick={() => borrowBook(book._id)}
                                        >
                                            Borrow
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
            }
            {/* <div className="row"> */}

            {/* {books.map((book) => (
                    <div className="col-md-4" key={book._id}>
                        <div className="card" style={{ width: "18rem", margin: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", borderRadius: "8px", overflow: "hidden" }}>
                            <img src={book.photo} alt={`${book.bookName} cover`} className="card-img-top" style={{ height: "200px", objectFit: "contain" }} />
                            <div className="card-body" style={{ padding: "15px" }}>
                                <h5 className="card-title">{book.bookName}</h5>
                                <p className="card-text">
                                    <strong>Author:</strong> {book.author}
                                </p>
                                <p className="card-text">
                                    <strong>Publication Year:</strong> {book.publicationYear}
                                </p>
                                <p className="card-text">
                                    <strong>Availability:</strong> {book.available ? "Available" : "Not Available"}
                                </p>
                                <button
                                    type="button"
                                    className={`btn ${book.available ? "btn-primary" : "btn-outline-secondary"}`}
                                    disabled={!book.available}
                                    onClick={() => borrowBook(book._id)}
                                >
                                    Borrow
                                </button>
                            </div>
                        </div>
                    </div>
                ))} */}
            {/* </div> */}
        </div>
    );
};

export default BooksList;

