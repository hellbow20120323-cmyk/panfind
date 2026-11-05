/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  MoreVertical,
  Copy,
  ExternalLink,
  Bookmark,
  Info,
} from 'lucide-react';
import { ResourceItem, SortOption } from '../types';
import { DISK_PROVIDERS } from '../constants/providers';

type TableSortKey = 'title' | 'valid' | 'files' | 'size';

interface SearchResultsTableProps {
  items: ResourceItem[];
  query: string;
  total: number;
  tookMs: number;
  modeLabel?: string;
  demoMode?: boolean;
  sortBy: SortOption;
  onSelectSort: (sort: SortOption) => void;
  onClose: () => void;
  onOpenDetail: (item: ResourceItem) => void;
  onToggleFavorite: (item: ResourceItem) => void;
  isFavorited: (id: string) => boolean;
  onShowToast: (msg: string) => void;
}

function ProviderBadge({ item }: { item: ResourceItem }) {
  const p = DISK_PROVIDERS[item.diskProvider];
  return (
    <span
      className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0 shadow-sm"
      style={{ backgroundColor: p?.color || '#64748b' }}
      title={p?.name}
    >
      {p?.shortName?.slice(0, 2) || '?'}
    </span>
  );
}

function sortItems(items: ResourceItem[], key: TableSortKey, asc: boolean): ResourceItem[] {
  const dir = asc ? 1 : -1;
  return [...items].sort((a, b) => {
    switch (key) {
      case 'title':
        return dir * a.title.localeCompare(b.title, 'zh-CN');
      case 'valid':
        return dir * ((a.isValid ? 1 : 0) - (b.isValid ? 1 : 0)) || dir * (a.healthScore - b.healthScore);
      case 'files':
        return dir * (a.totalFiles - b.totalFiles);
      case 'size':
        return dir * (a.sizeBytes - b.sizeBytes);
      default:
        return 0;
    }
  });
}

