import React, { useState, useRef, useEffect } from 'react';
import DashboardCard from './DashboardCard';
import { classifyAudioContent } from '../services/geminiService';
import { 
    ContentType, SourceType, EventData, RecipeData, JobData, PostData, 
    PortfolioData, TutorialData, ProductData, OfferData, AnnouncementData, 
    ResearchData, UpdateData, TeamSpotlightData, QuoteData, FestivalData, Item
} from '../types';
import { MicrophoneIcon, SparklesIcon, BellIcon, StopIcon, XIcon } from './IconComponents';

type AddItemPayload = Omit<Item, 'id' | 'user_id' | 'created_at' | 'status' | 'thumbnail_url' | 'reminder_id' | 'deck_ids' | 'design_data' | 'education_data'>;

interface VoiceMemoClassifierProps {
    onItemAdded: (data: AddItemPayload) => void;
}

type ResultState = any;

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const VoiceMemoClassifier: React.FC<VoiceMemoClassifierProps> = ({ onItemAdded }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [result, setResult] = useState<ResultState>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [recordingTime, setRecordingTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<number | null>(null);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            
            mediaRecorderRef.current.ondataavailable = (event) => {
                chunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                chunksRef.current = [];
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            timerRef.current = window.setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            setError("Microphone access denied. Please enable it in your browser settings.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
        setRecordingTime(0);
    };

    const handleClassify = async () => {
        if (!audioBlob) return;
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = (reader.result as string).split(',')[1];
                const classificationResult = await classifyAudioContent(base64Audio, audioBlob.type);
                setResult(classificationResult);
                setIsLoading(false);
            };
        } catch (err) {
            setError('Failed to classify audio. Please try again.');
            console.error(err);
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setIsRecording(false);
        setAudioBlob(null);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setResult(null);
        setError(null);
        setIsLoading(false);
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const handleSave = () => {
        if (!result) return;
        onItemAdded({
            title: result.classification.title,
            summary: result.classification.summary,
            body: result.classification.body,
            content_type: result.classification.category,
            source_type: SourceType.VoiceMemo,
            tags: result.classification.tags,
            event_data: result.eventData,
            recipe_data: result.recipeData,
            job_data: result.jobData,
            post_data: result.postData,
            portfolio_data: result.portfolioData,
            tutorial_data: result.tutorialData,
            product_data: result.productData,
            offer_data: result.offerData,
            announcement_data: result.announcementData,
            research_data: result.researchData,
            update_data: result.updateData,
            team_spotlight_data: result.teamSpotlightData,
            quote_data: result.quoteData,
            festival_data: result.festivalData,
        });
        resetState();
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    return (
        <div className="px-4">
            <DashboardCard>
                <div className="space-y-4">
                    {!audioBlob && !isRecording && (
                        <button
                            onClick={handleStartRecording}
                            className="w-full flex justify-center items-center space-x-2 font-semibold py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 transition-all"
                        >
                            <MicrophoneIcon className="w-5 h-5" />
                            <span>Classify Voice Memo</span>
                        </button>
                    )}

                    {isRecording && (
                        <div className="text-center p-4">
                            <p className="text-red-400 font-semibold mb-2 recording-pulse">Recording...</p>
                            <p className="text-2xl font-mono font-bold text-white">{formatTime(recordingTime)}</p>
                             <button
                                onClick={handleStopRecording}
                                className="mt-4 w-16 h-16 flex justify-center items-center mx-auto rounded-full bg-red-600 hover:bg-red-700 active:scale-98 transition-all shadow-lg"
                            >
                                <StopIcon className="w-8 h-8 text-white"/>
                            </button>
                        </div>
                    )}

                    {audioUrl && !result && (
                        <div className="animate-fade-in space-y-4">
                            <div className="bg-[#0C0D0F] p-3 rounded-lg border border-white/10 flex items-center justify-between">
                                <audio src={audioUrl} controls className="w-full" />
                                <button onClick={resetState} className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 flex-shrink-0 ml-2">
                                    <XIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                onClick={handleClassify}
                                disabled={isLoading}
                                className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-98 transition-all disabled:opacity-50"
                            >
                                {isLoading ? 'Analyzing Audio...' : <><SparklesIcon className="w-5 h-5"/><span>Classify Memo</span></>}
                            </button>
                        </div>
                    )}
                    
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    
                    {result && (
                         <div className="animate-fade-in">
                            <div className="bg-[#0C0D0F] p-3 rounded-lg border border-white/10">
                                <p className="font-bold text-white">{result.classification.title}</p>
                                <p className="text-sm text-gray-300 mt-1">{result.classification.summary}</p>
                                <div className="mt-2 flex justify-between items-center">
                                    <span className="text-xs capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                                        {result.classification.category.replace('_', ' ')}
                                    </span>
                                    {result.eventData && <span className="text-xs flex items-center space-x-1 text-cyan-300"><BellIcon className="w-4 h-4" /><span>Reminder</span></span>}
                                </div>
                            </div>
                             <details className="mt-3 group">
                                <summary className="p-3 cursor-pointer text-sm font-semibold text-gray-400 list-none flex justify-between items-center bg-[#0C0D0F] rounded-lg border border-white/10 group-open:rounded-b-none active:scale-98 transition-transform">
                                    <span>View Transcription</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 transition-transform duration-200 group-open:rotate-180">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </summary>
                                <div className="p-3 pt-2 text-sm text-gray-300 max-h-32 overflow-y-auto bg-[#0C0D0F] rounded-b-lg border border-t-0 border-white/10">
                                    <p className="whitespace-pre-wrap">{result.classification.body}</p>
                                </div>
                            </details>
                            <div className="mt-4 flex space-x-2">
                                <button onClick={resetState} className="w-full font-semibold py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 transition-all">Clear</button>
                                <button onClick={handleSave} className="w-full font-bold py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-98 transition-all">Save to Inbox</button>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardCard>
        </div>
    );
};

export default VoiceMemoClassifier;