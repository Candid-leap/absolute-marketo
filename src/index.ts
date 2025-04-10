/* eslint-disable */

window.Webflow ||= [];
window.Webflow.push(() => {
    console.log('AS Marketo Forms Script is here');

    const isShowQueryPresent = window.location.search.includes('show');

    const divWithGatedPageAttribute = document.querySelector('div[is-gated-page]');

    if (!divWithGatedPageAttribute) {
        console.log('No gated page div found, rendering normally');
        loadMarketoScriptForms();
        return;
    }

    const isGatedPage = divWithGatedPageAttribute?.getAttribute('is-gated-page') === 'true';

    if (isShowQueryPresent) {
        removeAllFormGroupWrappers(); 
        showElements();
        hideElements();
        applyQueryActionOnElements();    
        return;
    }

    // Un gated page
    if (!isGatedPage) {
        console.log('Ungated page detected, checking webinar type');
        if (!isWebinarPage()) {
            console.log('Webinar page detected, loading form 1001');
            removeAllFormGroupWrappers();
            showElements();
            hideElements();
            applyQueryActionOnElements();
            return;
        }
        const isLiveWebinar = isLiveWebinarPage();
        if (isLiveWebinar) {
            console.log('Live webinar detected, loading form 1024 and showing allelements');
            removeFormGroupWrapperbyId('1001');
            loadMarketoScriptForms();
            showElements();
            hideElements();
            applyQueryActionOnElements();
        } else {
            console.log(
                'On-demand webinar detected, removing all form group wrappers and showing all elements'
            );
            removeAllFormGroupWrappers();
            showElements();
            hideElements();
          applyQueryActionOnElements()
        }
    }

    // Gated page
    if (isGatedPage) {
        console.log('Gated page detected,');
        if (isLiveWebinarPage()) {
            // remvoing on demand form
            console.log('Live webinar detected, removing on demand form and loading form 1024');
            removeFormGroupWrapperbyId('1001');
        } else {
            // removing live form
            console.log('On-demand webinar detected, removing live form and loading form 1001');
            removeFormGroupWrapperbyId('1024');
        }
        loadMarketoScriptForms();
    }
});

function removeFormGroupWrapperbyId(id: string) {
    const formGroupWrapper = document.querySelector(
        `div[as-element="form-group-wrapper"][formid="${id}"]`
    );
    if (formGroupWrapper) {
        formGroupWrapper.remove();
    }
}

function isWebinarPage() {
    const webinarEventTypeDiv = document.querySelector('div[id="webinar-event-type"]');
    if (!webinarEventTypeDiv) {
        console.log('No webinar Page detected');
        return false;
    }
    return true;
}

function isLiveWebinarPage(): boolean {
    const webinarEventTypeDiv = document.querySelector('div[id="webinar-event-type"]');

    if (!webinarEventTypeDiv) {
        //  console.log('No webinar Page detected');
        return false;
    }

    const liveWebinarDiv = webinarEventTypeDiv.querySelector('div[id="live-webinar"]');
    const onDemandWebinarDiv = webinarEventTypeDiv.querySelector('div[id="on-demand-webinar"]');

    if (!liveWebinarDiv || !onDemandWebinarDiv) {
        console.log('Missing webinar type indicators');
        return false;
    }

    const isLive = !liveWebinarDiv.classList.contains('w-condition-invisible');
    console.log(`Webinar type: ${isLive ? 'Live' : 'On-Demand'}`);
    return isLive;
}

function loadMarketoScriptForms() {
    const script1 = document.createElement('script');
    script1.src = '//go.absolute.com/js/forms2/js/forms2.min.js';
    document.body.appendChild(script1);

    // Once the script loads, create and initialize the form
    script1.onload = () => {
        // Check if MktoForms2 is available
        if (typeof MktoForms2 !== 'undefined') {
            console.log('MktoForms2 loaded');
            const formDivs = getAllFormDivs();
            for (const formDiv of formDivs) {
                const formId = getFormId(formDiv as HTMLElement);
                loadForm(formId, formDiv as HTMLElement);
            }
        } else {
            console.error('Error: MktoForms2 is not loaded');
        }
    };
}

function getAllFormDivs(): NodeListOf<Element> {
    const formDivs = document.querySelectorAll('div[as-element="formdiv"]');
    return formDivs;
}

