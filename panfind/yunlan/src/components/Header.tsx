/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Database, Flame, Bookmark, Settings, Search, Sun, Moon, Crown } from 'lucide-react';
import { UserQuotaPanel } from './UserQuotaPanel';
import { AuthUser, PointsStatus } from '../types/auth';

interface HeaderProps {
  activeTab: 'search' | 'providers' | 'rankings' | 'guide';
  setActiveTab: (tab: 'search' | 'providers' | 'rankings' | 'guide') => void;
  onOpenFavorites: () => void;
  onOpenBackendConfig: () => void;
  onOpenWeiboConfig?: () => void;
  user?: AuthUser | null;
  points?: PointsStatus | null;
  authLoading?: boolean;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onOpenPaywall?: () => void;
  favoritesCount: number;
  isDark: boolean;
  toggleTheme: () => void;
  onFocusSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenFavorites,
  onOpenBackendConfig,
  onOpenWeiboConfig,
  user = null,
  points = null,
  authLoading = false,
  onOpenAuth,
  onLogout,
  onOpenPaywall,
  favoritesCount,
  isDark,
  toggleTheme,
  onFocusSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/80 dark:bg-slate-950/80 bg-white/90 border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <button 
          onClick={() => setActiveTab('search')} 
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-sm shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M7 11c0-2.2 1.8-4 4-4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 flex items-center gap-1.5">
              云览 <span className="text-xs font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 uppercase">YUNLAN</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (single line, 4-5 links) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'search' 
                ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>发现资源</span>
          </button>

          <button
            onClick={() => setActiveTab('providers')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'providers' 
                ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>网盘引擎</span>
          </button>

          <button
            onClick={() => setActiveTab('rankings')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'rankings' 
                ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span>热门榜单</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'guide' 
                ? 'text-cyan-600 dark:text-cyan-400 font-semibold' 
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <span>使用指南</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Backend API Config */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick search focus on desktop */}
          {onFocusSearch && (
            <button
              onClick={onFocusSearch}
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              title="按快捷键快速聚焦搜索框"
            >
              <Search className="w-3.5 h-3.5" />
              <span>快速搜索</span>
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-400">
                /
              </kbd>
            </button>
          )}

          {/* Favorites trigger */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            title="我的收藏夹"
          >
            <Bookmark className="w-4 h-4" />
            {favoritesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold text-white bg-cyan-600 rounded-full flex items-center justify-center">
                {favoritesCount > 9 ? '9+' : favoritesCount}
              </span>
            )}
          </button>

          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            title={isDark ? '切换至亮色模式' : '切换至暗色模式'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {onOpenWeiboConfig && (
            <button
              onClick={onOpenWeiboConfig}
              className="hidden sm:flex items-center px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-cyan-500/40 transition-colors"
            >
              微博源
            </button>
          )}

          {onOpenPaywall && !points?.subscription?.active && !points?.unlimitedSearch && (
            <button
              type="button"
              onClick={onOpenPaywall}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-950 dark:text-amber-100 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 rounded-lg shadow-sm shadow-amber-500/25 transition-all whitespace-nowrap"
              title="月付 3 元起 · 有效期内搜索不扣积分"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>开通 VIP</span>
              <span className="text-[10px] font-semibold opacity-90">¥3起</span>
            </button>
          )}

          {onOpenAuth && onLogout && (
            <UserQuotaPanel
              user={user}
              points={points}
              loading={authLoading}
              onOpenAuth={onOpenAuth}
              onLogout={onLogout}
              onOpenPaywall={onOpenPaywall}
            />
          )}

          {/* Primary Action Button: Backend Interface Config */}
          <button
            onClick={onOpenBackendConfig}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 active:scale-95 rounded-lg shadow-sm shadow-cyan-600/20 transition-all whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Settings className="w-3.5 h-3.5 animate-spin-slow" />
            <span>接口对接</span>
          </button>
        </div>

      </div>
    </header>
  );
};
