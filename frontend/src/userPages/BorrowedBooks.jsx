

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function BorrowedBooks() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const auth = localStorage.getItem("user");
    const userId = JSON.parse(auth)._id;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                setLoading(true);
                const auth = localStorage.getItem("user");
                const userId = JSON.parse(auth).result._id;
                console.log(userId);

                const response = await fetch(`http://localhost:5000/borrowedBooks/${userId}`);
                const data = await response.json();

                if (response.ok) {
                    setBorrowedBooks(data);
                } else {
                    setError(data.message || "Failed to fetch borrowed books");
                }
                setLoading(false);
            } catch (err) {
                setError("An error occurred while fetching borrowed books");
            } finally {
                setLoading(false);
            }
        };

        fetchBorrowedBooks();
    }, [userId]);

    const handleReturn = async (borrowedBookId) => {
        try {
            const response = await fetch(`http://localhost:5000/returnBook/${borrowedBookId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setBorrowedBooks((prevBooks) =>
                    prevBooks.filter((book) => book._id !== borrowedBookId)
                );
            } else {
                const data = await response.json();
                alert(data.message || "Failed to return the book");
            }
        } catch (err) {
            console.error("Error returning book:", err.message);
            alert("An error occurred while returning the book");
        }
    };

    // if (loading) return <p>Loading...</p>;
    // if (error) return <h1 style={{marginTop:"5rem"}}>{error}</h1>;
    if(error){
        return(
            <div>
                <h1 style={{marginTop:"5rem"}}>{error}</h1>
                <Link to = '/userData'><button className = 'btn  btn-primary btn-lg'>Go back</button></Link>
            </div>
        )
    }
    const headerStyle = {
        textAlign: "center",
        margin: "20px 0",
        color: "#007BFF",
        fontWeight: "bold",
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="container mt-5">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1 style={headerStyle}>Borrowed Books</h1>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                    <Link to="/userData">
                        <button type="button" className="btn btn-danger mx-1" style={{ padding: "10px 20px", fontWeight: "bold" }}>
                            All Books
                        </button>
                    </Link>
                    <button type="button" className="btn btn-warning" style={{ padding: "10px 20px", fontWeight: "bold" }} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <div className="row">
                {
                    loading ? <div class="spinner-border text-success" role="status" style={{ height: "5rem", width: "5rem",marginLeft:"auto",marginRight:"auto" }} >
                    <span class="visually-hidden">Loading...</span>
                </div> : borrowedBooks.length === 0 ? <div><h1 className="text-center">No books borrowed yet.</h1> <Link to = '/userData'><button className = 'btn  btn-primary btn-lg'>Go back</button></Link> </div>:
                    borrowedBooks.map((book) => (
                        <div key={book._id} className="col-md-4">
                            <div className="card mb-4">
                                <img src={book.photo} className="card-img-top" alt={book.bookName} height={500} />
                                <div className="card-body">
                                    <h5 className="card-title">{book.bookName}</h5>
                                    <p className="card-text"><strong>Author:</strong> {book.author}</p>
                                    <p className="card-text"><strong>Year:</strong> {book.publicationYear}</p>
                                    <button
                                        type="button"
                                        className="btn btn-danger mx-1"
                                        style={{ padding: "10px 20px", fontWeight: "bold" }}
                                        onClick={() => handleReturn(book._id)}
                                    >
                                        Return
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))

                }
                {
                    
                }
                {/* {borrowedBooks.map((book) => (
                    <div key={book._id} className="col-md-4">
                        <div className="card mb-4">
                            <img src={book.photo} className="card-img-top" alt={book.bookName} height={500} />
                            <div className="card-body">
                                <h5 className="card-title">{book.bookName}</h5>
                                <p className="card-text"><strong>Author:</strong> {book.author}</p>
                                <p className="card-text"><strong>Year:</strong> {book.publicationYear}</p>
                                <button
                                    type="button"
                                    className="btn btn-danger mx-1"
                                    style={{ padding: "10px 20px", fontWeight: "bold" }}
                                    onClick={() => handleReturn(book._id)}
                                >
                                    Return
                                </button>
                            </div>
                        </div>
                    </div>
                ))} */}
            </div>
        </div>
    );
}

export default BorrowedBooks;
