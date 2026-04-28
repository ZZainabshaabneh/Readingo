
import React, { useState } from 'react';
import { QuizQuestion } from '../types';

interface QuizProps {
  questions: QuizQuestion[];
  onQuizComplete: (score: number) => void;
}

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

const Quiz: React.FC<QuizProps> = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (index: number) => {
    if (answerStatus !== 'unanswered') return;

    setSelectedAnswerIndex(index);
    if (index === currentQuestion.correctAnswerIndex) {
      setAnswerStatus('correct');
      setScore(s => s + 10); // Add 10 points for a correct answer
    } else {
      setAnswerStatus('incorrect');
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerIndex(null);
      setAnswerStatus('unanswered');
    } else {
      onQuizComplete(score);
    }
  };

  const getButtonClass = (index: number) => {
    if (answerStatus === 'unanswered') {
      return 'bg-white hover:bg-slate-100 border-slate-300';
    }
    if (index === currentQuestion.correctAnswerIndex) {
      return 'bg-emerald-100 border-emerald-400 text-emerald-800';
    }
    if (index === selectedAnswerIndex) {
      return 'bg-red-100 border-red-400 text-red-800';
    }
    return 'bg-slate-100 border-slate-300 text-slate-500';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <p className="text-sm font-semibold text-emerald-600 mb-1">Question {currentQuestionIndex + 1} of {questions.length}</p>
        <h3 className="text-xl font-semibold text-slate-800">{currentQuestion.question}</h3>
      </div>
      <div className="space-y-3">
        {currentQuestion.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleAnswerSelect(index)}
            disabled={answerStatus !== 'unanswered'}
            className={`w-full text-left p-4 rounded-lg border-2 font-medium transition-all duration-200 ${getButtonClass(index)}`}
          >
            {option}
          </button>
        ))}
      </div>
      {answerStatus !== 'unanswered' && (
        <div className="flex flex-col items-center">
            <div className={`w-full p-4 rounded-b-lg text-white font-bold ${answerStatus === 'correct' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                {answerStatus === 'correct' ? 'Correct!' : 'Incorrect.'}
            </div>
          <button
            onClick={handleNext}
            className="mt-6 w-full py-3 px-6 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors duration-300 shadow-lg"
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Lesson'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
