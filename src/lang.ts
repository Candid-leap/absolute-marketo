/* eslint-disable */

window.Webflow ||= [];
window.Webflow.push(() => {
    console.log('langScript loaded');


    // Get all language dropdown items
    const langItems = document.querySelectorAll('.w-locales-item a');


    // Clean up href URLs to only keep language path
    langItems.forEach(item => {
        if (item instanceof HTMLAnchorElement) {
            const url = new URL(item.href);
            const pathParts = url.pathname.split("/");
            const langPath = pathParts[1];
            if (["pt", "ja", "es"].includes(langPath)) {
                item.href = "/" + langPath;
            } else {
                item.href = "/";
            }
        }
    });

    const langDropDown = document.querySelector('[id="lang-dropdown"]');
    if (!langDropDown) {
        return;
    }

    // Find the currently selected language item
    const currentLangItem = document.querySelector('.w-locales-item .w--current');
    if (!currentLangItem) {
        return;
    }

    // Get the text of the selected language
    const selectedLang = currentLangItem.textContent;

    // Find and update the text block with selected language
    const textBlock = langDropDown.querySelector('#selected-lang-text');
    if (textBlock) {
        textBlock.textContent = selectedLang;
    }
});
