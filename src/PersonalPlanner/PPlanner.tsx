import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameWeek,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
} from "date-fns";
import { Bell, MoreVertical, Filter, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSwipeable } from "react-swipeable";
import { useTaskContext } from "./TaskContext";

interface PersonalPlannerProps {
  setCurrentPage: (page: Page) => void;
}

type Page = "virtual-coach" | "personal-planner" | "study-jam" | "profile";

const categoryColors: Record<string, string> = {
  school: "bg-green-100 border-green-400",
  homework: "bg-orange-100 border-orange-400",
  personal: "bg-red-100 border-red-400",
};

const dotColors: Record<string, string> = {
  school: "bg-green-500",
  homework: "bg-orange-500",
  personal: "bg-red-500",
};

// Define alert types
type AlertType = 'default' | 'subtask' | 'datechange' | 'rename';

interface AlertMessage {
  message: string;
  type?: AlertType;
}

export default function PersonalPlanner({}: PersonalPlannerProps) {
  const { tasks, updateTask, deleteTask, addSubtask } = useTaskContext();
  const [conversations] = useState([
    [{ role: "assistant", content: "Hi! How can I help you today?" }],
  ]);
  const [titles] = useState(["Personal Planner"]);
  const [currentConvIndex, setCurrentConvIndex] = useState(0);
  const navigate = useNavigate();
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const daysInMonth = eachDayOfInterval({ 
    start: startOfMonth(selectedMonth), 
    end: endOfMonth(selectedMonth) 
  });
  const [filter, setFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [alert, setAlert] = useState<AlertMessage | string | null>(null);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);
  const [renameModal, setRenameModal] = useState<{ index: number | null; value: string }>({ 
    index: null, 
    value: "" 
  });
  const [dateModal, setDateModal] = useState<{ index: number | null; value: string }>({ 
    index: null, 
    value: "" 
  });
  const [subtaskModal, setSubtaskModal] = useState<{ index: number | null; value: string }>({ 
    index: null, 
    value: "" 
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [opacity, setOpacity] = useState(1);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe(-1),
    onSwipedRight: () => handleSwipe(1),
    trackTouch: true,
  });

  const handleSwipe = (dir: 1 | -1) => {
    setTransitioning(true);
    setTranslateX(dir * 100);
    setOpacity(0);

    setTimeout(() => {
      setSelectedMonth((prev) =>
        dir === 1 ? subMonths(prev, 1) : addMonths(prev, 1)
      );
      setTranslateX(-dir * 100);
      setTimeout(() => {
        setTranslateX(0);
        setOpacity(1);
        setTransitioning(false);
      }, 10);
    }, 300);
  };

  const filteredTasks = tasks.filter((task) => {
    const isInWeek = filter === "week" ? isSameWeek(parseISO(task.deadline), today) : true;
    const isInCategory = categoryFilter === "all" ? true : task.category === categoryFilter;
    const isOnDate = selectedDate ? isSameDay(parseISO(task.deadline), selectedDate) : true;
    return isInWeek && isInCategory && isOnDate;
  });

  const showAlert = (message: string, type: AlertType = 'default'): void => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 2000);
  };

  const getDotColor = (date: Date): string | null => {
    const task = tasks.find((task) => isSameDay(new Date(task.deadline), date));
    return task ? dotColors[task.category] : null;
  };

  const applyRename = () => {
    if (renameModal.index !== null) {
      const updatedTask = {
        ...tasks[renameModal.index],
        title: renameModal.value
      };
      updateTask(renameModal.index, updatedTask);
      showAlert("Task Renamed", 'rename');
    }
    setRenameModal({ index: null, value: "" });
  };

  const applyDateChange = () => {
    if (dateModal.index !== null) {
      const updatedTask = {
        ...tasks[dateModal.index],
        deadline: dateModal.value
      };
      updateTask(dateModal.index, updatedTask);
      showAlert("Date Changed", 'datechange');
    }
    setDateModal({ index: null, value: "" });
  };

  const applySubtask = () => {
    if (subtaskModal.index !== null && subtaskModal.value.trim()) {
      addSubtask(subtaskModal.index, subtaskModal.value);
      showAlert("Subtask Added", 'subtask');
      setSubtaskModal({ index: null, value: "" });
    }
  };
