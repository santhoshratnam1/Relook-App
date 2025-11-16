import React, { useState, useEffect } from 'react';
import { Item, Deck, Reminder, SourceType, ContentType } from '../types';
import { ScreenshotIcon, ArrowLeftIcon, DotsVerticalIcon, EditIcon, TrashIcon, BookOpenIcon, BellIcon, LinkIcon } from '../components/IconComponents';
import AddToDeckModal from '../components/AddToDeckModal';
import EditItemModal from '../components/EditItemModal';
import RecipeView from '../components/RecipeView';
import JobView from '../components/JobView';
import EventView from '../components/EventView';
import PostView from '../components/PostView';
import DesignView from '../components/DesignView';
import EducationView from '../components/EducationView';
import ProductView from '../components/ProductView';
import OfferView from '../components/OfferView';
import AnnouncementView from '../components/AnnouncementView';
import ResearchView from '../components/ResearchView';
import UpdateView from '../components/UpdateView';
import TeamSpotlightView from '../components/TeamSpotlightView';
import QuoteView from '../components/QuoteView';
import FestivalView from '../components/FestivalView';
import ImageLoader from '../components/ImageLoader';

interface ItemDetailProps {
  itemId: string;
  items: Item[];
  decks: Deck[];
  reminders: Reminder[];
  onAddItemToDeck: (itemId: string, deckId: string) => void;
  onCreateDeck: (deckData: { title: string; description: string }) => void;
  onUpdateItem: (itemId: string, data: { title: string, body: string }) => Promise<void>;
  onDeleteItem: (itemId: string) => void;
  onNavigate: (path: string) => void;
  onBack: () => void;
}

interface YouTubeVideo {
    url: string;
    title: string;
    author_name: string;
    html: string;
}

const SourceInfo: React.FC<{ type: SourceType }> = ({ type }) => {
    const iconMap: Record<SourceType, React.ReactNode> = {
        [SourceType.Screenshot]: <ScreenshotIcon />,
        [SourceType.Manual]: <EditIcon className="w-5 h-5"/>,
        [SourceType.Bookmark]: <LinkIcon className="w-5 h-5"/>,
        [SourceType.Instagram]: <BookOpenIcon />,
        [SourceType.LinkedIn]: <BookOpenIcon />,
    };
    return (
        <div className="flex items-center space-x-2 text-sm text-gray-400 capitalize">
            {iconMap[type] || <div className="w-5 h-5 bg-gray-600 rounded-md" />}
            <span>{type}</span>
        </div>
    );
};

