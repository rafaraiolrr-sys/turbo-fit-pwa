// TurboFit - Constantes do Sistema

import { Emotion, ExperienceLevel, Biotipo, WorkoutDuration } from './types';

export const EMOTIONS: { value: Emotion; label: string; icon: string; color: string }[] = [
  { value: 'raiva', label: 'Raiva', icon: '😤', color: 'from-red-500 to-orange-600' },
  { value: 'ansiedade', label: 'Ansiedade', icon: '😰', color: 'from-yellow-500 to-amber-600' },
  { value: 'preguica', label: 'Preguiça', icon: '😴', color: 'from-blue-400 to-cyan-500' },
  { value: 'motivado', label: 'Motivado', icon: '🔥', color: 'from-green-500 to-emerald-600' },
];

export const DURATIONS: { value: WorkoutDuration; label: string }[] = [
  { value: 10, label: '10 min' },
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 60, label: '60 min' },
  { value: 120, label: '2 horas' },
];

export const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; description: string }[] = [
  { 
    value: 'iniciante', 
    label: 'Iniciante', 
    description: 'Pouca ou nenhuma experiência com exercícios' 
  },
  { 
    value: 'intermediario', 
    label: 'Intermediário', 
    description: 'Treina regularmente há alguns meses' 
  },
  { 
    value: 'avancado', 
    label: 'Avançado', 
    description: 'Treina consistentemente há mais de 1 ano' 
  },
];

export const BIOTIPOS: { value: Biotipo; label: string; description: string }[] = [
  { 
    value: 'ectomorfo', 
    label: 'Ectomorfo', 
    description: 'Corpo naturalmente magro, dificuldade para ganhar peso' 
  },
  { 
    value: 'mesomorfo', 
    label: 'Mesomorfo', 
    description: 'Corpo atlético, facilidade para ganhar músculos' 
  },
  { 
    value: 'endomorfo', 
    label: 'Endomorfo', 
    description: 'Corpo com tendência a acumular gordura' 
  },
];

export const GOALS = [
  { value: 'perder-peso', label: 'Perder Peso' },
  { value: 'ganhar-massa', label: 'Ganhar Massa Muscular' },
  { value: 'definir', label: 'Definir o Corpo' },
  { value: 'saude', label: 'Melhorar Saúde Geral' },
  { value: 'resistencia', label: 'Aumentar Resistência' },
  { value: 'flexibilidade', label: 'Melhorar Flexibilidade' },
];

// Base de exercícios adaptativa
export const EXERCISE_DATABASE = {
  raiva: [
    {
      name: 'Burpees Explosivos',
      description: 'Movimento completo de alta intensidade',
      muscleGroups: ['corpo-todo'],
      difficulty: 'medio' as const,
      baseDuration: 30,
      baseRest: 15,
      reps: 10,
      sets: 3,
    },
    {
      name: 'Mountain Climbers',
      description: 'Escalada rápida no solo',
      muscleGroups: ['core', 'cardio'],
      difficulty: 'medio' as const,
      baseDuration: 40,
      baseRest: 20,
      reps: 20,
      sets: 3,
    },
    {
      name: 'Jumping Jacks',
      description: 'Polichinelos de alta intensidade',
      muscleGroups: ['cardio', 'pernas'],
      difficulty: 'facil' as const,
      baseDuration: 45,
      baseRest: 15,
      reps: 30,
      sets: 3,
    },
  ],
  ansiedade: [
    {
      name: 'Prancha Isométrica',
      description: 'Posição de prancha com foco na respiração',
      muscleGroups: ['core'],
      difficulty: 'medio' as const,
      baseDuration: 45,
      baseRest: 30,
      reps: 1,
      sets: 3,
    },
    {
      name: 'Agachamento Controlado',
      description: 'Agachamento lento e controlado',
      muscleGroups: ['pernas', 'gluteos'],
      difficulty: 'facil' as const,
      baseDuration: 60,
      baseRest: 30,
      reps: 15,
      sets: 3,
    },
    {
      name: 'Flexão de Braço',
      description: 'Flexão tradicional com ritmo controlado',
      muscleGroups: ['peito', 'triceps'],
      difficulty: 'medio' as const,
      baseDuration: 40,
      baseRest: 30,
      reps: 10,
      sets: 3,
    },
  ],
  preguica: [
    {
      name: 'Caminhada Estacionária',
      description: 'Caminhar no lugar em ritmo leve',
      muscleGroups: ['cardio'],
      difficulty: 'facil' as const,
      baseDuration: 60,
      baseRest: 20,
      reps: 1,
      sets: 2,
    },
    {
      name: 'Alongamento Dinâmico',
      description: 'Movimentos suaves de alongamento',
      muscleGroups: ['corpo-todo'],
      difficulty: 'facil' as const,
      baseDuration: 45,
      baseRest: 15,
      reps: 10,
      sets: 2,
    },
    {
      name: 'Elevação de Joelhos',
      description: 'Elevar joelhos alternadamente',
      muscleGroups: ['core', 'pernas'],
      difficulty: 'facil' as const,
      baseDuration: 40,
      baseRest: 20,
      reps: 20,
      sets: 2,
    },
  ],
  motivado: [
    {
      name: 'Burpees com Salto',
      description: 'Burpee completo com salto vertical',
      muscleGroups: ['corpo-todo'],
      difficulty: 'dificil' as const,
      baseDuration: 45,
      baseRest: 20,
      reps: 12,
      sets: 4,
    },
    {
      name: 'Agachamento com Salto',
      description: 'Agachamento explosivo com salto',
      muscleGroups: ['pernas', 'gluteos'],
      difficulty: 'dificil' as const,
      baseDuration: 40,
      baseRest: 25,
      reps: 15,
      sets: 4,
    },
    {
      name: 'Flexão Diamante',
      description: 'Flexão com mãos juntas',
      muscleGroups: ['peito', 'triceps'],
      difficulty: 'dificil' as const,
      baseDuration: 35,
      baseRest: 25,
      reps: 12,
      sets: 3,
    },
  ],
};
