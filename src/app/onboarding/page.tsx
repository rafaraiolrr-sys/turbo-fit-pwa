'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { ArrowRight, Dumbbell } from 'lucide-react';
import { 
  EXPERIENCE_LEVELS, 
  BIOTIPOS, 
  GOALS, 
  DURATIONS 
} from '@/lib/constants';
import { 
  OnboardingData, 
  ExperienceLevel, 
  Biotipo, 
  WorkoutDuration 
} from '@/lib/types';
import { createUserProfile } from '@/lib/storage';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    goals: [],
  });

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Finalizar onboarding
      if (isFormComplete()) {
        createUserProfile(formData as OnboardingData);
        router.push('/home');
      }
    }
  };

  const isFormComplete = (): boolean => {
    return !!(
      formData.name &&
      formData.experienceLevel &&
      formData.biotipo &&
      formData.goals &&
      formData.goals.length > 0 &&
      formData.averageTimeAvailable
    );
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!formData.name && formData.name.length > 0;
      case 2:
        return !!formData.experienceLevel;
      case 3:
        return !!formData.biotipo;
      case 4:
        return !!formData.goals && formData.goals.length > 0;
      case 5:
        return !!formData.averageTimeAvailable;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-4 rounded-2xl">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TurboFit</h1>
          <p className="text-gray-600">Configure seu perfil em {5 - step + 1} passos</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all ${
                  s <= step
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Nome */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Qual é o seu nome?
              </h2>
              <p className="text-gray-600 mb-6">
                Vamos personalizar sua experiência
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="text-lg"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Step 2: Nível de Experiência */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Qual seu nível de experiência?
              </h2>
              <p className="text-gray-600 mb-6">
                Isso nos ajuda a criar treinos adequados para você
              </p>
            </div>
            <RadioGroup
              value={formData.experienceLevel}
              onValueChange={(value) =>
                setFormData({ ...formData, experienceLevel: value as ExperienceLevel })
              }
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <div
                  key={level.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() =>
                    setFormData({ ...formData, experienceLevel: level.value })
                  }
                >
                  <RadioGroupItem value={level.value} id={level.value} />
                  <div className="flex-1">
                    <Label
                      htmlFor={level.value}
                      className="text-base font-semibold cursor-pointer"
                    >
                      {level.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 3: Biotipo */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Qual é o seu biotipo?
              </h2>
              <p className="text-gray-600 mb-6">
                Seu tipo corporal influencia o treino ideal
              </p>
            </div>
            <RadioGroup
              value={formData.biotipo}
              onValueChange={(value) =>
                setFormData({ ...formData, biotipo: value as Biotipo })
              }
            >
              {BIOTIPOS.map((biotipo) => (
                <div
                  key={biotipo.value}
                  className="flex items-start space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => setFormData({ ...formData, biotipo: biotipo.value })}
                >
                  <RadioGroupItem value={biotipo.value} id={biotipo.value} />
                  <div className="flex-1">
                    <Label
                      htmlFor={biotipo.value}
                      className="text-base font-semibold cursor-pointer"
                    >
                      {biotipo.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">{biotipo.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Step 4: Objetivos */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quais são seus objetivos?
              </h2>
              <p className="text-gray-600 mb-6">
                Selecione um ou mais objetivos
              </p>
            </div>
            <div className="space-y-3">
              {GOALS.map((goal) => (
                <div
                  key={goal.value}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => {
                    const currentGoals = formData.goals || [];
                    const newGoals = currentGoals.includes(goal.value)
                      ? currentGoals.filter((g) => g !== goal.value)
                      : [...currentGoals, goal.value];
                    setFormData({ ...formData, goals: newGoals });
                  }}
                >
                  <Checkbox
                    id={goal.value}
                    checked={formData.goals?.includes(goal.value)}
                  />
                  <Label
                    htmlFor={goal.value}
                    className="text-base font-medium cursor-pointer flex-1"
                  >
                    {goal.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Tempo Disponível */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Quanto tempo você tem normalmente?
              </h2>
              <p className="text-gray-600 mb-6">
                Isso define a duração padrão dos seus treinos
              </p>
            </div>
            <RadioGroup
              value={formData.averageTimeAvailable?.toString()}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  averageTimeAvailable: parseInt(value) as WorkoutDuration,
                })
              }
            >
              {DURATIONS.map((duration) => (
                <div
                  key={duration.value}
                  className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() =>
                    setFormData({ ...formData, averageTimeAvailable: duration.value })
                  }
                >
                  <RadioGroupItem
                    value={duration.value.toString()}
                    id={duration.value.toString()}
                  />
                  <Label
                    htmlFor={duration.value.toString()}
                    className="text-lg font-semibold cursor-pointer flex-1"
                  >
                    {duration.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex gap-4">
          {step > 1 && (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Voltar
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {step === 5 ? 'Começar' : 'Próximo'}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
