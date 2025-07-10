import { BarChart, Book, FlaskConical, PenSquare } from 'lucide-react';

export const subjects = [
  {
    name: 'Mathematics',
    icon: BarChart,
    chapters: [
      { name: 'Algebra Basics' },
      { name: 'Geometry Fundamentals' },
      { name: 'Introduction to Calculus' },
      { name: 'Statistics and Probability' },
    ],
  },
  {
    name: 'History',
    icon: Book,
    chapters: [
      { name: 'Ancient Civilizations' },
      { name: 'The Roman Empire' },
      { name: 'The Middle Ages' },
      { name: 'The Renaissance' },
    ],
  },
  {
    name: 'Science',
    icon: FlaskConical,
    chapters: [
      { name: 'Photosynthesis' },
      { name: 'The Solar System' },
      { name: 'Chemical Reactions' },
      { name: 'Newton\'s Laws of Motion' },
    ],
  },
  {
    name: 'Literature',
    icon: PenSquare,
    chapters: [
      { name: 'Shakespearean Tragedies' },
      { name: 'Modernist Poetry' },
      { name: 'The Lost Generation' },
      { name: 'Post-colonial Literature' },
    ],
  },
];
