import { DomainConfig, PortalRecord } from './domains';

export function generateStandaloneHtml(domain: DomainConfig, currentRecords: PortalRecord[]): string {
  const serializedRecords = JSON.stringify(currentRecords, null, 2);
  const serializedCategories = JSON.stringify(domain.categories);
  const idPrefix = domain.id === 'smart-city' ? 'CMP' : 'APT';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${domain.portalTitle}</title>
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Plus Jakarta Sans, Public Sans, JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Public Sans', system-ui, -apple-system, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
    }
    h1, h2, h3, .font-display {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    }
    .font-mono, .tabular-nums {
      font-family: 'JetBrains Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
    .status-toggle-btn {
      transition: transform 120ms cubic-bezier(0.16, 1, 0.3, 1), background-color 150ms ease;
    }
    .status-toggle-btn:active {
      transform: scale(0.97);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col">
  <!-- Top Institutional Header -->
  <header class="bg-white border-b border-slate-200 px-6 py-4">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-8">
      <a href="#" class="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
        ${domain.portalTitle}
      </a>
      <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="#kpi-section" class="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Overview</a>
        <a href="#intake-form" class="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">New ${domain.recordNounSingular}</a>
        <a href="#queue-section" class="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">Live Queue</a>
      </nav>
      <button id="resetDataBtn" type="button" class="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0">
        Reset Sample Data
      </button>
    </div>
  </header>

  <!-- Main Workspace Container -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
    <!-- Hero Context Banner -->
    <section class="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
      <div>
        <p class="text-xs font-medium text-blue-700 mb-1">${domain.name}</p>
        <h1 class="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">${domain.portalTitle}</h1>
        <p class="text-sm text-slate-600 mt-1">${domain.portalSubtitle}</p>
      </div>
      <div class="text-xs text-slate-500 font-mono">
        Click any status button to cycle: Pending → In Progress → Resolved
      </div>
    </section>

    <!-- 4-Column Operational KPI Strip -->
    <section id="kpi-section" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs font-medium text-slate-500">Total ${domain.recordNounPlural}</p>
        <p id="kpiTotal" class="text-3xl font-bold text-slate-900 tabular-nums mt-2">0</p>
        <p class="text-xs text-slate-500 mt-1">Active in local registry</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs font-medium text-amber-700">Pending Triage</p>
        <p id="kpiPending" class="text-3xl font-bold text-amber-700 tabular-nums mt-2">0</p>
        <p class="text-xs text-slate-500 mt-1">Awaiting initial action</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs font-medium text-blue-700">In Progress</p>
        <p id="kpiInProgress" class="text-3xl font-bold text-blue-700 tabular-nums mt-2">0</p>
        <p class="text-xs text-slate-500 mt-1">Currently assigned</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-xs font-medium text-emerald-700">Resolved & Completed</p>
        <p id="kpiResolved" class="text-3xl font-bold text-emerald-700 tabular-nums mt-2">0</p>
        <p class="text-xs text-slate-500 mt-1">Verified closed</p>
      </div>
    </section>

    <!-- 12-Column Split Workspace: 4 Cols Intake Form / 8 Cols Interactive Queue -->
    <section class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <!-- Left Column: Interactive Form with QA Validation -->
      <div id="intake-form" class="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6">
        <h2 class="font-display text-lg font-bold text-slate-900">${domain.formTitle}</h2>
        <p class="text-xs text-slate-500 mt-1 mb-5">${domain.formDescription}</p>

        <!-- Validation Error Alert Box -->
        <div id="formErrorBox" class="hidden mb-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 space-y-1" role="alert"></div>
        <!-- Submission Success Alert Box -->
        <div id="formSuccessBox" class="hidden mb-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800" role="status"></div>

        <form id="recordForm" class="space-y-4" novalidate>
          <div>
            <label for="titleInput" class="block text-xs font-semibold text-slate-700 mb-1">${domain.titleFieldLabel} *</label>
            <input id="titleInput" type="text" required placeholder="${domain.titleFieldPlaceholder}"
              class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="categoryInput" class="block text-xs font-semibold text-slate-700 mb-1">${domain.categoryFieldLabel}</label>
              <select id="categoryInput" class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"></select>
            </div>
            <div>
              <label for="priorityInput" class="block text-xs font-semibold text-slate-700 mb-1">Priority Level</label>
              <select id="priorityInput" class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="Standard">Standard</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label for="secondaryInput" class="block text-xs font-semibold text-slate-700 mb-1">${domain.secondaryFieldLabel} *</label>
            <input id="secondaryInput" type="text" required placeholder="${domain.secondaryFieldPlaceholder}"
              class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label for="personInput" class="block text-xs font-semibold text-slate-700 mb-1">${domain.personFieldLabel} *</label>
              <input id="personInput" type="text" required placeholder="${domain.personFieldPlaceholder}"
                class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label for="dateInput" class="block text-xs font-semibold text-slate-700 mb-1">${domain.dateFieldLabel}</label>
              <input id="dateInput" type="date" required
                class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono" />
            </div>
          </div>

          <div>
            <label for="contactInput" class="block text-xs font-semibold text-slate-700 mb-1">${domain.contactFieldLabel} *</label>
            <input id="contactInput" type="text" required placeholder="${domain.contactFieldPlaceholder}"
              class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600" />
          </div>

          <div>
            <label for="notesInput" class="block text-xs font-semibold text-slate-700 mb-1">${domain.notesFieldLabel}</label>
            <textarea id="notesInput" rows="3" placeholder="${domain.notesFieldPlaceholder}"
              class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
          </div>

          <button type="submit" class="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer">
            ${domain.primaryButtonLabel}
          </button>
        </form>
      </div>

      <!-- Right Column: Filter Controls & Dynamic List -->
      <div id="queue-section" class="lg:col-span-8 space-y-4">
        <!-- Search & Filter Bar -->
        <div class="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1">
              <label for="searchInput" class="sr-only">Search records</label>
              <input id="searchInput" type="search" placeholder="Search by ID, title, ${domain.secondaryFieldLabel.toLowerCase()}, or ${domain.personFieldLabel.toLowerCase()}..."
                class="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div class="sm:w-56">
              <label for="categoryFilter" class="sr-only">Filter by Category</label>
              <select id="categoryFilter" class="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="All">All Categories</option>
              </select>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
            <!-- Segmented Status Filter Controls -->
            <div id="statusTabs" class="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button type="button" data-status="All" class="status-tab px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-slate-900 shadow-sm whitespace-nowrap">All</button>
              <button type="button" data-status="Pending" class="status-tab px-3 py-1.5 text-xs font-semibold rounded-md text-slate-600 hover:text-slate-900 whitespace-nowrap">Pending</button>
              <button type="button" data-status="In Progress" class="status-tab px-3 py-1.5 text-xs font-semibold rounded-md text-slate-600 hover:text-slate-900 whitespace-nowrap">In Progress</button>
              <button type="button" data-status="Resolved" class="status-tab px-3 py-1.5 text-xs font-semibold rounded-md text-slate-600 hover:text-slate-900 whitespace-nowrap">Resolved</button>
            </div>
            <p id="resultCountText" class="text-xs text-slate-500 font-mono tabular-nums"></p>
          </div>
        </div>

        <!-- Dynamic Records Container -->
        <div id="recordsList" class="space-y-3"></div>
      </div>
    </section>
  </main>

  <footer class="bg-white border-t border-slate-200 px-6 py-4 mt-12">
    <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
      <span>${domain.portalTitle} · Single-File Interactive Prototype</span>
      <span>Built with HTML5, Tailwind CSS, and Vanilla JavaScript</span>
    </div>
  </footer>

  <!-- Application State & Interactive Logic -->
  <script>
    const INITIAL_RECORDS = ${serializedRecords};
    const CATEGORIES = ${serializedCategories};
    const STATUS_ORDER = ['Pending', 'In Progress', 'Resolved'];

    let records = JSON.parse(JSON.stringify(INITIAL_RECORDS));
    let activeStatus = 'All';
    let activeCategory = 'All';
    let searchQuery = '';
    let nextSequenceNumber = 2045;

    // DOM Elements
    const categoryInput = document.getElementById('categoryInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const dateInput = document.getElementById('dateInput');
    const recordForm = document.getElementById('recordForm');
    const formErrorBox = document.getElementById('formErrorBox');
    const formSuccessBox = document.getElementById('formSuccessBox');
    const searchInput = document.getElementById('searchInput');
    const statusTabs = document.querySelectorAll('.status-tab');
    const recordsList = document.getElementById('recordsList');
    const resultCountText = document.getElementById('resultCountText');
    const resetDataBtn = document.getElementById('resetDataBtn');

    // Initialize Select Options & Default Date
    function initControls() {
      CATEGORIES.forEach((cat) => {
        const opt1 = document.createElement('option');
        opt1.value = cat;
        opt1.textContent = cat;
        categoryInput.appendChild(opt1);

        const opt2 = document.createElement('option');
        opt2.value = cat;
        opt2.textContent = cat;
        categoryFilter.appendChild(opt2);
      });
      dateInput.value = new Date().toISOString().split('T')[0];
    }

    // QA Enhancement: Form Validation
    function validatePayload(payload) {
      const errors = [];
      if (!payload.title || payload.title.trim().length < 8) {
        errors.push('${domain.titleFieldLabel} must be at least 8 characters long.');
      }
      if (!payload.secondaryField || payload.secondaryField.trim().length < 3) {
        errors.push('Please enter a valid ${domain.secondaryFieldLabel}.');
      }
      if (!payload.personName || payload.personName.trim().length < 2) {
        errors.push('Please enter a valid ${domain.personFieldLabel}.');
      }
      const contactRegex = /^([^\\s@]+@[^\\s@]+\\.[^\\s@]+|[+()\\-\\d\\s]{7,20})$/;
      if (!contactRegex.test(payload.contactInfo.trim())) {
        errors.push('Enter a valid email address or 7+ digit phone number.');
      }
      return errors;
    }

    // Escape HTML to prevent XSS on user input
    function escapeHtml(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    // Cycle Status: Pending -> In Progress -> Resolved
    window.cycleRecordStatus = function(id) {
      records = records.map((item) => {
        if (item.id !== id) return item;
        const nextIndex = (STATUS_ORDER.indexOf(item.status) + 1) % STATUS_ORDER.length;
        return { ...item, status: STATUS_ORDER[nextIndex] };
      });
      renderDashboard();
    };

    // Delete Record
    window.deleteRecord = function(id) {
      records = records.filter((item) => item.id !== id);
      renderDashboard();
    };

    // Filter Records
    function getFilteredRecords() {
      const q = searchQuery.trim().toLowerCase();
      return records.filter((item) => {
        const matchesStatus = activeStatus === 'All' || item.status === activeStatus;
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch =
          !q ||
          item.id.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          item.secondaryField.toLowerCase().includes(q) ||
          item.personName.toLowerCase().includes(q) ||
          item.notes.toLowerCase().includes(q);
        return matchesStatus && matchesCategory && matchesSearch;
      });
    }

    // Render KPIs and Filtered List
    function renderDashboard() {
      const total = records.length;
      const pending = records.filter((r) => r.status === 'Pending').length;
      const inProgress = records.filter((r) => r.status === 'In Progress').length;
      const resolved = records.filter((r) => r.status === 'Resolved').length;

      document.getElementById('kpiTotal').textContent = total;
      document.getElementById('kpiPending').textContent = pending;
      document.getElementById('kpiInProgress').textContent = inProgress;
      document.getElementById('kpiResolved').textContent = resolved;

      const filtered = getFilteredRecords();
      resultCountText.textContent = \`Showing \${filtered.length} of \${total}\`;

      if (filtered.length === 0) {
        recordsList.innerHTML = \`
          <div class="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <p class="text-sm font-semibold text-slate-800">No matching ${domain.recordNounPlural.toLowerCase()} found</p>
            <p class="text-xs text-slate-500 mt-1">Try clearing your search query or switching the active status filter.</p>
          </div>
        \`;
        return;
      }

      recordsList.innerHTML = filtered
        .map((item) => {
          const statusBtnStyle =
            item.status === 'Resolved'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
              : item.status === 'In Progress'
              ? 'bg-blue-50 text-blue-800 border-blue-300 hover:bg-blue-100'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100';

          const priorityTextStyle =
            item.priority === 'Urgent'
              ? 'text-red-700 font-semibold'
              : item.priority === 'High'
              ? 'text-amber-700 font-semibold'
              : 'text-slate-600';

          return \`
            <article class="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
              <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div class="space-y-1.5 flex-1">
                  <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span class="font-mono font-semibold text-slate-800">\${escapeHtml(item.id)}</span>
                    <span aria-hidden="true">·</span>
                    <span>\${escapeHtml(item.category)}</span>
                    <span aria-hidden="true">·</span>
                    <span class="\${priorityTextStyle}">\${escapeHtml(item.priority)} Priority</span>
                    <span aria-hidden="true">·</span>
                    <span class="font-mono">\${escapeHtml(item.dateStr)}</span>
                  </div>
                  <h3 class="font-display text-base font-bold text-slate-900">\${escapeHtml(item.title)}</h3>
                  <p class="text-xs text-slate-600 leading-relaxed">\${escapeHtml(item.notes || 'No additional notes provided.')}</p>
                  <div class="pt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span class="font-medium text-slate-700">\${escapeHtml(item.secondaryField)}</span>
                    <span aria-hidden="true">·</span>
                    <span>\${escapeHtml(item.personName)}</span>
                    <span aria-hidden="true">·</span>
                    <span class="font-mono">\${escapeHtml(item.contactInfo)}</span>
                  </div>
                </div>
                <div class="flex sm:flex-col items-end justify-between gap-2 shrink-0">
                  <button type="button" onclick="cycleRecordStatus('\${escapeHtml(item.id)}')"
                    title="Click to advance status"
                    class="status-toggle-btn px-3 py-1.5 text-xs font-semibold border rounded-lg cursor-pointer whitespace-nowrap \${statusBtnStyle}">
                    Status: \${escapeHtml(item.status)} ↻
                  </button>
                  <button type="button" onclick="deleteRecord('\${escapeHtml(item.id)}')"
                    class="text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer">
                    Remove
                  </button>
                </div>
              </div>
            </article>
          \`;
        })
        .join('');
    }

    // Event Listeners
    recordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formErrorBox.classList.add('hidden');
      formSuccessBox.classList.add('hidden');

      const payload = {
        title: document.getElementById('titleInput').value,
        category: categoryInput.value,
        priority: document.getElementById('priorityInput').value,
        secondaryField: document.getElementById('secondaryInput').value,
        personName: document.getElementById('personInput').value,
        dateStr: dateInput.value || new Date().toISOString().split('T')[0],
        contactInfo: document.getElementById('contactInput').value,
        notes: document.getElementById('notesInput').value,
      };

      const errors = validatePayload(payload);
      if (errors.length > 0) {
        formErrorBox.innerHTML = errors.map((err) => \`<p>• \${escapeHtml(err)}</p>\`).join('');
        formErrorBox.classList.remove('hidden');
        return;
      }

      const newRecord = {
        id: \`${idPrefix}-\${nextSequenceNumber++}\`,
        ...payload,
        status: 'Pending',
      };

      records.unshift(newRecord);
      recordForm.reset();
      dateInput.value = new Date().toISOString().split('T')[0];

      formSuccessBox.textContent = \`Successfully logged \${newRecord.id} ("\${newRecord.title}").\`;
      formSuccessBox.classList.remove('hidden');
      renderDashboard();
    });

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderDashboard();
    });

    categoryFilter.addEventListener('change', (e) => {
      activeCategory = e.target.value;
      renderDashboard();
    });

    statusTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        activeStatus = tab.getAttribute('data-status');
        statusTabs.forEach((t) => {
          t.className = 'status-tab px-3 py-1.5 text-xs font-semibold rounded-md text-slate-600 hover:text-slate-900 whitespace-nowrap';
        });
        tab.className = 'status-tab px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-slate-900 shadow-sm whitespace-nowrap';
        renderDashboard();
      });
    });

    resetDataBtn.addEventListener('click', () => {
      records = JSON.parse(JSON.stringify(INITIAL_RECORDS));
      searchQuery = '';
      activeStatus = 'All';
      activeCategory = 'All';
      searchInput.value = '';
      categoryFilter.value = 'All';
      renderDashboard();
    });

    // Boot Application
    initControls();
    renderDashboard();
  </script>
</body>
</html>`;
}
