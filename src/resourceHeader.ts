/* eslint-disable */

const webflow = window.Webflow || [];
webflow.push(async () => {
    console.log('resourceHeader script is ready');
    const cmsDirectory = '/related-resources-directory/';
    const slugAttribute = 'featured-resources-on-resource-page';

    const resourceUrl = `${document.location.origin}${cmsDirectory}${slugAttribute}`;

    try {
        const response = await fetch(resourceUrl);
        const data = await response.text();

        console.log('Fetched featured resource:', resourceUrl);

        const parser = new DOMParser();
        const fetchedDoc = parser.parseFromString(data, 'text/html');

        let listItems = fetchedDoc.querySelectorAll('div[as-cms-nest="target-item"]');




        const smallCardTemplate = fetchedDoc.querySelector('.article-card-horizontal-small_component');
        const sortString = fetchedDoc.querySelector('p[as-sort]');


        // Get the sort order from the sort string
        const sortOrder = sortString?.textContent?.split(',').map(s => s.trim()).filter(Boolean) || [];

        // Sort the list items based on the sort order
        if (sortOrder.length > 0) {
            const sortedItems = Array.from(listItems);
            sortedItems.sort((a, b) => {
                const titleA = (a.querySelector('.text-size-medium')?.textContent || '').toLowerCase();
                const titleB = (b.querySelector('.text-size-medium')?.textContent || '').toLowerCase();

                const indexA = sortOrder.findIndex(s => titleA.includes(s.toLowerCase()));
                const indexB = sortOrder.findIndex(s => titleB.includes(s.toLowerCase()));

                // If both titles are found in sort order, sort by their position
                if (indexA !== -1 && indexB !== -1) {
                    return indexA - indexB;
                }
                // If only one title is found, prioritize it
                if (indexA !== -1) return -1;
                if (indexB !== -1) return 1;
                // If neither is found, keep original order
                return 0;
            });

            // Take only first 4 items
            listItems = sortedItems.slice(0, 4);
        }

        const items = Array.from(listItems).map((item) => {
            const link = item.querySelector('a')?.getAttribute('href') || '';
            const title = item.querySelector('.text-size-medium')?.textContent || '';
            const description = item.querySelector('.text-size-regular')?.textContent || '';
            const image = item.querySelector('img');
            const imageUrl = image?.getAttribute('src') || '';
            const imageAlt = image?.getAttribute('alt') || '';

            return {
                url: link,
                title: title,
                description: description,
                imageUrl: imageUrl,
                imageAlt: imageAlt,
            };
        });

        const bigCard = listItems[0];
        const smallCards = items.slice(1, 4);

        const dropzone = document.querySelector('.highlighting-featured-resources');

        if (dropzone) {
            const bigCardDropzone = dropzone.querySelector('.big-card');
            const smallCardsDropzone = dropzone.querySelector('.small-cards');

            if (bigCardDropzone) {
                console.log('bigCardDropzone', bigCardDropzone);
                bigCardDropzone.innerHTML = '';
                bigCardDropzone.appendChild(bigCard);
            }

            if (smallCardsDropzone) {
                smallCardsDropzone.innerHTML = '';
                smallCards.forEach((card) => {
                    const cardElement = smallCardTemplate?.cloneNode(true) as HTMLElement;
                    if (cardElement) {
                        const link = cardElement.querySelector('a');
                        const image = cardElement.querySelector('img');
                        const title = cardElement.querySelector('.heading-style-h6');
                        const description = cardElement.querySelector('.text-size-regular');

                        if (link) link.setAttribute('href', card.url);
                        if (image) {
                            image.setAttribute('src', card.imageUrl);
                            image.setAttribute('alt', card.imageAlt);
                        }
                        if (title) title.textContent = card.title;
                        if (description) description.textContent = card.description;

                        smallCardsDropzone.appendChild(cardElement);
                    }
                });
            }

            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
});
