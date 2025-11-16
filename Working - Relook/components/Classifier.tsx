import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { classifyContent } from '../services/geminiService';
import { 
    ContentType, SourceType, EventData, RecipeData, JobData, PostData, 
    PortfolioData, TutorialData, ProductData, OfferData, AnnouncementData, 
    ResearchData, UpdateData, TeamSpotlightData, QuoteData, FestivalData
} from '../types';
import { SparklesIcon, BellIcon } from './IconComponents';

interface ClassifierProps {
    onItemAdded: (data: { 
        title: string; 
        summary: string;
        body: string; 
        content_type: ContentType; 
        source_type: SourceType;
        tags?: string[];
        eventData: EventData | null;
        recipeData?: RecipeData | null;
        jobData?: JobData | null;
        postData?: PostData | null;
        portfolioData?: PortfolioData | null;
        tutorialData?: TutorialData | null;
        productData?: ProductData | null;
        offerData?: OfferData | null;
        announcementData?: AnnouncementData | null;
        researchData?: ResearchData | null;
        updateData?: UpdateData | null;
        teamSpotlightData?: TeamSpotlightData | null;
        quoteData?: QuoteData | null;
        festivalData?: FestivalData | null;
    }) => void;
}

type ResultState = {
    classification: { category: ContentType; title: string; summary: string; tags?: string[] };
    eventData: EventData | null;
    recipeData: RecipeData | null;
    jobData: JobData | null;
    postData: PostData | null;
    portfolioData: PortfolioData | null;
    tutorialData: TutorialData | null;
    productData: ProductData | null;
    offerData: OfferData | null;
    announcementData: AnnouncementData | null;
    researchData: ResearchData | null;
    updateData: UpdateData | null;
    teamSpotlightData: TeamSpotlightData | null;
    quoteData: QuoteData | null;
    festivalData: FestivalData | null;
} | null;

const Classifier: React.FC<ClassifierProps> = ({ onItemAdded }) => {
    const [text, setText] = useState('');
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
            setResult(classificationResult as ResultState);
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
            summary: result.classification.summary,
            body: text,
            content_type: result.classification.category,
            source_type: SourceType.Manual,
            tags: result.classification.tags,
            eventData: result.eventData,
            recipeData: result.recipeData,
            jobData: result.jobData,
            postData: result.postData,
            portfolioData: result.portfolioData,
            tutorialData: result.tutorialData,
            productData: result.productData,
            offerData: result.offerData,
            announcementData: result.announcementData,
            researchData: result.researchData,
            updateData: result.updateData,
            teamSpotlightData: result.teamSpotlightData,
            quoteData: result.quoteData,
            festivalData: result.festivalData,
        });
        resetState();
    }

    return (
        <div className="px-4">
             <DashboardCard>
                <div className="space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste text from a screenshot or note..."
                        className="w-full h-24 p-3 bg-[#0C0D0F] border border-white/10 rounded-xl resize-none focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition text-sm"
                        disabled={!!result}
                    />
                    {!result && (
                        <button
                            onClick={handleClassify}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        {result.classification.category.replace('_', ' ')}
                                    </span>
                                    {result.eventData && (
                                        <span className="text-xs flex items-center space-x-1 text-cyan-300">
                                            <BellIcon className="w-4 h-4" />
                                            <span>Reminder</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 flex space-x-2">
                                <button 
                                    onClick={resetState} 
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

export default Classifier;
