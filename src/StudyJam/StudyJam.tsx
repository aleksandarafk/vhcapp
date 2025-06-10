import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { MoreHorizontal, Copy, Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Activity {
  id: number;
  user: string;
  action: string;
  description: string;
  avatar: string;
  groupId: number;
}

interface StudyJamProps {
  jams: Array<{
    id: number;
    name: string;
    date: string;
    time: string;
    color: string;
    code: string;
    description: string;
  }>;
  onRemoveJam: (id: number) => void;
}

function StudyJam({ jams: studyJams, onRemoveJam: removeJam }: StudyJamProps) {
  const getColorClass = (colorValue: string) => {
    // Extract just the color hex from the bg-[#HEX] class if it exists
    const hexColor = colorValue.replace('bg-[', '').replace(']', '');
    return { backgroundColor: hexColor };
  };

  const navigate = useNavigate();

  // Internal state only if no props passed
  const [conversations] = useState([
    [{ role: "assistant", content: "Hi! How can I help you today?" }],
  ]);
  const [titles] = useState(["Study Jam"]);
  const [currentConvIndex, setCurrentConvIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [activeMenuIndex] = useState<number | null>(null);
  const [openGroup, setOpenGroup] = useState<null | (typeof studyJams[0])>(null);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      user: "Mijke",
      action: "has completed his task",
      description: "View your group progress and earn rewards",
      avatar: "https://i.pravatar.cc/150?img=3",
      groupId: 1,
    },
    {
      id: 2,
      user: "Fred",
      action: "added a new task in his agenda",
      description: "View all changes to the group agenda",
      avatar: "https://i.pravatar.cc/150?img=4",
      groupId: 2,
    },
  ]);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showLeaveToast, setShowLeaveToast] = useState(false);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [groupToLeave, setGroupToLeave] = useState<null | { id: number; name: string }>(null);
  const [currentPage] = useState<"virtual-coach" | "personal-planner" | "study-jam" | "profile">("study-jam");

  useEffect(() => {
    const timer = setTimeout(() => {
      setActivities((prev) => [
        ...prev,
        {
          id: 3,
          user: "Anna",
          action: "joined the group",
          description: "Welcome Anna to your study jam!",
          avatar: "https://i.pravatar.cc/150?img=5",
          groupId: 1,
        },
      ]);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveActivity = (id: number) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const openLeaveModal = (jam: { id: number; name: string }) => {
    setGroupToLeave(jam);
    setLeaveModalOpen(true);
  };

  const confirmLeaveGroup = () => {
    if (groupToLeave) {
      removeJam(groupToLeave.id);
      setOpenGroup(null);
      setShowLeaveToast(true);
      setTimeout(() => setShowLeaveToast(false), 2500);
    }
    setLeaveModalOpen(false);
    setGroupToLeave(null);
  };

  const cancelLeaveGroup = () => {
    setLeaveModalOpen(false);
    setGroupToLeave(null);
  };

  const SwipeableActivity = ({
    activity,
    onRemove,
  }: {
    activity: Activity;
    onRemove: (id: number) => void;
  }) => {
    const [translateX, setTranslateX] = useState(0);
    const [opacity, setOpacity] = useState(1);
    const [removing, setRemoving] = useState(false);

    const handlers = useSwipeable({
      onSwiping: ({ deltaX }) => {
        if (deltaX > 0) {
          setTranslateX(deltaX);
          setOpacity(1 - deltaX / 200);
        }
      },
      onSwipedRight: () => {
        setTranslateX(200);
        setOpacity(0);
        setRemoving(true);
        setTimeout(() => onRemove(activity.id), 300);
      },
      trackMouse: true,
    });

    return (
      <div
        {...handlers}
        style={{
          transform: `translateX(${translateX}px)`,
          opacity,
          transition: removing
            ? "transform 0.3s ease-out, opacity 0.3s ease-out"
            : "none",
        }}
        className="w-full flex items-center gap-4 border p-2 rounded-lg text-left cursor-pointer relative overflow-hidden bg-white"
      >
        <img
          src={activity.avatar}
          alt={activity.user}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-semibold" style={{ fontFamily: 'Teena, sans-serif' }}>
            {activity.user} {activity.action}
          </p>
          <p className="text-xs text-gray-500">{activity.description}</p>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border-b relative">
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
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
              <span className="absolute top-1 right-1 block w-2 h-2 bg-red-500 rounded-full" />
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

      <div className="p-4 font-sans max-w-md mx-auto space-y-4 relative z-0">
        <h2 className="text-xl font-bold mt-6" style={{ fontFamily: 'Teena, sans-serif' }}>
          My Study Jams
        </h2>

        {studyJams.length === 0 ? (
          <p className="text-center text-gray-500 mt-8" style={{ fontFamily: 'Teena Light, sans-serif' }}>
            You haven't joined any jams
          </p>
        ) : (
          studyJams.map((jam) => (
        <div
          key={jam.id}
          className="rounded-xl p-4 text-white flex justify-between items-center"
          style={getColorClass(jam.color)}
        >
          <a href="/studyjambiology">
            <div>
              <h2 className="font-medium text-lg leading-tight" style={{ fontFamily: 'Teena, sans-serif' }}>
                {jam.name}
              </h2>
              <p className="text-sm" style={{ fontFamily: 'Teena, sans-serif' }}>
                {jam.date} • {jam.time}
              </p>
            </div>
          </a>

              <Popover>
                <PopoverTrigger>
                  <MoreHorizontal className="w-6 h-6" />
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2 text-sm z-50">
                  <button
                    onClick={() => setOpenGroup(jam)}
                    className="w-full text-left hover:bg-gray-100 rounded p-2"
                  >
                    More details
                  </button>
                  <button
                    onClick={() => openLeaveModal(jam)}
                    className="w-full text-left text-red-600 hover:bg-red-100 rounded p-2"
                  >
                    Leave group
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          ))
        )}

        <Dialog open={!!openGroup} onOpenChange={() => setOpenGroup(null)}>
          <DialogContent className="z-50">
            <DialogHeader>
              <DialogTitle>{openGroup?.name}</DialogTitle>
            </DialogHeader>
            <p className="text-sm">{openGroup?.description}</p>
            <p className="text-sm">Deadline: {openGroup?.date}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-mono">Code: {openGroup?.code}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (openGroup) {
                    navigator.clipboard.writeText(openGroup.code);
                    setShowCopyToast(true);
                    setTimeout(() => setShowCopyToast(false), 2000);
                  }
                }}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <h2 className="text-xl font-bold mt-6" style={{ fontFamily: 'Teena, sans-serif' }}>
          Recent Group Activity
        </h2>
        {activities.length === 0 && (
          <p className="text-center text-gray-500" style={{ fontFamily: 'Teena Light, sans-serif' }}>
            No New Team Activities for Now - Stay Tuned!
          </p>
        )}
        {activities.map((a) => (
          <SwipeableActivity
            key={a.id}
            activity={a}
            onRemove={handleRemoveActivity}
          />
        ))}

        <Button
          className="w-full bg-black text-white py-3 rounded text-base mt-6 hover:bg-[#8F88FD] transition-colors duration-300"
          style={{ fontFamily: 'Teena, sans-serif' }}
          onClick={() => navigate("/jam-options")}
        >
          + New Study Jam
        </Button>

        {showCopyToast && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl w-[350px] backdrop-blur-md text-sm text-white shadow-xl z-50 flex justify-center items-center"
            style={{
              backgroundColor: 'rgba(144, 190, 109, 0.49)',
              border: '1px solid rgba(144, 190, 109, 0.54)',
            }}
          >
            <span className="text-white text-base font-medium">Copied Jam Code!</span>
          </div>
        )}

        {showLeaveToast && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl backdrop-blur-md w-[350px] text-sm text-white shadow-xl z-50 flex justify-center items-center"
            style={{
              backgroundColor: 'rgba(249, 65, 68, 0.49)',
              border: '1px solid rgba(249, 65, 68, 0.54)',
            }}
          >
            <span className="text-white text-base font-medium" style={{ fontFamily: 'Teena, sans-serif' }}>
              You left this Jam
            </span>
          </div>
        )}

        <Dialog open={leaveModalOpen} onOpenChange={cancelLeaveGroup}>
          <DialogContent className="z-50">
            <DialogHeader>
              <DialogTitle>Leave Group</DialogTitle>
            </DialogHeader>
            <p className="mb-6">
              Are you sure you want to leave the group "{groupToLeave?.name}"?
            </p>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={cancelLeaveGroup}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmLeaveGroup} className="bg-[#FD6555]">
                Leave Group
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
    </>
  );
}

export default StudyJam;