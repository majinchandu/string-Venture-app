import logo from './logo.svg';
import './App.css';
import Home from './Home';
import {  BrowserRouter as Router, Routes , Route } from 'react-router-dom';
import LoginAdmin from './adminPages/LoginAdmin';
import LoginUser from './userPages/LoginUser';
import RegisterUser from './userPages/RegisterUser';
import AdminData from './adminPages/AdminData'; 
import UserData from './userPages/UserData'; 
import AddBook from './adminPages/AddBook';
import BorrowedBooks from './userPages/BorrowedBooks';
import Protected from './adminPages/Protected';
import Protected2 from './userPages/Protected2';


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <Home /> */}
          <Route path="/" element={<Home />} />
          <Route path="/loginAdmin" element={<LoginAdmin />} />
          <Route path="/loginUser" element={<LoginUser />} />
          <Route path="/registerUser" element={<RegisterUser />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          {/* <Route path="/adminData" element={<AdminData />} /> */}
          <Route path = '/adminData' element = {<Protected Component = {<AdminData />} />} />
          {/* <Route path="/userData" element={<UserData />} /> */}
          <Route path = '/userData' element = {<Protected2 Component = {<UserData />} />} />
          {/* <Route path = '/AddBook' element = {<AddBook />} /> */}
          <Route path = '/AddBook' element = {<Protected Component = {<AddBook />} />} />
          {/* <Route path='/borrowedBooks/:userId' element={<BorrowedBooks />} /> */}
          <Route path = '/borrowedBooks/:userId' element = {<Protected2 Component = {<BorrowedBooks />} />} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
