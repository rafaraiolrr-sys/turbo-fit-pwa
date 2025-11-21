'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle2, 
  X,
  ThumbsUp,
  ThumbsDown,
  Star
} from 'lucide-react';
import { Workout, Exercise, WorkoutHistory } from '@/lib/types';
import { 
  getCurrentWorkout, 
  setCurrentWorkout,
  saveWorkoutHistory,
  updateUserProgress,
  getUserProfile
} from '@/lib/storage';

export default function WorkoutPage() {
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [workoutStartTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentWorkout = getCurrentWorkout();
    if (!currentWorkout) {
      router.push('/home');
      return;
    }
    setWorkout(currentWorkout);
    setTimeRemaining(currentWorkout.exercises[0].duration);
  }, [router]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);

  const handleTimerComplete = () => {
    if (!workout) return;

    const currentExercise = workout.exercises[currentExerciseIndex];

    if (isResting) {
      // Descanso terminou, próximo set ou exercício
      if (currentSet < currentExercise.sets) {
        setCurrentSet(currentSet + 1);
        setIsResting(false);
        setTimeRemaining(currentExercise.duration);
      } else {
        handleNextExercise();
      }
    } else {
      // Exercício terminou, iniciar descanso
      if (currentSet < currentExercise.sets) {
        setIsResting(true);
        setTimeRemaining(currentExercise.restTime);
      } else {
        handleNextExercise();
      }
    }
  };

  const handleNextExercise = () => {
    if (!workout) return;

    if (currentExerciseIndex < workout.exercises.length - 1) {
      const nextIndex = currentExerciseIndex + 1;
      setCurrentExerciseIndex(nextIndex);
      setCurrentSet(1);
      setIsResting(false);
      setTimeRemaining(workout.exercises[nextIndex].duration);
      setIsPlaying(false);
    } else {
      // Treino completo
      setShowFeedback(true);
      setIsPlaying(false);
    }
  };

  const handleSkip = () => {
    handleNextExercise();
  };

  const handleFinishWorkout = (wasEasy: boolean) => {
    if (!workout) return;

    const userProfile = getUserProfile();
    if (!userProfile) return;

    const workoutDuration = Math.round((Date.now() - workoutStartTime) / 1000 / 60);

    const history: WorkoutHistory = {
      id: `history_${Date.now()}`,
      userId: userProfile.id,
      workoutId: workout.id,
      completedAt: new Date().toISOString(),
      duration: workoutDuration,
      difficulty: workout.difficulty,
      feedback: {
        wasEasy,
        completed: true,
        userRating: rating,
      },
    };

    saveWorkoutHistory(history);
    updateUserProgress(history);
    setCurrentWorkout(null);

    router.push('/progress');
  };

  const handleQuit = () => {
    if (confirm('Tem certeza que deseja sair? Seu progresso não será salvo.')) {
      setCurrentWorkout(null);
      router.push('/home');
    }
  };

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-purple-600">Carregando...</div>
      </div>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const overallProgress = ((currentExerciseIndex + (currentSet / currentExercise.sets)) / totalExercises) * 100;

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white p-8 text-center">
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Treino Concluído! 🎉
            </h2>
            <p className="text-gray-600">
              Parabéns por completar seu treino!
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Como foi o treino?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => handleFinishWorkout(false)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <ThumbsUp className="w-5 h-5 mr-2" />
                Foi Desafiador
              </Button>
              <Button
                onClick={() => handleFinishWorkout(true)}
                variant="outline"
                className="w-full"
              >
                <ThumbsDown className="w-5 h-5 mr-2" />
                Foi Fácil Demais
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="text-white">
            <p className="text-sm opacity-90">Exercício {currentExerciseIndex + 1} de {totalExercises}</p>
            <p className="text-xs opacity-75">Série {currentSet} de {currentExercise.sets}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleQuit}
            className="text-white hover:bg-white/20"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-2">
        <Progress value={overallProgress} className="h-2 bg-white/30" />
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 mt-8">
        {/* Timer Card */}
        <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-2xl text-center">
          <div className="mb-6">
            <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
              isResting 
                ? 'bg-blue-100 text-blue-700'
                : 'bg-green-100 text-green-700'
            }`}>
              {isResting ? '⏸️ Descanso' : '💪 Exercício'}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {currentExercise.name}
            </h2>
            <p className="text-gray-600 mb-4">{currentExercise.description}</p>
            
            {!isResting && (
              <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                <span>{currentExercise.reps} repetições</span>
                <span>•</span>
                <span>{currentExercise.sets} séries</span>
              </div>
            )}
          </div>

          {/* Timer Display */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-gray-900 mb-2">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-sm text-gray-600">
              {isResting ? 'Tempo de descanso' : 'Tempo de execução'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-32"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Iniciar
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleSkip}
              className="w-32"
            >
              <SkipForward className="w-5 h-5 mr-2" />
              Pular
            </Button>
          </div>
        </Card>

        {/* Exercise Info */}
        <Card className="p-6 bg-white/90 backdrop-blur-sm">
          <h3 className="font-semibold text-gray-900 mb-3">Grupos Musculares</h3>
          <div className="flex flex-wrap gap-2">
            {currentExercise.muscleGroups.map((group) => (
              <span
                key={group}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {group}
              </span>
            ))}
          </div>
        </Card>

        {/* Next Exercise Preview */}
        {currentExerciseIndex < totalExercises - 1 && (
          <Card className="p-4 bg-white/80 backdrop-blur-sm">
            <p className="text-sm text-gray-600 mb-2">Próximo exercício:</p>
            <p className="font-semibold text-gray-900">
              {workout.exercises[currentExerciseIndex + 1].name}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
