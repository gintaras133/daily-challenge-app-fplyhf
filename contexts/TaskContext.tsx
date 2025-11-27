
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TodayTask {
  challenge: string;
  guidelines: string;
  conqueredFear: string;
  duration: string;
  partner: string;
  reward: string;
}

export interface YesterdayTask extends TodayTask {
  prize: string;
}

interface TaskContextType {
  todayTask: TodayTask;
  yesterdayTask: YesterdayTask;
  updateTodayTask: (task: TodayTask) => void;
  updateYesterdayTask: (task: YesterdayTask) => void;
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
    challenge: "Tell a mini story in three separate shots or angles.",
    guidelines: "Speak directly to the camera, 10–15 seconds.",
    conqueredFear: "Fear of sounding \"cringe\" or not deep enough.",
    duration: "15–20 sec.",
    reward: "1 Bloop token",
    partner: "CapCut"
  });

  // Yesterday's task data
  const [yesterdayTask, setYesterdayTask] = useState<YesterdayTask>({
    challenge: "Show a \"before and after\" of something small you improved today.",
    guidelines: "Can be cleaning, organizing, outfit, workspace..",
    conqueredFear: "Fear of being judged for imperfection.",
    duration: "15–20 sec.",
    reward: "100 Bloop tokens",
    partner: "CapCut",
    prize: "100 Bloop tokens"
  });

  const updateTodayTask = (task: TodayTask) => {
    setTodayTask(task);
  };

  const updateYesterdayTask = (task: YesterdayTask) => {
    setYesterdayTask(task);
  };

  // In a real app, you would fetch the task from an API here
  useEffect(() => {
    // Example: fetchTodayTask().then(setTodayTask);
    console.log('Today\'s task loaded:', todayTask);
    console.log('Yesterday\'s task loaded:', yesterdayTask);
  }, [todayTask, yesterdayTask]);

  return (
    <TaskContext.Provider value={{ todayTask, yesterdayTask, updateTodayTask, updateYesterdayTask }}>
      {children}
    </TaskContext.Provider>
  );
};
