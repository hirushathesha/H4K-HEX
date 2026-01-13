// ===== GLOBAL VARIABLES =====
let currentUser = null;
let currentAdmin = null;
let currentTab = 'home';
let products = [];
let users = [];
let purchases = [];
let feedback = [];
let projects = [];
let selectedRating = 0;
let currentProduct = null;

// ===== ADMIN CREDENTIALS (HARDCODED FOR DEMO) =====
const ADMIN_CREDENTIALS = {
    email: 'admin@h4k.com',
    password: 'admin123'
};

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize data from localStorage or set defaults
    initializeData();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial content
    loadInitialContent();
    
    // Hide loading screen after everything is loaded
    setTimeout(() => {
        hideLoadingScreen();
    }, 3000);
}

function initializeData() {
    // Load products
    products = JSON.parse(localStorage.getItem('h4k_products')) || getDefaultProducts();
    
    // Load users
    users = JSON.parse(localStorage.getItem('h4k_users')) || [];
    
    // Load purchases
    purchases = JSON.parse(localStorage.getItem('h4k_purchases')) || [];
    
    // Load feedback
    feedback = JSON.parse(localStorage.getItem('h4k_feedback')) || getDefaultFeedback();
    
    // Load projects
    projects = JSON.parse(localStorage.getItem('h4k_projects')) || getDefaultProjects();
    
    // Check if user is logged in
    const savedUser = localStorage.getItem('h4k_current_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateNavigationForLoggedInUser();
    }
    
    // Check if admin is logged in
    const savedAdmin = localStorage.getItem('h4k_current_admin');
    if (savedAdmin) {
        currentAdmin = JSON.parse(savedAdmin);
        updateNavigationForAdmin();
    }
}

function getDefaultProducts() {
    return [
        {
            id: 1,
            name: "Windows Optimizer Pro",
            description: "Advanced system optimization tool that cleans.",
            version: "v3.5.1",
            price: 2.99,
            downloadLink: "https://www.mediafire.com/view/mkhvim47jmy6du2/Screenshot_13-1-2026_72622_dashboard.emailjs.com.jpeg/file",
            enabled: true
        },
        {
            id: 2,
            name: "File Encryptor Ultimate",
            description: "Military-grade file encryption software with advanced security features.",
            version: "v1.8.0",
            price: 79.99,
            downloadLink: "https://example.com/download/file-encryptor-ultimate.exe",
            enabled: true
        },
        {
            id: 3,
            name: "Network Monitor X",
            description: "Comprehensive network monitoring and analysis tool for professionals.",
            version: "v3.2.4",
            price: 99.99,
            downloadLink: "https://example.com/download/network-monitor-x.exe",
            enabled: true
        },
        {
            id: 4,
            name: "Data Recovery Master",
            description: "Recover lost or deleted files from any storage device with high success rate.",
            version: "v4.1.2",
            price: 129.99,
            downloadLink: "https://example.com/download/data-recovery-master.exe",
            enabled: true
        }
    ];
}

function getDefaultFeedback() {
    return [
        {
            id: 1,
            name: "Alex Johnson",
            rating: 5,
            comment: "Excellent software quality and fast delivery. The System Optimizer Pro really improved my PC performance!",
            date: new Date().toISOString()
        },
        {
            id: 2,
            name: "Sarah Miller",
            rating: 4,
            comment: "Great web development services. Professional approach and stunning design.",
            date: new Date().toISOString()
        },
        {
            id: 3,
            name: "Mike Chen",
            rating: 5,
            comment: "H4K delivered exactly what I needed. The File Encryptor Ultimate is worth every penny!",
            date: new Date().toISOString()
        }
    ];
}

function getDefaultProjects() {
    return [
        {
            id: 1,
            title: "E-Commerce Platform",
            description: "Modern e-commerce website with advanced features and payment integration.",
            tech: ["React", "Node.js", "MongoDB", "Stripe"],
            image: "🛒"
        },
        {
            id: 2,
            title: "CRM Dashboard",
            description: "Comprehensive customer relationship management system with analytics.",
            tech: ["Vue.js", "Python", "PostgreSQL", "Chart.js"],
            image: "📊"
        },
        {
            id: 3,
            title: "Mobile Banking App",
            description: "Secure mobile banking application with biometric authentication.",
            tech: ["React Native", "Firebase", "Node.js", "JWT"],
            image: "🏦"
        },
        {
            id: 4,
            title: "AI Chatbot",
            description: "Intelligent customer support chatbot with natural language processing.",
            tech: ["Python", "TensorFlow", "Flask", "Redis"],
            image: "🤖"
        }
    ];
}

