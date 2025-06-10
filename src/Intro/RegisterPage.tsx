import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Optional: Replace with any icon library you use

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleRegister = () => {
    if (password !== repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Proceed with actual registration logic (e.g. API call)
    navigate("/virtual-coach");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-4">
      <img src="/yonder.svg" alt="Logo" className="w-80 h-60 mb-4" />

      <div className="w-full max-w-xs">
        <label className="font-semibold block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          className="w-full border p-2 rounded mt-1"
        />
      </div>

<div className="w-full max-w-xs">
  <label className="font-semibold block mb-1">Password</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="*********"
      className="w-full border p-2 rounded pr-10"
    />
    <button
      type="button"
      onClick={() => setShowPassword((prev) => !prev)}
      className="absolute inset-y-0 right-3 flex items-center text-gray-600"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>
</div>


<div className="w-full max-w-xs">
  <label className="font-semibold block mb-1">Repeat Password</label>
    <div className="relative"> 
  <input
    type={showRepeatPassword ? "text" : "password"}
    value={repeatPassword}
    onChange={(e) => setRepeatPassword(e.target.value)}
    placeholder="*********"
    className="w-full border p-2 rounded pr-10"
  />
  <button
    type="button"
    onClick={() => setShowRepeatPassword((prev) => !prev)}
    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
  >
    {showRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
  </button>
  </div>
</div>
      <button
        onClick={handleRegister}
        className="bg-[#FD6555] text-white hover:bg-[#8F88FD] transition-colors duration-300 py-2 w-full max-w-xs cursor-pointer"
      >
        Register
      </button>

      <div className="w-full max-w-xs text-left text-sm">
        Already have an Account?{" "}
        <button
          className="text-[#8F88FD] hover:text-[#6e67c6] transition-colors"
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;
