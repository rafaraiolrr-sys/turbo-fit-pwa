'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft,
  Dumbbell, 
  Clock, 
  TrendingUp, 
  Calendar,
  Award,
  Target,
  Flame
} from 'lucide-react';
import { getUserProfile, getUserProgress, getWorkoutHistory } from '@/lib/storage';
import { UserProfile, UserProgress, WorkoutHistory } from '@/lib/types';

export default function ProgressPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [history, setHistory] = useState<WorkoutHistory[]>([]);

  useEffect(() => {
    const profile = getUserProfile();
    const progress = getUserProgress();
    const workoutHistory = getWorkoutHistory();

    setUserProfile(profile);
    setUserProgress(progress);
    setHistory(workoutHistory.slice(-10).reverse()); // Últimos 10 treinos
  }, []);

  if (!userProfile || !userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Dumbbell className="w-12 h-12 text-purple-600" />
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil':
        return 'bg-green-100 text-green-700';
      case 'medio':
        return 'bg-yellow-100 text-yellow-700';
      case 'dificil':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'facil':
        return 'Fácil';
      case 'medio':
        return 'Médio';
      case 'dificil':
        return 'Difícil';
      default:
        return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20 mb-4"
            onClick={() => router.push('/home')}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">Seu Progresso</h1>
          <p className="text-purple-100 mt-1">Acompanhe sua evolução</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <Dumbbell className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {userProgress.totalWorkouts}
              </p>
              <p className="text-sm text-gray-600">Treinos Completos</p>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="bg-pink-100 p-3 rounded-full mb-3">
                <Clock className="w-6 h-6 text-pink-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {Math.round(userProgress.totalMinutes / 60)}h
              </p>
              <p className="text-sm text-gray-600">Tempo Total</p>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-3 rounded-full mb-3">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {userProgress.currentStreak}
              </p>
              <p className="text-sm text-gray-600">Dias Seguidos</p>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">
                {userProgress.longestStreak}
              </p>
              <p className="text-sm text-gray-600">Melhor Sequência</p>
            </div>
          </Card>
        </div>

        {/* Weekly Consistency */}
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Consistência Semanal
                </h3>
                <p className="text-sm text-gray-600">
                  Meta: 4 treinos por semana
                </p>
              </div>
            </div>
            <span className="text-3xl font-bold text-purple-600">
              {Math.round(userProgress.weeklyConsistency)}%
            </span>
          </div>
          <Progress 
            value={userProgress.weeklyConsistency} 
            className="h-4"
          />
          <p className="text-sm text-gray-600 mt-3">
            {userProgress.weeklyConsistency >= 75
              ? '🔥 Excelente! Você está super consistente!'
              : userProgress.weeklyConsistency >= 50
              ? '💪 Bom trabalho! Continue assim!'
              : userProgress.weeklyConsistency >= 25
              ? '🎯 Você pode melhorar! Tente treinar mais vezes.'
              : '📈 Vamos começar! Estabeleça uma rotina.'}
          </p>
        </Card>

        {/* Current Level */}
        <Card className="p-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5" />
                <h3 className="text-lg font-bold">Nível Atual</h3>
              </div>
              <p className="text-3xl font-bold capitalize mb-1">
                {getDifficultyLabel(userProgress.difficultyLevel)}
              </p>
              <p className="text-sm text-purple-100">
                {userProfile.experienceLevel === 'iniciante' && 'Continue assim para evoluir!'}
                {userProfile.experienceLevel === 'intermediario' && 'Você está progredindo bem!'}
                {userProfile.experienceLevel === 'avancado' && 'Mantendo o alto nível!'}
              </p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <Award className="w-12 h-12" />
            </div>
          </div>
        </Card>

        {/* Workout History */}
        <Card className="p-6 bg-white shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Histórico de Treinos
            </h3>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Nenhum treino realizado ainda</p>
              <p className="text-sm mt-1">Comece seu primeiro treino agora!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((workout) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(workout.difficulty)}`}>
                        {getDifficultyLabel(workout.difficulty)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {workout.duration} min
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {formatDate(workout.completedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {workout.feedback.completed && (
                      <div className="text-green-600">
                        <Award className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex">
                      {[...Array(workout.feedback.userRating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">★</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Profile Info */}
        <Card className="p-6 bg-white shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Seu Perfil</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Nível</p>
              <p className="font-semibold text-gray-900 capitalize">
                {userProfile.experienceLevel}
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Biotipo</p>
              <p className="font-semibold text-gray-900 capitalize">
                {userProfile.biotipo}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 mb-2">Objetivos</p>
              <div className="flex flex-wrap gap-2">
                {userProfile.goals.map((goal) => (
                  <span
                    key={goal}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Action Button */}
        <Button
          onClick={() => router.push('/home')}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
        >
          <Dumbbell className="w-6 h-6 mr-2" />
          Iniciar Novo Treino
        </Button>
      </div>
    </div>
  );
}
