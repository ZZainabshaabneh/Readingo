
import React from 'react';
import { FireIcon, StarIcon, BookOpenIcon } from './icons';

interface HeaderProps {
  streak: number;
  points: number;
}

const Header: React.FC<HeaderProps> = ({ streak, points }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 w-full border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="w-8 h-8 text-emerald-500" />
            <h1 className="text-2xl font-bold text-slate-800">Readingo</h1>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-1.5">
              <FireIcon className="w-6 h-6 text-orange-500" />
              <span className="text-lg font-bold text-slate-700">{streak}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <StarIcon className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-bold text-slate-700">{points}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
