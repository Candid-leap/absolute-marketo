/* eslint-disable */

window.Webflow ||= [];
window.Webflow.push(() => {
    console.log('cmsScript loaded');

    const cmsDirectory = '/related-resources-directory/';

    // Find all elements with data-cms-nest="item"
    const featuredContainerElements = document.querySelectorAll('section[as-cms-nest="featured-container"]');
    const fetchPromises = Array.from(featuredContainerElements).map(async (featuredContainer) => {
        // Get the slug attribute
        const slugAttribute = featuredContainer.getAttribute('as-cms-slug');
        // Check if slug is empty or null
        if (!slugAttribute) {
            featuredContainer.remove();
            console.log('No slug found for featured container, removed from DOM');
            return;
        }

        // Construct the full URL
        const resourceUrl = `${document.location.origin}${cmsDirectory}${slugAttribute}`;


        try {
            const response = await fetch(resourceUrl);
            const data = await response.text();

            console.log('Fetched featured resource:', resourceUrl);

            const parser = new DOMParser();
            const fetchedDoc = parser.parseFromString(data, 'text/html');

            const listItems = fetchedDoc.querySelectorAll('div[as-cms-nest="target-item"]');
            const dropzone = featuredContainer.querySelector('div[as-cms-nest="dropzone"]');

            if (!dropzone) {
                featuredContainer.remove();
                console.log('No dropzone found, removed from DOM');
                return;
            }

            if (listItems.length === 0) {
                featuredContainer.remove();
                console.log('No list items found, removed from DOM');
                return;
            }
            // Only append first 3 items
            Array.from(listItems).slice(0, 3).forEach(listItem => {
                const clonedItem = listItem.cloneNode(true);
                dropzone.appendChild(clonedItem);
            });

            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    });

    // Wait for all fetches to complete
    Promise.all(fetchPromises).then(results => {
        console.log('CMS Load doneCompleted processing');
    });
});

