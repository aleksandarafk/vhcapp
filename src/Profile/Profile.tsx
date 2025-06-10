import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [conversations] = useState([
    [{ role: "assistant", content: "Hi! How can I help you today?" }],
  ]);
  const [titles] = useState(["Profile"]);
  const [currentConvIndex, setCurrentConvIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [activeMenuIndex] = useState<number | null>(null);
  const [currentPage] = useState<
    "virtual-coach" | "personal-planner" | "study-jam" | "profile"
  >("profile");

  return (
    <>
      {/* Topbar */}
      <div className="flex items-center justify-between p-4 border-b relative z-10 bg-white">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold truncate max-w-[60%]">
          {currentPage === "virtual-coach"
            ? titles[currentConvIndex] || `Chat ${currentConvIndex + 1}`
            : currentPage.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
        <div className="relative">
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="icon"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setHasUnreadNotifications(false);
            }}
          >
            <Bell className="w-5 h-5 cursor-pointer" />
            {hasUnreadNotifications && (
              <span className="absolute top-1 right-1 block w-2 h-2 bg-[#FD6555] rounded-full" />
            )}
          </Button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 border shadow-md rounded-md z-20 p-2 text-sm">
              <p className="text-black dark:text-white">🔔 You have 1 new message</p>
              <p className="text-xs text-muted-foreground mt-1">
                Welcome back! This is your dummy notification.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <NavigationMenu
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          conversations={conversations}
          setCurrentConvIndex={setCurrentConvIndex}
          currentConvIndex={currentConvIndex}
          titles={titles}
          activeMenuIndex={activeMenuIndex}
          setActiveMenuIndex={() => {}}
          setRenameModalOpen={() => {}}
          setDeleteModalOpen={() => {}}
          setChatToModify={() => {}}
          setNewTitle={() => {}}
          createNewConversation={() => {}}
        />
      )}

      {/* Main content */}
      <div className="p-4 font-sans max-w-md mx-auto space-y-6 relative z-0">

        {/* Profile Header */}
        <div className="flex flex-col items-center space-y-1">
          <img
            src="Profile.png" // Replace with user image
            alt="User"
            className="w-40 h-40 rounded-full object-cover"
          />
          <h2 className="text-xl font-bold"style={{ fontFamily: 'Tecna, sans-serif' }}>George Fiddlenan</h2>
          <p className="text-sm text-gray-500 text-center" style={{ fontFamily: 'Tecna, sans-serif' }}>
            g.fiddlenan@yonder.nl &nbsp;•&nbsp; Joined March 2025
          </p>
        </div>

        {/* Overview */}
       <div>
  <h3 className="text-lg font-bold"style={{ fontFamily: 'Tecna, sans-serif' }}>Overview</h3>
  <div className="grid grid-cols-2 gap-3" style={{ fontFamily: 'Tecna, sans-serif' }}>
    {[
      { icon: "🔥", value: "5", label: "Day streak" },
      { icon: "📦", value: "10", label: "Group Tasks Solved" },
      { icon: "✅", value: "25", label: "Completed Tasks" },
      { icon: "🏅", value: "10 / 25", label: "Achievements" },
    ].map((item, index) => (
      <div
        key={index}
        className="p-4 rounded-md border flex items-center space-x-3 text-left"
      >
        <div className="text-2xl">{item.icon}</div>
        <div>
          <p className="font-medium">{item.value}</p>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </div>
      </div>
    ))}
  </div>
</div>

        {/* Group Badges */}
<div>
  <div className="flex justify-between items-center mb-2">
    <h3 className="text-lg font-bold"style={{ fontFamily: 'Tecna, sans-serif' }}>Group Badges</h3>
    <button className="text-[#8F88FD] text-sm"style={{ fontFamily: 'Tecna Light, sans-serif' }} onClick={() => navigate("/groupbadges")}>View All</button>
  </div>
  <div className="flex bg-white border rounded-md p-3 divide-x">
    {[1, 2, 3].map((_, i) => (
      <div
        key={i}
        className="flex items-center justify-center px-2 w-1/3 h-24 overflow-hidden"
      >
        <img
          src="locked.png"
          alt={`Badge ${i + 1}`}
          className="object-contain w-20 h-20"
        />
      </div>
    ))}
  </div>
</div>


{/* Achievements */}
<div>
  <div className="flex justify-between items-center mb-2 mt-6">
    <h3 className="text-lg font-bold"style={{ fontFamily: 'Tecna, sans-serif' }}>Achievements</h3>
    <button className="text-[#8F88FD] text-sm" style={{ fontFamily: 'Tecna Light, sans-serif' }} onClick={() => navigate("/achievements")}>View All</button>
  </div>
  <div className="flex bg-white border rounded-md p-3 divide-x">
    {[
      "fire.png",
      "completedtask.png",
      "calendar.png",
      "medal.png", // extra image (won’t show unless mapped)
    ]
      .slice(0, 3) // only show first 3
      .map((src, i) => (
        <div
          key={i}
          className="flex justify-between p-3 space-x-2 w-1/3 h-24 overflow-hidden"
        >
          <img
            src={src}
            alt={`Achievement ${i + 1}`}
            className="object-contain w-full h-full"
          />
        </div>
      ))}
  </div>
</div>
        </div>
    </>
  );
}
