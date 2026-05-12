const username = 'amrit94';
document.addEventListener('DOMContentLoaded', () => {
    const pinnedReposContainer = document.getElementById('pinned-repos');
    const pinnedApiUrl = `https://pinned.berrysauce.dev/get/${username}`;
    const profileApiUrl = `https://api.github.com/users/${username}`;

    // Fetch Profile Data
    fetch(profileApiUrl)
        .then(response => response.json())
        .then(data => {
            // Update Text Content
            updateElementText('profile-name', data.name);
            // updateElementText('profile-username', data.login);
            updateElementText('profile-bio', data.bio);
            updateElementText('profile-location', data.location);

            // Update Stats with HTML
            const followersEl = document.getElementById('profile-followers');
            if (followersEl) followersEl.innerHTML = `<b>${data.followers}</b> followers`;

            const followingEl = document.getElementById('profile-following');
            if (followingEl) followingEl.innerHTML = `<b>${data.following}</b> following`;

            // Update Images
            const avatarEl = document.getElementById('profile-avatar');
            if (avatarEl) avatarEl.src = data.avatar_url;

            const navAvatarEl = document.getElementById('nav-profile-avatar');
            if (navAvatarEl) navAvatarEl.src = data.avatar_url;

            // Optional: Company and Blog
            // if (data.company) {
            //     const companyEl = document.getElementById('profile-company');
            //     const companyWrapper = document.getElementById('profile-company-wrapper');
            //     if (companyEl) companyEl.textContent = data.company;
            //     if (companyWrapper) companyWrapper.style.display = 'flex';
            // }

            if (data.blog) {
                const blogEl = document.getElementById('profile-blog');
                if (blogEl) {
                    blogEl.textContent = data.blog;
                    blogEl.href = data.blog.startsWith('http') ? data.blog : `https://${data.blog}`;
                }
            }
        })
        .catch(err => console.error('Error fetching profile:', err));

    if (pinnedReposContainer) {
        fetch(pinnedApiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Clear loading message
                pinnedReposContainer.innerHTML = '';

                data.forEach(repo => {
                    const card = createRepoCard(repo);
                    pinnedReposContainer.appendChild(card);
                });

                // Re-apply hover effects to new cards
                addHoverEffects();
            })
            .catch(error => {
                console.error('Error fetching pinned repos:', error);
                pinnedReposContainer.innerHTML = '<p style="color: var(--color-text-secondary);">Failed to load repositories.</p>';
            });
    } else {
        console.warn('Pinned repos container not found.');
    }
});

function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'pinned-item-card';

    // Handle missing language color
    const langColor = repo.languageColor || '#ccc';
    const langName = repo.language || '';

    // Create card HTML
    card.innerHTML = `
        <div class="card-header">
            <div class="repo-title">
                <i class="fa-solid fa-book-bookmark"></i>
                <a href="https://github.com/${repo.author}/${repo.name}" target="_blank">${repo.name}</a>
                <span class="badge">Public</span>
            </div>
            <span class="grab-handle"><i class="fa-solid fa-grip-vertical"></i></span>
        </div>
        ${repo.description ? `<p class="repo-desc">${repo.description}</p>` : '<p class="repo-desc" style="font-style: italic; opacity: 0.5;">No description provided.</p>'}
        <div class="card-footer">
            ${langName ? `<span class="lang-color" style="background-color: ${langColor};"></span>
            <span class="lang-name">${langName}</span>` : ''}
            <span class="star-count"><i class="fa-regular fa-star"></i> ${repo.stars}</span>
            <span class="fork-count" style="margin-left: 16px;"><i class="fa-solid fa-code-branch"></i> ${repo.forks}</span>
        </div>
    `;

    return card;
}

function addHoverEffects() {
    const repoCards = document.querySelectorAll('.pinned-item-card');

    repoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--color-text-secondary)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--color-border-default)';
        });
    });
}

function updateElementText(id, text) {
    const el = document.getElementById(id);
    if (el && text) {
        el.textContent = text;
    }
}

// Theme Switcher Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('i');
const htmlElement = document.documentElement;

// Function to set theme
function setTheme(theme) {
    if (theme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
        updateStatsTheme('light');
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
        updateStatsTheme('dark');
    }
}

