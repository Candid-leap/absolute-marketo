/* eslint-disable */
window.Webflow ||= [];
window.Webflow.push(() => { 

const dropdowns = document.querySelectorAll('.w-dropdown');

function toggleDropdownDisplay(dropdown: Element) {
  const toggle = dropdown.querySelector('.w-dropdown-toggle');
  const input = dropdown.querySelector('[pm-element="dropdown-input"]') as HTMLElement;
  const text = dropdown.querySelector('[pm-element="dropdown-text"]') as HTMLElement;
  const chevronContainer = dropdown.querySelector('.form-group_input-date-toggle') as HTMLElement;

  if (toggle && input && text) {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    
    if (isExpanded) {
      input.style.display = 'block';
      text.style.display = 'none';
      if (chevronContainer) {
        // Target the ::after pseudo-element by setting a CSS custom property
        chevronContainer.style.setProperty('--chevron-rotation', '180deg');
      }
      setTimeout(() => input.focus(), 100);
    } else {
      input.style.display = 'none';
      text.style.display = 'flex';
      if (chevronContainer) {
        // Reset rotation when closed
        chevronContainer.style.setProperty('--chevron-rotation', '0deg');
      }
    }
  }
}

function filterDropdownItems(dropdown: Element, searchText: string) {
  const links = dropdown.querySelectorAll('.w-dropdown-link');
  
  links.forEach((link) => {
    const linkText = link.textContent?.toLowerCase() || '';
    if (linkText.includes(searchText.toLowerCase())) {
      (link as HTMLElement).style.display = 'block';
    } else {
      (link as HTMLElement).style.display = 'none';
    }
  });
}

dropdowns.forEach((dropdown) => {
  const toggle = dropdown.querySelector('.w-dropdown-toggle');
  const input = dropdown.querySelector('[pm-element="dropdown-input"]') as HTMLElement;
  
  if (toggle && input) {
    // Prevent dropdown from closing when clicking input
    input.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Add input event listener for filtering
    input.addEventListener('input', (e) => {
      const searchText = (e.target as HTMLInputElement).value;
      filterDropdownItems(dropdown, searchText);
    });

    // Create MutationObserver to watch for aria-expanded changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-expanded') {
          toggleDropdownDisplay(dropdown);
          // Reset filter when dropdown opens/closes
          filterDropdownItems(dropdown, '');
          (input as HTMLInputElement).value = '';
        }
      });
    });

    // Start observing the toggle element for aria-expanded attribute changes
    observer.observe(toggle, {
      attributes: true,
      attributeFilter: ['aria-expanded']
    });

    // Run initially to set correct state
    toggleDropdownDisplay(dropdown);
  }
});

// Add CSS rule for the chevron rotation
const style = document.createElement('style');
style.textContent = `
  .form-group_input-date-toggle::after {
    transform: rotate(var(--chevron-rotation, 0deg));
    transition: transform 0.2s ease;
  }
`;
document.head.appendChild(style);

});
