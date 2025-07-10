import { BarChart, Book, FlaskConical, PenSquare, Atom, Dna, Globe, Landmark, Languages } from 'lucide-react';

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
    name: 'Physics',
    icon: Atom,
    chapters: [
        { name: 'Kinematics' },
        { name: "Newton's Laws of Motion" },
        { name: 'Work, Energy, and Power' },
        { name: 'Thermodynamics' },
    ]
  },
  {
    name: 'Biology',
    icon: Dna,
    chapters: [
        { name: 'Cell Structure and Function' },
        { name: 'Genetics and Heredity' },
        { name: 'Human Anatomy' },
        { name: 'Photosynthesis' },
    ]
  },
  {
    name: 'Chemistry',
    icon: FlaskConical,
    chapters: [
      { name: 'Atomic Structure' },
      { name: 'Chemical Bonding' },
      { name: 'The Periodic Table' },
      { name: 'Chemical Reactions' },
    ],
  },
  {
    name: 'History',
    icon: Book,
    chapters: [
      { name: 'Ancient Civilizations' },
      { name: 'The Roman Empire' },
      { name: 'The World Wars' },
      { name: 'The Cold War' },
    ],
  },
    {
    name: 'Geography',
    icon: Globe,
    chapters: [
        { name: 'The Solar System' },
        { name: 'World Climates' },
        { name: 'Plate Tectonics' },
        { name: 'Human-Environment Interaction' },
    ],
  },
  {
    name: 'Civics',
    icon: Landmark,
    chapters: [
        { name: 'The Constitution' },
        { name: 'Branches of Government' },
        { name: 'Citizen Rights and Responsibilities' },
        { name: 'The Electoral Process' },
    ],
  },
  {
    name: 'English',
    icon: PenSquare,
    chapters: [
      { name: 'Shakespearean Tragedies' },
      { name: 'Modernist Poetry' },
      { name: 'Victorian Novels' },
      { name: 'Post-colonial Literature' },
    ],
  },
  {
    name: 'English Grammar',
    icon: Languages,
    chapters: [
        { name: 'Parts of Speech' },
        { name: 'Sentence Structure' },
        { name: 'Punctuation Rules' },
        { name: 'Tenses and Verb Forms' },
    ]
  }
];
