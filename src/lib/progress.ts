
'use client';

// This file requires 'use client' because it interacts with localStorage.

type ChapterProgress = {
  quizScore?: number; // Score from 0 to 100
  theoryExamScore?: number; // Score from 0 to 100
};

type SubjectProgress = {
  [subject: string]: {
    chapters: {
      [chapter: string]: ChapterProgress;
    };
  };
};

type ProgressHistoryItem = {
    date: string;
    subject: string;
    chapter: string;
    score: number;
    type: 'quiz' | 'theory';
}

const PROGRESS_KEY = 'aicademy_progress';
const HISTORY_KEY = 'aicademy_progress_history';


/**
 * Retrieves all progress data from localStorage.
 */
export function getProgress(): SubjectProgress {
  if (typeof window === 'undefined') return {};
  try {
    const savedProgress = window.localStorage.getItem(PROGRESS_KEY);
    return savedProgress ? JSON.parse(savedProgress) : {};
  } catch (error) {
    console.error("Failed to get progress from localStorage", error);
    return {};
  }
}

/**
 * Retrieves the historical log of all quizzes and exams taken.
 */
export function getProgressHistory(): ProgressHistoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
        const savedHistory = window.localStorage.getItem(HISTORY_KEY);
        return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
        console.error("Failed to get progress history from localStorage", error);
        return [];
    }
}


/**
 * Saves the score for a quiz, updating both the overall progress and the history.
 */
export function saveQuizProgress(subject: string, chapter: string, score: number) {
  if (typeof window === 'undefined') return;
  const progress = getProgress();

  if (!progress[subject]) {
    progress[subject] = { chapters: {} };
  }
  if (!progress[subject].chapters[chapter]) {
    progress[subject].chapters[chapter] = {};
  }
  progress[subject].chapters[chapter].quizScore = score;
  
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    addToHistory(subject, chapter, score, 'quiz');
  } catch (error) {
    console.error("Failed to save quiz progress to localStorage", error);
  }
}

/**
 * Saves the score for a theory exam, updating both the overall progress and the history.
 */
export function saveTheoryExamProgress(subject: string, chapter: string, score: number) {
  if (typeof window === 'undefined') return;
  const progress = getProgress();

  if (!progress[subject]) {
    progress[subject] = { chapters: {} };
  }
  if (!progress[subject].chapters[chapter]) {
    progress[subject].chapters[chapter] = {};
  }
  progress[subject].chapters[chapter].theoryExamScore = score;

  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    addToHistory(subject, chapter, score, 'theory');
  } catch (error) {
    console.error("Failed to save theory exam progress to localStorage", error);
  }
}

/**
 * Adds a new entry to the progress history log.
 */
function addToHistory(subject: string, chapter: string, score: number, type: 'quiz' | 'theory') {
    if (typeof window === 'undefined') return;
    const history = getProgressHistory();
    const newHistoryItem: ProgressHistoryItem = {
        date: new Date().toISOString(),
        subject,
        chapter,
        score,
        type,
    };
    const updatedHistory = [newHistoryItem, ...history].slice(0, 100); // Keep last 100 entries
    try {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    } catch (error) {
        console.error("Failed to add to progress history in localStorage", error);
    }
}
