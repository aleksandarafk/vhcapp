import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface CreateAJamProps {
  addJam: (jamData: {
    name: string;
    date: string;
    time: string;
    color: string;
    code: string;
    description: string;
  }) => void;
}

function CreateAJam({ addJam }: CreateAJamProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [customColor, setCustomColor] = useState<string>("");
  const [code, setCode] = useState<string>(""); // Removed user input for code
  const [error, setError] = useState<string>("");

  const predefinedColors = ["#BC4B51", "#5B8E7D", "#F4A259", "#8CB369"];

  // Generate random alphanumeric code on component mount
  useEffect(() => {
    generateRandomCode();
  }, []);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid ambiguous characters
    let result = '';
    for (let i = 0; i < 5; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleSubmit = () => {
    if (
      !title ||
      !startDate ||
      !endDate ||
      !time ||
      !description ||
      (!color && !customColor)
    ) {
      setError("Please fill in all required fields.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    const selectedColor = customColor || color;
    
    const formatDateRange = (start: string, end: string) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      const options: Intl.DateTimeFormatOptions = { 
        month: 'long',
        timeZone: 'UTC'
      };
      
      const startMonth = startDate.toLocaleString('en-US', options);
      const endMonth = endDate.toLocaleString('en-US', options);
      const startDay = startDate.getDate().toString().padStart(2, '0');
      const endDay = endDate.getDate().toString().padStart(2, '0');
      
      if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}`;
      }
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    };

    addJam({
      name: title,
      date: formatDateRange(startDate, endDate),
      time: time,
      color: `bg-[${selectedColor}]`,
      code: code, // Using auto-generated code
      description: description
    });

    navigate("/study-jam");
  };

  return (
    <div className="p-4 font-sans max-w-md mx-auto">
      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 w-[350px] rounded-xl backdrop-blur-md text-sm text-white shadow-xl z-50 flex justify-center items-center"
          style={{
            backgroundColor: 'rgba(249, 65, 68, 0.49)',
            border: '1px solid rgba(249, 65, 68, 0.54)',
            fontFamily: 'Teena, sans-serif',
          }}
        >
          {error}
        </div>
      )}
      
      <div className="flex justify-between text-sm">
        <a href="/study-jam" className="text-[#FD6555]">
          CANCEL
        </a>
      </div>
      
      <h1 className="text-2xl font-bold mt-4">New Study Jam</h1>

        <div className="mt-4">
          <label className="font-semibold">Project Name</label>
          <input
            type="text"
            placeholder="My awesome project"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold block">Deadline</label>
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
          <label className="font-semibold">Description</label>
          <textarea
            placeholder="What is your awesome project all about..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 mt-1 rounded"
            rows={3}
          ></textarea>
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

         <div className="mt-4">
<div className="mt-4">
        <label className="font-semibold">Study Jam Code</label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            value={code}
            readOnly
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">This code will be used to invite others</p>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-black text-white py-3 rounded"
      >
        Create
      </button>
    </div>
    </div>
  );
}


export default CreateAJam;