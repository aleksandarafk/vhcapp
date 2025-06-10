import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Bell, Filter, MoreVertical } from "lucide-react";
import NavigationMenu from "../NavigationMenu/NavigationMenu";
import { 
    format, 
    startOfMonth, 
    endOfMonth, 
    eachDayOfInterval, 
    isToday, 
    isSameDay, 
    addMonths, 
    subMonths 
} from "date-fns";
import { useSwipeable } from "react-swipeable";

type Task = {
    id: number;
    owner: "me" | "group";
    completed: boolean;
    title: string;
    description: string;
};

function StudyJamBiology() {
    // Define initial tasks with proper types
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            owner: "me",
            completed: false,
            title: "Find Resources",
            description: "Find relevant resources for the project",
        },
        {
            id: 2,
            owner: "me",
            completed: true,
            title: "Select a Topic",
            description: "Choose the topic for our biology project",
        },
        {
            id: 3,
            owner: "group",
            completed: false,
            title: "Analyze Findings",
            description: "Analyze all collected data together",
        },
        {
            id: 4,
            owner: "group",
            completed: false,
            title: "Fact-check sources",
            description: "Verify all sources for accuracy",
        },
        {
            id: 5,
            owner: "group",
            completed: true,
            title: "Prepare Presentation",
            description: "Create slides for final presentation",
        }
    ]);

    // Status colors
    const statusColors: Record<string, string> = {
        completed: "bg-green-100 border-l-green-400",
        unfinished: "bg-orange-100 border-l-orange-400",
    };

    const [filter, setFilter] = useState<"all" | "my" | "group" | "unfinished" | "completed">("my");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
    const [showAchievement, setShowAchievement] = useState(false);
    const [hasShownAchievement, setHasShownAchievement] = useState(false);
const today = new Date();
const [selectedMonth, setSelectedMonth] = useState<Date>(today);
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [transitioning, setTransitioning] = useState(false);
const [translateX, setTranslateX] = useState(0);
const [opacity, setOpacity] = useState(1);

const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
});

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

    // Filter tasks based on filter state
    const filteredTasks = tasks.filter((task) => {
        if (filter === "all") return true;
        if (filter === "my") return task.owner === "me";
        if (filter === "group") return task.owner === "group";
        if (filter === "unfinished") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    // Calculate completion percentage
    const completedTasksCount = tasks.filter((t) => t.completed).length;
    const totalTasks = tasks.length;
    const completionPercent = totalTasks === 0 ? 0 : (completedTasksCount / totalTasks) * 100;

    // Show achievement when project is fully completed
    useEffect(() => {
        if (completionPercent === 100 && !hasShownAchievement) {
            setShowAchievement(true);
            setHasShownAchievement(true);
            setTimeout(() => setShowAchievement(false), 4000);
        }
    }, [completionPercent, hasShownAchievement]);

    // Handlers
    const markTaskDone = (id: number) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, completed: true } : task))
        );
    };

    const splitTask = (id: number) => {
        setTasks((prev) => {
            const index = prev.findIndex((t) => t.id === id);
            if (index === -1) return prev;
            const task = prev[index];
            const newTask1 = { ...task, id: Date.now(), title: task.title + " Part 1" };
            const newTask2 = { ...task, id: Date.now() + 1, title: task.title + " Part 2" };
            return [...prev.slice(0, index), newTask1, newTask2, ...prev.slice(index + 1)];
        });
    };

    const editTask = (id: number) => {
        alert(`Edit task with id: ${id} (implement edit UI)`);
    };

    const moreDetails = (id: number) => {
        alert(`More details for task id: ${id} (implement details modal)`);
    };

    const confirmDeleteTask = (id: number) => {
        setTaskToDelete(id);
        setShowDeleteModal(true);
    };

    const deleteTask = () => {
        if (taskToDelete == null) return;
        setTasks((prev) => prev.filter((task) => task.id !== taskToDelete));
        setShowDeleteModal(false);
        setNotification("Task Removed");
        setTaskToDelete(null);
        setTimeout(() => setNotification(null), 3000);
    };

    // Group tasks by filter category