const isGreenAlert = (type: AlertType) => 
  ['subtask', 'datechange', 'rename'].includes(type);

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-white">
      {/* Alert notification */}
{alert && (
  <div 
    className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 w-[350px] rounded-xl backdrop-blur-md text-sm text-white shadow-xl z-50 flex justify-center items-center"
    style={{
      backgroundColor: 
        typeof alert === 'object' && isGreenAlert(alert.type ?? 'default')
          ? 'rgba(144, 190, 109, 0.49)' 
          : 'rgba(249, 65, 68, 0.49)',
      border: 
        typeof alert === 'object' && isGreenAlert(alert.type ?? 'default')
          ? '1px solid rgba(144, 190, 109, 0.54)' 
          : '1px solid rgba(249, 65, 68, 0.54)',
    }}
  >
    {typeof alert === 'object' ? alert.message : alert}
  </div>
)}

        {/* Header */}
      <div className="flex items-center justify-between p-4 border-b relative z-20">
        <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold truncate max-w-[60%]">
          Personal Planner
        </h1>
        <div className="relative">
          <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="w-5 h-5" />
          </Button>
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
            {hasUnreadNotifications && <span className="absolute top-1 right-1 block w-2 h-2 bg-[#FD6555] rounded-full" />}
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="absolute right-4 top-14 w-35 bg-white dark:bg-zinc-800 border shadow-md rounded-md z-20 p-3 text-sm space-y-3">
          <div className="flex flex-col items-center gap-2">
            <Button
              className="w-full justify-center text-center"
              variant={filter === "all" ? "default" : "ghost"}
              onClick={() => setFilter("all")}
            >
              All
            </Button>
            <Button
              className="w-full justify-center text-center"
              variant={filter === "week" ? "default" : "ghost"}
              onClick={() => setFilter("week")}
            >
              This Week
            </Button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Button
              className="w-full justify-center text-center"
              variant={categoryFilter === "all" ? "default" : "ghost"}
              onClick={() => setCategoryFilter("all")}
            >
              All
            </Button>
            <Button
              className="w-full justify-center text-center"
              variant={categoryFilter === "school" ? "default" : "ghost"}
              onClick={() => setCategoryFilter("school")}
            >
              School
            </Button>
            <Button
              className="w-full justify-center text-center"
              variant={categoryFilter === "homework" ? "default" : "ghost"}
              onClick={() => setCategoryFilter("homework")}
            >
              Homework
            </Button>
            <Button
              className="w-full justify-center text-center"
              variant={categoryFilter === "personal" ? "default" : "ghost"}
              onClick={() => setCategoryFilter("personal")}
            >
              Personal
            </Button>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div
        {...handlers}
        style={{
          transform: `translateX(${translateX}%)`,
          opacity,
          transition: transitioning
            ? 'transform 0.3s ease, opacity 0.3s ease'
            : "none",
        }}
      >
        <div className="flex justify-between items-center px-4 py-1">
          <Button variant="ghost" onClick={() => handleSwipe(1)}>
            &lt;
          </Button>
          <span className="text-sm font-medium">
            {format(selectedMonth, "MMMM yyyy")}
          </span>
          <Button variant="ghost" onClick={() => handleSwipe(-1)}>
            &gt;
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1 px-4 py-2 text-center text-xs text-gray-600">
          {daysInMonth.map((day) => (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`p-2 rounded-full cursor-pointer border ${
                isToday(day) ? "bg-black text-white" : "hover:bg-gray-100"
              } ${
                selectedDate && isSameDay(day, selectedDate)
                  ? "border-blue-500"
                  : ""
              }`}
            >
              <div>{format(day, "d")}</div>
              {getDotColor(day) && (
                <div
                  className={`w-2 h-2 mx-auto mt-1 rounded-full ${getDotColor(day)}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <h2 className="text-left font-bold text-lg mb-2">My Tasks</h2>
        {filteredTasks.length === 0 && <p>No tasks found.</p>}

        {filteredTasks.map((task, idx) => (
          <div
            key={idx}
            className={`relative p-4 rounded-xl shadow-sm transition-all duration-200 ${
              categoryColors[task.category] || "bg-gray-100 border-l-4 border-gray-400"
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-sm">{task.title}</div>

                <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-700">
                  <span className="px-2 py-0.5 rounded-full border border-gray-300 bg-white/70 text-gray-700 text-xs">
                    Due: {format(new Date(task.deadline), "yyyy-MM-dd")}
                  </span>
                  <span className="px-2 py-0.5 rounded-full border border-gray-300 bg-white/70 text-gray-700 text-xs capitalize">
                    {task.category}
                  </span>
                </div>

                {task.subtasks.length > 0 && (
                  <ul className="mt-3 list-disc pl-5 text-xs text-gray-800 space-y-1">
                    {task.subtasks.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition"
                  onClick={() => setActiveMenuIndex(activeMenuIndex === idx ? null : idx)}
                >
                  <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </Button>

                {activeMenuIndex === idx && (
                  <div className="absolute right-0 mt-1 w-44 bg-white shadow-lg rounded-md text-sm z-[1000] border">
                    <div
                      onClick={() => {
                        setRenameModal({ index: idx, value: task.title });
                        setActiveMenuIndex(null);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Rename
                    </div>
                    <div
                      onClick={() => {
                        setDateModal({ index: idx, value: task.deadline });
                        setActiveMenuIndex(null);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Change Date
                    </div>
                    <div
                      onClick={() => {
                        setSubtaskModal({ index: idx, value: "" });
                        setActiveMenuIndex(null);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Add Subtask
                    </div>
                    <div
                      onClick={() => {
                        setConfirmDeleteIndex(idx);
                        setActiveMenuIndex(null);
                      }}
                      className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Delete
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDeleteIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Delete Task?</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setConfirmDeleteIndex(null)} variant="ghost">Cancel</Button>
              <Button 
                onClick={() => {
                  deleteTask(confirmDeleteIndex);
                  showAlert("Task Removed");
                  setConfirmDeleteIndex(null);
                }} 
                variant="destructive" 
                className="bg-[#FD6555]"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {renameModal.index !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Rename Task</h2>
            <input 
              type="text" 
              value={renameModal.value} 
              onChange={(e) => setRenameModal({ ...renameModal, value: e.target.value })} 
              className="w-full border rounded px-3 py-2 mb-4" 
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setRenameModal({ index: null, value: "" })} variant="ghost">Cancel</Button>
              <Button onClick={applyRename} className="hover:bg-[#8F88FD]">Rename</Button>
            </div>
          </div>
        </div>
      )}

      {/* Change Date Modal */}
      {dateModal.index !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Change Deadline</h2>
            <input 
              type="date" 
              value={dateModal.value} 
              onChange={(e) => setDateModal({ ...dateModal, value: e.target.value })} 
              className="w-full border rounded px-3 py-2 mb-4" 
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setDateModal({ index: null, value: "" })} variant="ghost">Cancel</Button>
              <Button onClick={applyDateChange} className="hover:bg-[#8F88FD]">Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Subtask Modal */}
      {subtaskModal.index !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Add Subtask</h2>
            <input 
              type="text" 
              value={subtaskModal.value} 
              onChange={(e) => setSubtaskModal({ ...subtaskModal, value: e.target.value })} 
              className="w-full border rounded px-3 py-2 mb-4" 
              placeholder="Enter subtask description"
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => setSubtaskModal({ index: null, value: "" })} variant="ghost">Cancel</Button>
              <Button onClick={applySubtask} className="hover:bg-[#8F88FD]">Add</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Task Button */}
      <div className="p-4 border-t">
        <Button 
          className="w-full hover:bg-[#8F88FD] transition-colors duration-300" 
          onClick={() => navigate("/personal-planner-task")}
        >
          Add New Task
        </Button>
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
    </div>
  );
}