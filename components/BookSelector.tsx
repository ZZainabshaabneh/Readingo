
import React from 'react';
import { Book } from '../types';
import { BOOKS } from '../constants';

interface BookSelectorProps {
  onSelectBook: (book: Book) => void;
}

const BookSelector: React.FC<BookSelectorProps> = ({ onSelectBook }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Welcome to Readingo!</h2>
      <p className="text-lg text-center text-slate-600 mb-8">Choose a book to start your reading adventure.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {BOOKS.map((book) => (
          <div
            key={book.title}
            onClick={() => onSelectBook(book)}
            className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
          >
            <img src={book.coverImage} alt={`Cover of ${book.title}`} className="w-full h-48 sm:h-64 object-cover" />
            <div className="p-4">
              <h3 className="font-bold text-slate-800 group-hover:text-emerald-600 transition-colors duration-300 truncate">{book.title}</h3>
              <p className="text-sm text-slate-500">{book.author}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookSelector;
