import React from 'react';
import { PostData } from '../types';
import InfoRow from './InfoRow';

interface PostViewProps {
  post: PostData;
}

const PostView: React.FC<PostViewProps> = ({ post }) => {
    return (
        <dl>
            <InfoRow label="Author" value={post.author ? `${post.author} ${post.authorHandle ? `(${post.authorHandle})` : ''}`: undefined} icon="✍️" />
            <InfoRow label="Platform" value={post.platform} icon="🌐" />
            <InfoRow label="Post Type" value={post.postType} icon="📄" />
            <InfoRow label="Sentiment" value={post.sentiment} icon="😊" />
            <InfoRow 
                label="Tags" 
                value={
                    post.tags && post.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-200">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    ) : undefined
                }
                icon="🏷️"
            />
            <InfoRow 
                label="Key Points"
                value={
                    post.keyPoints && post.keyPoints.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                            {post.keyPoints.map((item, index) => <li key={index}>{item}</li>)}
                        </ul>
                    ) : undefined
                }
                icon="🎯"
            />
            <InfoRow 
                label="Links" 
                value={
                    post.links && post.links.length > 0 ? (
                        <div className="space-y-1">
                            {post.links.map((link, index) => (
                                <a href={link} key={index} target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline truncate text-sm">
                                    {link}
                                </a>
                            ))}
                        </div>
                    ) : undefined
                }
                icon="🔗"
            />
        </dl>
    );
};

export default PostView;