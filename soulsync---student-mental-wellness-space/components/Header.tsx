
import React from 'react';
import { Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Sparkles className="text-indigo-600 w-6 h-6" />
        <h1 className="text-2xl font-display font-bold text-slate-900">SoulSync</h1>
      </div>
    </header>
  );
};

export default Header;
