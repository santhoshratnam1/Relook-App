import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { classifyContent } from '../services/geminiService';
import { ContentType, SourceType, ExtractedEvent } from '../types';
import { SparklesIcon, BellIcon } from './IconComponents';

interface ClassifierProps {
    onItemAdded: (data: { title: string; body: string; content_type: ContentType; source_type: SourceType, extractedEvent: ExtractedEvent | null }) => void;
}

type ResultState = {
    classification: { category: ContentType; title: string; summary: string };
    extractedEvent: ExtractedEvent | null;
} | null;

const Classifier: React.FC<ClassifierProps> = ({ onItemAdded }) => {
    const [text, setText] = useState('Apple Vision Pro is a mixed reality headset developed by Apple Inc. It was announced on June 5, 2023, at Apple\'s Worldwide Developers Conference, and pre-orders began on January 19, 2024.');
    const [result, setResult] = useState<ResultState>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClassify = async () => {
        if (!text.trim()) {
            setError('Please enter some text to classify.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const classificationResult = await classifyContent(text);
            setResult(classificationResult);
        } catch (err) {
            setError('Failed to classify content. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setText('');
        setResult(null);
        setError(null);
        setIsLoading(false);
    }

    const handleSave = () => {
        if (!result) return;
        onItemAdded({
            title: result.classification.title,
            body: text, // Save the original text as the body
            content_type: result.classification.category,
            source_type: SourceType.Manual,
            extractedEvent: result.extractedEvent
        });
        resetState();
    }

    return (
        <div className="px-6 my-4">
             <DashboardCard>
                <div className="space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste text from a screenshot or note..."
                        className="w-full h-24 p-2 bg-[#0C0D0F] border border-white/10 rounded-xl resize-none focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition"
                        disabled={!!result}
                    />
                    {!result && (
                        <button
                            onClick={handleClassify}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             {isLoading ? 'Analyzing...' : <> <SparklesIcon className="w-5 h-5"/> <span>Classify Text</span> </>}
                        </button>
                    )}
                    
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    
                    {result && (
                         <div className="animate-fade-in">
                            <div className="bg-[#0C0D0F] p-3 rounded-lg border border-white/10">
                                <p className="font-bold text-white">{result.classification.title}</p>
                                <p className="text-sm text-gray-300 mt-1">{result.classification.summary}</p>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                                        {result.classification.category}
                                    </span>
                                    {result.extractedEvent && (
                                        <span className="text-xs flex items-center space-x-1 text-cyan-300">
                                            <BellIcon className="w-4 h-4" />
                                            <span>Reminder Detected</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button onClick={resetState} className="w-full font-semibold py-2 px-4 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                    Clear
                                </button>
                                <button onClick={handleSave} className="w-full font-bold py-2 px-4 rounded-full bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 transition-opacity">
                                    Save to Inbox
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardCard>
        </div>
    );
};

export default Classifier;
