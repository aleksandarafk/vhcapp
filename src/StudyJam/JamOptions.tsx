import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JamOptions() {
  const navigate = useNavigate();
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<"menu" | "join" | "what" | null>(null);

  const tutorialTexts: Record<"join" | "what", string> = {
    join: "You can press the two black buttons to join or create a new Jam.",
    what: "Study Jam is where you and your colleague can collaborate on your project agenda and earn cool rewards!",
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    setTutorialStep(null);
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto relative min-h-screen flex flex-col">
      {/* Top navigation with padding */}
      <div className="flex justify-between text-sm">
        <a href="/study-jam" className="text-[#FD6555]">
          CANCEL
        </a>
        <button
          onClick={() => {
            setShowTutorial(true);
            setTutorialStep("menu");
          }}
          className="text-[#8F88FD] focus:outline-none"
        >
          I need help
        </button>
      </div>

      {/* Centered buttons container fills remaining height */}
      <div className="flex flex-col items-center justify-center flex-grow space-y-4 px-4">
        <button
          onClick={() => navigate('/create-study-jam')}
          className="bg-black text-white rounded-sm py-3 w-full max-w-xs cursor-pointer"
        >
          Create a Study Jam
        </button>
        <button
          onClick={() => navigate('/join-study-jam')}
          className="bg-black text-white rounded-sm py-3 w-full max-w-xs cursor-pointer"
        >
          Join a Study Jam
        </button>
      </div>

      {/* Tutorial overlay */}
      {showTutorial && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.2)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
          }}
        >
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg flex gap-4 mx-4">
            {/* Right: Chat content */}
            <div className="flex flex-col flex-grow">
              {tutorialStep === "menu" && (
                <>
                  <h2 className="text-xl font-bold mb-4 text-center">How can I help you?</h2>
                  <div className="flex flex-col gap-3">
                    <button
                      className="w-full border p-3 rounded text-center hover:bg-gray-100"
                      onClick={() => setTutorialStep("join")}
                    >
                      How to Join a Study Jam
                    </button>
                    <button
                      className="w-full border p-3 rounded text-center hover:bg-gray-100"
                      onClick={() => setTutorialStep("what")}
                    >
                      What is a Study Jam
                    </button>
                  </div>
                  <button
                    className="mt-6 w-full bg-black text-white hover:bg-[#8F88FD] transition-colors duration-300 py-2 rounded"
                    onClick={closeTutorial}
                  >
                    Close Tutorial
                  </button>
                </>
              )}

              {(tutorialStep === "join" || tutorialStep === "what") && (
                <>
                  <p className="mb-4">{tutorialTexts[tutorialStep]}</p>
                  <button
                    className="mt-4 w-full bg-black text-white hover:bg-[#8F88FD] transition-colors duration-300 py-2 rounded"
                    onClick={() => setTutorialStep("menu")}
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JamOptions;
