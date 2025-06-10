import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "g.fiddlenan@yonder.nl" && password === "password123") {
      navigate("/virtual-coach");
    } else {
      alert("Invalid credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-4">
      <img src="/yonder.svg" alt="Logo" className="w-80 h-60 mb-4" />

      {/* Email Input */}
      <div className="w-full max-w-xs">
        <label className="font-semibold block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@yonder.nl"
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {/* Password Input */}
      <div className="w-full max-w-xs">
        <label className="font-semibold block mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="*********"
          className="w-full border p-2 rounded mt-1"
        />
        <button
          className="text-[#8F88FD] text-sm mt-1 hover:text-[#6e67c6] transition-colors"
          onClick={() => navigate("/forgotten-password")}
        >
          Forgot Password?
        </button>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="bg-[#FD6555] text-white hover:bg-[#8F88FD] transition-colors duration-300 py-2 w-full max-w-xs rounded cursor-pointer"
      >
        Log In
      </button>

      {/* Sign Up Text */}
      <div className="w-full max-w-xs text-left text-sm">
        Not signed, yet?{" "}
        <button
          className="text-[#8F88FD] hover:text-[#6e67c6] transition-colors"
          onClick={() => navigate("/register")}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
