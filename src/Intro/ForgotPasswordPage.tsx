 import { useNavigate } from "react-router-dom";

export default function ForgottenPassword() {

  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-4">
        <img src="/yonder.svg" alt="Logo" className="w-80 h-60 mb-4" />
        <div className="w-full max-w-xs">
          <label className="font-semibold block mb-1">Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        <button
        onClick={() => navigate("/virtual-coach")}
          className="bg-[#FD6555] text-white hover:bg-[#8F88FD] transition-colors duration-300 py-2 w-full max-w-xs cursor-pointer"
        >
          Reset Password
        </button>
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

    </>
  );
}
