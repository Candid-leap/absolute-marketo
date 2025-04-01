/* eslint-disable */
window.Webflow ||= [];
window.Webflow.push(() => {
    // Find all external links
    const allLinks = document.querySelectorAll('a');
    const currentOrigin = window.location.origin;
    
    allLinks.forEach(link => {
        if (link instanceof HTMLAnchorElement) {
            const href = link.getAttribute('href');
            
            // Check if link is external by looking for http/https and not www.absolute.com or current origin
            if (href?.match(/^https?:\/\//) && 
                !href.includes('www.absolute.com') &&
                !href.includes(currentOrigin)) {
                
                // Add rel and target attributes for external links
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('target', '_blank');
            }
        }
    });
});
