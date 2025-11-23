const API_BASE = '/api';

// State
let currentView = 'dashboard';

// Navigation
// Navigation
function navigateTo(view, addToHistory = true) {
    currentView = view;
    document.querySelectorAll('.nav-links li').forEach(li => {
        li.classList.remove('active');
        if (li.innerText.toLowerCase().includes(view)) li.classList.add('active');
    });

    const title = view.charAt(0).toUpperCase() + view.slice(1);
    document.getElementById('page-title').innerText = title;
    document.title = `${title} - Lumina Library`;

    if (addToHistory) {
        history.pushState({ view: view }, '', `/${view}`);
    }

    renderView(view);
}

window.onpopstate = function (event) {
    if (event.state && event.state.view) {
        navigateTo(event.state.view, false);
    } else {
        // Handle initial load or empty state
        const path = window.location.pathname.substring(1) || 'dashboard';
        navigateTo(path, false);
    }
};

async function renderView(view) {
    const content = document.getElementById('content-area');

    // Fade out
    content.style.opacity = '0';
    content.style.transform = 'translateY(10px)';
    content.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

    setTimeout(async () => {
        if (view === 'dashboard') {
            await renderDashboard(content);
        } else if (view === 'books') {
            await renderBooks(content);
        } else if (view === 'members') {
            await renderMembers(content);
        } else if (view === 'circulation') {
            await renderCirculation(content);
        }

        // Fade in
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
    }, 200);
}

// --- VIEWS ---

async function renderDashboard(container) {
    const stats = await fetch(`${API_BASE}/stats`).then(r => r.json());

    container.innerHTML = `
        <div class="stats-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
            <div class="card">
                <h3>Total Books</h3>
                <p style="font-size: 2.5rem; font-weight: bold; color: var(--accent-color);">${stats.total_books}</p>
            </div>
            <div class="card">
                <h3>Active Issues</h3>
                <p style="font-size: 2.5rem; font-weight: bold; color: var(--success-color);">${stats.active_issues}</p>
            </div>
            <div class="card">
                <h3>Overdue</h3>
                <p style="font-size: 2.5rem; font-weight: bold; color: var(--danger-color);">${stats.overdue_books}</p>
            </div>
        </div>
        <div class="card">
            <h3>Library Activity</h3>
            <div style="height: 300px; position: relative;">
                <canvas id="activityChart"></canvas>
            </div>
        </div>
    `;

    // Render Chart
    const ctx = document.getElementById('activityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: stats.chart.labels,
            datasets: [{
                label: 'Books Issued',
                data: stats.chart.data,
                backgroundColor: '#0a84ff',
                borderRadius: 6,
                barPercentage: 0.6,
                categoryPercentage: 0.8,
                maxBarThickness: 40
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
                    ticks: {
                        color: '#98989d',
                        stepSize: 1,
                        precision: 0
                    },
                    border: { display: false }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#98989d' },
                    border: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(30, 30, 30, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 8,
                    displayColors: false
                }
            }
        }
    });
}

// --- MODALS & FORMS ---

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex'; // Changed to flex for centering
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal if clicked outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
    }
}

async function handleAddBook(e) {
    e.preventDefault();
    const data = {
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        total_copies: parseInt(document.getElementById('bookCopies').value)
    };

    const res = await fetch(`${API_BASE}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModal('addBookModal');
        e.target.reset();
        booksData = []; // Clear cache
        renderBooks(document.getElementById('content-area'));
    } else {
        alert('Error adding book');
    }
}

async function handleAddMember(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value
    };

    const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModal('addMemberModal');
        e.target.reset();
        membersData = []; // Clear cache
        renderMembers(document.getElementById('content-area'));
    } else {
        alert('Error adding member');
    }
}

async function prepareIssueModal() {
    const members = await fetch(`${API_BASE}/members`).then(r => r.json());
    const books = await fetch(`${API_BASE}/books`).then(r => r.json());

    const memberSelect = document.getElementById('issueMemberSelect');
    const bookSelect = document.getElementById('issueBookSelect');

    memberSelect.innerHTML = '<option value="">Select Member</option>' +
        members.map(m => `<option value="${m.id}">${m.name} (${m.id})</option>`).join('');

    bookSelect.innerHTML = '<option value="">Select Book</option>' +
        books.filter(b => b.available_copies > 0)
            .map(b => `<option value="${b.id}">${b.title} (Qty: ${b.available_copies})</option>`).join('');

    openModal('issueBookModal');
}

async function handleIssueBook(e) {
    e.preventDefault();
    const data = {
        member_id: document.getElementById('issueMemberSelect').value,
        book_id: parseInt(document.getElementById('issueBookSelect').value)
    };

    const res = await fetch(`${API_BASE}/issues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        closeModal('issueBookModal');
        e.target.reset();
        // Clear cache to force refresh
        booksData = [];
        renderCirculation(document.getElementById('content-area'));
    } else {
        const err = await res.json();
        alert(err.error || 'Error issuing book');
    }
}

