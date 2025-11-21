// TurboFit - Sistema de Tipos

export type Emotion = 'raiva' | 'ansiedade' | 'preguica' | 'motivado';
export type ExperienceLevel = 'iniciante' | 'intermediario' | 'avancado';
export type Biotipo = 'ectomorfo' | 'mesomorfo' | 'endomorfo';
export type WorkoutDifficulty = 'facil' | 'medio' | 'dificil';
export type WorkoutDuration = 10 | 20 | 30 | 60 | 120;

export interface UserProfile {
  id: string;
  name: string;
  experienceLevel: ExperienceLevel;
  biotipo: Biotipo;
  goals: string[];
  averageTimeAvailable: WorkoutDuration;
  createdAt: string;
  lastWorkout?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  videoUrl?: string;
  muscleGroups: string[];
  difficulty: WorkoutDifficulty;
  duration: number; // segundos
  restTime: number; // segundos
  reps?: number;
  sets?: number;
}

export interface Workout {
  id: string;
  userId: string;
  emotion: Emotion;
  duration: WorkoutDuration;
  difficulty: WorkoutDifficulty;
  exercises: Exercise[];
  totalDuration: number;
  createdAt: string;
  completedAt?: string;
  feedback?: {
    wasEasy: boolean;
    completed: boolean;
    userRating: number; // 1-5
  };
}

export interface WorkoutHistory {
  id: string;
  userId: string;
  workoutId: string;
  completedAt: string;
  duration: number;
  difficulty: WorkoutDifficulty;
  feedback: {
    wasEasy: boolean;
    completed: boolean;
    userRating: number;
  };
}

export interface UserProgress {
  userId: string;
  totalWorkouts: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  weeklyConsistency: number; // 0-100
  lastWorkoutDate?: string;
  difficultyLevel: WorkoutDifficulty;
}

export interface OnboardingData {
  name: string;
  experienceLevel: ExperienceLevel;
  biotipo: Biotipo;
  goals: string[];
  averageTimeAvailable: WorkoutDuration;
}
