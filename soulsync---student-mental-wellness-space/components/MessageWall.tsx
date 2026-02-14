
import React, { useState } from 'react';
import { Post, Mood } from '../types';
import { MOOD_CONFIG } from '../constants';
import { Heart, MessageSquare, Send } from 'lucide-react';

interface MessageWallProps {
  posts: Post[];
  onAddPost: (content: string) => void;
}

const MessageWall: React.FC<MessageWallProps> = ({ posts, onAddPost }) => {
  const [newPost, setNewPost] = useState('');
  const [huggedPosts, setHuggedPosts] = useState<Set<string>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    onAddPost(newPost);
    setNewPost('');
  };

  const handleHug = (post: Post) => {
    console.log(`%c [SoulSync] Sending a giant virtual hug to ${post.authorNickname}'s post!`, 'background: #6366f1; color: white; padding: 2px 5px; border-radius: 4px;');
    
    // UI Feedback: Toggle hugged state
    const newHugged = new Set(huggedPosts);
    if (newHugged.has(post.id)) {
      newHugged.delete(post.id);
    } else {
      newHugged.add(post.id);
    }
    setHuggedPosts(newHugged);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind? (Anonymous)"
          className="w-full min-h-[100px] p-4 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none text-slate-700"
        />
        <div className="mt-3 flex justify-between items-center">
          <p className="text-xs text-slate-400">Your current mood is attached to this post.</p>
          <button 
            type="submit"
            disabled={!newPost.trim()}
            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Share
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {posts.map((post) => {
          const config = MOOD_CONFIG[post.mood];
          const isHugged = huggedPosts.has(post.id);
          return (
            <div key={post.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.bg} ${config.text}`}>
                    {config.icon}
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">{post.authorNickname}</h5>
                    <p className="text-xs text-slate-400">{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-md ${config.bg} ${config.text}`}>
                  {post.mood}
                </div>
              </div>
              
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-4">
                {post.content}
              </p>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-50">
                <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors group">
                  <Heart className={`w-5 h-5 group-active:scale-125 transition-transform ${post.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-sm font-medium">{post.likes}</span>
                </button>
                <button 
                  onClick={() => handleHug(post)}
                  className={`flex items-center gap-2 transition-all ${isHugged ? 'text-indigo-600 scale-105' : 'text-slate-400 hover:text-indigo-500'}`}
                >
                  <MessageSquare className={`w-5 h-5 ${isHugged ? 'fill-indigo-100' : ''}`} />
                  <span className="text-sm font-medium">{isHugged ? 'Hugged!' : 'Hug'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageWall;
