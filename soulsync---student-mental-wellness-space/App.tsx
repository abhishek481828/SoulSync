
import React, { useState, useEffect, useCallback } from 'react';
import { Mood, UserProfile, Post, MoodEntry } from './types';
import Header from './components/Header';
import MoodSelector from './components/MoodSelector';
import MessageWall from './components/MessageWall';
import MoodDashboard from './components/MoodDashboard';
import MatchingSection from './components/MatchingSection';
import SupportChat from './components/SupportChat';
import { getEmpatheticResponse } from './services/geminiService';
import { Sparkles, LayoutDashboard, MessageSquare, Users, History, Plus, X, Tag, Settings, Save, Camera, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'wall' | 'sync' | 'chat'>('dashboard');
  const [posts, setPosts] = useState<Post[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [aiTip, setAiTip] = useState<string>("Take a deep breath. You're doing great today.");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [interestInput, setInterestInput] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempNickname, setTempNickname] = useState('');
  const [tempAvatar, setTempAvatar] = useState('');

  // Initialize Anonymous User
  useEffect(() => {
    const savedUser = localStorage.getItem('soulsync_user');
    const savedPosts = localStorage.getItem('soulsync_posts');
    const savedHistory = localStorage.getItem('soulsync_history');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setTempNickname(parsedUser.nickname);
      setTempAvatar(parsedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${parsedUser.nickname}`);
    } else {
      const nicknames = ['Brave Koala', 'Calm Otter', 'Swift Sparrow', 'Wise Elephant', 'Kind Wolf'];
      const defaultNickname = nicknames[Math.floor(Math.random() * nicknames.length)];
      const newUser: UserProfile = {
        id: Math.random().toString(36).substr(2, 9),
        nickname: defaultNickname,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${defaultNickname}`,
        currentMood: Mood.NEUTRAL,
        interests: ['Music', 'Study', 'Coffee']
      };
      setUser(newUser);
      setTempNickname(newUser.nickname);
      setTempAvatar(newUser.avatar || '');
      localStorage.setItem('soulsync_user', JSON.stringify(newUser));
    }

    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedHistory) setMoodHistory(JSON.parse(savedHistory));
  }, []);

  const handleMoodSelect = useCallback(async (mood: Mood) => {
    if (!user) return;
    
    const updatedUser = { ...user, currentMood: mood };
    setUser(updatedUser);
    localStorage.setItem('soulsync_user', JSON.stringify(updatedUser));

    const newEntry = { timestamp: Date.now(), mood };
    const updatedHistory = [...moodHistory, newEntry];
    setMoodHistory(updatedHistory);
    localStorage.setItem('soulsync_history', JSON.stringify(updatedHistory));

    setIsLoadingAi(true);
    const tip = await getEmpatheticResponse("I just updated my mood.", mood);
    setAiTip(tip || "Stay strong, we're here for you.");
    setIsLoadingAi(false);
  }, [user, moodHistory]);

  const handleAddInterest = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!user || !interestInput.trim()) return;
    if (user.interests.includes(interestInput.trim())) {
      setInterestInput('');
      return;
    }
    const updatedUser = { ...user, interests: [...user.interests, interestInput.trim()] };
    setUser(updatedUser);
    localStorage.setItem('soulsync_user', JSON.stringify(updatedUser));
    setInterestInput('');
  };

  const handleRemoveInterest = (interest: string) => {
    if (!user) return;
    const updatedUser = { ...user, interests: user.interests.filter(i => i !== interest) };
    setUser(updatedUser);
    localStorage.setItem('soulsync_user', JSON.stringify(updatedUser));
  };

  const handleAddPost = (content: string) => {
    if (!user) return;
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user.id,
      authorNickname: user.nickname,
      content,
      mood: user.currentMood,
      timestamp: Date.now(),
      likes: 0
    };
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('soulsync_posts', JSON.stringify(updatedPosts));
  };

  const saveSettings = () => {
    if (!user) return;
    const updatedUser = { ...user, nickname: tempNickname, avatar: tempAvatar };
    setUser(updatedUser);
    localStorage.setItem('soulsync_user', JSON.stringify(updatedUser));
    setIsSettingsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-8">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight tracking-tighter">SoulSync</h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
            <span className="hidden sm:inline text-sm font-medium text-slate-500">{user.nickname}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm bg-indigo-50">
              <img src={user.avatar} alt={user.nickname} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-display font-bold text-slate-900">Profile Settings</h3>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-50 shadow-lg">
                      <img src={tempAvatar} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full shadow-lg border-2 border-white">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Nickname</label>
                    <input 
                      type="text" 
                      value={tempNickname}
                      onChange={(e) => setTempNickname(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avatar URL</label>
                    <input 
                      type="text" 
                      value={tempAvatar}
                      onChange={(e) => setTempAvatar(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-100 text-sm"
                    />
                  </div>
                </div>

                <button 
                  onClick={saveSettings}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 pt-8">
        <section className="mb-10 text-center md:text-left bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 rounded-[2rem] border border-white shadow-sm">
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">How are you, {user.nickname}?</h2>
          <p className="text-slate-500 mb-8">Let your feelings breathe. How is your heart today?</p>
          <MoodSelector selectedMood={user.currentMood} onSelectMood={handleMoodSelect} />
          
          <div className={`mt-8 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-indigo-100 shadow-sm transition-all duration-500 ${isLoadingAi ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-1">SoulAI Support</h4>
                <p className="text-slate-700 text-lg leading-relaxed font-medium">
                  "{aiTip}"
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="hidden md:flex gap-4 mb-6">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'dashboard' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                <LayoutDashboard className="w-5 h-5" />
                Your Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('wall')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'wall' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                <MessageSquare className="w-5 h-5" />
                Public Wall
              </button>
              <button 
                onClick={() => setActiveTab('sync')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'sync' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                <Users className="w-5 h-5" />
                Peer Sync
              </button>
              <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'chat' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                <MessageCircle className="w-5 h-5" />
                SoulAI Chat
              </button>
            </div>

            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-bold text-slate-800">Your Journey</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                      <History className="w-3 h-3" />
                      WEEKLY TREND
                    </div>
                  </div>
                  <MoodDashboard history={moodHistory} />
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                  <MatchingSection userMood={user.currentMood} userInterests={user.interests} />
                </div>
              </div>
            )}

            {activeTab === 'wall' && (
              <MessageWall posts={posts} onAddPost={handleAddPost} />
            )}

            {activeTab === 'sync' && (
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <MatchingSection userMood={user.currentMood} userInterests={user.interests} />
              </div>
            )}

            {activeTab === 'chat' && (
              <SupportChat currentMood={user.currentMood} />
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-display font-bold text-slate-800">Interests</h3>
              </div>
              <form onSubmit={handleAddInterest} className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="Add interest..."
                    className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm"
                  />
                  <button type="submit" className="absolute right-2 top-1.5 p-1 bg-indigo-600 text-white rounded-lg">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </form>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <span key={interest} className="flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                    {interest}
                    <button onClick={() => handleRemoveInterest(interest)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
              <h3 className="text-xl font-display font-bold mb-4 relative z-10">Safe Space</h3>
              <p className="text-slate-400 text-sm mb-6 relative z-10">Anonymous, kind, and always listening.</p>
              <div className="space-y-3 relative z-10">
                <a href="tel:988" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-center text-sm transition-colors">Crisis Lifeline (988)</a>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            </div>
          </div>
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Dash</span>
        </button>
        <button onClick={() => setActiveTab('wall')} className={`flex flex-col items-center gap-1 ${activeTab === 'wall' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <MessageSquare className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Wall</span>
        </button>
        <button onClick={() => setActiveTab('sync')} className={`flex flex-col items-center gap-1 ${activeTab === 'sync' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <Users className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Sync</span>
        </button>
        <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <MessageCircle className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Chat</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
