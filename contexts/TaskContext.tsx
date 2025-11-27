
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TodayTask {
 Challenge: string;
 Guidelines: string;
  Conquered_fear: string;
  Duration: string;
  Partner: string;
  Reward: string;
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
		Challenge:  "Tell a mini story in three separate shots or angles.",
 		Guidelines: "Speak directly to the camera, 10–15 seconds.";
	  Conquered_fear:"Fear of sounding “cringe” or not deep enough.";
	  Duration:"15–20 sec.";
	  Partner: "CapCut",
    Reward: "1 Bloop token"
  });

  // Yesterday's task data
  const [yesterdayTask, setYesterdayTask] = useState<YesterdayTask>({
    Challenge:  "Show a “before and after” of something small you improved today."
 		Guidelines: "Can be cleaning, organizing, outfit, workspace..";
	  Conquered_fear:" Fear of being judged for imperfection.";
	  Duration:"15–20 sec.";
	  Partner: "CapCut",
   Reward: "100 Bloop token"
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
  }, []);

  return (
    <TaskContext.Provider value={{ todayTask, yesterdayTask, updateTodayTask, updateYesterdayTask }}>
      {children}
    </TaskContext.Provider>
  );
};
