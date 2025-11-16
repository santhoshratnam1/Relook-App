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
          {quote.source && `, ${quote.source}`}
        </cite>
      )}
      {quote.context && <p className="text-sm text-gray-500 mt-4 italic">Context: {quote.context}</p>}
      <div className="mt-6 flex justify-center gap-2 flex-wrap">
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
        {quote.relatedTopics?.map((topic, i) => (
             <span key={i} className="text-xs px-2 py-1 rounded-full bg-slate-600/70 text-slate-300">
                {topic}
            </span>
        ))}
      </div>
    </div>
  );
};

export default QuoteView;