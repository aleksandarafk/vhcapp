import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

export interface Task {
  title: string;
  category: string;
  deadline: string;
  subtasks: string[];
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (index: number, updatedTask: Task) => void;
  deleteTask: (index: number) => void;
  addSubtask: (taskIndex: number, subtask: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([
    { title: "Submit Design Report", category: "school", deadline: "2025-06-17", subtasks: [] },
    { title: "Math Homework - Chapter 5", category: "homework", deadline: "2025-06-19", subtasks: [] },
    { title: "Buy groceries", category: "personal", deadline: "2025-06-21", subtasks: [] },
  ]);

  const addTask = (task: Task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTask = (index: number, updatedTask: Task) => {
    setTasks(prev => prev.map((task, i) => 
      i === index ? updatedTask : task
    ));
  };

  const deleteTask = (index: number) => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const addSubtask = (taskIndex: number, subtask: string) => {
    setTasks(prev => prev.map((task, i) => 
      i === taskIndex 
        ? { ...task, subtasks: [...task.subtasks, subtask] }
        : task
    ));
  };

  return (
    <TaskContext.Provider 
      value={{ 
        tasks, 
        addTask, 
        updateTask, 
        deleteTask,
        addSubtask 
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTaskContext must be used within a TaskProvider");
  return context;
};

export default TaskContext;