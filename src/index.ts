/* eslint-disable */
window.Webflow ||= [];
window.Webflow.push(() => {
  const form = document.getElementById('wf-form-Quote-Form');
  form?.addEventListener('submit', (e) => {
    ValidateQuoteFormAndRedirect(e);
  });
});

enum ErrorElements {
  Coverage = '[pm-element=coverage-error]',
  SelfDob = '[pm-element=self-dob-error]',
  SelfGender = '[pm-element=self-gender-error]',
  SelfSmoke = '[pm-element=self-smoke-error]',
  PartnerDob = '[pm-element=partner-dob-error]',
  PartnerGender = '[pm-element=partner-gender-error]',
  PartnerSmoke = '[pm-element=partner-smoke-error]'
}

function resetAllErrors() {
  const errorElements = document.querySelectorAll('.form-group_error');
  errorElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      element.innerText = "Required Field";
      element.style.display = 'none';
    }
  });
}

function showError(errorType: string, message?: string) {
  const element = document.querySelector(errorType);
  if (element instanceof HTMLElement) {
    element.style.display = 'block';
    if(message) {
      element.innerText = message;
    }
  }
}

function isAgeValid(dob: string): boolean {
    const day = parseInt(dob.substring(0, 2));
    const month = parseInt(dob.substring(2, 4)) - 1; // Months are 0-based in JS
    const year = parseInt(dob.substring(4, 8));
    
    const birthDate = new Date(year, month, day);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  }

function ValidateQuoteFormAndRedirect(e) {
  resetAllErrors();
  const BASE_URL = "https://www.policyme.com/life/";
  let folder = (e.target as HTMLFormElement).getAttribute('folder') || 'life';
  e.preventDefault();
  e.stopPropagation();
  let coverageValue = getRadioGroupValue('pm-element=coverage-radio-group');
  let selfGenderValue = getRadioGroupValue('pm-element=self-gender-radio-group');
  let partnerGenderValue = getRadioGroupValue('pm-element=partner-gender-radio-group');
  let selfSmokerValue = getRadioGroupValue('pm-element=self-smoker-radio-group');
  let partnerSmokerValue = getRadioGroupValue('pm-element=partner-smoker-radio-group');
  let selfDobValue = getDobValue('pm-dob-id="self"');
  let partnerDobValue = null;

  let hasError = false;

  if (!coverageValue) {
    showError(ErrorElements.Coverage);
    hasError = true;
  }

  if (!selfDobValue) {
    showError(ErrorElements.SelfDob);
    hasError = true;
  }

  if(selfDobValue && !isAgeValid(selfDobValue)) {
    showError(ErrorElements.SelfDob, "Age must be 18 years or older.");
    hasError = true;
  }

  if (!selfGenderValue) {
    showError(ErrorElements.SelfGender);
    hasError = true;
  }

  if (!selfSmokerValue) {
    showError(ErrorElements.SelfSmoke);
    hasError = true;
  }

  if (coverageValue === 'partner') {
    partnerDobValue = getDobValue('pm-dob-id="partner"');
    if (!partnerDobValue) {
      showError(ErrorElements.PartnerDob);
      hasError = true;
    }

    if(partnerDobValue && !isAgeValid(partnerDobValue)) {
      showError(ErrorElements.PartnerDob, "Age must be 18 years or older.");
      hasError = true;
    }

    if (!partnerGenderValue) {
      showError(ErrorElements.PartnerGender);
      hasError = true;
    }

    if (!partnerSmokerValue) {
      showError(ErrorElements.PartnerSmoke);
      hasError = true;
    }
  }

  if (hasError) {
    return;
  }

  // Get current URL parameters and filter out UTM params
  const currentUrlParams = new URLSearchParams(window.location.search);
  const filteredParams = Array.from(currentUrlParams.entries())
    .filter(([key]) => !key.toLowerCase().startsWith('utm_'))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

  // Convert filtered params back to query string
  const existingQueryParams = Object.entries(filteredParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

  // Build query string
  let queryString = `birthdate=${selfDobValue}&smoker=${selfSmokerValue}&gender=${selfGenderValue === 'male' ? 'M' : 'F'}`;

  if (coverageValue === 'partner') {
    queryString += `&partner=true&partner_smoker=${partnerSmokerValue}&partner_birthdate=${partnerDobValue}&partner_gender=${partnerGenderValue === 'male' ? 'M' : 'F'}`;
  }

  if(existingQueryParams) {
    queryString += `&${existingQueryParams}`;
  }
  
  const redirectUrl = `${BASE_URL}${folder}/life-insurance-quotes-continued?${queryString}`;
  window.open(redirectUrl, '_blank');
}

function getRadioGroupValue(attribute: string) {
  const radioGroup = document.querySelector(`[${attribute}]`) as HTMLFieldSetElement;
  if (!radioGroup) {
    return null;
  }
  const checkedRadio = radioGroup.querySelector('input[type="radio"]:checked') as HTMLInputElement;
  return checkedRadio?.value;
}

function getDobValue(pickerId: string) {

  let dobPicker = document.querySelector(`[${pickerId}]`) as HTMLFieldSetElement;

  if (!dobPicker) {
    return null;
  }

  const daySelect = dobPicker.querySelector('[pm-element="birth-day"]') as HTMLSelectElement;
  const monthSelect = dobPicker.querySelector('[pm-element="birth-month"]') as HTMLSelectElement;
  const yearSelect = dobPicker.querySelector('[pm-element="birth-year"]') as HTMLSelectElement;

  if (!daySelect?.value) {
    return null;
  }

  if (!monthSelect?.value) {
    return null;
  }

  if (!yearSelect?.value) {
    return null;
  }

  // Pad day and month with leading zeros if needed
  const day = daySelect.value.padStart(2, '0');
  const month = monthSelect.value.padStart(2, '0');
  const year = yearSelect.value;

  return `${day}${month}${year}`;

}
