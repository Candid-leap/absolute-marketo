/* eslint-disable */
window.Webflow ||= [];
window.Webflow.push(() => {
    // Find all breadcrumb components
    const breadcrumbs = document.querySelectorAll('.breadcrumbs_component');
    
    breadcrumbs.forEach(breadcrumb => {
        const active = breadcrumb.querySelector('.breadcrumbs_active');
        if (active && active.innerHTML.trim() === '') {
            const wrappers = breadcrumb.querySelectorAll('.breadcrumbs_link-wrapper');
            if (wrappers.length > 0) {
                const lastWrapper = wrappers[wrappers.length - 1];
                const divider = lastWrapper.querySelector('.breadcrumbs_divider');
                if (divider instanceof HTMLElement) {
                    divider.style.display = 'none';
                }
            }
        }
    });
});