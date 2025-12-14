document.addEventListener('DOMContentLoaded', () => {
    // Basic interaction tracking or future logic can go here.
    console.log('Portfolio loaded successfully.');

    // Add hover effects or simple interactions if needed
    const repoCards = document.querySelectorAll('.pinned-item-card');

    repoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'var(--color-text-secondary)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'var(--color-border-default)';
        });
    });
});
