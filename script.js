// DOM Elements
const patientCard = document.querySelector('.patient-card');
const doctorCard = document.querySelector('.doctor-card');
const patientBtn = document.querySelector('.patient-btn');
const doctorBtn = document.querySelector('.doctor-btn');
const logo = document.querySelector('.logo');

// Card Click Handlers
patientCard.addEventListener('click', () => {
    handleCardSelection('patient');
});

doctorCard.addEventListener('click', () => {
    handleCardSelection('doctor');
});

// Button Click Handlers
patientBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    redirectToPatientPortal();
});

doctorBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    redirectToDoctorPortal();
});

// Logo Click Handler
logo.addEventListener('click', () => {
    window.location.reload();
});

// Handle Card Selection
function handleCardSelection(role) {
    const selectedCard = role === 'patient' ? patientCard : doctorCard;
    const otherCard = role === 'patient' ? doctorCard : patientCard;
    
    // Add selection effect
    selectedCard.style.transform = 'scale(1.02)';
    selectedCard.style.borderColor = 'rgba(255, 255, 255, 0.4)';
    otherCard.style.opacity = '0.7';
    
    // Reset after animation
    setTimeout(() => {
        selectedCard.style.transform = '';
        selectedCard.style.borderColor = '';
        otherCard.style.opacity = '';
    }, 300);
}

// Redirect Functions
function redirectToPatientPortal() {
    // Add loading animation
    patientBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        // Replace with actual patient portal URL
        window.location.href = 'patient-portal.html';
    }, 1000);
}

function redirectToDoctorPortal() {
    // Add loading animation
    doctorBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    setTimeout(() => {
        // Replace with actual doctor portal URL
        window.location.href = 'doctor-portal.html';
    }, 1000);
}

// Smooth Scroll Animation for Page Load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Interactive Background Effect
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const bgShift = `${50 + mouseX * 5}% ${50 + mouseY * 5}%`;
    document.body.style.backgroundPosition = bgShift;
});

// Card Hover Effects
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

// Feature Items Animation
const featureItems = document.querySelectorAll('.feature-item');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

featureItems.forEach(item => {
    observer.observe(item);
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('card')) {
            focusedElement.click();
        }
    }
});

// Add keyboard accessibility
cards.forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Select ${card.dataset.role} portal`);
});

// Error Handling for Navigation
function handleNavigationError(role) {
    const button = role === 'patient' ? patientBtn : doctorBtn;
    button.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Try Again`;
    button.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    
    setTimeout(() => {
        button.innerHTML = `Get Started as ${role.charAt(0).toUpperCase() + role.slice(1)} <i class="fas fa-arrow-right"></i>`;
        button.style.background = '';
    }, 2000);
}

// Performance Optimization
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Debounced mouse move for better performance
const debouncedMouseMove = debounce((e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    const bgShift = `${50 + mouseX * 2}% ${50 + mouseY * 2}%`;
    document.body.style.backgroundPosition = bgShift;
}, 16);

document.addEventListener('mousemove', debouncedMouseMove);