import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {AdminDashboard } from './Pages/AdminDashboard.jsx'
import { Register }  from './Auth/Register.jsx'
import { useSelector } from 'react-redux';
import Home from './Pages/Home.jsx'
import { Login } from './Auth/Login.jsx';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth); 

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/admin' element={user && user.role == "admin" ? <AdminDashboard/> : <Home/>} />
          <Route path='/register' element={isAuthenticated ? <Home/> : <Register/>} />
          <Route path='/login' element={isAuthenticated ? <Home/> : <Login/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App