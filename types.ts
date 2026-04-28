
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface Lesson {
  snippet: string;
  quiz: QuizQuestion[];
}

export interface Book {
  title: string;
  author: string;
  coverImage: string;
}

export interface UserProgress {
  points: number;
  streak: number;
  lastCompletedDate: string | null;
  currentBook: Book | null;
  currentChapter: number;
}
