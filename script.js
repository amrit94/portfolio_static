document.addEventListener('DOMContentLoaded', () => {
    const pinnedReposContainer = document.getElementById('pinned-repos');
    const username = 'amrit94';
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
            if (data.company) {
                const companyEl = document.getElementById('profile-company');
                const companyWrapper = document.getElementById('profile-company-wrapper');
                if (companyEl) companyEl.textContent = data.company;
                if (companyWrapper) companyWrapper.style.display = 'flex';
            }

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
