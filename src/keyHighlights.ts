/* eslint-disable */

window.Webflow ||= [];
window.Webflow.push(() => {
  console.log('keyHighlights');

  const keyHighlights = document.querySelectorAll('div[as-element="key-highlight"]');
  keyHighlights.forEach((highlight) => {
    const emptyRichText = highlight.querySelector('.global-rich-text.w-dyn-bind-empty.w-richtext');
    if (emptyRichText) {
      highlight.remove();
    }
  });
});
