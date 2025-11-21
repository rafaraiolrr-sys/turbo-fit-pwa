'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dumbbell, Clock, TrendingUp, Calendar, Award } from 'lucide-react';
import { EMOTIONS, DURATIONS } from '@/lib/constants';
import { Emotion, WorkoutDuration, UserProfile, UserProgress } from '@/lib/types';
import { getUserProfile, getUserProgress, hasCompletedOnboarding } from '@/lib/storage';
import { generateWorkout } from '@/lib/workout-engine';
import { setCurrentWorkout } from '@/lib/storage';

export default function HomePage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<WorkoutDuration | null>(null);

  useEffect(() => {
    // Verificar se completou onboarding
    if (!hasCompletedOnboarding()) {
      router.push('/onboarding');
      return;
    }

    const profile = getUserProfile();
    const progress = getUserProgress();
    
    setUserProfile(profile);
    setUserProgress(progress);
    
    // Definir duração padrão baseada no perfil
    if (profile) {
      setSelectedDuration(profile.averageTimeAvailable);
    }
  }, [router]);

  const handleStartWorkout = () => {
    if (!selectedEmotion || !selectedDuration || !userProfile) return;

    // Gerar treino
    const workout = generateWorkout({
      emotion: selectedEmotion,
      duration: selectedDuration,
      userProfile,
      userProgress,
    });

    // Salvar treino atual
    setCurrentWorkout(workout);

    // Navegar para execução
    router.push('/workout');
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Dumbbell className="w-12 h-12 text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Olá, {userProfile.name}! 👋</h1>
              <p className="text-purple-100 mt-1">Pronto para treinar hoje?</p>
            </div>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => router.push('/progress')}
            >
              <TrendingUp className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Stats Cards */}
        {userProgress && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Card className="p-4 bg-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Dumbbell className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {userProgress.totalWorkouts}
                  </p>
                  <p className="text-xs text-gray-600">Treinos</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-pink-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(userProgress.totalMinutes / 60)}h
                  </p>
                  <p className="text-xs text-gray-600">Total</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {userProgress.currentStreak}
                  </p>
                  <p className="text-xs text-gray-600">Sequência</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(userProgress.weeklyConsistency)}%
                  </p>
                  <p className="text-xs text-gray-600">Semana</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Emotion Selector */}
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Como você está se sentindo?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.value}
                onClick={() => setSelectedEmotion(emotion.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedEmotion === emotion.value
                    ? `border-transparent bg-gradient-to-br ${emotion.color} text-white shadow-lg scale-105`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-4xl mb-2">{emotion.icon}</div>
                <p
                  className={`text-sm font-semibold ${
                    selectedEmotion === emotion.value ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {emotion.label}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Duration Selector */}
        <Card className="p-6 bg-white shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Quanto tempo você tem?
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {DURATIONS.map((duration) => (
              <button
                key={duration.value}
                onClick={() => setSelectedDuration(duration.value)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedDuration === duration.value
                    ? 'border-transparent bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <Clock
                  className={`w-6 h-6 mx-auto mb-2 ${
                    selectedDuration === duration.value ? 'text-white' : 'text-gray-600'
                  }`}
                />
                <p
                  className={`text-sm font-semibold ${
                    selectedDuration === duration.value ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {duration.label}
                </p>
              </button>
            ))}
          </div>
        </Card>

        {/* Start Button */}
        <Button
          onClick={handleStartWorkout}
          disabled={!selectedEmotion || !selectedDuration}
          className="w-full h-16 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Dumbbell className="w-6 h-6 mr-2" />
          Gerar Treino Personalizado
        </Button>

        {/* Quick Stats */}
        {userProgress && userProgress.weeklyConsistency > 0 && (
          <Card className="p-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">Consistência Semanal</h3>
              <span className="text-2xl font-bold">
                {Math.round(userProgress.weeklyConsistency)}%
              </span>
            </div>
            <Progress
              value={userProgress.weeklyConsistency}
              className="h-3 bg-white/30"
            />
            <p className="text-sm text-purple-100 mt-3">
              {userProgress.weeklyConsistency >= 75
                ? '🔥 Você está arrasando! Continue assim!'
                : userProgress.weeklyConsistency >= 50
                ? '💪 Bom trabalho! Mantenha o ritmo!'
                : '🎯 Vamos treinar mais esta semana?'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
