/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, ShieldAlert, Zap, HelpCircle, FileCheck, Keyboard } from 'lucide-react';

export const UsageGuide: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          云览使用指南与高级检索技巧
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          掌握高效搜索指令，更快找到高质量无损原盘、免解压工具与完整教程
        </p>
      </div>

      {/* Grid of guide cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Card 1: Advanced Search Syntax */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
            <Search className="w-4 h-4" />
            <span>智能搜索语法技巧</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            支持高级指令组合，直接在搜索框内输入以下语法进行精准定位：
          </p>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">流浪地球 4K HDR</span>
              <span className="text-slate-500 font-sans block text-[11px] mt-0.5">多关键词空格隔开，自动取交集</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">Python 教程 -广告</span>
              <span className="text-slate-500 font-sans block text-[11px] mt-0.5">减号代表排除包含特定干扰词的资源</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">考研数学 ext:pdf</span>
              <span className="text-slate-500 font-sans block text-[11px] mt-0.5">限制目标格式只看 PDF 文档或 MKV 视频</span>
            </div>
          </div>
        </div>

        {/* Card 2: Keyboard shortcuts */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
            <Keyboard className="w-4 h-4" />
            <span>高效快捷键操作</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            为桌面端高频极客用户设计的零延迟键盘导航：
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">聚焦搜索框</span>
              <kbd className="px-2 py-0.5 font-mono text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                / 或 Ctrl+K
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">提交搜索 / 执行检索</span>
              <kbd className="px-2 py-0.5 font-mono text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                Enter
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">关闭详情弹窗 / 清空搜索历史</span>
              <kbd className="px-2 py-0.5 font-mono text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs">
                Esc
              </kbd>
            </div>
          </div>
        </div>

        {/* Card 3: Link Health Checking */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
            <FileCheck className="w-4 h-4" />
            <span>链接有效性自动校验</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            系统会定期对收录的公开分享链接执行轻量级心跳探针，过滤掉已被原作者取消或官方清理的失效资源。若在浏览过程中遇到失效链接，可随时点击卡片详情中的「报错失效链接」，系统将优先复核并自动剔除。
          </p>
        </div>

        {/* Card 4: Disclaimer & Compliance */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>合规声明与免责须知</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            本站仅为面向网络公开分享链接的非盈利性索引引擎，本身不存储、不上传、不断点续传任何实际文件内容。所有展示结果均直接跳转至各第三方云盘官网。如发现任何侵犯您合法权益的链接，欢迎联系处理。
          </p>
        </div>

      </div>
    </div>
  );
};