const ItemDetail: React.FC<ItemDetailProps> = ({ itemId, items, decks, reminders, onAddItemToDeck, onCreateDeck, onUpdateItem, onDeleteItem, onNavigate, onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddToDeckOpen, setIsAddToDeckOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  
  const item = items.find(i => i.id === itemId);
  const decksById = new Map<string, Deck>(decks.map(d => [d.id, d]));
  
  useEffect(() => {
    const findAndFetchYoutubeVideos = async () => {
        if (!item) return;

        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g;
        
        let foundUrls = new Set<string>();
        
        const allText = item.body + ' ' + (item.urls?.join(' ') || '');
        let match;
        while ((match = youtubeRegex.exec(allText)) !== null) {
            foundUrls.add(`https://www.youtube.com/watch?v=${match[1]}`);
        }

        if (foundUrls.size > 0) {
            try {
                const videoPromises = Array.from(foundUrls).map(url => 
                    fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`).then(res => res.json())
                );
                const videoData = await Promise.all(videoPromises);
                setYoutubeVideos(videoData.filter(v => v && !v.error && v.html));
            } catch (e) {
                console.error("Failed to fetch YouTube oEmbed data", e);
            }
        }
    };
    findAndFetchYoutubeVideos();
  }, [item]);

  if (!item) {
    return (
      <div className="px-6 text-center py-10">
        <h2 className="text-2xl font-bold text-white mt-4">Item not found</h2>
        <button onClick={() => onNavigate('/inbox')} className="text-sm text-[#E6F0C6] hover:underline mt-2">Go back to Inbox</button>
      </div>
    );
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      onDeleteItem(item.id);
      onNavigate('/inbox');
    }
  };

  const formatDate = (date: Date) => new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const renderContentView = () => {
    if (item.content_type === ContentType.Event && item.event_data) return <EventView event={item.event_data} />;
    if (item.content_type === ContentType.Job && item.job_data) return <JobView job={item.job_data} />;
    if (item.content_type === ContentType.Product && item.product_data) return <ProductView product={item.product_data} />;
    if (item.content_type === ContentType.Portfolio && item.portfolio_data) return <DesignView design={item.portfolio_data} />; // Using DesignView for portfolio
    if (item.content_type === ContentType.Tutorial && item.tutorial_data) return <EducationView education={item.tutorial_data} />; // Using EducationView for tutorial
    if (item.content_type === ContentType.Offer && item.offer_data) return <OfferView offer={item.offer_data} />;
    if (item.content_type === ContentType.Announcement && item.announcement_data) return <AnnouncementView announcement={item.announcement_data} />;
    if (item.content_type === ContentType.Research && item.research_data) return <ResearchView research={item.research_data} />;
    if (item.content_type === ContentType.Update && item.update_data) return <UpdateView update={item.update_data} />;
    if (item.content_type === ContentType.TeamSpotlight && item.team_spotlight_data) return <TeamSpotlightView spotlight={item.team_spotlight_data} />;
    if (item.content_type === ContentType.Quote && item.quote_data) return <QuoteView quote={item.quote_data} />;
    if (item.content_type === ContentType.Festival && item.festival_data) return <FestivalView festival={item.festival_data} />;
    if (item.content_type === ContentType.Recipe && item.recipe_data) return <RecipeView recipe={item.recipe_data} />;
    if (item.content_type === ContentType.Post && item.post_data) return <PostView post={item.post_data} />;
    
    // Fallback for older types
    if (item.content_type === ContentType.Design && item.design_data) return <DesignView design={item.design_data} />;
    if (item.content_type === ContentType.Education && item.education_data) return <EducationView education={item.education_data} />;
    
    return <p>{item.body}</p>;
  };
  
  const hasStructuredData = item.event_data || item.job_data || item.product_data || item.portfolio_data ||
                            item.tutorial_data || item.offer_data || item.announcement_data || item.research_data ||
                            item.update_data || item.team_spotlight_data || item.quote_data || item.festival_data ||
                            item.recipe_data || item.post_data || item.design_data || item.education_data;

  return (
    <>
      <div className="px-6 space-y-4 animate-fade-in">
        <div className="mt-4 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeftIcon />
            <span>Back</span>
          </button>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full hover:bg-white/10">
              <DotsVerticalIcon />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2a2b2e] border border-white/10 rounded-xl shadow-lg animate-fade-in z-20">
                <button onClick={() => { setIsEditOpen(true); setIsMenuOpen(false); }} className="w-full text-left flex items-center space-x-3 px-4 py-2 hover:bg-white/10 transition-colors">
                  <EditIcon className="w-5 h-5" />
                  <span>Edit</span>
                </button>
                <button onClick={handleDelete} className="w-full text-left flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500/10 transition-colors">
                  <TrashIcon className="w-5 h-5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {item.thumbnail_url && (
            <ImageLoader src={item.thumbnail_url} alt={item.title} className="w-full h-auto max-h-60 object-cover rounded-2xl border border-white/10" />
        )}
        
        <div className="space-y-2">
            <span className="text-sm capitalize px-2 py-1 rounded-full bg-gradient-to-r from-[#e6f0c630] to-[#f6f2d830] text-[#E6F0C6]">
                {item.content_type.replace('_', ' ')}
            </span>
            <h1 className="text-3xl font-bold text-white">{item.title}</h1>
        </div>
        
        {item.source_type === SourceType.Bookmark && (item.urls?.[0] || item.body.startsWith('http')) && (
            <a
                href={item.urls?.[0] || item.body}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full flex justify-center items-center space-x-2 font-semibold py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 active:scale-98 transition-all"
            >
                <LinkIcon className="w-5 h-5"/>
                <span>Visit Source Link</span>
            </a>
        )}

        <div className="text-gray-300 whitespace-pre-wrap leading-relaxed py-4 border-y border-white/10">
          {renderContentView()}
          {hasStructuredData && (
              <details className="mt-4 group">
                  <summary className="text-sm text-gray-400 cursor-pointer list-none group-hover:text-white transition-colors">View original text</summary>
                  <p className="whitespace-pre-wrap leading-relaxed pt-2 mt-2 border-t border-white/10">{item.body}</p>
              </details>
          )}
        </div>

        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">METADATA</h3>
                <div className="bg-[#1a1b1e] border border-white/10 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-300">Source</span>
                        <SourceInfo type={item.source_type} />
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-300">Saved On</span>
                        <span className="text-sm text-gray-400">{formatDate(item.created_at)}</span>
                    </div>
                </div>
            </div>

            {youtubeVideos.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">LINKED MEDIA</h3>
                    <div className="space-y-3">
                        {youtubeVideos.map((video, index) => (
                            video.html && (
                                <div 
                                    key={index} 
                                    className="bg-[#1a1b1e] border border-white/10 rounded-2xl p-4 space-y-3"
                                >
                                    <div 
                                        className="aspect-video rounded-lg overflow-hidden" 
                                        dangerouslySetInnerHTML={{ __html: video.html.replace(/width="\d+"/, 'width="100%"').replace(/height="\d+"/, 'height="100%"') }} 
                                    />
                                    <a href={video.url} target="_blank" rel="noopener noreferrer" className="block font-bold text-white hover:underline text-sm">{video.title}</a>
                                    <p className="text-xs text-gray-400">by {video.author_name}</p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {item.tags && item.tags.length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">TAGS</h3>
                    <div className="bg-[#1a1b1e] border border-white/10 rounded-2xl p-4">
                        <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded-full bg-slate-600/70 text-slate-300">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {item.reminder_id && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">REMINDER</h3>
                <div className="bg-[#1a1b1e] border border-white/10 rounded-2xl p-4">
                  {(() => {
                    const reminder = reminders.find(r => r.id === item.reminder_id);
                    if (!reminder) {
                      return <p className="text-sm text-gray-400">Reminder data not found</p>;
                    }
                    const formatDateTime = (date: Date | string) => {
                      const d = typeof date === 'string' ? new Date(date) : date;
                      if (isNaN(d.getTime())) return "Invalid Date";
                      return d.toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                    };
                    return (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BellIcon className="w-5 h-5 text-cyan-300" />
                          <div>
                            <p className="font-semibold text-white text-sm">{reminder.title}</p>
                            <p className="text-xs text-cyan-300">{formatDateTime(reminder.reminder_time)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => onNavigate('/reminders')}
                          className="text-xs text-[#E6F0C6] hover:underline"
                        >
                          View all
                        </button>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">DECKS</h3>
                <div className="bg-[#1a1b1e] border border-white/10 rounded-2xl p-4 space-y-2">
                    {item.deck_ids && item.deck_ids.length > 0 ? (
                        item.deck_ids.map(deckId => {
                            const deck = decksById.get(deckId);
                            return deck ? (
                                <button onClick={() => onNavigate(`/decks/${deck.id}`)} key={deckId} className="block w-full text-left text-sm font-semibold text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5">
                                    {deck.title}
                                </button>
                            ) : null;
                        })
                    ) : <p className="text-sm text-gray-400">Not in any decks yet.</p>}
                     <button onClick={() => setIsAddToDeckOpen(true)} className="w-full text-center text-sm font-bold py-3 px-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors mt-2">
                        Add to Deck...
                    </button>
                </div>
            </div>
        </div>

      </div>

      {isAddToDeckOpen && (
        <AddToDeckModal 
            item={item}
            decks={decks}
            onClose={() => setIsAddToDeckOpen(false)}
            onAddItemToDeck={onAddItemToDeck}
            onCreateDeck={onCreateDeck}
        />
      )}
      {isEditOpen && (
        <EditItemModal
            item={item}
            onClose={() => setIsEditOpen(false)}
            onSave={(data) => onUpdateItem(item.id, data)}
        />
      )}
    </>
  );
};

export default ItemDetail;