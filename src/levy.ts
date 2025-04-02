/* eslint-disable */

window.Webflow ||= [];
window.Webflow.push(() => {

    const readMoreButtons = document.querySelectorAll('a[data-element="readmore"]');
    readMoreButtons.forEach((button) => {

        if (button.getAttribute('data-extlink') !== "" && button.getAttribute('data-extlink') !== "#") {
            return;
        }
        button.addEventListener('click', (e) => {
            setModalItem(e);
            openModal();
        });
    });
    const modalElement = document.querySelector('section[data-element="modal"]');
    const closeButton = document.querySelectorAll('[data-element="close-button"]');

    if (modalElement) {
        modalElement.addEventListener('click', (e) => {
            // Check if click was directly on modal background (not on modal content)
            if (e.target === modalElement ||
                Array.from(closeButton).includes(e.target as Element) ||
                (e.target as Element).closest('[data-element="close-button"]')) {
                closeModal();
            }
        });
    }
});

function openModal() {
    const modal = document.querySelector('section[data-element="modal"]');
    modal?.classList.remove('hide');
}


function setModalItem(e: Event) {
    const button = e.target as HTMLElement;
    const cardItem = button.closest('.card-what');

    if (!cardItem) return;

    const title = cardItem.querySelector('[data-element="title"]')?.textContent || '';
    const subtitle = cardItem.querySelector('[data-element="subtitle"]')?.textContent || '';
    const description = cardItem.querySelector('[data-element="description"]')?.textContent || '';
    const image = cardItem.querySelector('[data-element="image"]') as HTMLImageElement;
    const imageUrl = image?.src || '';
    const richDescription = cardItem.querySelector('[data-element="rich-text"]')?.innerHTML || '';

    const modal = document.querySelector('section[data-element="modal"]');
    if (!modal) return;

    // Set modal content
    const modalHeading = modal.querySelector('[data-element="modal-heading"]');
    const modalImage = modal.querySelector('[data-element="modal-image"]') as HTMLImageElement;
    const modalTitle = modal.querySelector('[data-element="modal-title"]');
    const modalSubtitle = modal.querySelector('[data-element="modal-subtitle"]');
    const modalDescription = modal.querySelector('[data-element="modal-description"]');

    if (modalHeading) modalHeading.textContent = "More about " + title.split(' ')[0];
    if (modalImage) modalImage.src = imageUrl;
    if (modalTitle) modalTitle.textContent = title;
    if (modalSubtitle) modalSubtitle.textContent = subtitle;
    if (modalDescription) modalDescription.innerHTML = richDescription;
}

function closeModal() {
    const modal = document.querySelector('section[data-element="modal"]');
    if (!modal) return;
    modal.classList.add('hide');
}
