
import React from 'react';
import { Peer, Mood } from '../types';
import { MOCK_PEERS, MOOD_CONFIG } from '../constants';
import { MessageCircle, Hash } from 'lucide-react';

interface MatchingSectionProps {
  userMood: Mood;
  userInterests: string[];
}

const MatchingSection: React.FC<MatchingSectionProps> = ({ userMood, userInterests }) => {
  // Matching logic:
  // 1. Same mood (primary)
  // 2. Interest overlap (secondary)
  
  const getPeerScore = (peer: Peer) => {
    let score = 0;
    if (peer.mood === userMood) score += 10;
    const shared = peer.interests.filter(i => userInterests.includes(i));
    score += shared.length * 2;
    return { score, shared };
  };

  const rankedPeers = MOCK_PEERS
    .map(p => ({ ...p, ...getPeerScore(p) }))
    .sort((a, b) => b.score - a.score);

  const bestMatches = rankedPeers.slice(0, 4);

  const renderPeer = (peer: Peer & { shared: string[] }) => {
    const config = MOOD_CONFIG[peer.mood];
    return (
      <div key={peer.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-3 hover:border-indigo-200 transition-all">
        <div className="relative">
          <img src={peer.avatar} alt={peer.nickname} className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md" />
          <div className={`absolute -bottom-1 -right-1 p-2 rounded-full shadow-sm ${config.bg} ${config.text}`}>
            {React.cloneElement(config.icon as React.ReactElement, { className: 'w-4 h-4' })}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-lg">{peer.nickname}</h4>
          <p className="text-xs text-slate-500 italic mb-2">Feeling {peer.mood}</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-1.5 min-h-[1.5rem]">
          {peer.interests.map(interest => {
            const isShared = userInterests.includes(interest);
            return (
              <span 
                key={interest} 
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isShared ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-slate-50 text-slate-400 border border-transparent'}`}
              >
                {interest}
              </span>
            );
          })}
        </div>

        <p className="text-sm text-slate-600 line-clamp-2">{peer.bio}</p>
        
        <button className="w-full mt-2 py-2.5 px-4 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Sync Message
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-800">
            Peers Synced to You
          </h3>
          <p className="text-sm text-slate-400">Based on your mood and interests</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600">
          <Hash className="w-3 h-3" />
          <span className="text-xs font-bold uppercase tracking-wider">{userInterests.length} Interests</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bestMatches.map(renderPeer)}
      </div>

      {bestMatches.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-slate-200 text-center">
          <p className="text-slate-500">No matches found yet. Try adding more interests!</p>
        </div>
      )}
    </div>
  );
};

export default MatchingSection;
