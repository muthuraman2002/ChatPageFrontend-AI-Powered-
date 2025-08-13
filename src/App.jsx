import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import Chat from './pages/Chat'
import ForgetPassword from './pages/ForgetPassword'
import { getJWT } from './utils/auth'
import './App.css'


function App() {
  const isAuthenticated = !!getJWT()
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/chat" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={isAuthenticated ? <Chat /> : <Navigate to="/login" />} />
    <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>
    </Router>
  )
}

export default App