function loadForm(formid: number, div: Element) {
    const formElement = document.createElement('form');
    formElement.id = `mktoForm_${formid}`;
    div.appendChild(formElement);
    MktoForms2.loadForm('//go.absolute.com', '258-HSL-350', formid).whenReady((form: any) => {

        expandLastMarketoField(`mktoForm_${formid}`);
        form.onSuccess((callback: any) => {
            // Form submission succeeded
            console.log('Form submitted successfully');
            // Get the form ID from the submitted form
            const submittedFormId = form.getId();

            // Find the corresponding form div
            const formDiv = document.querySelector(
                `div[as-element="formdiv"][formid="${submittedFormId}"]`
            );

            if (formDiv) {
                // Find success section and form elements
                const successSection = formDiv.querySelector('[as-element="sucess-section"]');
                const formElement = formDiv.querySelector(`#mktoForm_${submittedFormId}`);
                if (successSection instanceof HTMLElement) {
                    if (successSection.hasAttribute('as-display')) {
                        successSection.style.setProperty(
                            'display',
                            successSection.getAttribute('as-display') || 'block',
                            'important'
                        );
                    } else {
                        successSection.style.setProperty('display', 'block', 'important');
                    }
                }
                if (formElement instanceof HTMLElement) {
                    formElement.style.setProperty('display', 'none', 'important');
                }
            }

            hideElements(true);
            showElements(true, true);

            const scrollElement = document.querySelector('[as-scrollto="true"]') as HTMLElement;
            if (scrollElement instanceof HTMLElement) {
                // disable scroll sitewide
               // scrollElement.scrollIntoView({ behavior: 'smooth' });
            }

            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'marketo-form-submitted',
                form: formid
            });

            return false;
            // Return false to prevent the submission from continuing
        });

       
        // Update submit button text if it exists
        const submitButton = div.getAttribute('form-submittext');
        if (submitButton) {
            form.getFormElem().find('button[type="submit"]').text(submitButton);
        }
    

        form.onSubmit((callback: any) => {
            // Hide Marketo form after submission
            form.getFormElem().hide();
            return false;
        });
        
    });


}

function getFormId(div: HTMLElement): number {
    return parseInt(div.getAttribute('formid') || '', 10);
}

function hideElements(hideElementOfFormGroupWrapper: boolean = false) {
    const elementsToHide = document.querySelectorAll(
        '[as-formaction="hide"]'
    ) as NodeListOf<HTMLElement>;
    elementsToHide.forEach((element) => {
        const parentFormGroupWrapper = element.closest('[as-element="form-group-wrapper"]');
        if (parentFormGroupWrapper && !hideElementOfFormGroupWrapper) {
            return;
        }
        element.style.setProperty('display', 'none', 'important');
    });
}

function showElements(showFormSuccess: boolean = false, showElementOfFormGroupWrapper: boolean = false) {
    const elementsToShow = document.querySelectorAll(
        '[as-formaction="show"]'
    ) as NodeListOf<HTMLElement>;

    elementsToShow.forEach((element) => {
        const parentFormGroupWrapper = element.closest('[as-element="form-group-wrapper"]');
        if (parentFormGroupWrapper && !showElementOfFormGroupWrapper) {
            return;
        }
        // Skip success section elements unless showFormSuccess is true
        if (element.getAttribute('as-element') === 'sucess-section' && !showFormSuccess) {
            return;
        }

        if (element.hasAttribute('as-display')) {
            element.style.setProperty(
                'display',
                element.getAttribute('as-display') || 'block',
                'important'
            );
        } else {
            element.style.setProperty('display', 'block', 'important');
        }
    });
}

function removeAllFormGroupWrappers() {
    const formGroupWrappers = document.querySelectorAll('div[as-element="form-group-wrapper"]');
    formGroupWrappers.forEach((formGroupWrapper) => {
        formGroupWrapper.remove();
    });
}

function applyQueryActionOnElements() {
    const queryActionElementsToShow = document.querySelectorAll('[as-queryaction="show"]') as NodeListOf<HTMLElement>;
    queryActionElementsToShow.forEach((element) => {
        element.style.setProperty('display', 'block', 'important');
    });

    const queryActionElementsToHide = document.querySelectorAll('[as-queryaction="hide"]') as NodeListOf<HTMLElement>;
    queryActionElementsToHide.forEach((element) => {
        element.style.setProperty('display', 'none', 'important');
    });
}

function expandLastMarketoField(formId = 'mktoForm_1004') {
    const form = document.getElementById(formId);
    if (!form) {
        return;
    }

    const fields = form.querySelectorAll(
        '.mktoFormRow .mktoFieldWrap input:not([type="hidden"]):not([type="checkbox"]), .mktoFormRow .mktoFieldWrap select'
    ) as NodeListOf<HTMLElement>;

    // Skip if even number of fields
    if (fields.length % 2 === 0) {
        return;
    }

    const lastField = [...fields].reverse().find(field => {
        const name = field.getAttribute('name');
        return field.offsetParent !== null && name !== 'Opt_In__c';
    });

    if (!lastField) {
        return;
    }

    const row = lastField.closest('.mktoFormRow');
    if (!row) {
        return;
    }

    const uniqueClass = 'force-span-full';
    row.classList.add(uniqueClass);

    const styleTag = document.createElement('style');
    styleTag.textContent = `
      .${uniqueClass} {
        grid-column-start: 1 !important;
        grid-column-end: -1 !important;
      }
    `;
    document.head.appendChild(styleTag);
}
