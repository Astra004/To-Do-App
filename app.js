/* ==============================================
   Do. — To-Do List  |  app.js
   ============================================== */

/* ─────────────── State ─────────────── */
let tasks = JSON.parse(localStorage.getItem('do-tasks') || 'null') || [
  { id: uid(), text: 'Add your first real task',     priority: 'high', done: false, ts: Date.now() - 5000 },
  { id: uid(), text: 'Drag items to reorder them',   priority: 'med',  done: false, ts: Date.now() - 4000 },
  { id: uid(), text: 'Tick the checkbox to complete',priority: 'low',  done: false, ts: Date.now() - 3000 },
  { id: uid(), text: 'Hover to delete a task',       priority: 'med',  done: true,  ts: Date.now() - 2000 },
];

let filter     = 'all';
let draggedId  = null;
let toastTimer = null;

/* ─────────────── Utility Helpers ─────────────── */

/** Generate a short unique id */
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

/** Escape HTML to prevent XSS */
function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Save tasks array to localStorage */
function save() {
  localStorage.setItem('do-tasks', JSON.stringify(tasks));
}

/** Return a human-readable "time ago" string */
function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

/* ─────────────── Filter Logic ─────────────── */

/** Return only tasks visible under the current filter */
function visibleTasks() {
  return tasks.filter(t => {
    if (filter === 'active')    return !t.done;
    if (filter === 'completed') return  t.done;
    if (filter === 'high')      return t.priority === 'high' && !t.done;
    if (filter === 'med')       return t.priority === 'med'  && !t.done;
    if (filter === 'low')       return t.priority === 'low'  && !t.done;
    return true; // 'all'
  });
}

/** Switch the active filter and re-render */
function setFilter(f, btn) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

/* ─────────────── Render ─────────────── */

/** Re-build the entire task list from the tasks array */
function render() {
  const listEl    = document.getElementById('task-list');
  listEl.innerHTML = '';

  const visible   = visibleTasks();
  const active    = tasks.filter(t => !t.done);
  const completed = tasks.filter(t =>  t.done);

  // Update filter count badges
  document.getElementById('fc-all').textContent    = tasks.length;
  document.getElementById('fc-active').textContent = active.length;
  document.getElementById('fc-done').textContent   = completed.length;

  // Update progress bar
  const pct = tasks.length
    ? Math.round((completed.length / tasks.length) * 100)
    : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-label').textContent =
    `${completed.length} / ${tasks.length}`;

  // Update footer stat
  document.getElementById('footer-stat').textContent =
    active.length === 0 && tasks.length > 0
      ? 'all done ✓'
      : `${active.length} remaining`;

  // Show/hide empty state
  document.getElementById('empty-state').classList.toggle('show', visible.length === 0);

  // In "all" view, separate active and completed with a divider
  if (filter === 'all') {
    const activePart    = visible.filter(t => !t.done);
    const completedPart = visible.filter(t =>  t.done);

    activePart.forEach(t => listEl.appendChild(makeItem(t)));

    if (completedPart.length && activePart.length) {
      const divider = document.createElement('div');
      divider.className = 'section-divider';
      divider.innerHTML = '<span>Completed</span>';
      listEl.appendChild(divider);
    }

    completedPart.forEach(t => listEl.appendChild(makeItem(t)));
  } else {
    visible.forEach(t => listEl.appendChild(makeItem(t)));
  }

  save();
}

/** Create a single task DOM element */
function makeItem(task) {
  const el = document.createElement('div');
  el.className   = 'task-item' + (task.done ? ' completed' : '');
  el.draggable   = true;
  el.dataset.id  = task.id;
  el.dataset.priority = task.priority;

  el.innerHTML = `
    <div class="handle"><span></span><span></span><span></span></div>
    <div class="check-wrap">
      <input
        type="checkbox"
        ${task.done ? 'checked' : ''}
        onchange="toggleDone('${task.id}')"
        title="Mark complete"
      />
    </div>
    <div class="task-body">
      <div class="task-text">${esc(task.text)}</div>
      <div class="task-meta">
        <span class="priority-badge ${task.priority}">${task.priority}</span>
        <span class="task-time">${timeAgo(task.ts)}</span>
      </div>
    </div>
    <div class="task-actions">
      <button class="action-btn del" onclick="deleteTask('${task.id}')" title="Delete">
        <svg viewBox="0 0 13 13" fill="none">
          <path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `;

  attachDrag(el, task.id);
  return el;
}

