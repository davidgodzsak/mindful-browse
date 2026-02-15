import {
  BookOpen,
  Droplets,
  TreePine,
  Phone,
  Brain,
  Coffee,
} from 'lucide-react';
import { t } from '@/lib/utils/i18n';

export interface Suggestion {
  icon: typeof BookOpen;
  title: string;
  description: string;
  color: string;
}

export function getActivitySuggestions(): Suggestion[] {
  return [
    {
      icon: BookOpen,
      title: t('suggestion_readBook_title'),
      description: t('suggestion_readBook_description'),
      color: 'bg-amber-100 text-amber-600',
    },
    {
      icon: Droplets,
      title: t('suggestion_drinkWater_title'),
      description: t('suggestion_drinkWater_description'),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: TreePine,
      title: t('suggestion_takeWalk_title'),
      description: t('suggestion_takeWalk_description'),
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: Phone,
      title: t('suggestion_callSomeone_title'),
      description: t('suggestion_callSomeone_description'),
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Brain,
      title: t('suggestion_meditate_title'),
      description: t('suggestion_meditate_description'),
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Coffee,
      title: t('suggestion_takeBreak_title'),
      description: t('suggestion_takeBreak_description'),
      color: 'bg-orange-100 text-orange-600',
    },
  ];
}

// Keep ACTIVITY_SUGGESTIONS for backward compatibility
export const ACTIVITY_SUGGESTIONS: Suggestion[] = getActivitySuggestions();