const getGroupedTasks = () => {
    switch (filter) {
        case "my":
            return {
                "My Tasks": tasks.filter(task => task.owner === "me" && !task.completed)
            };
        case "group":
            return {
                "Group Tasks": tasks.filter(task => task.owner === "group" && !task.completed)
            };
        case "unfinished":
            return { "Unfinished Tasks": filteredTasks };
        case "completed":
            return { "Completed Tasks": filteredTasks };
        case "all":
        default:
            return {
                "My Tasks": tasks.filter(task => task.owner === "me" && !task.completed),
                "Group Tasks": tasks.filter(task => task.owner === "group" && !task.completed),
                "Completed Tasks": tasks.filter(task => task.completed)
            };
    }
};

    const groupedTasks = getGroupedTasks();

    return (
        <>
            {/* Topbar */}
            <div className="flex items-center justify-between p-4 border-b relative z-10 bg-white">
                <Button variant="ghost" size="icon"
                    className="cursor-pointer" onClick={() =>
                        setSidebarOpen(!sidebarOpen)}>
                    <Menu className="w-5 h-5" />
                </Button>
                <h1 className="text-lg font-semibold truncate max-w-[60%]">Biology Project</h1>
                <div className="relative">
                    <Button variant="ghost" size="icon" onClick={() => setShowFilters(!showFilters)}>
                        <Filter className="w-5 h-5" />
                    </Button>
                    {/* Dropdown filter buttons - mobile friendly */}
                    {showFilters && (
                        <div className="absolute right-0 mt-2 top-full bg-white rounded-md shadow-md p-2 w-40 flex flex-col space-y-2 z-10">
                            <button
                                className={`px-3 py-2 rounded text-sm text-center ${filter === "all" ? "bg-black text-white" : "bg-gray-200"}`}
                                onClick={() => {
                                    setFilter("all");
                                    setShowFilters(false);
                                }}
                            >
                                All Tasks
                            </button>
                            <button
                                className={`px-3 py-2 rounded text-sm text-center ${filter === "my" ? "bg-black text-white" : "bg-gray-200"}`}
                                onClick={() => {
                                    setFilter("my");
                                    setShowFilters(false);
                                }}
                            >
                                My Tasks
                            </button>
                            <button
                                className={`px-3 py-2 rounded text-sm text-center ${filter === "group" ? "bg-black text-white" : "bg-gray-200"}`}
                                onClick={() => {
                                    setFilter("group");
                                    setShowFilters(false);
                                }}
                            >
                                Group Tasks
                            </button>
                            <button
                                className={`px-3 py-2 rounded text-sm text-center ${filter === "unfinished" ? "bg-black text-white" : "bg-gray-200"}`}
                                onClick={() => {
                                    setFilter("unfinished");
                                    setShowFilters(false);
                                }}
                            >
                                Unfinished
                            </button>
                            <button
                                className={`px-3 py-2 rounded text-sm text-center ${filter === "completed" ? "bg-black text-white" : "bg-gray-200"}`}
                                onClick={() => {
                                    setFilter("completed");
                                    setShowFilters(false);
                                }}
                            >
                                Completed
                            </button>
                        </div>
                    )}

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
            <NavigationMenu
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                conversations={[]}
                setCurrentConvIndex={() => { }}
                currentConvIndex={0}
                titles={["Study Jam"]}
                activeMenuIndex={null}
                setActiveMenuIndex={() => { }}
                setRenameModalOpen={() => { }}
                setDeleteModalOpen={() => { }}
                setChatToModify={() => { }}
                setNewTitle={() => { }}
                createNewConversation={() => { }}
            />
 {/* Centered images and text above */}
<div className="text-center mt-6 pb-2 px-4">
  <p className="mb-3 font-normal text-gray-500 text-sm">
    These are your unique group project tasks!
  </p>
  <div className="relative mx-auto w-40 h-26">
    <img
      src="/irene_answering 1.png"
      alt="Virtual Human Torso"
      className="rounded-full w-24 h-24 mx-auto"
    />
    <img
      src="/Profile.png"
      alt="Group Member 1"
      className="rounded-full w-10 h-10 absolute top-0 left-6"
    />
    <img
      src="/Profile.png"
      alt="Group Member 2"
      className="rounded-full w-10 h-10 absolute top-0 right-6"
    />
  </div>
</div>

            {/* Project Planner Calendar */}
<div
    {...handlers}
    className="px-4 py-3"
    style={{
        transform: `translateX(${translateX}px)`,
        opacity,
        transition: transitioning
            ? 'transform 0.3s ease, opacity 0.3s ease'
            : "none",
    }}
>
    <div className="flex justify-between items-center mb-3">
        <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => handleSwipe(1)}
        >
            &lt;
        </Button>
        <span className="text-sm font-medium text-gray-800">
            {format(selectedMonth, "MMMM yyyy")}
        </span>
        <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={() => handleSwipe(-1)}
        >
            &gt;
        </Button>
    </div>


    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-600">
        {daysInMonth.map((day) => (
            <div
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={`p-2 rounded-full cursor-pointer border ${
                    isToday(day) 
                        ? "bg-black text-white" 
                        : "hover:bg-gray-100"
                } ${
                    selectedDate && isSameDay(day, selectedDate)
                        ? "border border-blue-500"
                        : ""
                }`}
            >
                {format(day, "d")}
            </div>
        ))}
    </div>
