/* eslint-disable */

window.Webflow ||= [];
window.Webflow.push(() => {
    console.log('cmsScript loaded');
    window.addEventListener('cmsNestComplete', () => {
        console.log('cmsNest has finished adding all elements to the page.');
    const targetDropzone = document.querySelectorAll('div[data-cms-nest="target-1"]');
    const dropzones = document.querySelectorAll('div[data-cms-nest^="dropzone-"]');
    dropzones.forEach(dropzone => {
        const attr = dropzone.getAttribute('data-cms-nest');
        if (attr && /^dropzone-[2-9]$/.test(attr)) {
            console.log('Found dropzone:', attr);

            const listItems = dropzone.querySelectorAll('div[role="listitem"]');
            listItems.forEach(item => {
                targetDropzone.forEach(target => {
                    // Clone the item and append to target dropzone
                    const clonedItem = item.
                    cloneNode(true);
                    target.appendChild(clonedItem);
                });
                // Remove original item from source dropzone
                item.remove();
            });
            dropzone.remove();
        }
    });
    });
});
