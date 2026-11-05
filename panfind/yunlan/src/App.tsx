/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useSearchEngine } from './hooks/useSearchEngine';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { FilterBar } from './components/FilterBar';
import { SearchRefinePanel } from './components/SearchRefinePanel';
import { SearchResultsTable } from './components/SearchResultsTable';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { BackendConfigModal } from './components/BackendConfigModal';
import { WeiboConfigModal } from './components/WeiboConfigModal';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { DiskNavigationGrid } from './components/DiskNavigationGrid';
import { HotSearchAndRankings } from './components/HotSearchAndRankings';
import { UsageGuide } from './components/UsageGuide';
import { BatchActionBar } from './components/BatchActionBar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { ResourceItem, DiskProviderId, ResourceCategory } from './types';
import { SearchX, ArrowDown, ChevronRight } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { AuthModal } from './components/AuthModal';
import { PaywallModal } from './components/PaywallModal';

export default function App() {
  const auth = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallReason, setPaywallReason] = useState('');
  // Theme management: default to dark
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('haisou_theme');
    if (saved) return saved === 'dark';
    return true; // default dark oceanic theme
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('haisou_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('haisou_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'search' | 'providers' | 'rankings' | 'guide'>('search');

  // Search Engine state hook
  const {
    filter,
    setQuery,
    handleSearchSubmit,
    toggleProvider,
    selectAllProviders,
    invertProviders,
    setCategory,
    setSortBy,
    setTimeRange,
    setOnlyValid,
    setSizeRange,
    clearSearch,
    response,
    loading,
    error,
    loadMore,
    history,
    clearHistory,
    removeHistoryItem,
    favorites,
    toggleFavorite,
    isFavorite,
    selectedItemIds,
    toggleSelectItem,
    selectAllVisible,
    clearSelection,
    refreshSearch,
  } = useSearchEngine(auth.applyPoints, (msg) => {
    setPaywallReason(msg);
    setIsPaywallOpen(true);
  });

  // Modals & Drawers state
  const [detailItem, setDetailItem] = useState<ResourceItem | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isBackendConfigOpen, setIsBackendConfigOpen] = useState(false);
  const [isWeiboConfigOpen, setIsWeiboConfigOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [minSizeUnit, setMinSizeUnit] = useState<'MB' | 'GB'>('MB');
  const [maxSizeUnit, setMaxSizeUnit] = useState<'MB' | 'GB'>('GB');

  const maxSizeGb =
    filter.maxSizeMb != null && filter.maxSizeMb > 0 ? filter.maxSizeMb / 1024 : null;

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on '/' or 'Ctrl+K' / 'Cmd+K'
      if ((e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') ||
          ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
        e.preventDefault();
        setActiveTab('search');
        searchInputRef.current?.focus();
      }

      // Close modals on Esc
      if (e.key === 'Escape') {
        setDetailItem(null);
        setIsFavoritesOpen(false);
        setIsBackendConfigOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleShowToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Selected items array for batch action bar
  const selectedItems = response 
    ? response.items.filter(item => selectedItemIds.has(item.id)) 
    : [];

  const handleSearchProviderFromGrid = (providerId: DiskProviderId) => {
    toggleProvider(providerId);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectKeywordFromRankings = (keyword: string, category?: ResourceCategory) => {
    setQuery(keyword);
    if (category) setCategory(category);
    handleSearchSubmit(keyword);
    setActiveTab('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Toast Feedback */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenBackendConfig={() => setIsBackendConfigOpen(true)}
        onOpenWeiboConfig={() => setIsWeiboConfigOpen(true)}
        user={auth.user}
        points={auth.points}
        authLoading={auth.loading}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={() => auth.logout()}
        onOpenPaywall={() => {
          setPaywallReason('今日积分已用完，选择套餐开通 VIP 后可继续搜索');
          setIsPaywallOpen(true);
        }}
        favoritesCount={favorites.length}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onFocusSearch={() => {
          setActiveTab('search');
          searchInputRef.current?.focus();
        }}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB 1: Search View */}
        {activeTab === 'search' && (
          <div className="py-2">
            
            {/* Hero Search Box */}
            <HeroSearch
              query={filter.query}
              onQueryChange={setQuery}
              onSearch={handleSearchSubmit}
              loading={loading}
              history={history}
              onSelectHistory={(q) => {
                setQuery(q);
                handleSearchSubmit(q);
              }}
              onClearHistory={clearHistory}
              onRemoveHistoryItem={removeHistoryItem}
              inputRef={searchInputRef}
            />

            {filter.query.trim() && (
              <div className="mt-4 space-y-3">
                <SearchRefinePanel
                  selectedProviders={filter.selectedProviders}
                  onToggleProvider={toggleProvider}
                  providersCount={response?.providersCount}
                  minSizeMb={filter.minSizeMb ?? 0}
                  maxSizeGb={maxSizeGb}
                  minUnit={minSizeUnit}
                  maxUnit={maxSizeUnit}
                  onMinSizeChange={(mb, unit) => {
                    setMinSizeUnit(unit);
                    setSizeRange(mb, filter.maxSizeMb);
                  }}
                  onMaxSizeChange={(gbOrNull, unit) => {
                    setMaxSizeUnit(unit);
                    if (gbOrNull === null) {
                      setSizeRange(filter.minSizeMb ?? 0, undefined);
                      return;
                    }
                    const maxMb = Math.round(gbOrNull * 1024);
                    setSizeRange(filter.minSizeMb ?? 0, maxMb);
                  }}
                />
                <FilterBar
                  currentCategory={filter.category}
                  onSelectCategory={setCategory}
                  categoriesCount={response?.categoriesCount}
                  currentSort={filter.sortBy}
                  onSelectSort={setSortBy}
                  currentTimeRange={filter.timeRange}
                  onSelectTimeRange={setTimeRange}
                  onlyValid={filter.onlyValid}
                  onToggleOnlyValid={setOnlyValid}
                  viewMode="list"
                  onChangeViewMode={() => {}}
                  hideViewSwitcher
                  totalResults={response?.total || 0}
                  tookMs={response?.tookMs || 0}
                  modeLabel={response?.modeLabel}
                  demoMode={response?.demoMode}
                />
              </div>
            )}

            {/* Results Section */}
            <div className="space-y-3 min-h-[300px] mt-3">
              
              {/* Error state */}
              {error && (
                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 text-xs">
                  <p className="font-semibold mb-1">搜索服务遇到问题：</p>
                  <p>{error}</p>
                </div>
              )}

              {/* Loading skeletons */}
              {loading && !response && (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <div 
                      key={n} 
                      className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-pulse space-y-3"
                    >
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                      <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty Results state */}
              {!loading && response && response.items.length === 0 && (
                <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8">
                  <SearchX className="w-12 h-12 stroke-[1.5] mx-auto text-slate-400 mb-3" />
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                    未检索到符合条件的网盘资源
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                    建议缩减筛选条件，取消特定格式或时间限制，或尝试搜索其他通用词汇（如简写名称）。
                  </p>
                  <button
                    onClick={() => {
                      selectAllProviders();
                      setCategory('all');
                      setOnlyValid(false);
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 text-white hover:bg-cyan-500 transition-colors"
                  >
                    重置所有筛选条件
                  </button>
                </div>
              )}

              {response && response.items.length > 0 && (
                <SearchResultsTable
                  items={response.items}
                  query={filter.query}
                  total={response.total}
                  tookMs={response.tookMs}
                  modeLabel={response.modeLabel}
                  demoMode={response.demoMode}
                  sortBy={filter.sortBy}
                  onSelectSort={setSortBy}
                  onClose={() => {
                    clearSearch();
                    searchInputRef.current?.focus();
                  }}
                  onOpenDetail={(i) => setDetailItem(i)}
                  onToggleFavorite={toggleFavorite}
                  isFavorited={isFavorite}
                  onShowToast={handleShowToast}
                />
              )}

              {/* Load More Button */}
              {response && response.hasMore && (
                <div className="pt-6 pb-2 text-center">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-xs transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="w-3.5 h-3.5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowDown className="w-3.5 h-3.5 text-cyan-500" />
                    )}
                    <span>加载更多搜索结果</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 2: Providers Matrix */}
        {activeTab === 'providers' && (
          <DiskNavigationGrid onSearchProvider={handleSearchProviderFromGrid} />
        )}

        {/* TAB 3: Hot Rankings */}
        {activeTab === 'rankings' && (
          <HotSearchAndRankings onSelectKeyword={handleSelectKeywordFromRankings} />
        )}

        {/* TAB 4: Usage Guide */}
        {activeTab === 'guide' && (
          <UsageGuide />
        )}

      </main>

      {/* Floating Batch Action Bar */}
      <BatchActionBar
        selectedCount={selectedItemIds.size}
        selectedItems={selectedItems}
        onClearSelection={clearSelection}
        onBatchFavorite={(items) => {
          items.forEach(toggleFavorite);
          clearSelection();
        }}
        onShowToast={handleShowToast}
      />

      {/* Resource Detail Modal */}
      <ResourceDetailModal
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onToggleFavorite={toggleFavorite}
        isFavorited={detailItem ? isFavorite(detailItem.id) : false}
        onShowToast={handleShowToast}
      />

      {/* Backend API Config Modal */}
      <BackendConfigModal
        isOpen={isBackendConfigOpen}
        onClose={() => setIsBackendConfigOpen(false)}
        onConfigSaved={refreshSearch}
        onShowToast={handleShowToast}
      />

      <WeiboConfigModal
        isOpen={isWeiboConfigOpen}
        onClose={() => setIsWeiboConfigOpen(false)}
        onShowToast={handleShowToast}
        onSaved={refreshSearch}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={async (e, p) => {
          await auth.login(e, p);
          handleShowToast('登录成功');
        }}
        onRegister={async (e, p) => {
          await auth.register(e, p);
          handleShowToast('注册成功');
        }}
      />

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        user={auth.user}
        reason={paywallReason}
        onOpenAuth={() => {
          setIsPaywallOpen(false);
          setIsAuthOpen(true);
        }}
        onPaid={() => {
          auth.refresh();
          handleShowToast('VIP 已开通，可以畅搜啦');
        }}
      />

      {/* Favorites Drawer */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={toggleFavorite}
        onOpenDetail={(i) => setDetailItem(i)}
        onShowToast={handleShowToast}
      />

      {/* Footer */}
      <Footer
        onOpenBackendConfig={() => setIsBackendConfigOpen(true)}
        onNavigateToTab={setActiveTab}
      />

    </div>
  );
}
