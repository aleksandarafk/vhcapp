import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type JoinAJamProps = {
    onJoinJam: (code: string) => { success: boolean; message: string };
};

const JoinAJam: React.FC<JoinAJamProps> = ({ onJoinJam }) => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [showJoinToast, setShowJoinToast] = useState(false);
    const [error, setError] = useState("");

const handleJoin = () => {
  if (code.trim()) {
    const result = onJoinJam(code.trim());
    if (result.success) {
      setShowJoinToast(true);
      setTimeout(() => {
        setShowJoinToast(false);
        navigate("/study-jam"); // This should now show the updated list
      }, 2000);
    } else {
      setError(result.message);
      setTimeout(() => setError(""), 3000);
    }
  } else {
    setError("Please enter a code");
    setTimeout(() => setError(""), 3000);
  }
};

    return (
        <>
            {/* Back arrow button */}
            <button
                onClick={() => navigate("/jam-options")}
                className="fixed top-0 left-0 m-4 text-[#8F88FD] font-semibold z-50 flex items-center space-x-1"
            >
                <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-4">
                <div className="w-full max-w-xs">
                    <label className="font-semibold block mb-1">Enter a Study Jam Code</label>
                    <input
                        type="text"
                        placeholder="A1B1B"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        className="w-full border p-2 rounded mt-1"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}

                <button
                    onClick={handleJoin}
                    className="bg-black text-white rounded-sm py-2 w-full max-w-xs cursor-pointer"
                >
                    Join Jam
                </button>
            </div>

            {/* Join Toast Notification */}
            {showJoinToast && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl w-[350px] backdrop-blur-md text-sm text-white shadow-xl z-50 flex justify-center items-center"
            style={{
              backgroundColor: 'rgba(144, 190, 109, 0.49)',
              border: '1px solid rgba(144, 190, 109, 0.54)',
            }}
          >
                    <div className="text-sm font-semibold text-white">
                        Joined Jam Successfully!
                    </div>
                </div>
            )}
        </>
    );
};

export default JoinAJam;