</div>
            {/* Project Completion */}
<div className="max-w-md mx-auto mb-8 px-4 py-3">
    <h2 className="text-left font-bold text-lg mb-3">Project Completion</h2>
    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
        <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${completionPercent}%` }}
        />
    </div>
    <p className="text-center text-sm font-semibold">
        {completedTasksCount} of {totalTasks} tasks done
    </p>
</div>

            {/* Achievement Notification */}
            {showAchievement && (
                <div
                    className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 w-[350px] rounded-xl backdrop-blur-md text-sm text-white shadow-xl z-50"
                    style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.49)',
                        border: '1px solid rgba(0, 0, 0, 0.54)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <img src="completedtaskrecord.png" className="w-8 h-8" alt="achievement" />
                        <div className="text-sm text-black">
                            <div className="font-semibold">Group Badge Unlocked: GG!</div>
                            <div className="text-xs text-[#242424] mt-1">You successfully completed your project.</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Task List with proper grouping */}
            <div className="max-w-md mx-auto px-4 py-3 space-y-3">
                {Object.entries(groupedTasks).map(([category, tasks]: [string, Task[]]) => {
                    if (tasks.length === 0) return (
                        <div key={category} className="space-y-3">
                            <h2 className="text-left font-bold text-lg">{category}</h2>
                            <p className="text-gray-500 italic">Yay! All Tasks are Complete</p>
                        </div>
                    );
                    return (
                        <div key={category} className="space-y-3">
                            <h2 className="text-left font-bold text-lg">{category}</h2>
                           {tasks.map((task: Task) => (
  <div key={task.id} className={`relative p-4 rounded-xl shadow-sm transition-all duration-200 ${
    task.completed ? statusColors.completed : statusColors.unfinished
  }`}>

                                    <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0">
                                            <div className="font-semibold">{task.title}</div>
                                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-700">
                                                <span className="px-2 py-0.5 rounded-full border border-gray-300 bg-white/70 text-gray-700 text-xs">
                                                    {task.owner === "me" ? "My Task" : "Group Task"}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-full border border-gray-300 bg-white/70 text-gray-700 text-xs capitalize">
                                                    {task.completed ? "Completed" : "Unfinished"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="relative shrink-0">
 <Button
      variant="ghost"
      size="icon"
      className="hover:bg-zinc-200/60 transition"
      onClick={() => setActiveTaskId(activeTaskId === task.id ? null : task.id)}
    >
      <MoreVertical className="w-4 h-4 text-gray-700" />
    </Button>
    {activeTaskId === task.id && (
      <div className="absolute right-0 mt-1 w-44 bg-white shadow-lg rounded-md text-sm z-[1000] border">
        {!task.completed && (
          <div
            onClick={() => {
              markTaskDone(task.id);
              setActiveTaskId(null);
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Mark as Done
          </div>
        )}
        <div
          onClick={() => {
            splitTask(task.id);
            setActiveTaskId(null);
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Split Task
        </div>
                                                            <div
                                                        onClick={() => {
                                                            moreDetails(task.id);
                                                            setActiveTaskId(null);
                                                        }}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        More Details
                                                    </div>
                                                    <div
                                                        onClick={() => {
                                                            editTask(task.id);
                                                            setActiveTaskId(null);
                                                        }}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                                    >
                                                        Edit
                                                    </div>

                                                    <div
                                                        onClick={() => {
                                                            confirmDeleteTask(task.id);
                                                            setActiveTaskId(null);
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
                    );
                })}
            </div>

            {/* Delete confirmation modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-80 max-w-full shadow-lg space-y-4">
                        <p>Are you sure you want to delete this task?</p>
                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={deleteTask}>
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Snackbar */}
            {notification && (
          <div
            className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl backdrop-blur-md w-[350px] text-sm text-white shadow-xl z-50 flex justify-center items-center"
            style={{
              backgroundColor: 'rgba(249, 65, 68, 0.49)',
              border: '1px solid rgba(249, 65, 68, 0.54)',
            }}
          >
                    {notification}
                </div>
            )}

            {/* Add Task button */}
            <div className="max-w-xs mx-auto mt-8 mb-4">
                <button className="bg-black text-white rounded-sm py-2 w-full cursor-pointer hover:bg-[#8F88FD] transition-colors duration-300">
                    Add Task
                </button>
            </div>
        </>
    );
}

export default StudyJamBiology;