import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTaskContext } from "./TaskContext";
// Define the tutorial topics as a union type for strict typing
type TutorialTopic = "Planning my Agenda" | "Setting a Deadline" | "Categorizing my Task";

interface Explanation {
  text: string;
  helpOptions: string[];
}

const explanations: Record<TutorialTopic, Explanation> = {
  "Planning my Agenda": {
    text: `To plan your agenda, start by listing your tasks in order of priority. Use deadlines and categories to keep track of what needs your immediate attention.`,
    helpOptions: ["Helped me", "I'm confused"],
  },
  "Setting a Deadline": {
    text: `Setting a deadline helps keep your tasks on track and avoid procrastination. Always assign realistic deadlines and update them if needed.`,
    helpOptions: ["Helped me", "I'm confused"],
  },
  "Categorizing my Task": {
    text: `Categorizing your tasks allows you to organize them into groups like School, Homework, or Personal. This helps you focus and manage similar tasks together.`,
    helpOptions: ["Helped me", "I'm confused"],
  },
};

interface SubTask {
  title: string;
  description: string;
  deadline: string;
}

function PPlannerTask() {
  const navigate = useNavigate();
  const [subTasks, setSubTasks] = useState<SubTask[]>([
    { title: "", description: "", deadline: "" },
  ]);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [customColor, setCustomColor] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { addTask } = useTaskContext();

  // Tutorial modal states
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0); // 0 = choose topic, 1 = explanation
  const [selectedTopic, setSelectedTopic] = useState<TutorialTopic | "">("");

  const tutorialOptions: TutorialTopic[] = [
    "Planning my Agenda",
    "Setting a Deadline",
    "Categorizing my Task",
  ];

  const addSubTask = () => {
    setSubTasks([...subTasks, { title: "", description: "", deadline: "" }]);
  };

  const handleSubmit = () => {
    if (
      !title ||
      !startDate ||
      !endDate ||
      !time ||
      !category ||
      !description ||
      (!color && !customColor)
    ) {
      setError("Please fill in all required fields.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    const newTask = {
      title,
      category: category.toLowerCase(),
      deadline: endDate,
      subtasks: subTasks.map((st) => st.title),
    };

    addTask(newTask);
    navigate("/personal-planner");
  };

  const handleTopicSelect = (topic: TutorialTopic) => {
    setSelectedTopic(topic);
    setStep(1);
  };

  const handleHelpResponse = (response: string) => {
    if (response === "Helped me") {
      // Close tutorial
      setShowTutorial(false);
      setStep(0);
      setSelectedTopic("");
    } else {
      alert("Sorry to hear that! We'll improve this tutorial soon.");
      setShowTutorial(false);
      setStep(0);
      setSelectedTopic("");
    }
  };

  const predefinedColors = ["#BC4B51", "#5B8E7D", "#F4A259", "#8CB369"];

  return (
    <>
      {/* Main content with blur effect when tutorial active */}
      <div
        className={`p-4 font-sans max-w-md mx-auto ${
          showTutorial ? "filter blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {error && (
<div
  className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 w-[350px] rounded-xl backdrop-blur-md text-sm text-white shadow-xl z-50 flex justify-center items-center" 
  style={{
    backgroundColor: 'rgba(249, 65, 68, 0.49)',       // 49% opacity background
    border: '1px solid rgba(249, 65, 68, 0.54)',
    fontFamily: 'Tecna, sans-serif',       // 54% opacity stroke/border
  }}
>
            {error}
          </div>
        )}

        <div className="flex justify-between text-sm">
          <a href="/personal-planner" className="text-[#FD6555]">
            CANCEL
          </a>
          <button
            onClick={() => setShowTutorial(true)}
            className="text-[#8F88FD] focus:outline-none"
          >
            I need help
          </button>
        </div>

        <h1 className="text-2xl font-bold mt-4">New Task</h1>

        <div className="mt-4">
          <label className="font-semibold">Title</label>
          <input
            type="text"
            placeholder="My awesome task"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold block">Date & Time</label>
          <div className="flex flex-col gap-2 mt-1">
            <label className="text-sm">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <label className="text-sm">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border p-2 w-full rounded"
            />
            <label className="text-sm">Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-semibold">Category</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {["School", "Homework", "Personal"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`border px-4 py-2 rounded text-sm ${
                  category === cat ? "bg-black text-white" : ""
                }`}
                onClick={() => setCategory(cat)}
              >
                {cat === "School"
                  ? "🏠 School"
                  : cat === "Homework"
                  ? "📄 Homework"
                  : "🏠 Personal"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="font-semibold">Description</label>
          <textarea
            placeholder="Add notes or links…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
            rows={3}
          ></textarea>
        </div>

        <div className="mt-4">
          <label className="font-semibold">Sub Tasks</label>
          {subTasks.map((task, index) => (
            <div key={index} className="border p-2 mt-2 rounded">
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-1 mb-1 rounded"
                value={task.title}
                onChange={(e) => {
                  const updated = [...subTasks];
                  updated[index].title = e.target.value;
                  setSubTasks(updated);
                }}
              />
              <input
                type="text"
                placeholder="Description"
                className="w-full border p-1 mb-1 rounded"
                value={task.description}
                onChange={(e) => {
                  const updated = [...subTasks];
                  updated[index].description = e.target.value;
                  setSubTasks(updated);
                }}
              />
              <input
                type="date"
                className="w-full border p-1 rounded"
                value={task.deadline}
                onChange={(e) => {
                  const updated = [...subTasks];
                  updated[index].deadline = e.target.value;
                  setSubTasks(updated);
                }}
              />
            </div>
          ))}
          <button
            onClick={addSubTask}
            className="w-full border p-2 mt-2 text-center rounded"
          >
            +
          </button>
        </div>

        <div className="mt-4">
          <label className="font-semibold">Color Tag</label>
          <div className="flex gap-3 mt-2 items-center">
            {predefinedColors.map((c, i) => (
              <div
                key={i}
                onClick={() => {
                  setColor(c);
                  setCustomColor("");
                }}
                className={`w-8 h-8 rounded-full cursor-pointer ${
                  color === c ? "ring-2 ring-black" : ""
                }`}
                style={{ backgroundColor: c }}
              ></div>
            ))}
            <label className="relative cursor-pointer">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setColor(e.target.value);
                  setCustomColor(e.target.value);
                }}
                className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer"
              />
              <div
                className="w-8 h-8 rounded-full border"
                style={{ backgroundColor: customColor || "#ffffff" }}
              ></div>
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-black text-white py-3 rounded"
        >
          Add
        </button>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div
  className="fixed inset-0 flex items-center justify-center z-50"
  style={{
    backgroundColor: "rgba(0, 0, 0, 0.3)", // lighter black transparent overlay
    backdropFilter: "blur(1px)",          // blur effect on background behind modal
    WebkitBackdropFilter: "blur(1px)",   // Safari support
  }}
>

          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
            {step === 0 && (
              <>
                <h2 className="text-xl font-bold mb-4 text-center">
                  What do you need help with, George?
                </h2>
                <ul className="space-y-3">
                  {tutorialOptions.map((topic) => (
                    <li key={topic}>
                      <button
                        onClick={() => handleTopicSelect(topic)}
                        className="w-full border p-3 rounded text-center hover:bg-gray-100"
                      >
                        {topic}
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="mt-6 w-full bg-black text-white hover:bg-[#8F88FD] transition-colors duration-300 py-2 rounded"
                >
                  Close
                </button>
              </>
            )}

            {step === 1 && selectedTopic && (
              <>
                <h2 className="text-xl font-bold mb-4">{selectedTopic}</h2>
                <p className="mb-6">{explanations[selectedTopic].text}</p>
                <div className="flex justify-around">
                  {explanations[selectedTopic].helpOptions.map(
                    (option: string) => (
                      <button
                        key={option}
                        onClick={() => handleHelpResponse(option)}
                        className="border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => {
                    setStep(0);
                    setSelectedTopic("");
                  }}
                  className="mt-4 w-full bg-black text-white hover:bg-[#8F88FD] transition-colors duration-300 py-2 rounded"
                >
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default PPlannerTask;
