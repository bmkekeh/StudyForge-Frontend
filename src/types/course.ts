export type Course = {
  id: number;
  name: string;
  description: string;
};

export type StudyMaterial = {
  id: number;
  fileName: string;
  filePath?: string;
};

export type KeyConcept = {
  concept: string;
  explanation: string;
};

export type StudySummary = {
  title: string;
  overview: string;
  keyConcepts: KeyConcept[];
  importantPoints: string[];
  reviewTopics: string[];
};

export type SavedSummary = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

export type Quiz = {
  questions: QuizQuestion[];
};

export type SavedQuiz = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export type Flashcard = {
  front: string;
  back: string;
};

export type FlashcardSet = {
  flashcards: Flashcard[];
};

export type SavedFlashcardSet = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export type QuizAttempt = {
  id: number;
  score: number;
  totalQuestions: number;
  completedAt: string;
};

export type Tab =
  | "overview"
  | "materials"
  | "summary"
  | "quizzes"
  | "flashcards";