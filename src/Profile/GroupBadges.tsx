import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// List of achievements
const achievements = [
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
];

// Personal records data

function GroupBadges() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen pb-12 px-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/profile")}
        className="fixed top-0 left-0 m-4 text-[#8F88FD] font-semibold z-50"
      >
        <ArrowLeft className="inline mr-2" />
      </button>

      {/* Title at the very top, centered */}
      <div className="pt-4 pb-8 text-center">
        <h1 className="text-2xl font-bold">Group Badges</h1>
      </div>
      {/* Achievements Section */}
      <div className="mt-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {achievements.map((ach, index) => (
            <div key={index} className="flex justify-center">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={ach.image}
                  alt=""
                  className={`w-20 h-20 object-contain ${
                    !ach.unlocked ? "opacity-100" : ""
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default GroupBadges;
