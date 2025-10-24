## 🎯 Overview

TutorConnect Frontend is a modern, responsive web application that connects students with qualified tutors. It provides an intuitive interface for browsing tutors, bood manage your tutor profile king sessions, and managing payments.

## ✨ Features

### For Students
- 🔍 **Browse Tutors** - Search and filter tutors by subject, rating, and expertise
- 📅 **Book Sessions** - Schedule tutoring sessions at convenient times
- 💳 **Secure Payments** - Pay securely via Stripe integration
### For Tutors
- 📝 **Profile Management** - Create an
- 💼 **Session Management** - View and manage student bookings
- 💰 **Earnings Tracking** - Monitor your payments and earnings
- 📈 **Performance Metrics** - View your ratings and reviews

### General
- 🔐 **Secure Authentication** - JWT-based login and registration
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- ⚡ **Fast Performance** - Optimized for speed and efficiency

## 🛠 Tech Stack

### HTML + Vanilla JavaScript Version
- HTML5 - Semantic markup
- CSS3 - Custom styling with animations
- JavaScript - No framework dependencies
- Stripe.js - Payment processing


## 📦 Prerequisites

- **Web Browser** (Chrome, Firefox, Safari, Edge)
- **Text Editor/IDE** (VS Code recommended)
- **Basic knowledge** of HTML/CSS/JavaScript or React

## 🚀 Installation

### Option 1: HTML/JavaScript Version

#### Step 1: Create Project Structure

```bash
mkdir tutorconnect-frontend
cd tutorconnect-frontend
```

#### Step 2: Create Files

Create the following files:
```
tutorconnect-frontend/
├── index.html
├── style.css
├── payment-styles.css
├── script-with-payment.js
└── README.md
```

### Option 2: React Version

#### Step 1: Create React App

```bash
npx create-react-app tutorconnect-frontend
cd tutorconnect-frontend
```

#### Step 2: Install Dependencies

```bash
npm install lucide-react
```

#### Step 3: Add Stripe

Add to `public/index.html` inside `<head>`:
```html
<script src="https://js.stripe.com/v3/"></script>
```

#### Step 4: Copy Component

Replace `src/App.js` with the provided React component code.

## 📁 Project Structure

### HTML/JavaScript Version

```
tutorconnect-frontend/
├── index.html              # Main HTML file
├── style.css               # Base styles
├── payment-styles.css      # Payment modal styles
├── script-with-payment.js  # Application logic with Stripe
├── assets/                 # Images and media (optional)
│   └── logo.png
└── README.md              # This file
```



## ⚙️ Configuration

### Backend API URL

Update the API base URL in your JavaScript/React file:

**JavaScript Version (`script-with-payment.js`):**
```javascript
const API_BASE = 'http://localhost:5000/api';
```

**React Version (`App.js`):**
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

### Stripe Configuration

Stripe is automatically configured from the backend. No frontend configuration needed!

