import { useState } from "react";
import { hashPassword } from "../utils/auth.js";
import { useAuth } from "../context/AuthContext";
import countryCodes from "../assets/countryCodes.json";
import { useNavigate } from "react-router-dom";


function SignUp() {
  const { axiosInstance } = useAuth();
  const [email, setEmail] = useState("");
    const [userName, setUsername] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filtered, setFiltered] = useState(countryCodes);

  const navigate = useNavigate()

  const fullPhone = `${countryCode}${phone}`;

  const handleSendOtp = async () => {
    setError("");
    setSuccess("");

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    try {
      const res = await axiosInstance.post("/send-otp", { phone: fullPhone });
      if (res.status === 200) {
        setSuccess("OTP sent successfully.");
        setIsOtpSent(true);
      } else {
        setError("Failed to send OTP.");
      }
    } catch (err) {
      setError("Server error while sending OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccess("");

    if (!otp || !phone) {
      setError("Please enter OTP and phone number.");
      return;
    }

    try {
      const res = await axiosInstance.post("/verify-otp", {
        phone: fullPhone,
        otp,
      });

      if (res.status === 200) {
        setSuccess("OTP verified successfully.");
        setIsOtpVerified(true);
      } else {
        setError("OTP verification failed.");
      }
    } catch (err) {
      setError("Server error during OTP verification.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !phone || !password || !confirmPassword || !otp) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isOtpVerified) {
      setError("Please verify OTP first.");
      return;
    }

    const hashedPassword = await hashPassword(password);

    try {
      const res = await axiosInstance.post("/signup", {
        email,
        name:userName,
        phone: fullPhone,
        password: hashedPassword,
      });
      console.log(res)

      if (res.status === 201 || res.status === 200) {
        setSuccess("Account created successfully!");
        navigate('/login')
      
      } else {
        setError("Signup failed.");
      }
    } catch (err) {
      setError("Server error during signup.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
<div>
            <label className="block text-gray-700 mb-2">User Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Phone</label>
            <div className="flex gap-2">
             <select
        className="w-full px-4 border rounded focus:outline-none focus:ring"
        onChange={(e) => setCountryCode(e.target.value)}
      >
        {filtered.map((c) => (
          <option key={c.code} value={c.dial_code}>
            {c.name} ({c.dial_code})
          </option>
        ))}
      </select>
              <input
                type="tel"
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <button
                type="button"
                className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
            </div>
          </div>

          {isOtpSent && (
            <div>
              <label className="block text-gray-700 mb-2">Enter OTP</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="bg-green-500 text-white px-3 rounded hover:bg-green-600"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </div>
            </div>
          )}

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

          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
