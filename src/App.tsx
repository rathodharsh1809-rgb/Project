/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import {
  DOMAINS,
  DomainId,
  PortalRecord,
  RecordStatus,
} from './data/domains';
import { generateStandaloneHtml } from './data/singleFileGenerator';
import { LivePrototypeView } from './components/LivePrototypeView';
import {
  ActiveTabId,
  DeliverablesExplorer,
} from './components/DeliverablesExplorer';

const STATUS_SEQUENCE: RecordStatus[] = ['Pending', 'In Progress', 'Resolved'];

export default function App() {
  const [activeDomainId, setActiveDomainId] = useState<DomainId>('smart-city');
  const [activeTab, setActiveTab] = useState<ActiveTabId>('prototype');

  // Maintain independent live records state for both domains so user edits persist while switching
  const [recordsByDomain, setRecordsByDomain] = useState<
    Record<DomainId, PortalRecord[]>
  >({
    'smart-city': [...DOMAINS['smart-city'].initialRecords],
    healthcare: [...DOMAINS['healthcare'].initialRecords],
  });

  const [seqCounter, setSeqCounter] = useState<Record<DomainId, number>>({
    'smart-city': 2045,
    healthcare: 8814,
  });

  const currentDomain = DOMAINS[activeDomainId];
  const currentRecords = recordsByDomain[activeDomainId];

  // Add a new record
  const handleAddRecord = (
    payload: Omit<PortalRecord, 'id' | 'status'>
  ): PortalRecord => {
    const prefix = activeDomainId === 'smart-city' ? 'CMP' : 'APT';
    const nextNum = seqCounter[activeDomainId];
    const newRecord: PortalRecord = {
      id: `${prefix}-${nextNum}`,
      ...payload,
      status: 'Pending',
    };

    setSeqCounter((prev) => ({
      ...prev,
      [activeDomainId]: prev[activeDomainId] + 1,
    }));

    setRecordsByDomain((prev) => ({
      ...prev,
      [activeDomainId]: [newRecord, ...prev[activeDomainId]],
    }));

    return newRecord;
  };

  // Cycle record status: Pending -> In Progress -> Resolved
  const handleCycleStatus = (id: string) => {
    setRecordsByDomain((prev) => ({
      ...prev,
      [activeDomainId]: prev[activeDomainId].map((item) => {
        if (item.id !== id) return item;
        const nextIdx =
          (STATUS_SEQUENCE.indexOf(item.status) + 1) % STATUS_SEQUENCE.length;
        return { ...item, status: STATUS_SEQUENCE[nextIdx] };
      }),
    }));
  };

  // Delete record
  const handleDeleteRecord = (id: string) => {
    setRecordsByDomain((prev) => ({
      ...prev,
      [activeDomainId]: prev[activeDomainId].filter((item) => item.id !== id),
    }));
  };

  // Reset domain sample data
  const handleResetRecords = () => {
    setRecordsByDomain((prev) => ({
      ...prev,
      [activeDomainId]: [...DOMAINS[activeDomainId].initialRecords],
    }));
  };

  // Download standalone single-file index.html (Step 3 & Step 4 deliverable)
  const handleDownloadStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtml(currentDomain, currentRecords);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `index-${activeDomainId}-prototype.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const navItems: Array<{ id: ActiveTabId; label: string }> = [
    { id: 'prototype', label: 'Live Prototype' },
    { id: 'step1', label: 'Product Spec' },
    { id: 'step2', label: 'UX Wireframe' },
    { id: 'step3', label: 'Single-File HTML' },
    { id: 'step4-5', label: 'QA & Evaluation' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: Zone 1 Brand Wordmark — Zone 2 Nav Links — Zone 3 Primary Action */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('prototype');
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            CivicPulse Studio
          </a>

          {/* Zone 2: 5 concise single-line text navigation links */}
          <nav
            aria-label="Primary Workspace Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {navItems.map((item) => {
              const isCurrent = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(item.id);
                  }}
                  className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                    isCurrent
                      ? 'text-blue-700 font-semibold underline underline-offset-8 decoration-2 decoration-blue-700'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export index.html</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (1440px desktop baseline / max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Workspace Hero & Domain / Step Controls */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-blue-700">
                  {currentDomain.name}
                </span>
                <span aria-hidden="true">·</span>
                <span>5-Step Prompt Engineering & SDLC Prototype</span>
                <span aria-hidden="true">·</span>
                <span>Interactive Single-Page Architecture</span>
              </div>
              <h1
                className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
                style={{ textWrap: 'balance' }}
              >
                {currentDomain.portalTitle}
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentDomain.portalSubtitle}
              </p>
            </div>

            {/* Domain Switcher Control (Smart City Portal vs. Healthcare System) */}
            <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
              <span className="text-xs font-medium text-slate-500">
                Active Domain Preset
              </span>
              <div
                className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
                role="group"
                aria-label="Select application domain"
              >
                {(['smart-city', 'healthcare'] as const).map((domId) => {
                  const dom = DOMAINS[domId];
                  const isSelected = activeDomainId === domId;
                  return (
                    <button
                      key={domId}
                      type="button"
                      onClick={() => setActiveDomainId(domId)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {dom.shortLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step / Deliverable Segmented Switcher Bar */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                {
                  id: 'prototype' as ActiveTabId,
                  stepTag: 'Live App',
                  title: 'Interactive Prototype',
                },
                {
                  id: 'step1' as ActiveTabId,
                  stepTag: 'Step 1',
                  title: 'PM Requirements & Flow',
                },
                {
                  id: 'step2' as ActiveTabId,
                  stepTag: 'Step 2',
                  title: 'UI/UX Wireframe & Tokens',
                },
                {
                  id: 'step3' as ActiveTabId,
                  stepTag: 'Step 3',
                  title: 'Single-File HTML Code',
                },
                {
                  id: 'step4-5' as ActiveTabId,
                  stepTag: 'Steps 4 & 5',
                  title: 'QA Patch & CS Report',
                },
              ].map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tab.stepTag}: {tab.title}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500">
              <span>Click any status button in the queue to toggle: </span>
              <strong className="font-mono text-slate-700">
                Pending → In Progress → Resolved
              </strong>
            </div>
          </div>
        </section>

        {/* Active View Content */}
        {activeTab === 'prototype' ? (
          <LivePrototypeView
            domain={currentDomain}
            records={currentRecords}
            onAddRecord={handleAddRecord}
            onCycleStatus={handleCycleStatus}
            onDeleteRecord={handleDeleteRecord}
            onResetRecords={handleResetRecords}
          />
        ) : (
          <DeliverablesExplorer
            activeTab={activeTab}
            domain={currentDomain}
            records={currentRecords}
            onDownloadHtml={handleDownloadStandaloneHtml}
            onSwitchToPrototype={() => setActiveTab('prototype')}
          />
        )}
      </main>

      {/* Clean Institutional Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-5 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            CivicPulse Prototype Studio · {currentDomain.portalTitle}
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('prototype')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Live Prototype
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('step3')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              View Single-File HTML
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleDownloadStandaloneHtml}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Download index.html
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