The publishable key is fetched from:
```
GET http://localhost:5000/api/config/stripe
```
ConceptTutorConnect is an online platform designed to connect students with expert tutors for one-on-one sessions. 
## The application supports user registration with role-based access (Student or Tutor) and facilitates secure session booking and payment processing. This frontend is built entirely using Vanilla JavaScript, HTML, and CSS, demonstrating core web development proficiency without relying on large frameworks.
## Features ImplementedThe following features have been implemented and synchronized with the backend API:User Management & AuthenticationRole-Based Registration: Users can sign up as either a student or a tutor. Tutors are required to provide additional details like subjects and hourly rate.JWT Authentication: User sessions are managed using JSON Web Tokens (JWT) stored in Local Storage.
## Role-Based Dashboards: After login, users are routed to the appropriate dashboard (Student or Tutor).
Tutor & Session ManagementTutor Listing: Logged-in students can view a grid of available tutors, complete with details like name, rating, subjects, and hourly rate.Interactive Booking Modal: Students can click "Book Session" to open a dynamic modal for scheduling and payment summary.
## Payment IntegrationStripe Ready: The application loads the Stripe SDK and uses a multi-step process for secure payment.
Payment Intent Flow: The client initiates a payment intent request, receives a clientSecret from the backend, and mounts the official Stripe Payment Element for transaction completion.Integration and Necessary Frontend CorrectionThe core integration point is the API_BASE variable in script.js.Current Setting (in script.js):JavaScriptconst API_BASE = 'http://localhost:5000/api';
## Problem: Your script.js file uses two sub-paths that do not match the routes defined in your backend's server.js file, which will cause a 404 Not Found error even if the server is running.
## Frontend Call (in script.js)Current URL BuiltBackend Route (in server.js)Correction Needed in script.jshandleLogin/api/auth/login/api/loginRemove /authhandleRegister/api/auth/register/api/registerRemove /authFixes for script.jsYou must correct the URLs in your handleLogin and handleRegister functions in script.js to remove the redundant /auth path:JavaScript// Correction for handleLogin
// Find this line:
// const response = await fetch(`${API_BASE}/auth/login`, {
// Change it to:
const response = await fetch(`${API_BASE}/login`, { // FIXED

// Correction for handleRegister
// Find this line:
// const response = await fetch(`${API_BASE}/auth/register`, {
// Change it to:
const response = await fetch(`${API_BASE}/register`, { // FIXED
Future Improvements for Backend IntegrationTo complete the project, the following features are still needed or require synchronization:
Full Stripe Implementation: The backend requires the final code to successfully call the Stripe API for payment intent creation and confirmation.
The frontend currently relies on these two routes to succeed.Required Backend Route Logic: /api/sessions/create-payment-intent and /api/sessions/:id/confirm-payment.
Tutor Details Fetch: The bookSession function in script.js attempts to fetch a single tutor's details via a GET request to /api/tutors/${tutorId}. 
This specific route is not yet defined in your server.js file and needs to be implemented.
Tutor Dashboard Content: The tutor dashboard currently displays only a placeholder message. Future work should implement the /api/sessions GET route for tutors to view their upcoming and pending sessions.
Review Submission: Implementation of the frontend form to allow students to submit reviews using the /api/reviews POST route after a session status is marked 'completed'.

## 🎮 Running the Application

### Option 1: VS Code Live Server (Recommended)

1. Install **Live Server** extension in VS Code
2. Right-click `index.html`
3. Select **"Open with Live Server"**
4. Automatically opens at `http://localhost:5501`


## 🎨 Available Versions

### 1. Basic HTML Version (No Payment)
- Simple authentication
- Tutor browsing
- Basic booking (no payment)
- Uses: `script.js` (original)

### 2. HTML + Payment Integration
- Full authentication
- Tutor browsing with search
- Complete booking with Stripe
- Payment processing
- Uses: `script-with-payment.js`

### 3. React Version
- Modern component-based architecture
- State management with Context API
- Responsive design
- Full feature parity with HTML version
- Uses: React components

## 📖 User Guide

### For Students

#### 1. Registration

1. Click **"Sign Up"** button
2. Fill in your details:
   - Full Name
   - Email
   - Password
   - Select **"Student"** role
3. Click **"Create Account"**

#### 2. Browse Tutors

1. Login with your credentials
2. View all available tutors
3. Use search bar to filter tutors
4. View tutor details:
   - Rating and reviews
   - Hourly rate
   - Subjects taught
   - Bio and experience

#### 3. Book a Session

1. Click **"Book Session"** on tutor card
2. Select:
   - Subject
   - Date and time
   - Duration (30 min, 1 hr, 1.5 hr, 2 hr)
3. Add optional notes
4. Review payment summary
5. Enter payment details:
   - **Test Card**: 4242 4242 4242 4242
   - **Expiry**: Any future date
   - **CVC**: Any 3 digits
   - **ZIP**: Any 5 digits
6. Click **"Complete Payment"**
7. Receive meeting link

#### 4. Manage Sessions

1. View upcoming sessions in dashboard
2. Join session via meeting link
3. Mark sessions as complete
4. Cancel if needed

#### 5. Leave Reviews

1. After session completion
2. Click on completed session
3. Rate tutor (1-5 stars)
4. Write optional comment
5. Submit review

### For Tutors

#### 1. Registration

1. Click **"Sign Up"** button
2. Fill in your details
3. Select **"Tutor"** role
4. Add:
   - Phone number
   - Bio (teaching experience)
   - Subjects (use dropdown)
   - Hourly rate
5. Click **"Create Account"**

#### 2. Manage Profile

1. Login with credentials
2. View your profile
3. Update availability (coming soon)

#### 3. View Bookings

1. Check dashboard for new bookings
2. View session details
3. Prepare for sessions

#### 4. Conduct Sessions

1. Join meeting via link
2. Teach scheduled session
3. Mark as complete when done

## 💳 Payment Integration

### How It Works

1. **Student initiates booking** → Creates session request
2. **Backend creates payment intent** → Stripe generates client secret
3. **Frontend displays payment form** → Stripe Elements UI
4. **Student enters card details** → Securely collected by Stripe
5. **Payment processed** → Confirmation sent to backend
6. **Session confirmed** → Meeting link generated

### Payment Flow Diagram

```
Student → Select Tutor & Details
    ↓
Backend → Create Payment Intent (Stripe)
    ↓
Frontend → Show Stripe Payment Form
    ↓
Student → Enter Card Details
    ↓
Stripe → Process Payment
    ↓
Backend → Confirm & Create Session
    ↓
Frontend → Show Meeting Link
```

### Test Cards

| Card Number | Result | Use Case |
|------------|--------|----------|
| 4242 4242 4242 4242 | ✅ Success | Normal payment |
| 4000 0000 0000 0002 | ❌ Declined | Test error handling |
| 4000 0000 0000 9995 | ❌ Insufficient Funds | Test decline |

- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

### Payment Security

- ✅ PCI compliant (Stripe handles sensitive data)
- ✅ HTTPS required in production

## 🎨 Customization

### Change Colors

In `style.css`, update CSS variables:

```css
:root {
  --primary-color: #667eea;      /* Main brand color */
  --secondary-color: #764ba2;    /* Accent color */
  --success-color: #48bb78;      /* Success messages */
  --error-color: #f56565;        /* Error messages */
}
```

### Modify Logo

Replace the SVG in `index.html`:

```html
<div class="logo">
  <img src="assets/logo.png" alt="TutorConnect">
  TutorConnect
</div>
```

### Add Features

Common customizations:

1. **Add profile pictures**: Update tutor card avatar
2. **Add filters**: Subject, price range, availability
3. **Add notifications**: Toast messages for actions
4. **Add chat**: Real-time messaging (Socket.io)
5. **Add calendar**: Google Calendar integration

### Change Layout

Modify grid layout in `style.css`:

```css
.tutor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}
```
