import React from 'react';
import { PostData } from '../types';
import InfoRow from './InfoRow';

interface PostViewProps {
  post: PostData;
}

const PostView: React.FC<PostViewProps> = ({ post }) => {
    return (
        <dl>
            <InfoRow label="Author" value={post.author} icon="✍️" />
            <InfoRow label="Platform" value={post.platform} icon="🌐" />
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
        </dl>
    );
};

export default PostView;
