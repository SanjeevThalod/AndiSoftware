import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import {AdminDashboard } from './Pages/AdminDashboard.jsx'
import { Register }  from './Auth/Register.jsx'
import { useSelector } from 'react-redux';
import Home from './Pages/Home.jsx'
import { Login } from './Auth/Login.jsx';

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);  
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/admin' element={isAuthenticated ? <AdminDashboard/> : <Register/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/login' element={<Login/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App