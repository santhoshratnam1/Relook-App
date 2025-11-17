
import React, { useState, useRef } from 'react';
import DashboardCard from './DashboardCard';
import { classifyContent } from '../services/geminiService';
import { 
    ContentType, SourceType, EventData, RecipeData, JobData, PostData, 
    PortfolioData, TutorialData, ProductData, OfferData, AnnouncementData, 
    ResearchData, UpdateData, TeamSpotlightData, QuoteData, FestivalData, Item
} from '../types';
import { SparklesIcon, BellIcon, DocumentIcon, XIcon } from './IconComponents';

type AddItemPayload = Omit<Item, 'id' | 'user_id' | 'created_at' | 'status' | 'thumbnail_url' | 'reminder_id' | 'deck_ids' | 'design_data' | 'education_data'>;

interface ClassifierProps {
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

const Classifier: React.FC<ClassifierProps> = ({ onItemAdded }) => {
    const [text, setText] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<ResultState>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            resetState(false);
            setFile(selectedFile);
            setText('');
        }
    };

    const handleClassify = async () => {
        let contentToClassify = '';
        if (file) {
            contentToClassify = `--- Document Analysis ---\nFilename: ${file.name}\nFile type: ${file.type}\n\n(Simulated content of the document. The AI will classify based on this information.)`;
        } else if (text.trim()) {
            contentToClassify = text;
        } else {
            setError('Please enter text or upload a file.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const classificationResult = await classifyContent(contentToClassify);
            setResult(classificationResult as ResultState);
        } catch (err) {
            setError('Failed to classify content. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = (clearFileInput = true) => {
        setText('');
        setFile(null);
        setResult(null);
        setError(null);
        setIsLoading(false);
        if (fileInputRef.current && clearFileInput) {
            fileInputRef.current.value = "";
        }
    }

    const handleSave = () => {
        if (!result) return;
        
        const sourceType = file ? SourceType.FileUpload : SourceType.Manual;
        const bodyContent = file ? `--- Document Analysis ---\nFilename: ${file.name}\nFile type: ${file.type}\n\n(Simulated content of the document.)` : text;

        onItemAdded({
            title: result.classification.title,
            summary: result.classification.summary,
            body: bodyContent,
            content_type: result.classification.category,
            source_type: sourceType,
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
            headings: result.headings,
            sections: result.sections,
            keyPhrases: result.keyPhrases,
            urls: result.urls,
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
                    {!file && (
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste text from a screenshot or note..."
                            className="w-full h-24 p-3 bg-[#0C0D0F] border border-white/10 rounded-xl resize-none focus:ring-2 focus:ring-[#E6F0C6] focus:outline-none transition text-sm"
                            disabled={!!result}
                        />
                    )}

                    {file && !result && (
                        <div className="bg-[#0C0D0F] p-3 rounded-lg border border-white/10 flex items-center justify-between animate-fade-in">
                            <div className="flex items-center gap-3 min-w-0">
                                <DocumentIcon className="w-6 h-6 text-gray-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-white truncate">{file.name}</span>
                            </div>
                            <button onClick={() => resetState()} className="p-1 rounded-full text-gray-500 hover:text-white hover:bg-white/10 flex-shrink-0">
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {!result && !file && (
                        <>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <div className="flex-1 h-px bg-white/10"></div>
                                <span>OR</span>
                                <div className="flex-1 h-px bg-white/10"></div>
                            </div>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.doc,.docx,.txt,.md"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex justify-center items-center space-x-2 font-semibold py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-98 transition-all"
                            >
                                <DocumentIcon className="w-5 h-5"/>
                                <span>Upload Document</span>
                            </button>
                        </>
                    )}
                    
                    {!result && (
                        <button
                            onClick={handleClassify}
                            disabled={isLoading || (!text.trim() && !file)}
                            className="w-full flex justify-center items-center space-x-2 font-bold py-3 px-4 rounded-xl bg-gradient-to-r from-[#E6F0C6] to-[#F6F2D8] text-black hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                             {isLoading ? 'Analyzing...' : (
                                file 
                                    ? <><SparklesIcon className="w-5 h-5"/><span>Classify File</span></> 
                                    : <><SparklesIcon className="w-5 h-5"/><span>Classify Text</span></>
                             )}
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

export default Classifier;