/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Search, X, History, Trash2, TrendingUp, Sparkles } from 'lucide-react';
import { SearchHistoryItem } from '../types';
import { HOT_KEYWORDS } from '../constants/providers';
interface HeroSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  onSearch: (q?: string) => void;
  loading: boolean;
  history: SearchHistoryItem[];
  onSelectHistory: (q: string) => void;
  onClearHistory: () => void;
  onRemoveHistoryItem: (id: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  query,
  onQueryChange,
  onSearch,
  loading,
  history,
  onSelectHistory,
  onClearHistory,
  onRemoveHistoryItem,
  inputRef,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close history dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFocused(false);
    onSearch();
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-8 pb-4">
      {/* Editorial Headline */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-medium mb-3 border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>全新前端架构 · 多网盘极速聚合 · 智能排重</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
          万象云盘，一览尽搜
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span>收录 4.8 亿文件</span>
          <span aria-hidden="true">·</span>
          <span>10 大主流云盘协同</span>
          <span aria-hidden="true">·</span>
          <span>高精度有效性自检</span>
        </p>
      </div>

      {/* Main Search Input Form with History Dropdown */}
      <div ref={containerRef} className="relative w-full mb-6">
        <form 
          onSubmit={handleSubmit}
          className={`relative flex items-center w-full rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 shadow-lg ${
            isFocused 
              ? 'border-cyan-500 ring-4 ring-cyan-500/10 dark:ring-cyan-500/20 shadow-cyan-500/5' 
              : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 shadow-slate-950/5'
          }`}
        >
          <div className="pl-4 sm:pl-5 pr-2 text-slate-400">
            <Search className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="搜索影视剧集、考研学习、行业软件、无损音乐、游戏MOD..."
            className="w-full py-4 px-2 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                onQueryChange('');
                inputRef?.current?.focus();
              }}
              className="p-1.5 mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Submit Search Button */}
          <div className="pr-2 sm:pr-3">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 active:scale-98 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>全网聚合搜</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* History & Suggestion Dropdown */}
        {isFocused && history.length > 0 && !query && (
          <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-medium">
                <History className="w-3.5 h-3.5 text-slate-400" />
                <span>最近搜索历史</span>
              </span>
              <button
                type="button"
                onClick={onClearHistory}
                className="flex items-center gap-1 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                <span>清空历史</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="group flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-md transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectHistory(item.query);
                      setIsFocused(false);
                    }}
                    className="hover:text-cyan-600 dark:hover:text-cyan-400"
                  >
                    {item.query}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveHistoryItem(item.id);
                    }}
                    className="text-slate-400 hover:text-red-500 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Hot Searches Bar */}
      <div className="flex items-center gap-2 text-xs overflow-x-auto no-scrollbar py-1">
        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium shrink-0">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>大家都在搜：</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {HOT_KEYWORDS.slice(0, 6).map((item) => (
            <button
              key={item.keyword}
              onClick={() => {
                onQueryChange(item.keyword);
                onSearch(item.keyword);
              }}
              className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap"
            >
              {item.keyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
