import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// List of achievements
const achievements = [
  { image: "fire.png", unlocked: true },
  { image: "calendar.png", unlocked: true },
  { image: "completedtask.png", unlocked: true },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
  { image: "locked.png", unlocked: false },
];

// Personal records data
const personalRecords = [
  {
    image: "achievementsrecord.png",
    value: 10,
    description: "Achievements Collected",
    date: "14 March, 2025",
  },
  {
    image: "completedtaskrecord.png",
    value: 10,
    description: "Group Tasks Solved",
    date: "20 March, 2025",
  },
  {
    image: "agendarecord.png",
    value: 25,
    description: "Completed Tasks",
    date: "14 April, 2025",
  },
];

function Achievements() {
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
        <h1 className="text-2xl font-bold">Achievements</h1>
      </div>

      {/* Personal Records Section */}
      <div>
        <div className="mb-2">
          <h3
            className="text-lg font-semibold"
            style={{ fontFamily: "Tecna, sans-serif" }}
          >
            Personal Records
          </h3>
        </div>

        <div className="flex bg-white border rounded-md p-4 divide-x">
          {personalRecords.map((record, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center w-1/3 h-40 px-2 text-center"
            >
              <img
                src={record.image}
                alt={`Record ${i + 1}`}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-2"
              />
              <p className="text-lg font-bold">{record.value}</p>
              <p className="text-xs text-gray-500 leading-tight">
                {record.description}
              </p>
              <p className="text-xs text-gray-400">{record.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mt-10">
        <div className="mb-2">
          <h3
            className="text-lg font-semibold"
            style={{ fontFamily: "Tecna, sans-serif" }}
          >
            Achievements
          </h3>
        </div>

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

export default Achievements;
