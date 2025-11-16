import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import { classifyContent } from '../services/geminiService';
import { 
    ContentType, SourceType, EventData, RecipeData, JobData, PostData, 
    PortfolioData, TutorialData, ProductData, OfferData, AnnouncementData, 
    ResearchData, UpdateData, TeamSpotlightData, QuoteData, FestivalData, Item
} from '../types';
import { LinkIcon, SparklesIcon, BellIcon } from './IconComponents';

type AddItemPayload = Omit<Item, 'id' | 'user_id' | 'created_at' | 'status' | 'thumbnail_url' | 'reminder_id' | 'deck_ids' | 'design_data' | 'education_data'>;

interface BookmarkClassifierProps {
    onItemAdded: (data: AddItemPayload) => void;
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
    headings?: string[];
    sections?: string[];
    keyPhrases?: string[];
    urls?: string[];
    entities?: string[];
    sentiment?: string;
    language?: string;
} | null;

const BookmarkClassifier: React.FC<BookmarkClassifierProps> = ({ onItemAdded }) => {
    const [url, setUrl] = useState('');
    const [result, setResult] = useState<ResultState>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleClassify = async () => {
        if (!url.trim()) {
            setError('Please enter a URL.');
            return;
        }
        // Basic URL validation
        try {
            new URL(url);
        } catch (_) {
            setError('Please enter a valid URL.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const classificationResult = await classifyContent(url);
            setResult(classificationResult as ResultState);
        } catch (err) {
            setError('Failed to classify URL. The link might be inaccessible.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setUrl('');
        setResult(null);
        setError(null);
        setIsLoading(false);
    }

    const handleSave = () => {
        if (!result) return;
        onItemAdded({
            title: result.classification.title,
            summary: result.classification.summary,
            body: url, // Store the original URL in the body
            content_type: result.classification.category,
            source_type: SourceType.Bookmark,
            tags: result.classification.tags,
            urls: [url, ...(result.urls || [])], // Ensure original URL is included
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
            headings: result.headings,
            sections: result.sections,
            keyPhrases: result.keyPhrases,
            entities: result.entities,
            sentiment: result.sentiment,
            language: result.language,
        });
        resetState();
    }

    return (
        <div className="px-4">
             <DashboardCard>
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <LinkIcon className="w-5 h-5 text-gray-500" />
                        </div>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="Paste a URL to save..."
                            className="w-full p-3 pl-10 bg-[#0C0D0F] border border-white/10 rounded-xl focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition text-sm"
                            disabled={!!result || isLoading}
                        />
                    </div>
                    {!result && (
                        <button
                            onClick={handleClassify}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             {isLoading ? 'Analyzing URL...' : <> <SparklesIcon className="w-5 h-5"/> <span>Classify Link</span> </>}
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

export default BookmarkClassifier;