// Updated Render Functions to use Modals
// Global data cache for client-side filtering
let booksData = [];
let membersData = [];
let issuesData = [];

async function renderBooks(container) {
    if (booksData.length === 0) {
        booksData = await fetch(`${API_BASE}/books`).then(r => r.json());
    }

    container.innerHTML = `
        <div class="card">
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <input type="text" id="bookSearch" placeholder="Search books..." style="margin-bottom: 0;" oninput="filterBooks()">
                <button class="btn btn-primary" onclick="openModal('addBookModal')">+ Add Book</button>
            </div>
            <table id="booksTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateBooksRows(booksData)}
                </tbody>
            </table>
        </div>
    `;
}

function filterBooks() {
    const term = document.getElementById('bookSearch').value.toLowerCase();
    const filtered = booksData.filter(b =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.category.toLowerCase().includes(term)
    );
    document.querySelector('#booksTable tbody').innerHTML = generateBooksRows(filtered);
}

function generateBooksRows(books) {
    if (books.length === 0) return '<tr><td colspan="5" style="text-align:center; color: var(--text-secondary);">No books found</td></tr>';
    return books.map(b => `
        <tr>
            <td>#${b.id}</td>
            <td>${b.title}</td>
            <td>${b.author}</td>
            <td><span style="background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 4px; font-size: 0.8rem;">${b.category}</span></td>
            <td>${b.available_copies} / ${b.total_copies}</td>
        </tr>
    `).join('');
}

async function renderMembers(container) {
    if (membersData.length === 0) {
        membersData = await fetch(`${API_BASE}/members`).then(r => r.json());
    }

    container.innerHTML = `
        <div class="card">
             <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <input type="text" id="memberSearch" placeholder="Search members..." style="margin-bottom: 0;" oninput="filterMembers()">
                <button class="btn btn-primary" onclick="openModal('addMemberModal')">+ Add Member</button>
            </div>
            <table id="membersTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateMembersRows(membersData)}
                </tbody>
            </table>
        </div>
    `;
}

function filterMembers() {
    const term = document.getElementById('memberSearch').value.toLowerCase();
    const filtered = membersData.filter(m =>
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        m.id.toLowerCase().includes(term)
    );
    document.querySelector('#membersTable tbody').innerHTML = generateMembersRows(filtered);
}

function generateMembersRows(members) {
    if (members.length === 0) return '<tr><td colspan="4" style="text-align:center; color: var(--text-secondary);">No members found</td></tr>';
    return members.map(m => `
        <tr>
            <td>${m.id}</td>
            <td>${m.name}</td>
            <td>${m.email}</td>
            <td>${m.joined_date}</td>
        </tr>
    `).join('');
}

async function renderCirculation(container) {
    // Always fetch fresh data for circulation to ensure status is up to date
    issuesData = await fetch(`${API_BASE}/issues`).then(r => r.json());

    container.innerHTML = `
        <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3>Circulation History</h3>
                <button class="btn btn-primary" onclick="prepareIssueModal()">Issue New Book</button>
            </div>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                <input type="text" id="issueSearch" placeholder="Search by ID, Member, or Book ID..." style="margin-bottom: 0; flex: 2;" oninput="filterIssues()">
                <select id="issueFilter" style="margin-bottom: 0; flex: 1;" onchange="filterIssues()">
                    <option value="all">All Status</option>
                    <option value="issued">Issued</option>
                    <option value="returned">Returned</option>
                </select>
            </div>
            <table id="issuesTable">
                <thead>
                    <tr>
                        <th>Issue ID</th>
                        <th>Book ID</th>
                        <th>Member ID</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${generateIssuesRows(issuesData)}
                </tbody>
            </table>
        </div>
    `;
}

