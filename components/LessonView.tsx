
import React, { useState } from 'react';
import { Lesson, Book } from '../types';
import Quiz from './Quiz';

interface LessonViewProps {
  lesson: Lesson;
  book: Book;
  chapter: number;
  onLessonComplete: (score: number) => void;
}

const ReadingPane: React.FC<{ snippet: string; onContinue: () => void }> = ({ snippet, onContinue }) => (
  <div className="p-4 sm:p-6 lg:p-8 space-y-6">
    <div className="prose lg:prose-lg max-w-none text-slate-700">
      <p>{snippet.split('\n').map((paragraph, i) => <span key={i}>{paragraph}<br/><br/></span>)}</p>
    </div>
    <div className="flex justify-center">
      <button
        onClick={onContinue}
        className="w-full sm:w-auto py-3 px-8 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors duration-300 shadow-lg"
      >
        I'm ready for the quiz!
      </button>
    </div>
  </div>
);

const LessonView: React.FC<LessonViewProps> = ({ lesson, book, chapter, onLessonComplete }) => {
  const [view, setView] = useState<'reading' | 'quizzing'>('reading');

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">{book.title}</h2>
        <p className="text-md text-slate-600">Chapter {chapter}</p>
      </div>

      {view === 'reading' ? (
        <ReadingPane snippet={lesson.snippet} onContinue={() => setView('quizzing')} />
      ) : (
        <Quiz questions={lesson.quiz} onQuizComplete={onLessonComplete} />
      )}
    </div>
  );
};

export default LessonView;