function updateStatsTheme(theme) {
    const statsCard = document.querySelector('.gh-stats-card');
    const streakCard = document.querySelector('.gh-streak-card');

    if (theme === 'light') {
        if (statsCard) {
            statsCard.src = 'https://github-readme-stats.vercel.app/api?username=amrit94&show_icons=true&theme=default&hide_border=true&bg_color=ffffff&title_color=24292f&text_color=57606a&icon_color=0969da';
        }
        if (streakCard) {
            streakCard.src = 'https://streak-stats.demolab.com?user=amrit94&theme=default&background=ffffff&border=d0d7de&dates=57606a&currStreakLabel=0969da';
        }
    } else {
        if (statsCard) {
            statsCard.src = 'https://github-readme-stats.vercel.app/api?username=amrit94&show_icons=true&theme=dark&hide_border=true&bg_color=0d1117&title_color=c9d1d9&text_color=8b949e&icon_color=58a6ff';
        }
        if (streakCard) {
            streakCard.src = 'https://streak-stats.demolab.com?user=amrit94&theme=dark&background=0d1117&border=30363d&dates=c9d1d9&currStreakLabel=58a6ff';
        }
    }
}

// Check local storage or system preference on load
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'light') {
    setTheme('light');
} else if (savedTheme === 'dark') {
    setTheme('dark');
} else {
    // Default to dark
    setTheme('dark');
}

// Toggle event listener
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
    });
}

// ── Followers Modal ────────────────────────────────────────────────────────
(function () {
    const followersApiUrl = `https://api.github.com/users/${username}/followers?per_page=100`;
    const modal    = document.getElementById('followers-modal');
    const list     = document.getElementById('followers-list');
    const closeBtn = document.getElementById('followers-modal-close');
    const trigger  = document.getElementById('profile-followers');
    let   cache    = null;   // store fetched data so we don't re-fetch

    function openModal() {
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (!cache) loadFollowers();
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function loadFollowers() {
        list.innerHTML = '<div class="gh-modal-loading"><i class="fa-solid fa-spinner fa-spin"></i> Loading followers…</div>';
        fetch(followersApiUrl)
            .then(r => {
                if (!r.ok) throw new Error(`GitHub API error ${r.status}`);
                return r.json();
            })
            .then(data => {
                cache = data;
                renderFollowers(data);
            })
            .catch(err => {
                console.error('Followers fetch error:', err);
                list.innerHTML = `<div class="gh-modal-error"><i class="fa-solid fa-triangle-exclamation"></i> Failed to load followers. Try again later.</div>`;
            });
    }

    function renderFollowers(data) {
        if (!data || data.length === 0) {
            list.innerHTML = '<div class="gh-modal-error">No followers found.</div>';
            return;
        }
        // Update header count
        const headerEl = document.getElementById('followers-modal-title');
        if (headerEl) headerEl.innerHTML = `<i class="fa-solid fa-user-group"></i> Followers <span style="font-weight:400;color:var(--color-text-secondary);font-size:13px;">(${data.length})</span>`;

        list.innerHTML = data.map(user => `
            <a href="${user.html_url}" target="_blank" rel="noopener noreferrer"
               class="gh-follower-item" aria-label="View ${user.login}'s GitHub profile">
                <img src="${user.avatar_url}&s=72" alt="${user.login}" class="gh-follower-avatar" loading="lazy">
                <div class="gh-follower-info">
                    <span class="gh-follower-login">${user.login}</span>
                    <span class="gh-follower-meta">github.com/${user.login}</span>
                </div>
            </a>
        `).join('');
    }

    if (trigger) trigger.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal)    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();
// ── End Followers Modal ────────────────────────────────────────────────────

// Back to Top Button Logic
const backToTopBtn = document.getElementById('back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'flex';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Active Navigation Logic (Scroll Spy)
const sections = document.querySelectorAll('h4.section-title, .github-stats-section');
const navLinks = document.querySelectorAll('.main-nav ul li a');

// Click handler
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Scroll Spy
if (sections.length > 0) {
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Offset for fixed header (approx 100px)
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (current && link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}
