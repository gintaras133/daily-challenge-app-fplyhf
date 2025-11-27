
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TodayTask {
  task: string;
  constraint: string;
  skillMastery: string;
  duration: string;
  suggestion: string;
  partner: string;
}

interface TaskContextType {
  todayTask: TodayTask;
  updateTodayTask: (task: TodayTask) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default task data - in a real app, this would come from an API
  const [todayTask, setTodayTask] = useState<TodayTask>({
    task: "Story in 3 Clips",
    constraint: "Tell a mini story in three separate shots or angles.",
    skillMastery: "Narrative pacing, basic sequencing, and transitions.",
    duration: "20–40 sec final video\n60 min for shooting + editing.",
    suggestion: "Use CapCut transition effects between clips",
    partner: "CapCut"
  });

  const updateTodayTask = (task: TodayTask) => {
    setTodayTask(task);
  };

  // In a real app, you would fetch the task from an API here
  useEffect(() => {
    // Example: fetchTodayTask().then(setTodayTask);
    console.log('Today\'s task loaded:', todayTask);
  }, []);

  return (
    <TaskContext.Provider value={{ todayTask, updateTodayTask }}>
      {children}
    </TaskContext.Provider>
  );
};
