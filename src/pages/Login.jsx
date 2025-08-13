import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hashPassword, storeJWT } from '../utils/auth.js';
import { useAuth } from '../context/AuthContext.jsx';
 

function Login() {
   const {axiosInstance,login}=useAuth()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!email || !password) {
    setError('Please enter both email and password.');
    return;
  }

  try {
    const hashedPassword = await hashPassword(password);

    const res = await 
login({name: email, password: hashedPassword 
    });
const data =res.data
console.log(res.data)
    if (!res.status) {
      setError(data.message || 'Invalid credentials');
      return;
    }

    setError('');
    storeJWT(data.token); // Save JWT securely
    alert(`Logged in as ${email}`);
    // navigate('/dashboard');
    navigate("/chat")
  } catch (err) {
    setError('Login failed. Try again.');
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">User Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
          <div className="flex justify-between items-center text-sm mt-2">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </button>
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => navigate('/signup')}
            >
              Don’t have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
