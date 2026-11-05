/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DiskProviderId } from '../types';
import { DISK_PROVIDERS, ALL_PROVIDER_IDS } from '../constants/providers';

interface SearchRefinePanelProps {
  selectedProviders: DiskProviderId[];
  onToggleProvider: (id: DiskProviderId) => void;
  providersCount?: Record<DiskProviderId, number>;
  minSizeMb: number;
  maxSizeGb: number | null;
  minUnit: 'MB' | 'GB';
  maxUnit: 'MB' | 'GB';
  onMinSizeChange: (value: number, unit: 'MB' | 'GB') => void;
  onMaxSizeChange: (value: number | null, unit: 'MB' | 'GB') => void;
}

function ProviderMark({ id }: { id: DiskProviderId }) {
  const p = DISK_PROVIDERS[id];
  return (
    <span
      className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
      style={{ backgroundColor: p.color }}
      aria-hidden
    >
      {p.shortName.slice(0, 1)}
    </span>
  );
}

export const SearchRefinePanel: React.FC<SearchRefinePanelProps> = ({
  selectedProviders,
  onToggleProvider,
  providersCount,
  minSizeMb,
  maxSizeGb,
  minUnit,
  maxUnit,
  onMinSizeChange,
  onMaxSizeChange,
}) => {
  const minDisplay =
    minUnit === 'GB' ? (minSizeMb / 1024).toFixed(minSizeMb % 1024 === 0 ? 0 : 1) : String(minSizeMb);
  const maxDisplay =
    maxSizeGb === null
      ? '∞'
      : maxUnit === 'GB'
        ? String(maxSizeGb)
        : String(Math.round(maxSizeGb * 1024));

  return (
    <div className="rounded-2xl border border-emerald-900/35 bg-[#071418]/90 dark:bg-[#071418]/95 backdrop-blur-sm p-4 sm:p-5 space-y-4 shadow-inner shadow-emerald-950/20">
      <div>
        <p className="text-xs font-semibold text-emerald-100/90 mb-2.5">云盘</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ALL_PROVIDER_IDS.map((id) => {
            const provider = DISK_PROVIDERS[id];
            const selected = selectedProviders.includes(id);
            const count = providersCount?.[id];
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleProvider(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  selected
                    ? 'border-emerald-500/55 bg-emerald-950/40 text-emerald-50'
                    : 'border-slate-700/60 bg-slate-900/30 text-slate-400 hover:border-emerald-800/50 hover:text-slate-200'
                }`}
              >
                <ProviderMark id={id} />
                <span className="truncate">{provider.shortName}</span>
                {count !== undefined && count > 0 && (
                  <span className="ml-auto text-[10px] tabular-nums text-emerald-400/80">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-emerald-100/90 mb-2.5">大小</p>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <div className="flex items-center rounded-xl border border-slate-700/70 bg-slate-950/50 overflow-hidden">
            <input
              type="number"
              min={0}
              step={minUnit === 'GB' ? 0.1 : 1}
              value={minDisplay === '0' ? 0 : minDisplay}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (!Number.isFinite(n) || n < 0) return;
                const mb = minUnit === 'GB' ? Math.round(n * 1024) : Math.round(n);
                onMinSizeChange(mb, minUnit);
              }}
              className="w-16 sm:w-20 bg-transparent px-2 py-2 text-right focus:outline-none tabular-nums"
            />
            <select
              value={minUnit}
              onChange={(e) => onMinSizeChange(minSizeMb, e.target.value as 'MB' | 'GB')}
              className="bg-slate-900/80 border-l border-slate-700/70 px-1.5 py-2 text-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="MB">MB</option>
              <option value="GB">GB</option>
            </select>
          </div>
          <span className="text-slate-500">~</span>
          <div className="flex items-center rounded-xl border border-slate-700/70 bg-slate-950/50 overflow-hidden">
            <input
              type="text"
              inputMode="decimal"
              value={maxDisplay}
              onChange={(e) => {
                const v = e.target.value.trim();
                if (v === '∞' || v === '') {
                  onMaxSizeChange(null, maxUnit);
                  return;
                }
                const n = Number(v);
                if (!Number.isFinite(n) || n < 0) return;
                onMaxSizeChange(maxUnit === 'GB' ? n : n / 1024, maxUnit);
              }}
              className="w-16 sm:w-20 bg-transparent px-2 py-2 text-right focus:outline-none tabular-nums"
              placeholder="∞"
            />
            <select
              value={maxUnit}
              onChange={(e) =>
                onMaxSizeChange(maxSizeGb, e.target.value as 'MB' | 'GB')
              }
              className="bg-slate-900/80 border-l border-slate-700/70 px-1.5 py-2 text-slate-400 focus:outline-none cursor-pointer"
            >
              <option value="MB">MB</option>
              <option value="GB">GB</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
