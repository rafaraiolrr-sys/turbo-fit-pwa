// TurboFit - Sistema de Armazenamento Local

import { 
  UserProfile, 
  Workout, 
  WorkoutHistory, 
  UserProgress,
  OnboardingData 
} from './types';

const STORAGE_KEYS = {
  USER_PROFILE: 'turbofit_user_profile',
  WORKOUTS: 'turbofit_workouts',
  HISTORY: 'turbofit_history',
  PROGRESS: 'turbofit_progress',
  CURRENT_WORKOUT: 'turbofit_current_workout',
};

// User Profile
export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  }
};

export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

export const createUserProfile = (data: OnboardingData): UserProfile => {
  const profile: UserProfile = {
    id: `user_${Date.now()}`,
    name: data.name,
    experienceLevel: data.experienceLevel,
    biotipo: data.biotipo,
    goals: data.goals,
    averageTimeAvailable: data.averageTimeAvailable,
    createdAt: new Date().toISOString(),
  };
  saveUserProfile(profile);
  return profile;
};

// Workouts
export const saveWorkout = (workout: Workout): void => {
  if (typeof window === 'undefined') return;
  const workouts = getWorkouts();
  workouts.push(workout);
  localStorage.setItem(STORAGE_KEYS.WORKOUTS, JSON.stringify(workouts));
};

export const getWorkouts = (): Workout[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.WORKOUTS);
  return data ? JSON.parse(data) : [];
};

export const getCurrentWorkout = (): Workout | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_WORKOUT);
  return data ? JSON.parse(data) : null;
};

export const setCurrentWorkout = (workout: Workout | null): void => {
  if (typeof window === 'undefined') return;
  if (workout) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_WORKOUT, JSON.stringify(workout));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_WORKOUT);
  }
};

// History
export const saveWorkoutHistory = (history: WorkoutHistory): void => {
  if (typeof window === 'undefined') return;
  const allHistory = getWorkoutHistory();
  allHistory.push(history);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(allHistory));
};

export const getWorkoutHistory = (): WorkoutHistory[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
  return data ? JSON.parse(data) : [];
};

// Progress
export const getUserProgress = (): UserProgress | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : null;
};

export const updateUserProgress = (workout: WorkoutHistory): void => {
  if (typeof window === 'undefined') return;
  
  const currentProgress = getUserProgress();
  const history = getWorkoutHistory();
  
  // Calcular streak
  const calculateStreak = (): number => {
    if (history.length === 0) return 1;
    
    const sortedHistory = [...history].sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
    
    let streak = 1;
    let lastDate = new Date(sortedHistory[0].completedAt);
    
    for (let i = 1; i < sortedHistory.length; i++) {
      const currentDate = new Date(sortedHistory[i].completedAt);
      const diffDays = Math.floor((lastDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
        lastDate = currentDate;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  // Calcular consistência semanal
  const calculateWeeklyConsistency = (): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weekWorkouts = history.filter(h => 
      new Date(h.completedAt) >= oneWeekAgo
    );
    
    return Math.min(100, (weekWorkouts.length / 4) * 100); // 4 treinos = 100%
  };
  
  const totalMinutes = history.reduce((sum, h) => sum + h.duration, 0);
  const currentStreak = calculateStreak();
  
  const progress: UserProgress = {
    userId: workout.userId,
    totalWorkouts: history.length,
    totalMinutes,
    currentStreak,
    longestStreak: Math.max(currentProgress?.longestStreak || 0, currentStreak),
    weeklyConsistency: calculateWeeklyConsistency(),
    lastWorkoutDate: workout.completedAt,
    difficultyLevel: workout.difficulty,
  };
  
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

// Utility
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

export const hasCompletedOnboarding = (): boolean => {
  return getUserProfile() !== null;
};