/* ─────────────── Task Actions ─────────────── */

/** Add a new task from the input field */
function addTask() {
  const input    = document.getElementById('task-input');
  const text     = input.value.trim();
  if (!text) { input.focus(); return; }

  const priority = document.getElementById('priority-select').value;
  tasks.unshift({ id: uid(), text, priority, done: false, ts: Date.now() });

  input.value = '';
  input.focus();
  render();
  showToast('Task added');
}

/** Toggle a task's done state */
function toggleDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  render();
  showToast(task.done ? 'Marked done ✓' : 'Marked active');
}

/** Animate out and delete a single task */
function deleteTask(id) {
  const el = document.querySelector(`[data-id="${id}"]`);
  if (el) {
    el.style.transition = 'opacity 0.16s, transform 0.16s';
    el.style.opacity    = '0';
    el.style.transform  = 'scale(0.96) translateX(8px)';
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      render();
    }, 160);
  }
  showToast('Task removed');
}

/** Remove all completed tasks */
function clearCompleted() {
  const count = tasks.filter(t => t.done).length;
  if (!count) return;
  tasks = tasks.filter(t => !t.done);
  render();
  showToast(`Cleared ${count} completed`);
}

/** Remove every task */
function clearAll() {
  if (!tasks.length) return;
  tasks = [];
  render();
  showToast('All cleared');
}

/* ─────────────── Drag & Drop ─────────────── */

/** Attach all drag events to a task element */
function attachDrag(el, id) {

  el.addEventListener('dragstart', e => {
    draggedId = id;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    // Delay so the "ghost" image captures before we dim the element
    setTimeout(() => el.classList.add('dragging'), 0);
  });

  el.addEventListener('dragend', () => {
    el.classList.remove('dragging');
    document.querySelectorAll('.task-item').forEach(i => i.classList.remove('drag-over'));
    draggedId = null;
  });

  el.addEventListener('dragenter', e => {
    e.preventDefault();
    if (el.dataset.id !== draggedId) el.classList.add('drag-over');
  });

  el.addEventListener('dragleave', e => {
    // Only remove highlight when truly leaving the element (not a child)
    if (!el.contains(e.relatedTarget)) el.classList.remove('drag-over');
  });

  el.addEventListener('dragover', e => {
    e.preventDefault(); // Required to allow drop
    e.dataTransfer.dropEffect = 'move';
  });

  el.addEventListener('drop', e => {
    e.preventDefault();
    el.classList.remove('drag-over');
    if (!draggedId || el.dataset.id === draggedId) return;

    const fromIdx = tasks.findIndex(t => t.id === draggedId);
    const toIdx   = tasks.findIndex(t => t.id === el.dataset.id);
    if (fromIdx === -1 || toIdx === -1) return;

    // Insert above or below based on cursor's Y position relative to the target's midpoint
    const rect   = el.getBoundingClientRect();
    const before = e.clientY < rect.top + rect.height / 2;
    const insert = before ? toIdx : toIdx + 1;
    const adj    = fromIdx < insert ? insert - 1 : insert;

    const [moved] = tasks.splice(fromIdx, 1);
    tasks.splice(adj, 0, moved);

    render();
    showToast('Reordered');
  });
}

/* ─────────────── Toast Notification ─────────────── */

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1800);
}

/* ─────────────── Date Chip ─────────────── */

function setDate() {
  const d      = new Date();
  const days   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  document.getElementById('date-chip').textContent =
    `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

/* ─────────────── Event Listeners ─────────────── */

// Allow pressing Enter to add a task
document.getElementById('task-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

/* ─────────────── Init ─────────────── */
setDate();
render();
