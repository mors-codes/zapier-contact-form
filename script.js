// ============================================
// CONFIGURATION - Replace this URL with your Zapier webhook
// ============================================
const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/27631131/4o3bl71/';

// ============================================
// DOM Elements
// ============================================
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

const fullNameInput = document.getElementById('fullName');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const subjectError = document.getElementById('subjectError');
const messageError = document.getElementById('messageError');

// ============================================
// Validation Functions
// ============================================

function validateNotEmpty(value, fieldName) {
    if (!value || value.trim() === '') {
        return `${fieldName} is required`;
    }
    return null;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || email.trim() === '') {
        return 'Email is required';
    }
    
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    
    return null;
}

function showError(input, errorElement, message) {
    input.classList.add('invalid');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function clearError(input, errorElement) {
    input.classList.remove('invalid');
    errorElement.textContent = '';
    errorElement.classList.remove('show');
}

function validateForm() {
    let isValid = true;
    
    clearError(fullNameInput, nameError);
    clearError(emailInput, emailError);
    clearError(subjectInput, subjectError);
    clearError(messageInput, messageError);
    
    const nameValidation = validateNotEmpty(fullNameInput.value, 'Full name');
    if (nameValidation) {
        showError(fullNameInput, nameError, nameValidation);
        isValid = false;
    }
    
    const emailValidation = validateEmail(emailInput.value);
    if (emailValidation) {
        showError(emailInput, emailError, emailValidation);
        isValid = false;
    }
    
    const subjectValidation = validateNotEmpty(subjectInput.value, 'Subject');
    if (subjectValidation) {
        showError(subjectInput, subjectError, subjectValidation);
        isValid = false;
    }
    
    const messageValidation = validateNotEmpty(messageInput.value, 'Message');
    if (messageValidation) {
        showError(messageInput, messageError, messageValidation);
        isValid = false;
    }
    
    return isValid;
}

// ============================================
// UI State Functions
// ============================================

function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

function showSuccessMessage() {
    form.classList.add('hide');
    successMessage.classList.add('show');
}

function showErrorMessage() {
    form.classList.add('hide');
    errorMessage.classList.add('show');
}

function resetForm() {
    form.reset();
    form.classList.remove('hide');
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
    
    clearError(fullNameInput, nameError);
    clearError(emailInput, emailError);
    clearError(subjectInput, subjectError);
    clearError(messageInput, messageError);
}

async function submitFormData(formData) {
    const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
}

async function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        fullName: fullNameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
        timestamp: new Date().toISOString()
    };
    
    try {
        setLoadingState(true);
        
        await submitFormData(formData);
        
        showSuccessMessage();
        
        setTimeout(resetForm, 5000);
        
    } catch (error) {
        console.error('Form submission error:', error);
        
        showErrorMessage();
        
        setTimeout(() => {
            form.classList.remove('hide');
            errorMessage.classList.remove('show');
        }, 5000);
        
    } finally {
        setLoadingState(false);
    }
}

// ============================================
// Real-time validation on input blur
// ============================================

fullNameInput.addEventListener('blur', () => {
    const error = validateNotEmpty(fullNameInput.value, 'Full name');
    if (error) {
        showError(fullNameInput, nameError, error);
    } else {
        clearError(fullNameInput, nameError);
    }
});

emailInput.addEventListener('blur', () => {
    const error = validateEmail(emailInput.value);
    if (error) {
        showError(emailInput, emailError, error);
    } else {
        clearError(emailInput, emailError);
    }
});

subjectInput.addEventListener('blur', () => {
    const error = validateNotEmpty(subjectInput.value, 'Subject');
    if (error) {
        showError(subjectInput, subjectError, error);
    } else {
        clearError(subjectInput, subjectError);
    }
});

messageInput.addEventListener('blur', () => {
    const error = validateNotEmpty(messageInput.value, 'Message');
    if (error) {
        showError(messageInput, messageError, error);
    } else {
        clearError(messageInput, messageError);
    }
});

// ============================================
// Event Listeners
// ============================================

form.addEventListener('submit', handleSubmit);