export const SearchResultsTable: React.FC<SearchResultsTableProps> = ({
  items,
  query,
  total,
  tookMs,
  modeLabel,
  demoMode,
  sortBy,
  onSelectSort,
  onClose,
  onOpenDetail,
  onToggleFavorite,
  isFavorited,
  onShowToast,
}) => {
  const [tableSort, setTableSort] = useState<{ key: TableSortKey; asc: boolean }>({
    key: 'title',
    asc: true,
  });
  const [menuId, setMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuId(null);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const sorted = useMemo(
    () => sortItems(items, tableSort.key, tableSort.asc),
    [items, tableSort]
  );

  const toggleColSort = (key: TableSortKey) => {
    setTableSort((prev) =>
      prev.key === key ? { key, asc: !prev.asc } : { key, asc: key === 'title' }
    );
    if (key === 'size') onSelectSort(tableSort.asc && tableSort.key === 'size' ? 'size_asc' : 'size_desc');
  };

  const SortHead = ({ label, col }: { label: string; col: TableSortKey }) => (
    <button
      type="button"
      onClick={() => toggleColSort(col)}
      className="inline-flex items-center gap-1 text-left text-[11px] font-semibold text-emerald-100/80 hover:text-emerald-50 transition-colors"
    >
      {label}
      <ArrowUpDown className="w-3 h-3 opacity-60" />
    </button>
  );

  const copyItem = (item: ResourceItem) => {
    const copyText = item.extractCode
      ? `资源名称: ${item.title}\n分享链接: ${item.shareUrl}\n提取码: ${item.extractCode}`
      : `资源名称: ${item.title}\n分享链接: ${item.shareUrl}`;
    navigator.clipboard.writeText(copyText);
    onShowToast(`已复制「${item.title}」`);
    setMenuId(null);
  };

  return (
    <div className="rounded-2xl border border-emerald-900/40 bg-[#061014]/95 overflow-hidden shadow-lg shadow-black/20">
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-emerald-900/35 bg-emerald-950/20">
        <div className="flex items-center gap-2 min-w-0">
          <Search className="w-4 h-4 text-emerald-400 shrink-0" />
          <h2 className="text-sm font-bold text-emerald-50 truncate">搜索结果</h2>
          {query && (
            <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
              「{query}」
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 text-[10px] text-slate-500">
          <span>
            共 <strong className="text-emerald-200 tabular-nums">{total}</strong> 条 · {tookMs}ms
          </span>
          {modeLabel && (
            <span className={demoMode ? 'text-amber-400' : 'text-emerald-400'}>{modeLabel}</span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-emerald-950/50 text-slate-400 hover:text-white transition-colors"
            title="关闭结果"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-xs border-collapse">
          <thead>
            <tr className="border-b border-emerald-900/30 text-slate-500">
              <th className="w-10 px-3 py-2.5" aria-label="网盘" />
              <th className="px-3 py-2.5 text-left">
                <SortHead label="分享名称" col="title" />
              </th>
              <th className="px-3 py-2.5 text-center w-20">
                <SortHead label="有效性" col="valid" />
              </th>
              <th className="px-3 py-2.5 text-right w-24">
                <SortHead label="文件数量" col="files" />
              </th>
              <th className="px-3 py-2.5 text-right w-28">
                <SortHead label="分享大小" col="size" />
              </th>
              <th className="w-10 px-2 py-2.5" aria-label="操作" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => {
              const valid = item.isValid && item.healthScore >= 60;
              return (
                <tr
                  key={item.id}
                  className="border-b border-slate-800/60 hover:bg-emerald-950/15 transition-colors group"
                >
                  <td className="px-3 py-3 align-middle">
                    <ProviderBadge item={item} />
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(item)}
                      className="text-left font-semibold text-amber-400/95 hover:text-amber-300 line-clamp-2 leading-snug"
                      title={item.title}
                    >
                      {item.title}
                    </button>
                  </td>
                  <td className="px-3 py-3 align-middle text-center">
                    {valid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" aria-label="有效" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-slate-600 mx-auto" aria-label="未验证" />
                    )}
                  </td>
                  <td className="px-3 py-3 align-middle text-right tabular-nums text-slate-300">
                    {item.totalFiles > 0
                      ? `${item.metaPartial ? '≥' : ''}${item.totalFiles}`
                      : '—'}
                  </td>
                  <td className="px-3 py-3 align-middle text-right tabular-nums text-slate-300 font-medium">
                    {item.sizeFormatted && item.sizeFormatted !== '—'
                      ? `${item.metaPartial ? '约 ' : ''}${item.sizeFormatted}`
                      : '—'}
                  </td>
                  <td className="px-2 py-3 align-middle relative">
                    <button
                      type="button"
                      onClick={() => setMenuId(menuId === item.id ? null : item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-200 hover:bg-emerald-950/40 opacity-70 group-hover:opacity-100"
                      aria-label="更多操作"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {menuId === item.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-2 top-full z-20 mt-1 w-36 rounded-xl border border-slate-700 bg-slate-900 shadow-xl py-1 text-[11px]"
                      >
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-slate-200"
                          onClick={() => copyItem(item)}
                        >
                          <Copy className="w-3.5 h-3.5" /> 复制链接
                        </button>
                        <a
                          href={item.shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-slate-200"
                          onClick={() => setMenuId(null)}
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> 打开网盘
                        </a>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-slate-200"
                          onClick={() => {
                            onToggleFavorite(item);
                            setMenuId(null);
                          }}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${isFavorited(item.id) ? 'fill-amber-400 text-amber-400' : ''}`}
                          />
                          {isFavorited(item.id) ? '取消收藏' : '收藏'}
                        </button>
                        <button
                          type="button"
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-800 text-slate-200"
                          onClick={() => {
                            onOpenDetail(item);
                            setMenuId(null);
                          }}
                        >
                          <Info className="w-3.5 h-3.5" /> 详情
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sortBy === 'relevance' && (
        <p className="px-4 py-2 text-[10px] text-slate-600 border-t border-emerald-900/20">
          点击表头可排序；综合排序仍按匹配度从 API 拉取，表内排序仅当前页。
        </p>
      )}
    </div>
  );
};
