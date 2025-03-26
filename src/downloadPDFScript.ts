/* eslint-disable */
window.Webflow ||= [];
window.Webflow.push(() => {

    // Find all download PDF buttons by looking for div with "Download PDF" text
    const downloadButtons = document.querySelectorAll('div.button-text');

    downloadButtons.forEach((button) => {
        if (button.textContent?.trim() === 'Download PDF') {
            const anchorParent = button.closest('a[fs-modal-element][button-size="default"]');
            if (anchorParent instanceof HTMLAnchorElement) {
                const href = anchorParent.getAttribute('href');

                if (!window.location.search.includes('show')) {
                    anchorParent.setAttribute('as-formaction', 'show');
                }
                // Check if href is blank or '#'
                if (!href || href === '#') {
                    // Remove the button from DOM
                    anchorParent.remove();
                }
            }
        }
    });
});
