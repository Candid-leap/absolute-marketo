/* eslint-disable */


window.Webflow ||= [];
window.Webflow.push(() => {

    const adjustLayout = () => {
        const stickyForm = document.querySelector<HTMLElement>('[sticky-form="true"]');
        if (!stickyForm) return;

        const header = document.querySelector<HTMLElement>('[header]');
        const formSlot = document.querySelector<HTMLElement>('.event-resources_form-slot .cta-demo_form-component');
        const layout = document.querySelector<HTMLElement>('.event-resources_layout');

        if (!formSlot || !header || !layout) return;

        if (window.innerWidth > 1340) {
            const headerHeight = header.offsetHeight;
            const topOffset = headerHeight * 0.7;

            formSlot.style.position = 'absolute';
            formSlot.style.top = `-${topOffset}px`;
            formSlot.style.right = '0';
            formSlot.style.width = '500px';

            const formSlotHeight = formSlot.offsetHeight;
            layout.style.minHeight = `${formSlotHeight - topOffset}px`;

            formSlot.style.visibility = 'visible';
        } else {
            formSlot.style.position = '';
            formSlot.style.top = '';
            formSlot.style.right = '';
            formSlot.style.width = '100%';
            formSlot.style.visibility = 'visible';
            layout.style.minHeight = '';
        }
    };

    // Initial layout adjustment
     adjustLayout();
    
});
