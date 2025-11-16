import React from 'react';
import { QuoteData } from '../types';

interface QuoteViewProps {
  quote: QuoteData;
}

const QuoteView: React.FC<QuoteViewProps> = ({ quote }) => {
  return (
    <div className="text-center p-4">
      <blockquote className="text-2xl font-semibold italic text-white">
        "{quote.text}"
      </blockquote>
      {quote.author && (
        <cite className="block text-right mt-4 not-italic text-gray-400">
          — {quote.author}
        </cite>
      )}
      <div className="mt-6 flex justify-center gap-2">
        {quote.category && (
            <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300">
                {quote.category}
            </span>
        )}
        {quote.theme && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                {quote.theme}
            </span>
        )}
      </div>
    </div>
  );
};

export default QuoteView;
