import React, { useState } from 'react';
import {
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RotateCcw,
  PlusCircle,
  Sparkles,
} from 'lucide-react';
import {
  DomainConfig,
  PortalRecord,
  PriorityLevel,
  RecordStatus,
} from '../data/domains';

interface LivePrototypeViewProps {
  domain: DomainConfig;
  records: PortalRecord[];
  onAddRecord: (newRecord: Omit<PortalRecord, 'id' | 'status'>) => PortalRecord;
  onCycleStatus: (id: string) => void;
  onDeleteRecord: (id: string) => void;
  onResetRecords: () => void;
}

export const LivePrototypeView: React.FC<LivePrototypeViewProps> = ({
  domain,
  records,
  onAddRecord,
  onCycleStatus,
  onDeleteRecord,
  onResetRecords,
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(domain.categories[0]);
  const [priority, setPriority] = useState<PriorityLevel>('Standard');
  const [secondaryField, setSecondaryField] = useState('');
  const [personName, setPersonName] = useState('');
  const [dateStr, setDateStr] = useState('2026-10-29');
  const [contactInfo, setContactInfo] = useState('');
  const [notes, setNotes] = useState('');

  // Validation & feedback state (Step 4 QA Enhancement)
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  // Filter & search state (Step 3 & Step 4)
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | RecordStatus>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Sync default category when domain switches
  React.useEffect(() => {
    setCategory(domain.categories[0]);
    setCategoryFilter('All');
    setStatusFilter('All');
    setSearchQuery('');
    setValidationErrors([]);
    setLastCreatedId(null);
  }, [domain.id]);

  // Step 4 QA Form Validator
  const validateForm = (): string[] => {
    const errs: string[] = [];
    if (!title || title.trim().length < 8) {
      errs.push(`${domain.titleFieldLabel} must be at least 8 characters long.`);
    }
    if (!secondaryField || secondaryField.trim().length < 3) {
      errs.push(`Please provide a valid ${domain.secondaryFieldLabel}.`);
    }
    if (!personName || personName.trim().length < 2) {
      errs.push(`${domain.personFieldLabel} is required.`);
    }
    const contactRegex = /^([^\s@]+@[^\s@]+\.[^\s@]+|[+()\-0-9\s]{7,20})$/;
    if (!contactInfo || !contactRegex.test(contactInfo.trim())) {
      errs.push('Provide a valid email address or 7+ digit phone number.');
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLastCreatedId(null);
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    const created = onAddRecord({
      title: title.trim(),
      category,
      priority,
      secondaryField: secondaryField.trim(),
      personName: personName.trim(),
      dateStr: dateStr || '2026-10-29',
      contactInfo: contactInfo.trim(),
      notes: notes.trim(),
    });

    setLastCreatedId(created.id);
    setTitle('');
    setSecondaryField('');
    setPersonName('');
    setContactInfo('');
    setNotes('');
    setPriority('Standard');
  };

  const handlePrefillSample = () => {
    setValidationErrors([]);
    setLastCreatedId(null);
    if (domain.id === 'smart-city') {
      setTitle('Water main seepage along northbound bike lane curb');
      setCategory('Water & Drainage');
      setPriority('High');
      setSecondaryField('Ward 05 · 1140 Sycamore Ave');
      setPersonName('Jordan Vance');
      setContactInfo('j.vance@civicgrid.org');
      setDateStr('2026-10-29');
      setNotes('Steady low-pressure water flow pooling near storm grate #22. Potential overnight freeze hazard.');
    } else {
      setTitle('Acute asthma exacerbation & spirometry follow-up');
      setCategory('General Internal Medicine');
      setPriority('High');
      setSecondaryField('Dr. K. Takahashi · Pulmonary Suite 2B');
      setPersonName('Soraia Mendes');
      setContactInfo('(555) 649-2031');
      setDateStr('2026-10-29');
      setNotes('Patient reports increased rescue inhaler usage over past 48 hours. Peak flow 78% of personal best.');
    }
  };

  // Filtered records calculation
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredRecords = records.filter((item) => {
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesSearch =
      !normalizedQuery ||
      item.id.toLowerCase().includes(normalizedQuery) ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.secondaryField.toLowerCase().includes(normalizedQuery) ||
      item.personName.toLowerCase().includes(normalizedQuery) ||
      item.notes.toLowerCase().includes(normalizedQuery);
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // KPI Metrics
  const totalCount = records.length;
  const pendingCount = records.filter((r) => r.status === 'Pending').length;
  const inProgressCount = records.filter((r) => r.status === 'In Progress').length;
  const resolvedCount = records.filter((r) => r.status === 'Resolved').length;

  return (
    <div className="space-y-8">
      {/* 4-Column Operational KPI Strip */}
      <section aria-label="Operational Metrics" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">Total {domain.recordNounPlural}</p>
          <p className="text-3xl font-bold text-slate-900 font-mono tabular-nums mt-2">{totalCount}</p>
          <p className="text-xs text-slate-500 mt-1">Active in live registry</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-amber-800">Pending Triage</p>
          <p className="text-3xl font-bold text-amber-700 font-mono tabular-nums mt-2">{pendingCount}</p>
          <p className="text-xs text-slate-500 mt-1">Awaiting initial action</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-blue-800">In Progress</p>
          <p className="text-3xl font-bold text-blue-700 font-mono tabular-nums mt-2">{inProgressCount}</p>
          <p className="text-xs text-slate-500 mt-1">Assigned & active</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-emerald-800">Resolved & Verified</p>
          <p className="text-3xl font-bold text-emerald-700 font-mono tabular-nums mt-2">{resolvedCount}</p>
          <p className="text-xs text-slate-500 mt-1">
            {totalCount > 0 ? `${Math.round((resolvedCount / totalCount) * 100)}% completion rate` : '0% completion rate'}
          </p>
        </div>
      </section>

      {/* Main 12-Column Split Workspace */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (4 Cols): Interactive Intake Form with Step 4 Validation */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">{domain.formTitle}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{domain.formDescription}</p>
            </div>
            <button
              type="button"
              onClick={handlePrefillSample}
              className="px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Auto-Fill Demo
            </button>
          </div>

          {validationErrors.length > 0 && (
            <div
              role="alert"
              className="mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 space-y-1.5"
            >
              <div className="flex items-center gap-1.5 font-semibold text-red-900">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>Please resolve the following validation issues:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 pl-0.5">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {lastCreatedId && (
            <div
              role="status"
              className="mb-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Logged record <strong className="font-mono">{lastCreatedId}</strong> into live queue.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setLastCreatedId(null)}
                className="text-emerald-700 hover:text-emerald-950 font-medium underline whitespace-nowrap shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="proto-title" className="block text-xs font-semibold text-slate-700 mb-1">
                {domain.titleFieldLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="proto-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={domain.titleFieldPlaceholder}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="proto-cat" className="block text-xs font-semibold text-slate-700 mb-1">
                  {domain.categoryFieldLabel}
                </label>
                <select
                  id="proto-cat"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {domain.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="proto-prio" className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority Level
                </label>
                <select
                  id="proto-prio"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Standard">Standard</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="proto-secondary" className="block text-xs font-semibold text-slate-700 mb-1">
                {domain.secondaryFieldLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="proto-secondary"
                type="text"
                value={secondaryField}
                onChange={(e) => setSecondaryField(e.target.value)}
                placeholder={domain.secondaryFieldPlaceholder}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="proto-person" className="block text-xs font-semibold text-slate-700 mb-1">
                  {domain.personFieldLabel} <span className="text-red-600">*</span>
                </label>
                <input
                  id="proto-person"
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder={domain.personFieldPlaceholder}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label htmlFor="proto-date" className="block text-xs font-semibold text-slate-700 mb-1">
                  {domain.dateFieldLabel}
                </label>
                <input
                  id="proto-date"
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono tabular-nums"
                />
              </div>
            </div>

            <div>
              <label htmlFor="proto-contact" className="block text-xs font-semibold text-slate-700 mb-1">
                {domain.contactFieldLabel} <span className="text-red-600">*</span>
              </label>
              <input
                id="proto-contact"
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder={domain.contactFieldPlaceholder}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="proto-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                {domain.notesFieldLabel}
              </label>
              <textarea
                id="proto-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={domain.notesFieldPlaceholder}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="pt-1 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{domain.primaryButtonLabel}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (8 Cols): Search, Status Filter Tabs & Dynamic Record List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Interactive Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search by ID, summary, ${domain.secondaryFieldLabel.toLowerCase()}, or ${domain.personFieldLabel.toLowerCase()}...`}
                  aria-label="Search records"
                  className="w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="sm:w-56">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter by category"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="All">All Categories ({records.length})</option>
                  {domain.categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              {/* Interactive Segmented Status Filter Controls */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="tablist" aria-label="Filter by status">
                {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((st) => {
                  const isActive = statusFilter === st;
                  const count =
                    st === 'All'
                      ? records.length
                      : records.filter((r) => r.status === st).length;
                  return (
                    <button
                      key={st}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  Showing {filteredRecords.length} of {records.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onResetRecords();
                    setSearchQuery('');
                    setStatusFilter('All');
                    setCategoryFilter('All');
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="Restore initial sample records"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Records Queue */}
          {filteredRecords.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-800">
                No matching {domain.recordNounPlural.toLowerCase()} found
              </p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No records match your current filter combination. Clear the search query or reset filters to view all active items.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('All');
                  setCategoryFilter('All');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((item) => {
                const statusButtonClasses =
                  item.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : item.status === 'In Progress'
                    ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
                    : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';

                const priorityColor =
                  item.priority === 'Urgent'
                    ? 'text-red-700 font-semibold'
                    : item.priority === 'High'
                    ? 'text-amber-700 font-semibold'
                    : 'text-slate-600';

                return (
                  <article
                    key={item.id}
                    className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left Content: Unboxed metadata + headline + notes */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-mono font-semibold text-slate-900">{item.id}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className={priorityColor}>{item.priority} Priority</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{item.dateStr}</span>
                        </div>

                        <h3 className="font-display text-base font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          {item.notes || 'No supplemental field notes recorded.'}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{item.secondaryField}</span>
                          <span aria-hidden="true">·</span>
                          <span>{item.personName}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{item.contactInfo}</span>
                        </div>
                      </div>

                      {/* Right Controls: Step 4 Interactive Status Cycle Button & Remove */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => onCycleStatus(item.id)}
                          title="Click to cycle status: Pending → In Progress → Resolved"
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${statusButtonClasses}`}
                        >
                          <span>Status: {item.status}</span>
                          <RefreshCw className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteRecord(item.id)}
                          className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          title={`Remove ${item.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
