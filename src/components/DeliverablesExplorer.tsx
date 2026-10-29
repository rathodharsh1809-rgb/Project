import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Code2,
  FileText,
  Layers,
  ShieldCheck,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import { DomainConfig, PortalRecord } from '../data/domains';
import { generateStandaloneHtml } from '../data/singleFileGenerator';

export type ActiveTabId = 'prototype' | 'step1' | 'step2' | 'step3' | 'step4-5';

interface DeliverablesExplorerProps {
  activeTab: Exclude<ActiveTabId, 'prototype'>;
  domain: DomainConfig;
  records: PortalRecord[];
  onDownloadHtml: () => void;
  onSwitchToPrototype: () => void;
}

export const DeliverablesExplorer: React.FC<DeliverablesExplorerProps> = ({
  activeTab,
  domain,
  records,
  onDownloadHtml,
  onSwitchToPrototype,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (activeTab === 'step1') {
    const { step1 } = domain;
    const step1Markdown = `# Step 1: Problem Definition & Requirements Planning (${domain.name})
Role: Senior Product Manager

## 1. Problem Statement & Core Objective
- **Problem Statement:** ${step1.problemStatement}
- **Core Objective:** ${step1.coreObjective}
- **Quantifiable Target:** ${step1.quantifiableTarget}

## 2. Target End-Users
${step1.targetUsers
  .map(
    (u) =>
      `- **${u.role}** (${u.segment}): ${u.needs} | *Primary Action:* ${u.primaryAction}`
  )
  .join('\n')}

## 3. Essential Functional Requirements (Must-Have Features)
${step1.functionalRequirements
  .map(
    (fr) =>
      `- **${fr.id}: ${fr.title}** (${fr.priority})\n  - Specification: ${fr.specification}\n  - Acceptance Criteria: ${fr.acceptanceCriteria}`
  )
  .join('\n')}

## 4. End-to-End User Flow
${step1.userFlow
  .map(
    (uf) =>
      `${uf.stepNumber}. **${uf.stage}** (${uf.actor}): ${uf.action} -> *System Response:* ${uf.systemResponse}`
  )
  .join('\n')}`;

    return (
      <div className="space-y-8">
        {/* Section Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Step 01 Deliverable</span>
              <span aria-hidden="true">·</span>
              <span>Persona: Senior Product Manager</span>
              <span aria-hidden="true">·</span>
              <span>Domain: {domain.name}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Problem Definition & Functional Requirements Specification
            </h2>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy('step1', step1Markdown)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedKey === 'step1' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied PRD Markdown</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy PRD Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 1. Problem Statement & Core Objective */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <p className="text-xs font-semibold text-slate-500">01. Problem Statement</p>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Operational Bottleneck & User Friction
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {step1.problemStatement}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <p className="text-xs font-semibold text-blue-700">02. Core Objective & Success Target</p>
            <h3 className="font-display text-lg font-bold text-slate-900">
              Single-Page Interactive Resolution System
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {step1.coreObjective}
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-700">
              <span className="font-semibold">Target KPI Benchmark: </span>
              <span>{step1.quantifiableTarget}</span>
            </div>
          </div>
        </div>

        {/* 2. Target End-Users */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">03. Target End-Users</p>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
              Primary & Secondary User Personas
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {step1.targetUsers.map((user, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 space-y-2"
              >
                <div className="text-xs text-slate-500">
                  <span className="font-mono font-semibold text-slate-800">0{idx + 1}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{user.segment}</span>
                </div>
                <h4 className="font-display text-sm font-bold text-slate-900">
                  {user.role}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">{user.needs}</p>
                <p className="text-xs text-slate-800 pt-1">
                  <span className="font-semibold">Key Workflow: </span>
                  {user.primaryAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Essential Functional Requirements (Must-Have Features) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              04. Essential Functional Requirements
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
              5 Core Must-Have Capabilities & Acceptance Criteria
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                  <th className="py-3 pr-4 whitespace-nowrap">Req ID</th>
                  <th className="py-3 px-4">Feature & Functional Specification</th>
                  <th className="py-3 pl-4">Testable Acceptance Criteria</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {step1.functionalRequirements.map((fr) => (
                  <tr key={fr.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 pr-4 align-top whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-slate-900">
                        {fr.id}
                      </span>
                      <div className="text-xs text-blue-700 mt-0.5">{fr.priority}</div>
                    </td>
                    <td className="py-3.5 px-4 align-top">
                      <p className="font-display font-bold text-slate-900 text-sm">
                        {fr.title}
                      </p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {fr.specification}
                      </p>
                    </td>
                    <td className="py-3.5 pl-4 align-top text-xs text-slate-600 leading-relaxed">
                      {fr.acceptanceCriteria}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. End-to-End User Flow */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">05. User Flow Architecture</p>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
              Step-by-Step Journey from Portal Arrival to Resolution
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {step1.userFlow.map((flow) => (
              <div
                key={flow.stepNumber}
                className="border border-slate-200 rounded-lg p-4 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-bold text-blue-700">
                      STEP {flow.stepNumber}
                    </span>
                    <span>{flow.actor}</span>
                  </div>
                  <h4 className="font-display text-sm font-bold text-slate-900">
                    {flow.stage}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    <strong className="text-slate-800">User Action:</strong> {flow.action}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">System Response:</strong>{' '}
                  {flow.systemResponse}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'step2') {
    const { step2 } = domain;

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Step 02 Deliverable</span>
              <span aria-hidden="true">·</span>
              <span>Persona: Lead UI/UX Designer</span>
              <span aria-hidden="true">·</span>
              <span>Domain: {domain.name}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Interface Architecture, Wireframe Blueprint & Design System
            </h2>
          </div>

          <button
            type="button"
            onClick={onSwitchToPrototype}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Inspect Live Rendered Layout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Structural Wireframe Blueprint */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              01. Interactive Structural Wireframe Concept
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
              Single-Page 12-Column Responsive Grid Schematic
            </h3>
          </div>

          {/* Schematic Blueprint Container */}
          <div className="bg-slate-50 border border-slate-300 border-dashed rounded-xl p-5 space-y-4 font-mono text-xs">
            {/* Zone A: Top Header Wireframe */}
            <div className="bg-white border border-slate-300 rounded-lg p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-blue-700">[ZONE-A]</span>
                <span className="text-slate-800 font-semibold">
                  Top Bar (1-Row 3-Zone Contract: Brand Wordmark — Nav Links — Primary CTA)
                </span>
              </div>
              <span className="text-slate-500">100% width · h-16</span>
            </div>

            {/* Zone B: 4-Col KPI Row Wireframe */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {['Total Count', 'Pending Triage', 'In Progress', 'Resolved'].map(
                (metric, idx) => (
                  <div
                    key={metric}
                    className="bg-white border border-slate-300 rounded-lg p-3 space-y-1"
                  >
                    <div className="text-slate-400">
                      [ZONE-B.{idx + 1}] KPI Card
                    </div>
                    <div className="text-slate-800 font-semibold">{metric}</div>
                    <div className="text-lg font-bold text-slate-900 tabular-nums">
                      0{idx + 1}
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Zone C & Zone D Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4 bg-white border border-slate-300 rounded-lg p-4 space-y-2.5">
                <div className="text-blue-700 font-bold">
                  [ZONE-C] Left Column (4/12 Cols)
                </div>
                <div className="text-slate-900 font-semibold">
                  {domain.formTitle}
                </div>
                <div className="space-y-1.5 text-slate-500">
                  <div className="border border-slate-200 rounded p-2 bg-slate-50">
                    Input: {domain.titleFieldLabel} (min 8 chars)
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="border border-slate-200 rounded p-2 bg-slate-50">
                      Select: Category
                    </div>
                    <div className="border border-slate-200 rounded p-2 bg-slate-50">
                      Select: Priority
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded p-2 bg-slate-50">
                    Input: {domain.secondaryFieldLabel}
                  </div>
                  <div className="border border-slate-200 rounded p-2 bg-slate-50">
                    Input: {domain.personFieldLabel} + Contact Regex
                  </div>
                  <div className="border border-blue-600 bg-blue-50 text-blue-800 font-semibold rounded p-2 text-center">
                    CTA: {domain.primaryButtonLabel}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white border border-slate-300 rounded-lg p-4 space-y-3">
                <div className="text-blue-700 font-bold">
                  [ZONE-D] Right Column (8/12 Cols)
                </div>
                <div className="text-slate-900 font-semibold">
                  Interactive Search, Filter Bar & Dynamic Record Queue
                </div>
                <div className="border border-slate-200 rounded p-2.5 bg-slate-50 flex flex-wrap items-center justify-between gap-2 text-slate-600">
                  <span>[Search Input: ID / Title / Location / Person]</span>
                  <span>[Tabs: All | Pending | In Progress | Resolved]</span>
                </div>
                <div className="space-y-2">
                  {[1, 2].map((row) => (
                    <div
                      key={row}
                      className="border border-slate-200 rounded p-3 flex items-center justify-between bg-slate-50/50"
                    >
                      <div className="space-y-1">
                        <div className="text-slate-500">
                          ID-0{row} · Category · Priority · Date
                        </div>
                        <div className="text-slate-800 font-semibold">
                          Dynamic Record Summary Headline #{row}
                        </div>
                      </div>
                      <div className="border border-slate-300 bg-white px-2.5 py-1 rounded text-slate-800">
                        [Status Toggle ↻]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Component Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {step2.componentBreakdown.map((comp) => (
              <div
                key={comp.zoneId}
                className="border border-slate-200 rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono font-bold text-blue-700">
                    {comp.zoneId}
                  </span>
                  <span className="font-mono">{comp.layoutGrid}</span>
                </div>
                <h4 className="font-display text-sm font-bold text-slate-900">
                  {comp.componentName}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {comp.purpose}
                </p>
                <div className="pt-1 text-xs text-slate-500">
                  {comp.elements.join(' · ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Color Scheme & Typography Specification */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Color Scheme */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                02. 60-30-10 Color & Contrast System
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                Domain Palette & WCAG Contrast Verification
              </h3>
            </div>

            <div className="space-y-3">
              {step2.colorScheme.map((c, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-3.5 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-slate-900">
                        {c.token}
                      </span>
                      <span aria-hidden="true" className="text-slate-300">
                        ·
                      </span>
                      <span className="font-mono text-xs text-slate-600">
                        {c.hex}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{c.usage}</p>
                  </div>
                  <span className="font-mono text-xs text-emerald-700 shrink-0">
                    {c.contrastRatio}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography System */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                03. Typographic Hierarchy (2+1 Font Rule)
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                Font Pairings & Tabular Numeral Discipline
              </h3>
            </div>

            <div className="space-y-3">
              {step2.typography.map((t, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-blue-700">{t.role}</span>
                    <span className="font-mono text-slate-500">
                      {t.weightAndSize}
                    </span>
                  </div>
                  <p className="font-display text-sm font-bold text-slate-900">
                    {t.family}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {t.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step-by-Step UI Layout Walkthrough */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              04. Step-by-Step Single-Page UI Layout Sequence
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
              Progressive Visual Hierarchy from Top Bar to Row Actions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {step2.layoutSteps.map((ls) => (
              <div
                key={ls.step}
                className="border border-slate-200 rounded-lg p-4 space-y-1.5"
              >
                <span className="font-mono text-xs font-bold text-blue-700">
                  {ls.step}
                </span>
                <h4 className="font-display text-sm font-bold text-slate-900">
                  {ls.section}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ls.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'step3') {
    const fullSingleFileCode = generateStandaloneHtml(domain, records);

    return (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Step 03 Deliverable</span>
              <span aria-hidden="true">·</span>
              <span>Persona: Expert Full-Stack Developer</span>
              <span aria-hidden="true">·</span>
              <span>Single-File HTML5 + Tailwind CDN + Vanilla JS</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Complete Self-Contained index.html Prototype Code
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Save this code block directly as <code className="font-mono text-slate-800">index.html</code> and open it in any browser—includes your current {records.length} pre-populated {domain.recordNounPlural.toLowerCase()}, dynamic DOM updates, search/status filters, and QA validation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleCopy('step3-html', fullSingleFileCode)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {copiedKey === 'step3-html' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied Full HTML</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Full HTML</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onDownloadHtml}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download index.html</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>index.html — {domain.portalTitle}</span>
            <span>{fullSingleFileCode.split('\n').length} lines · Zero build dependencies</span>
          </div>
          <pre className="p-5 text-xs font-mono text-slate-100 overflow-x-auto max-h-[640px] leading-relaxed">
            <code>{fullSingleFileCode}</code>
          </pre>
        </div>
      </div>
    );
  }

  // Step 4 & Step 5 View
  const { step4, step5 } = domain;

  return (
    <div className="space-y-10">
      {/* STEP 4 SECTION */}
      <section className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Step 04 Deliverable</span>
              <span aria-hidden="true">·</span>
              <span>Persona: QA & Frontend Engineer</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Testing, Refinement & Functional Enhancement Patch
            </h2>
          </div>

          <button
            type="button"
            onClick={() =>
              handleCopy(
                'step4-patch',
                `${step4.updatedJsSnippet}\n\n${step4.updatedCssSnippet}`
              )
            }
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedKey === 'step4-patch' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied QA Patch</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy JS & CSS Patch</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Identified QA Enhancements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {step4.identifiedIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="text-xs text-slate-500">
                  <span className="font-mono font-bold text-blue-700">{issue.id}</span>
                  <span aria-hidden="true"> · </span>
                  <span>Verified Fix</span>
                </div>
                <h3 className="font-display text-sm font-bold text-slate-900">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Initial Limitation: </strong>
                  {issue.defectDescription}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Engineering Fix: </strong>
                  {issue.qaResolution}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-xs font-medium text-emerald-700">
                Outcome: {issue.impactMetric}
              </div>
            </div>
          ))}
        </div>

        {/* Updated JS & CSS Code Blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
              Updated JavaScript Functions (Validation, Status State Machine & Search Filter)
            </div>
            <pre className="p-4 text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
              <code>{step4.updatedJsSnippet}</code>
            </pre>
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs font-mono text-slate-400">
              CSS Refinements & Micro-Interaction Rules
            </div>
            <pre className="p-4 text-xs font-mono text-slate-100 overflow-x-auto leading-relaxed">
              <code>{step4.updatedCssSnippet}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* STEP 5 SECTION */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Step 05 Deliverable</span>
              <span aria-hidden="true">·</span>
              <span>Persona: Computer Science Professor</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900">
              Technical Explanation, Prompt Engineering Synthesis & Architectural Review
            </h2>
          </div>
        </div>

        {/* 1. Prompt Engineering Summary Across Phases */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              01. Prompt Engineering Methodology Across SDLC Phases
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
              How Role-Based Context Chaining Guided Planning, UX, and Code Generation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {step5.promptEngineeringSummary.map((item, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-lg p-4 space-y-2"
              >
                <div className="text-xs text-slate-500">
                  <span className="font-semibold text-blue-700">{item.phase}</span>
                  <span aria-hidden="true"> · </span>
                  <span>Persona: {item.personaUsed}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Prompt Technique: </strong>
                  {item.promptStrategy}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">Engineering Outcome: </strong>
                  {item.engineeringOutcome}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Key Technical Features & 3. AI Acceleration Table */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Technical Features */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                02. Key Technical Features
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                Core Frontend Mechanisms
              </h3>
            </div>

            <div className="space-y-3">
              {step5.technicalFeatures.map((tf, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-3.5 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-display font-bold text-slate-900">
                      {tf.feature}
                    </span>
                    <span className="font-mono text-blue-700">{tf.complexity}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tf.implementationMechanism}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quantitative Acceleration Comparison */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500">
                03. Prototyping Velocity Analysis
              </p>
              <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
                AI-Assisted Prompt Workflow vs. Traditional Manual Prototyping
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500">
                    <th className="py-2.5 pr-3">SDLC Phase</th>
                    <th className="py-2.5 px-3 text-right">Traditional</th>
                    <th className="py-2.5 px-3 text-right">Prompt-Guided</th>
                    <th className="py-2.5 pl-3 text-right">Efficiency Gain</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {step5.accelerationComparison.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-3 pr-3">
                        <p className="font-semibold text-slate-900">{row.sdlcPhase}</p>
                        <p className="text-slate-500 mt-0.5">{row.notes}</p>
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600 whitespace-nowrap align-top">
                        {row.traditionalEffort}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-blue-700 font-semibold whitespace-nowrap align-top">
                        {row.aiAssistedEffort}
                      </td>
                      <td className="py-3 pl-3 text-right font-mono tabular-nums text-emerald-700 font-bold whitespace-nowrap align-top">
                        {row.timeSavedPercent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Architectural Integrity & Implementation Efficiency Evaluation */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-500">
              04. Professor’s Architectural Integrity & Efficiency Evaluation
            </p>
            <h3 className="font-display text-lg font-bold text-slate-900 mt-0.5">
              State Management, DOM Reconciliation & Production Readiness
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="space-y-3">
              <div>
                <h4 className="font-display text-sm font-bold text-slate-900 mb-1">
                  Separation of Concerns & Maintainability
                </h4>
                <p>{step5.architecturalEvaluation.maintainabilityAnalysis}</p>
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-slate-900 mb-1">
                  Deterministic State Consistency
                </h4>
                <p>{step5.architecturalEvaluation.stateManagementIntegrity}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/70 space-y-2">
              <h4 className="font-display text-sm font-bold text-slate-900">
                Production Evolution Roadmap
              </h4>
              <ul className="list-disc list-inside space-y-1.5 text-slate-700">
                {step5.architecturalEvaluation.scalabilityRecommendations.map(
                  (rec, i) => (
                    <li key={i}>{rec}</li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
