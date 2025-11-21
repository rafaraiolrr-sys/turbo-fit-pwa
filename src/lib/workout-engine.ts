// TurboFit - Engine de Geração de Treinos

import { 
  Emotion, 
  ExperienceLevel, 
  WorkoutDuration, 
  WorkoutDifficulty,
  Workout,
  Exercise,
  UserProfile,
  UserProgress
} from './types';
import { EXERCISE_DATABASE } from './constants';

interface GenerateWorkoutParams {
  emotion: Emotion;
  duration: WorkoutDuration;
  userProfile: UserProfile;
  userProgress?: UserProgress | null;
}

export const generateWorkout = (params: GenerateWorkoutParams): Workout => {
  const { emotion, duration, userProfile, userProgress } = params;
  
  // Determinar dificuldade base
  let baseDifficulty: WorkoutDifficulty = 'medio';
  
  if (userProfile.experienceLevel === 'iniciante') {
    baseDifficulty = 'facil';
  } else if (userProfile.experienceLevel === 'avancado') {
    baseDifficulty = 'dificil';
  }
  
  // Ajustar dificuldade baseado no progresso
  if (userProgress) {
    baseDifficulty = adjustDifficultyBasedOnProgress(baseDifficulty, userProgress);
  }
  
  // Selecionar exercícios baseados na emoção
  const exercisePool = EXERCISE_DATABASE[emotion];
  const selectedExercises = selectExercisesForDuration(
    exercisePool,
    duration,
    baseDifficulty,
    userProfile.experienceLevel
  );
  
  // Criar workout
  const workout: Workout = {
    id: `workout_${Date.now()}`,
    userId: userProfile.id,
    emotion,
    duration,
    difficulty: baseDifficulty,
    exercises: selectedExercises,
    totalDuration: calculateTotalDuration(selectedExercises),
    createdAt: new Date().toISOString(),
  };
  
  return workout;
};

const adjustDifficultyBasedOnProgress = (
  currentDifficulty: WorkoutDifficulty,
  progress: UserProgress
): WorkoutDifficulty => {
  // Se consistência alta e streak bom, aumentar dificuldade
  if (progress.weeklyConsistency >= 75 && progress.currentStreak >= 5) {
    if (currentDifficulty === 'facil') return 'medio';
    if (currentDifficulty === 'medio') return 'dificil';
  }
  
  // Se consistência baixa, manter ou diminuir
  if (progress.weeklyConsistency < 40) {
    if (currentDifficulty === 'dificil') return 'medio';
    if (currentDifficulty === 'medio') return 'facil';
  }
  
  return currentDifficulty;
};

const selectExercisesForDuration = (
  exercisePool: typeof EXERCISE_DATABASE.raiva,
  targetDuration: WorkoutDuration,
  difficulty: WorkoutDifficulty,
  experienceLevel: ExperienceLevel
): Exercise[] => {
  const targetSeconds = targetDuration * 60;
  const exercises: Exercise[] = [];
  let currentDuration = 0;
  
  // Multiplicadores de dificuldade
  const difficultyMultiplier = {
    facil: 0.7,
    medio: 1.0,
    dificil: 1.3,
  };
  
  const experienceMultiplier = {
    iniciante: 0.8,
    intermediario: 1.0,
    avancado: 1.2,
  };
  
  const multiplier = difficultyMultiplier[difficulty] * experienceMultiplier[experienceLevel];
  
  // Selecionar exercícios até preencher o tempo
  let poolIndex = 0;
  while (currentDuration < targetSeconds && poolIndex < exercisePool.length) {
    const baseExercise = exercisePool[poolIndex % exercisePool.length];
    
    const adjustedDuration = Math.round(baseExercise.baseDuration * multiplier);
    const adjustedRest = Math.round(baseExercise.baseRest * multiplier);
    const adjustedReps = Math.round((baseExercise.reps || 10) * multiplier);
    const adjustedSets = baseExercise.sets || 3;
    
    const exercise: Exercise = {
      id: `ex_${Date.now()}_${poolIndex}`,
      name: baseExercise.name,
      description: baseExercise.description,
      muscleGroups: baseExercise.muscleGroups,
      difficulty,
      duration: adjustedDuration,
      restTime: adjustedRest,
      reps: adjustedReps,
      sets: adjustedSets,
    };
    
    const exerciseTotalTime = (adjustedDuration + adjustedRest) * adjustedSets;
    
    if (currentDuration + exerciseTotalTime <= targetSeconds + 60) { // +60s de margem
      exercises.push(exercise);
      currentDuration += exerciseTotalTime;
    }
    
    poolIndex++;
    
    // Evitar loop infinito
    if (poolIndex > exercisePool.length * 3) break;
  }
  
  return exercises;
};

const calculateTotalDuration = (exercises: Exercise[]): number => {
  return exercises.reduce((total, ex) => {
    return total + ((ex.duration + ex.restTime) * (ex.sets || 1));
  }, 0);
};

export const adjustWorkoutDifficulty = (
  workout: Workout,
  adjustment: 'easier' | 'harder'
): Workout => {
  const difficultyMap: Record<WorkoutDifficulty, WorkoutDifficulty> = {
    facil: adjustment === 'harder' ? 'medio' : 'facil',
    medio: adjustment === 'harder' ? 'dificil' : 'facil',
    dificil: adjustment === 'harder' ? 'dificil' : 'medio',
  };
  
  const newDifficulty = difficultyMap[workout.difficulty];
  const multiplier = adjustment === 'harder' ? 1.2 : 0.8;
  
  const adjustedExercises = workout.exercises.map(ex => ({
    ...ex,
    difficulty: newDifficulty,
    duration: Math.round(ex.duration * multiplier),
    reps: ex.reps ? Math.round(ex.reps * multiplier) : undefined,
  }));
  
  return {
    ...workout,
    difficulty: newDifficulty,
    exercises: adjustedExercises,
    totalDuration: calculateTotalDuration(adjustedExercises),
  };
};
