/* eslint-disable */

window.Webflow ||= [];
window.Webflow.push(() => {
    console.log('Webflow is here');
    // Create and load the Marketo Forms 2 script
    const script1 = document.createElement('script');
    script1.src = '//go.absolute.com/js/forms2/js/forms2.min.js';
    document.body.appendChild(script1);

    // Once the script loads, create and initialize the form
    script1.onload = () => {
        // Check if MktoForms2 is available
        if (typeof MktoForms2 !== 'undefined') {
            console.log('MktoForms2 is loaded');
            const formDivs = getAllFormDivs();
            for (const formDiv of formDivs) {
                const formId = getFormId(formDiv as HTMLElement);
                loadForm(formId, formDiv as HTMLElement);
            }
        } else {
            console.error('Error: MktoForms2 is not loaded');
        }
    };
});

function getAllFormDivs(): NodeListOf<Element> {
    const formDivs = document.querySelectorAll('div[as-element="formdiv"]');
    return formDivs;
}


function getFormElementById(formid: number, div: Element) {

}


function loadForm(formid: number, div: Element) {
    const formElement = document.createElement('form');
    formElement.id = `mktoForm_${formid}`;
    div.appendChild(formElement);
    MktoForms2.loadForm("//go.absolute.com", "258-HSL-350", formid)
        .whenReady((form: any) => {
            form.onSuccess((callback: any) => {

                // Form submission succeeded
                console.log("Form submitted successfully");
                console.log("Values:", callback);
                // Get the form ID from the submitted form
                const submittedFormId = form.getId();

                // Find the corresponding form div
                const formDiv = document.querySelector(`div[as-element="formdiv"][formid="${submittedFormId}"]`);

                if (formDiv) {
                    console.log("Form div found", formDiv);
                    // Find success section and form elements
                    const successSection = formDiv.querySelector('[as-element="sucess-section"]');
                    const formElement = formDiv.querySelector(`#mktoForm_${submittedFormId}`);

                    // Show success section and hide form
                    if (successSection) {
                        successSection.classList.remove('hide');
                    }
                    if (formElement) {
                        formElement.classList.remove('mktoForm');
                    }

                }


                // Find all elements with onFormSubmit="hide" and add hide class
                const elementsToHide = document.querySelectorAll('[as-formaction="hide"]');
                elementsToHide.forEach(element => {
                    element.classList.add('hide');
                });

                // Find all elements with onFormSubmit="show" and remove hide class
                const elementsToShow = document.querySelectorAll('[as-formaction="show"]');
                elementsToShow.forEach(element => {
                    element.classList.remove('hide');
                });
                return false;
                // Return false to prevent the submission from continuing
            });

            form.onSubmit((callback: any) => {
                console.log("Form is being submitted", callback);
                form.getFormElem().hide();
                // Form is being submitted

                // Return true to allow the submission to proceed
                return false;
            });
        });
}


function getFormId(div: HTMLElement): number {
    return parseInt(div.getAttribute('formid') || '', 10);
}