function filterIssues() {
    const term = document.getElementById('issueSearch').value.toLowerCase();
    const status = document.getElementById('issueFilter').value;

    const filtered = issuesData.filter(i => {
        const matchesTerm =
            i.id.toString().includes(term) ||
            i.book_id.toString().includes(term) ||
            i.member_id.toLowerCase().includes(term);

        const matchesStatus = status === 'all' || i.status === status;

        return matchesTerm && matchesStatus;
    });

    document.querySelector('#issuesTable tbody').innerHTML = generateIssuesRows(filtered);
}

function generateIssuesRows(issues) {
    // Sort by ID descending (newest first)
    const sorted = [...issues].sort((a, b) => b.id - a.id);

    if (sorted.length === 0) return '<tr><td colspan="6" style="text-align:center; color: var(--text-secondary);">No records found</td></tr>';

    return sorted.map(i => `
        <tr>
            <td>#${i.id}</td>
            <td>${i.book_id}</td>
            <td>${i.member_id}</td>
            <td>${i.due_date}</td>
            <td>
                <span style="color: ${i.status === 'issued' ? 'var(--accent-color)' : 'var(--success-color)'}">
                    ${i.status.toUpperCase()}
                </span>
                ${i.status === 'returned' ? `<span style="font-size:0.8em; color:var(--text-secondary); display:block;">Ret: ${i.return_date || 'N/A'}</span>` : ''}
            </td>
            <td>
                ${i.status === 'issued' ?
            `<button class="btn btn-primary" style="font-size: 0.8rem; padding: 0.3rem 0.8rem;" onclick="returnBook(${i.id})">Return</button>`
            : '-'}
            </td>
        </tr>
    `).join('');
}

// --- CONFIRM MODAL ---
let confirmResolver = null;

function showConfirm(message) {
    document.getElementById('confirmMessage').innerText = message;
    document.getElementById('confirmModal').style.display = 'flex';
    return new Promise((resolve) => {
        confirmResolver = resolve;
    });
}

function resolveConfirm(result) {
    document.getElementById('confirmModal').style.display = 'none';
    if (confirmResolver) confirmResolver(result);
}

async function returnBook(issueId) {
    const confirmed = await showConfirm('Confirm return?');
    if (!confirmed) return;

    const res = await fetch(`${API_BASE}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue_id: issueId })
    });

    if (res.ok) {
        renderCirculation(document.getElementById('content-area'));
    } else {
        alert('Error returning book');
    }
}

// --- AUTHENTICATION ---

async function checkSession() {
    try {
        const res = await fetch(`${API_BASE}/session`);
        const data = await res.json();
        if (data.logged_in) {
            showApp();
        } else {
            showLogin();
        }
    } catch (e) {
        showLogin();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('loginPassword').value;

    // Simple demo login
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: password })
    });

    if (res.ok) {
        showApp();
    } else {
        const form = document.querySelector('.login-form');
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
        document.getElementById('loginPassword').value = '';
    }
}

function showApp() {
    document.getElementById('loginScreen').style.opacity = '0';
    document.getElementById('loginScreen').style.visibility = 'hidden';
    document.querySelector('.app-container').style.display = 'flex';

    const path = window.location.pathname.substring(1) || 'dashboard';
    navigateTo(path, false);
}

function showLogin() {
    document.getElementById('loginScreen').style.opacity = '1';
    document.getElementById('loginScreen').style.visibility = 'visible';
    document.querySelector('.app-container').style.display = 'none';
}

// Shortcuts
document.addEventListener('keydown', async (e) => {
    // Ctrl+L to Logout
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLogout();
    }
});

// --- PROFILE MENU ---
function toggleProfileMenu() {
    const menu = document.getElementById('profileMenu');
    menu.classList.toggle('active');
}

// Close menu when clicking outside
window.addEventListener('click', (e) => {
    if (!e.target.closest('.user-profile')) {
        document.getElementById('profileMenu').classList.remove('active');
    }
});

async function handleLogout() {
    const confirmed = await showConfirm('Log out of system?');
    if (confirmed) {
        await fetch(`${API_BASE}/logout`, { method: 'POST' });
        showLogin();
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    checkSession();
    // Initial navigation based on URL is handled after session check or in showApp
});