function setupEventListeners() {
    // Navigation menu
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            showTab(tabName);
        });
    });

    // Hamburger menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Authentication forms
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);

    // Feedback form
    document.getElementById('feedback-form').addEventListener('submit', handleFeedbackSubmit);
    
    // Star rating
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.getAttribute('data-rating'));
            updateStarDisplay();
        });
    });

    // Payment form
    document.getElementById('payment-form').addEventListener('submit', handlePayment);

    // Add product form
    document.getElementById('add-product-form').addEventListener('submit', handleAddProduct);

    // Modal close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

function loadInitialContent() {
    loadProducts();
    loadProjects();
    loadFeedback();
    updateUserDashboard();
    updateAdminPanels();
}

// ===== LOADING SCREEN =====
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// ===== NAVIGATION =====
function showTab(tabName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(tabName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active class to nav item
    const navItem = document.querySelector(`[data-tab="${tabName}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }
    
    // Update current tab
    currentTab = tabName;
    
    // Close mobile menu
    document.querySelector('.nav-menu').classList.remove('active');
    
    // Special handling for protected routes
    if (tabName === 'dashboard' && !currentUser) {
        showTab('login');
        return;
    }
    
    if (tabName === 'admin' && !currentAdmin) {
        showAdminLogin();
        return;
    }
    
    // Load specific content for certain tabs
    if (tabName === 'dashboard') {
        updateUserDashboard();
    } else if (tabName === 'admin') {
        updateAdminPanels();
    }
}

function updateNavigationForLoggedInUser() {
    // Hide login/register tabs, show dashboard
    document.querySelector('[data-tab="login"]').classList.add('hidden');
    document.querySelector('[data-tab="register"]').classList.add('hidden');
    document.querySelector('[data-tab="dashboard"]').classList.remove('hidden');
}

function updateNavigationForAdmin() {
    // Show admin tab
    document.querySelector('[data-tab="admin"]').classList.remove('hidden');
}

// ===== AUTHENTICATION =====
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Check if it's admin login
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        currentAdmin = { email, role: 'admin' };
        localStorage.setItem('h4k_current_admin', JSON.stringify(currentAdmin));
        updateNavigationForAdmin();
        showTab('admin');
        showNotification('Admin login successful!', 'success');
        document.getElementById('login-form').reset();
        return;
    }
    
    // Check user credentials
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('h4k_current_user', JSON.stringify(currentUser));
        updateNavigationForLoggedInUser();
        showTab('dashboard');
        showNotification('Login successful!', 'success');
        document.getElementById('login-form').reset();
    } else {
        showNotification('Invalid email or password!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        showNotification('User with this email already exists!', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('h4k_users', JSON.stringify(users));
    
    showNotification('Registration successful! Please login.', 'success');
    document.getElementById('register-form').reset();
    showTab('login');
}

function logout() {
    currentUser = null;
    currentAdmin = null;
    localStorage.removeItem('h4k_current_user');
    localStorage.removeItem('h4k_current_admin');
    
    // Reset navigation
    document.querySelector('[data-tab="login"]').classList.remove('hidden');
    document.querySelector('[data-tab="register"]').classList.remove('hidden');
    document.querySelector('[data-tab="dashboard"]').classList.add('hidden');
    document.querySelector('[data-tab="admin"]').classList.add('hidden');
    
    showTab('home');
    showNotification('Logged out successfully!', 'success');
}

function showAdminLogin() {
    // Simple admin login prompt
    const email = prompt('Admin Email:');
    const password = prompt('Admin Password:');
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        currentAdmin = { email, role: 'admin' };
        localStorage.setItem('h4k_current_admin', JSON.stringify(currentAdmin));
        updateNavigationForAdmin();
        showTab('admin');
        showNotification('Admin login successful!', 'success');
    } else {
        showNotification('Invalid admin credentials!', 'error');
        showTab('home');
    }
}

// ===== PRODUCTS =====
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    const enabledProducts = products.filter(p => p.enabled);
    
    enabledProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const isPurchased = currentUser && purchases.some(p => 
        p.userId === currentUser.id && p.productId === product.id && p.status === 'success'
    );
    
    card.innerHTML = `
        <div class="product-header">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-version">${product.version}</p>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-actions">
            ${isPurchased ? 
                `<button class="btn btn-primary btn-small" onclick="downloadProduct(${product.id})">Download</button>` :
                `<button class="btn btn-primary btn-small" onclick="showPaymentModal(${product.id})">Buy Now</button>`
            }
        </div>
    `;
    
    return card;
}

function showPaymentModal(productId) {
    if (!currentUser) {
        showNotification('Please login to purchase products!', 'warning');
        showTab('login');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentProduct = product;
    
    document.getElementById('payment-product-name').textContent = product.name;
    document.getElementById('payment-product-description').textContent = product.description;
    document.getElementById('payment-product-price').textContent = product.price.toFixed(2);
    
    document.getElementById('payment-modal').style.display = 'block';
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
    currentProduct = null;
}

function handlePayment(e) {
    e.preventDefault();
    
    if (!currentUser || !currentProduct) return;
    
    // Simulate payment processing
    const paymentData = {
        id: Date.now(),
        userId: currentUser.id,
        productId: currentProduct.id,
        amount: currentProduct.price,
        status: 'success',
        date: new Date().toISOString()
    };
    
    purchases.push(paymentData);
    localStorage.setItem('h4k_purchases', JSON.stringify(purchases));
    
    closePaymentModal();
    loadProducts(); // Refresh products to show download button
    updateUserDashboard();
    
    showNotification('Payment successful! You can now download your software.', 'success');
    document.getElementById('payment-form').reset();
}

function downloadProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Simulate download
        showNotification(`Downloading ${product.name}...`, 'success');
        setTimeout(() => {
            showNotification('Download completed!', 'success');
        }, 2000);
    }
}

// ===== PROJECTS =====
function loadProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    projectsGrid.innerHTML = '';
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
    });
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const techTags = project.tech.map(tech => `<span class="tech-tag">${tech}</span>`).join('');
    
    card.innerHTML = `
        <div class="project-image">${project.image}</div>
        <div class="project-info">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tech">${techTags}</div>
        </div>
    `;
    
    return card;
}

// ===== FEEDBACK =====
function loadFeedback() {
    const feedbackContainer = document.getElementById('feedback-container');
    feedbackContainer.innerHTML = '';
    
    feedback.forEach(item => {
        const feedbackCard = createFeedbackCard(item);
        feedbackContainer.appendChild(feedbackCard);
    });
}

function createFeedbackCard(item) {
    const card = document.createElement('div');
    card.className = 'feedback-card';
    
    const stars = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
    const date = new Date(item.date).toLocaleDateString();
    
    card.innerHTML = `
        <div class="feedback-header">
            <span class="feedback-name">${item.name}</span>
            <span class="feedback-rating">${stars}</span>
        </div>
        <p class="feedback-comment">${item.comment}</p>
        <span class="feedback-date">${date}</span>
        ${currentAdmin ? `<button class="btn-danger btn-small" onclick="deleteFeedback(${item.id})">Delete</button>` : ''}
    `;
    
    return card;
}

function showFeedbackForm() {
    if (!currentUser) {
        showNotification('Please login to leave feedback!', 'warning');
        showTab('login');
        return;
    }
    
    document.getElementById('feedback-form-modal').style.display = 'block';
}

function closeFeedbackForm() {
    document.getElementById('feedback-form-modal').style.display = 'none';
    document.getElementById('feedback-form').reset();
    selectedRating = 0;
    updateStarDisplay();
}

function updateStarDisplay() {
    document.querySelectorAll('.star').forEach((star, index) => {
        star.classList.toggle('active', index < selectedRating);
    });
}

function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    if (!currentUser || selectedRating === 0) {
        showNotification('Please select a rating!', 'warning');
        return;
    }
    
    const name = document.getElementById('feedback-name').value;
    const comment = document.getElementById('feedback-comment').value;
    
    const newFeedback = {
        id: Date.now(),
        name: name || currentUser.username,
        rating: selectedRating,
        comment,
        date: new Date().toISOString()
    };
    
    feedback.push(newFeedback);
    localStorage.setItem('h4k_feedback', JSON.stringify(feedback));
    
    closeFeedbackForm();
    loadFeedback();
    showNotification('Thank you for your feedback!', 'success');
}

function deleteFeedback(id) {
    if (!currentAdmin) return;
    
    feedback = feedback.filter(f => f.id !== id);
    localStorage.setItem('h4k_feedback', JSON.stringify(feedback));
    loadFeedback();
    showNotification('Feedback deleted!', 'success');
}

// ===== USER DASHBOARD =====
function updateUserDashboard() {
    if (!currentUser) return;
    
    document.getElementById('user-name').textContent = currentUser.username;
    
    // Load user purchases
    const userPurchases = document.getElementById('user-purchases');
    userPurchases.innerHTML = '';
    
    const userPurchaseData = purchases.filter(p => p.userId === currentUser.id);
    
    if (userPurchaseData.length === 0) {
        userPurchases.innerHTML = '<p style="color: var(--text-secondary);">No purchases yet.</p>';
    } else {
        userPurchaseData.forEach(purchase => {
            const product = products.find(p => p.id === purchase.productId);
            if (product) {
                const purchaseItem = document.createElement('div');
                purchaseItem.className = 'purchase-item';
                purchaseItem.innerHTML = `
                    <h5>${product.name}</h5>
                    <p>Version: ${product.version}</p>
                    <button class="btn btn-primary btn-small" onclick="downloadProduct(${product.id})">Download</button>
                `;
                userPurchases.appendChild(purchaseItem);
            }
        });
    }
    
    // Load payment history
    const paymentHistory = document.getElementById('payment-history');
    paymentHistory.innerHTML = '';
    
    if (userPurchaseData.length === 0) {
        paymentHistory.innerHTML = '<p style="color: var(--text-secondary);">No payment history.</p>';
    } else {
        userPurchaseData.forEach(purchase => {
            const product = products.find(p => p.id === purchase.productId);
            if (product) {
                const paymentItem = document.createElement('div');
                paymentItem.className = 'payment-item';
                paymentItem.innerHTML = `
                    <div>
                        <strong>${product.name}</strong>
                        <br><small>${new Date(purchase.date).toLocaleDateString()}</small>
                    </div>
                    <div>
                        <span class="payment-status ${purchase.status}">${purchase.status}</span>
                        <br><strong>$${purchase.amount.toFixed(2)}</strong>
                    </div>
                `;
                paymentHistory.appendChild(paymentItem);
            }
        });
    }
}

// ===== ADMIN PANEL =====
function showAdminTab(tabName) {
    // Hide all admin panels
    document.querySelectorAll('.admin-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected panel
    document.getElementById(`admin-${tabName}`).classList.add('active');
    
    // Add active class to tab
    event.target.classList.add('active');
}

function updateAdminPanels() {
    if (!currentAdmin) return;
    
    updateProductsTable();
    updateUsersTable();
    updateFeedbackTable();
    updateStatistics();
}

function updateProductsTable() {
    const productsTable = document.getElementById('products-table');
    productsTable.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Version</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${products.map(product => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.version}</td>
                        <td>$${product.price.toFixed(2)}</td>
                        <td>${product.enabled ? 'Enabled' : 'Disabled'}</td>
                        <td>
                            <button class="btn btn-small btn-primary" onclick="toggleProduct(${product.id})">
                                ${product.enabled ? 'Disable' : 'Enable'}
                            </button>
                            <button class="btn btn-small btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function updateUsersTable() {
    const usersTable = document.getElementById('users-table');
    usersTable.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Joined</th>
                    <th>Purchases</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => {
                    const userPurchases = purchases.filter(p => p.userId === user.id).length;
                    return `
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                            <td>${userPurchases}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;
}

function updateFeedbackTable() {
    const feedbackTable = document.getElementById('feedback-table');
    feedbackTable.innerHTML = `
        <table class="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${feedback.map(item => `
                    <tr>
                        <td>${item.name}</td>
                        <td>${'★'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}</td>
                        <td>${item.comment}</td>
                        <td>${new Date(item.date).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-small btn-danger" onclick="deleteFeedback(${item.id})">Delete</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function updateStatistics() {
    const totalUsers = users.length;
    const totalProducts = products.length;
    const totalSales = purchases.filter(p => p.status === 'success').length;
    const totalRevenue = purchases
        .filter(p => p.status === 'success')
        .reduce((sum, p) => sum + p.amount, 0);
    
    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-sales').textContent = totalSales;
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
}

function showAddProductForm() {
    document.getElementById('add-product-modal').style.display = 'block';
}

function closeAddProductModal() {
    document.getElementById('add-product-modal').style.display = 'none';
    document.getElementById('add-product-form').reset();
}

function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const version = document.getElementById('product-version').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const downloadLink = document.getElementById('product-download-link').value;
    
    const newProduct = {
        id: Date.now(),
        name,
        description,
        version,
        price,
        downloadLink,
        enabled: true
    };
    
    products.push(newProduct);
    localStorage.setItem('h4k_products', JSON.stringify(products));
    
    closeAddProductModal();
    loadProducts();
    updateAdminPanels();
    showNotification('Product added successfully!', 'success');
}

function toggleProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        product.enabled = !product.enabled;
        localStorage.setItem('h4k_products', JSON.stringify(products));
        loadProducts();
        updateAdminPanels();
        showNotification(`Product ${product.enabled ? 'enabled' : 'disabled'}!`, 'success');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('h4k_products', JSON.stringify(products));
        loadProducts();
        updateAdminPanels();
        showNotification('Product deleted!', 'success');
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 
                    type === 'error' ? 'var(--error-color)' : 
                    type === 'warning' ? 'var(--warning-color)' : 'var(--neon-blue)'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 4000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Add animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);


// Check if user is admin
function isAdmin(user) {
    return user.email === 'admin@h4k.com' && user.role === 'admin';
}

// Show/hide admin features
if (currentUser && isAdmin(currentUser)) {
    showAdminFeatures();
} else {
    hideAdminFeatures();
}