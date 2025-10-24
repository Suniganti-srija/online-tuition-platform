// Global variables
        let currentUser = null;
        let authToken = null;
        let subjects = [];
        const API_BASE = 'http://localhost:5000/api';
        

        // Utility functions
        function showAlert(type, message) {
            const alertContainer = document.getElementById('alertContainer');
            alertContainer.innerHTML = `
                <div class="alert alert-${type} show">
                    ${message}
                </div>
            `;
            setTimeout(() => {
                alertContainer.innerHTML = '';
            }, 5000);
        }

        function hideAllSections() {
            document.getElementById('heroSection').style.display = 'none';
            document.getElementById('featuresSection').style.display = 'none';
            document.getElementById('authSection').classList.remove('active');
            document.getElementById('dashboardSection').classList.remove('active');
        }

        // Authentication functions
        function showLogin() {
            hideAllSections();
            document.getElementById('authSection').classList.add('active');
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('registerForm').classList.add('hidden');
        }

        function showRegister() {
            hideAllSections();
            document.getElementById('authSection').classList.add('active');
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registerForm').classList.remove('hidden');
        }

        function toggleTutorFields() {
            const role = document.getElementById('registerRole').value;
            const tutorFields = document.getElementById('tutorFields');
            
            if (role === 'tutor') {
                tutorFields.classList.remove('hidden');
            } else {
                tutorFields.classList.add('hidden');
            }
        }

        function addSubject() {
            const subjectInput = document.getElementById('subjectInput');
            const subject = subjectInput.value.trim();
            
            if (subject && !subjects.includes(subject)) {
                subjects.push(subject);
                subjectInput.value = '';
                renderSubjects();
            }
        }

        function removeSubject(subject) {
            subjects = subjects.filter(s => s !== subject);
            renderSubjects();
        }

        function renderSubjects() {
            const container = document.getElementById('subjectsTags');
            container.innerHTML = subjects.map(subject => `
                <span class="subject-tag">
                    ${subject}
                    <span class="remove-subject" onclick="removeSubject('${subject}')">×</span>
                </span>
            `).join('');
        }

        // API functions
        async function handleLogin(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    authToken = data.data.token;
                    currentUser = data.data.user;
                    localStorage.setItem('token', authToken);
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    showDashboard();
                    showAlert('success', 'Login successful!');
                } else {
                    showAlert('error', data.error || 'Login failed');
                }
            } catch (error) {
                showAlert('error', 'Network error occurred');
            }
        }

        async function handleRegister(event) {
            event.preventDefault();
            
            const formData = {
                name: document.getElementById('registerName').value,
                email: document.getElementById('registerEmail').value,
                password: document.getElementById('registerPassword').value,
                role: document.getElementById('registerRole').value,
                phone: document.getElementById('registerPhone').value,
                bio: document.getElementById('registerBio').value,
                subjects: subjects,
                hourlyRate: document.getElementById('registerRate').value
            };

            try {
                const response = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    authToken = data.data.token;
                    currentUser = data.data.user;
                    localStorage.setItem('token', authToken);
                    localStorage.setItem('user', JSON.stringify(currentUser));
                    showDashboard();
                    showAlert('success', 'Account created successfully!');
                } else {
                    showAlert('error', data.error || 'Registration failed');
                }
            } catch (error) {
                showAlert('error', 'Network error occurred');
            }
        }

        async function loadTutors() {
            try {
                const response = await fetch(`${API_BASE}/tutors`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });

                const data = await response.json();

                if (data.success) {
                    renderTutors(data.data);
                }
            } catch (error) {
                console.error('Error loading tutors:', error);
            }
        }

        function renderTutors(tutors) {
            const grid = document.getElementById('tutorGrid');
            
            if (tutors.length === 0) {
                grid.innerHTML = '<p>No tutors available at the moment.</p>';
                return;
            }

            grid.innerHTML = tutors.map(tutor => `
                <div class="tutor-card">
                    <div class="tutor-header">
                        <div style="display: flex; align-items: center; flex: 1;">
                            <div class="tutor-avatar">
                                ${tutor.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h4 style="margin-bottom: 0.25rem;">${tutor.name}</h4>
                                <div class="rating">
                                    ${'★'.repeat(Math.round(tutor.avg_rating || 0))}${'☆'.repeat(5 - Math.round(tutor.avg_rating || 0))}
                                    <span style="color: #666; margin-left: 0.5rem;">
                                        ${tutor.avg_rating ? parseFloat(tutor.avg_rating).toFixed(1) : 'New'} 
                                        (${tutor.review_count || 0} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 1.2rem; font-weight: bold; color: #667eea;">
                                ${tutor.hourly_rate}/hr
                            </div>
                        </div>
                    </div>
                    
                    <p style="color: #666; margin-bottom: 1rem; font-size: 0.9rem;">
                        ${tutor.bio || 'No bio available'}
                    </p>
                    
                    <div style="margin-bottom: 1rem;">
                        ${(tutor.subjects || []).map(subject => 
                            `<span style="display: inline-block; background: #e3f2fd; color: #1976d2; padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; margin: 0.125rem;">${subject}</span>`
                        ).join('')}
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #eee;">
                        <div style="font-size: 0.85rem; color: #666;">
                            📧 ${tutor.email}
                        </div>
                        <button class="btn btn-primary" onclick="bookSession(${tutor.id}, '${tutor.name}')">
                            Book Session
                        </button>
                    </div>
                </div>
            `).join('');
        }
