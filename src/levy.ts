/* eslint-disable */

window.Webflow ||= [];
window.Webflow.push(() => {

    const readMoreButtons = document.querySelectorAll('a[data-element="readmore"]');

    console.log(readMoreButtons);

    readMoreButtons.forEach((button) => {

        if (button.getAttribute('data-extlink') !== "" && button.getAttribute('data-extlink') !== "#") {
            console.log('not a link');
            return;
        }
        button.addEventListener('click', (e) => {
            console.log('clicked');
            setModalItem(e);
            openModal();
        });
    });


});

function openModal() {
    console.log('open modal');
    const modal = document.querySelector('section[data-element="modal"]');
    console.log(modal);
    modal?.classList.remove('hide');
}


function setModalItem(e: MouseEvent) {
    const button = e.target as HTMLElement;
    const cardItem = button.closest('.card-what');

    if (!cardItem) return;

    const title = cardItem.querySelector('[data-element="title"]')?.textContent || '';
    const subtitle = cardItem.querySelector('[data-element="subtitle"]')?.textContent || '';
    const description = cardItem.querySelector('[data-element="description"]')?.textContent || '';
    const image = cardItem.querySelector('[data-element="image"]') as HTMLImageElement;
    const imageUrl = image?.src || '';

    console.log({
        title,
        subtitle,
        description,
        imageUrl
    });


    const modal = document.querySelector('section[data-element="modal"]');
    if (!modal) return;

    // Set modal content
    const modalHeading = modal.querySelector('[data-element="modal-heading"]');
    const modalImage = modal.querySelector('[data-element="modal-image"]') as HTMLImageElement;
    const modalTitle = modal.querySelector('[data-element="modal-title"]');
    const modalSubtitle = modal.querySelector('[data-element="modal-subtitle"]');
    const modalDescription = modal.querySelector('[data-element="modal-description"]');

    if (modalHeading) modalHeading.textContent = title;
    if (modalImage) modalImage.src = imageUrl;
    if (modalTitle) modalTitle.textContent = title;
    if (modalSubtitle) modalSubtitle.textContent = subtitle;
    if (modalDescription) modalDescription.textContent = description;
}

function closeModal() {
    const modal = document.querySelector('section[data-element="modal"]');
    if (!modal) return;
    modal.classList.add('hide');
}

// Add event listener to modal for background clicks
const modalElement = document.querySelector('section[data-element="modal"]');
if (modalElement) {
    modalElement.addEventListener('click', (e) => {
        // Check if click was directly on modal background (not on modal content)
        if (e.target === modalElement) {
            closeModal();
        }
    });
}

const closeButton = document.querySelector('svg[data-element="close-button"]');
if (closeButton) {
    closeButton.addEventListener('click', () => {
        closeModal();
    });
}
