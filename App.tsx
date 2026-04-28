
import React, { useState, useEffect, useCallback } from 'react';
import { UserProgress, Book, Lesson } from './types';
import Header from './components/Header';
import BookSelector from './components/BookSelector';
import LessonView from './components/LessonView';
import LoadingSpinner from './components/LoadingSpinner';
import { generateLesson } from './services/geminiService';

const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
};


const App: React.FC = () => {
    const [progress, setProgress] = useState<UserProgress>({
        points: 0,
        streak: 0,
        lastCompletedDate: null,
        currentBook: null,
        currentChapter: 1,
    });
    const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const savedProgress = localStorage.getItem('readingoProgress');
            if (savedProgress) {
                setProgress(JSON.parse(savedProgress));
            }
        } catch (e) {
            console.error("Failed to load progress from localStorage", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('readingoProgress', JSON.stringify(progress));
        } catch (e) {
            console.error("Failed to save progress to localStorage", e);
        }
    }, [progress]);

    const startNewLesson = useCallback(async (book: Book, chapter: number) => {
        setIsLoading(true);
        setError(null);
        setCurrentLesson(null);

        const lesson = await generateLesson(book.title, chapter);
        if (lesson) {
            setCurrentLesson(lesson);
        } else {
            setError("We couldn't generate your next lesson. Please try again later.");
        }
        setIsLoading(false);
    }, []);

    const handleSelectBook = (book: Book) => {
        const newProgress: UserProgress = { ...progress, currentBook: book, currentChapter: 1 };
        setProgress(newProgress);
        startNewLesson(book, 1);
    };
    
    const handleLessonComplete = (score: number) => {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        let newStreak = progress.streak;

        if (progress.lastCompletedDate) {
            const lastDate = new Date(progress.lastCompletedDate);
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            
            if (isSameDay(lastDate, yesterday)) {
                newStreak += 1; // Continue streak
            } else if (!isSameDay(lastDate, today)) {
                newStreak = 1; // Reset streak if not yesterday or today
            }
        } else {
            newStreak = 1; // First lesson
        }

        setProgress(prev => ({
            ...prev,
            points: prev.points + score,
            streak: newStreak,
            lastCompletedDate: todayStr,
            currentChapter: prev.currentChapter + 1,
        }));
        setCurrentLesson(null);
    };
    
    const renderContent = () => {
        if (isLoading && !progress.currentBook) {
            return <div className="mt-20"><LoadingSpinner/></div>;
        }

        if (!progress.currentBook) {
            return <BookSelector onSelectBook={handleSelectBook} />;
        }

        if (isLoading) {
             return <div className="mt-20"><LoadingSpinner/></div>;
        }

        if (error) {
            return <div className="text-center p-8 text-red-500 bg-red-50 rounded-lg">{error}</div>;
        }

        if (currentLesson) {
            return <LessonView lesson={currentLesson} book={progress.currentBook} chapter={progress.currentChapter} onLessonComplete={handleLessonComplete} />;
        }
        
        return (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Ready for your next chapter?</h2>
                <p className="text-slate-600 mb-6">You're making great progress on "{progress.currentBook.title}"!</p>
                <button 
                    onClick={() => startNewLesson(progress.currentBook!, progress.currentChapter)}
                    className="py-3 px-8 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-600 transition-colors duration-300 shadow-lg"
                >
                    Start Chapter {progress.currentChapter}
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
            <Header streak={progress.streak} points={progress.points} />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