//
        // Store current tutor for booking
let currentBookingTutor = null;
let stripe = null;
let elements = null;
let clientSecret = null;
let currentSessionId = null;

// Initialize Stripe on page load
window.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch(`${API_BASE}/config/stripe`);
        const data = await response.json();
        if (data.success && typeof Stripe !== 'undefined') {
            stripe = Stripe(data.data.publishableKey);
        }
    } catch (error) {
        console.error('Error loading Stripe:', error);
    }
    
    // ... rest of your existing DOMContentLoaded code ...
});

function bookSession(tutorId, tutorName) {
    // Find the tutor data
    fetch(`${API_BASE}/tutors/${tutorId}`, {
        headers: {
            'Authorization': `Bearer ${authToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            currentBookingTutor = data.data;
            showPaymentModal();
        }
    })
    .catch(error => {
        showAlert('error', 'Error loading tutor details');
    });
}

function showPaymentModal() {
    const tutor = currentBookingTutor;
    
    const modal = document.createElement('div');
    modal.id = 'paymentModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h2>Book Session with ${tutor.name}</h2>
                <button class="close-btn" onclick="closePaymentModal()">×</button>
            </div>
            <div class="modal-body">
                <form id="bookingForm" onsubmit="handleBookingSubmit(event)">
                    <div class="form-group">
                        <label for="sessionSubject">Subject</label>
                        <select id="sessionSubject" required>
                            <option value="">Select a subject</option>
                            ${tutor.subjects.map(s => `<option value="${s}">${s}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="sessionDate">Date</label>
                            <input type="date" id="sessionDate" required min="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label for="sessionTime">Time</label>
                            <input type="time" id="sessionTime" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="sessionDuration">Duration</label>
                        <select id="sessionDuration" required onchange="updateTotalAmount()">
                            <option value="30">30 minutes</option>
                            <option value="60" selected>1 hour</option>
                            <option value="90">1.5 hours</option>
                            <option value="120">2 hours</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="sessionNotes">Notes (Optional)</label>
                        <textarea id="sessionNotes" rows="3" placeholder="Any specific topics..."></textarea>
                    </div>
                    
                    <div class="payment-summary">
                        <h3>Payment Summary</h3>
                        <div class="summary-row">
                            <span>Hourly Rate:</span>
                            <span>$${tutor.hourly_rate}</span>
                        </div>
                        <div class="summary-row">
                            <span>Duration:</span>
                            <span id="durationDisplay">60 minutes</span>
                        </div>
                        <div class="summary-row total">
                            <span><strong>Total Amount:</strong></span>
                            <span id="totalAmount"><strong>$${tutor.hourly_rate}</strong></span>
                        </div>
                    </div>
                    
                    <div id="payment-element" style="margin: 1.5rem 0; display: none;"></div>
                    <div id="payment-message" class="hidden"></div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%;" id="submitBtn">
                        Continue to Payment
                    </button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
        currentBookingTutor = null;
        elements = null;
        clientSecret = null;
        currentSessionId = null;
    }
}

function updateTotalAmount() {
    if (!currentBookingTutor) return;
    
    const duration = parseInt(document.getElementById('sessionDuration').value);
    const hourlyRate = currentBookingTutor.hourly_rate;
    const total = (hourlyRate * duration) / 60;
    
    document.getElementById('durationDisplay').textContent = `${duration} minutes`;
    document.getElementById('totalAmount').innerHTML = `<strong>$${total.toFixed(2)}</strong>`;
}

async function handleBookingSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const paymentElement = document.getElementById('payment-element');
    
    // If payment form not shown yet, create payment intent
    if (!clientSecret) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
        
        try {
            const subject = document.getElementById('sessionSubject').value;
            const date = document.getElementById('sessionDate').value;
            const time = document.getElementById('sessionTime').value;
            const duration = parseInt(document.getElementById('sessionDuration').value);
            const notes = document.getElementById('sessionNotes').value;
            
            const sessionDateTime = new Date(`${date}T${time}`).toISOString();
            
            const response = await fetch(`${API_BASE}/sessions/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    tutorId: currentBookingTutor.id,
                    subject,
                    sessionDate: sessionDateTime,
                    duration,
                    notes
                })
            });
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || 'Failed to create payment intent');
            }
            
            clientSecret = data.data.clientSecret;
            currentSessionId = data.data.sessionId;
            
            // Show payment form
            const appearance = { theme: 'stripe' };
            elements = stripe.elements({ clientSecret, appearance });
            const paymentElementComponent = elements.create('payment');
            paymentElementComponent.mount('#payment-element');
            
            paymentElement.style.display = 'block';
            submitBtn.textContent = 'Complete Payment';
            submitBtn.disabled = false;
            
        } catch (error) {
            showAlert('error', error.message);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Continue to Payment';
        }
    } else {
        // Process payment
        await processPayment();
    }
}

async function processPayment() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing Payment...';
    
    try {
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.href },
            redirect: 'if_required'
        });
        
        if (error) {
            throw new Error(error.message);
        }
        
        if (paymentIntent.status === 'succeeded') {
            // Confirm on backend
            const response = await fetch(`${API_BASE}/sessions/${currentSessionId}/confirm-payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    paymentIntentId: paymentIntent.id
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                showAlert('success', 'Session booked successfully!');
                closePaymentModal();
                loadTutors(); // Refresh
            } else {
                throw new Error(data.error);
            }
        }
    } catch (error) {
        showAlert('error', error.message);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Complete Payment';
    }
} 
//
        function showDashboard() {
            hideAllSections();
            document.getElementById('dashboardSection').classList.add('active');
            
            // Update header
            document.querySelector('.nav-buttons button:nth-child(1)').classList.add('hidden');
            document.querySelector('.nav-buttons button:nth-child(2)').classList.add('hidden');
            document.getElementById('logoutBtn').classList.remove('hidden');
            
            // Update user info
            document.getElementById('userName').textContent = currentUser.name;
            document.getElementById('userRole').textContent = currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1);
            
            // Show appropriate dashboard
            if (currentUser.role === 'student') {
                document.getElementById('studentDashboard').classList.remove('hidden');
                document.getElementById('tutorDashboard').classList.add('hidden');
                loadTutors();
            } else {
                document.getElementById('studentDashboard').classList.add('hidden');
                document.getElementById('tutorDashboard').classList.remove('hidden');
            }
        }

        function logout() {
            currentUser = null;
            authToken = null;
            subjects = [];
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Reset UI
            document.getElementById('heroSection').style.display = 'block';
            document.getElementById('featuresSection').style.display = 'grid';
            document.getElementById('authSection').classList.remove('active');
            document.getElementById('dashboardSection').classList.remove('active');
            
            // Reset header
            document.querySelector('.nav-buttons button:nth-child(1)').classList.remove('hidden');
            document.querySelector('.nav-buttons button:nth-child(2)').classList.remove('hidden');
            document.getElementById('logoutBtn').classList.add('hidden');
            
            showAlert('success', 'Logged out successfully');
        }

        // Initialize app
        window.addEventListener('DOMContentLoaded', function() {
            // Check for saved session
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            
            if (savedToken && savedUser) {
                authToken = savedToken;
                currentUser = JSON.parse(savedUser);
                showDashboard();
            }
            
            // Add enter key support for subject input
            document.getElementById('subjectInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubject();
                }
            });
        });

        // Add some interactive effects
        document.addEventListener('mousemove', function(e) {
            const cards = document.querySelectorAll('.feature-card, .tutor-card');
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardX = rect.left + rect.width / 2;
                const cardY = rect.top + rect.height / 2;
                
                const deltaX = mouseX - cardX;
                const deltaY = mouseY - cardY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance < 200) {
                    const intensity = (200 - distance) / 200;
                    const rotateX = (deltaY / 200) * intensity * 5;
                    const rotateY = (deltaX / 200) * intensity * -5;
                    
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${intensity * 10}px)`;
                } else {
                    card.style.transform = '';
                }
            });
        });

        // Smooth scrolling for better UX
        function smoothScrollTo(element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Add loading animation
        function showLoading(button) {
            const originalText = button.textContent;
            button.textContent = 'Loading...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        }

        // Form validation
        function validateForm(formId) {
            const form = document.getElementById(formId);
            const inputs = form.querySelectorAll('input[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#dc3545';
                    isValid = false;
                } else {
                    input.style.borderColor = '#e1e5e9';
                }
            });
            
            return isValid;
        }

        // Enhanced error handling
        function handleApiError(error, context = 'Operation') {
            console.error(`${context} failed:`, error);
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                showAlert('error', 'Unable to connect to server. Please check if the backend is running.');
            } else if (error.status === 401) {
                showAlert('error', 'Session expired. Please log in again.');
                logout();
            } else if (error.status === 403) {
                showAlert('error', 'Access denied. Insufficient permissions.');
            } else if (error.status >= 500) {
                showAlert('error', 'Server error. Please try again later.');
            } else {
                showAlert('error', error.message || `${context} failed. Please try again.`);
            }
        }

        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Escape key to close modals/forms
            if (e.key === 'Escape') {
                if (document.getElementById('authSection').classList.contains('active')) {
                    logout();
                }
            }
            
            // Ctrl+Enter to submit forms
            if (e.ctrlKey && e.key === 'Enter') {
                const activeForm = document.querySelector('form:not(.hidden)');
                if (activeForm) {
                    activeForm.dispatchEvent(new Event('submit'));
                }
            }
        });

        // Progressive Web App features
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                // Register service worker here if needed
                console.log('Service Worker support detected');
            });
        }

        // Accessibility improvements
        function improveAccessibility() {
            // Add aria-labels to interactive elements
            document.querySelectorAll('button').forEach(button => {
                if (!button.getAttribute('aria-label')) {
                    button.setAttribute('aria-label', button.textContent.trim());
                }
            });
            
            // Add role attributes
            document.querySelectorAll('.feature-card').forEach(card => {
                card.setAttribute('role', 'article');
            });
            
            // Add keyboard navigation
            document.querySelectorAll('.btn').forEach(button => {
                button.setAttribute('tabindex', '0');
            });
        }

        // Call accessibility improvements on load
        window.addEventListener('DOMContentLoaded', improveAccessibility);

        // Performance optimization
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        // Debounced search function for future search feature
        const debouncedSearch = debounce(function(searchTerm) {
            console.log('Searching for:', searchTerm);
            // Implement search functionality here
        }, 300);