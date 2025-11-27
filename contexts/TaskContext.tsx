
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TodayTask {
  task: string;
  constraint: string;
  skillMastery: string;
  duration: string;
  suggestion: string;
  partner: string;
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
    task: "Story in 3 Clips",
    constraint: "Tell a mini story in three separate shots or angles.",
    skillMastery: "Narrative pacing, basic sequencing, and transitions.",
    duration: "20–40 sec final video\n60 min for shooting + editing.",
    suggestion: "Use CapCut transition effects between clips",
    partner: "CapCut"
  });

  // Yesterday's task data
  const [yesterdayTask, setYesterdayTask] = useState<YesterdayTask>({
    task: "Create a Product Hype Reel",
    constraint: "Showcase one product using three angles: top shot, side shot, hero shot.",
    skillMastery: "Cinematic framing, micro-motion editing, CapCut speed ramping.",
    duration: "Final Video: 15–25 sec\nProduction Window: 45 minutes",
    suggestion: "Use CapCut Speed Ramp → \"Hero\" to accentuate the reveal in the final clip.",
    partner: "CapCut",
    prize: "1 year subscription of CapCut Pro"
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
