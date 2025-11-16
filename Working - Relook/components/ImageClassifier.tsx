import React, { useState, useRef } from 'react';
import DashboardCard from './DashboardCard';
import { classifyImageContent } from '../services/geminiService';
import { ContentType, SourceType, ExtractedEvent, RecipeData, JobData } from '../types';
import { PhotoIcon, SparklesIcon, BellIcon } from './IconComponents';

interface ImageClassifierProps {
    onItemAdded: (data: { 
        title: string; 
        summary: string;
        body: string; 
        content_type: ContentType; 
        source_type: SourceType; 
        extractedEvent: ExtractedEvent | null;
        recipeData?: RecipeData | null;
        jobData?: JobData | null;
    }) => void;
}

type ResultState = {
    classification: { category: ContentType; title: string; summary: string; body: string; };
    extractedEvent: ExtractedEvent | null;
    recipeData: RecipeData | null;
    jobData: JobData | null;
} | null;

const ImageClassifier: React.FC<ImageClassifierProps> = ({ onItemAdded }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [result, setResult] = useState<ResultState>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            resetState(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
                handleClassify(file, reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClassify = async (file: File, fileDataUrl: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const base64Data = fileDataUrl.split(',')[1];
            if (!base64Data) {
                throw new Error("Could not extract base64 data from file.");
            }
            const classificationResult = await classifyImageContent(base64Data, file.type);
            setResult(classificationResult);
        } catch (err) {
            setError('Failed to classify image. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const resetState = (clearInput = true) => {
        setPreview(null);
        setResult(null);
        setError(null);
        setIsLoading(false);
        if(fileInputRef.current && clearInput) {
            fileInputRef.current.value = "";
        }
    }

    const handleSave = () => {
        if (!result) return;
        onItemAdded({
            title: result.classification.title,
            summary: result.classification.summary,
            body: result.classification.body,
            content_type: result.classification.category,
            source_type: SourceType.Screenshot,
            extractedEvent: result.extractedEvent,
            recipeData: result.recipeData,
            jobData: result.jobData,
        });
        resetState();
    }

    return (
        <div className="px-4 mb-3">
            <DashboardCard>
                <div className="space-y-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                        disabled={isLoading}
                    />
                    {!preview && (
                         <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex justify-center items-center space-x-2 font-semibold py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 transition-all"
                        >
                           <PhotoIcon className="w-5 h-5"/>
                           <span>Classify Image / Screenshot</span>
                        </button>
                    )}
                   
                    {preview && (
                        <div className="relative">
                            <img src={preview} alt="Preview" className="w-full h-auto max-h-48 object-contain rounded-lg" />
                            {isLoading && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                                    <p className="text-white font-semibold flex items-center space-x-2">
                                        <SparklesIcon/>
                                        <span>Analyzing...</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    
                    {result && !isLoading && (
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
                                            <span>Reminder</span>
                                        </span>
                                    )}
                                </div>
                            </div>

                            {result.classification.body && (
                                <details className="mt-3 group">
                                    <summary className="p-3 cursor-pointer text-sm font-semibold text-gray-400 list-none flex justify-between items-center bg-[#0C0D0F] rounded-lg border border-white/10 group-open:rounded-b-none active:scale-98 transition-transform">
                                        <span>View Extracted Text</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-open:rotate-180">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    </summary>
                                    <div className="p-3 pt-2 text-sm text-gray-300 max-h-32 overflow-y-auto bg-[#0C0D0F] rounded-b-lg border border-t-0 border-white/10">
                                        <p className="whitespace-pre-wrap">{result.classification.body}</p>
                                    </div>
                                </details>
                            )}

                            <div className="mt-4 flex space-x-2">
                                <button 
                                    onClick={() => resetState()} 
                                    className="w-full font-semibold py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 transition-all"
                                >
                                    Clear
                                </button>
                                <button 
                                    onClick={handleSave} 
                                    className="w-full font-bold py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-98 transition-all"
                                >
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

export default ImageClassifier;