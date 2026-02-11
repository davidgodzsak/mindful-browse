import {
  BookOpen,
  Droplets,
  TreePine,
  Phone,
  Brain,
  Coffee,
} from 'lucide-react';

export interface Suggestion {
  icon: typeof BookOpen;
  title: string;
  description: string;
  color: string;
}

export const ACTIVITY_SUGGESTIONS: Suggestion[] = [
  {
    icon: BookOpen,
    title: 'Read a book',
    description: 'Dive into that novel you\'ve been meaning to start',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Droplets,
    title: 'Drink water',
    description: 'Stay hydrated! Your body will thank you',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: TreePine,
    title: 'Take a walk',
    description: 'Get some fresh air and clear your mind',
    color: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: Phone,
    title: 'Call someone',
    description: 'Connect with a friend or family member',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: Brain,
    title: 'Meditate',
    description: '5 minutes of mindfulness can reset your focus',
    color: 'bg-pink-100 text-pink-600',
  },
  {
    icon: Coffee,
    title: 'Take a break',
    description: 'Stretch, make tea, and rest your eyes',
    color: 'bg-orange-100 text-orange-600',
  },
];

export const DEFAULT_QUOTES = [
  'Take a deep breath and go for a short walk 🚶',
  'How about reading that book you\'ve been meaning to start? 📚',
  'Drink some water and stretch your body 💧',
  'Call a friend or family member you haven\'t talked to in a while 📱',
  'Try 5 minutes of meditation to clear your mind 🧘',
];
