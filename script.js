// Savings Calculator Logic
function calculateSavings() {
    // Get input values
    const initialAmount = parseFloat(document.getElementById('initialAmount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const annualInterestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const timeframe = parseFloat(document.getElementById('timeframe').value) || 0;
    const goalAmount = parseFloat(document.getElementById('goalAmount').value) || 0;
    
    // Validate inputs
    if (timeframe <= 0) {
        alert('Please enter a valid time period');
        return;
    }
    
    // Calculate compound interest
    const monthlyInterestRate = annualInterestRate / 100 / 12;
    const totalMonths = timeframe * 12;
    
    // Calculate future value with compound interest
    let futureValue = initialAmount;
    let totalContributions = initialAmount;
    let yearlyData = [];
    
    // Year-by-year calculation for timeline
    for (let year = 1; year <= timeframe; year++) {
        for (let month = 1; month <= 12; month++) {
            futureValue = futureValue * (1 + monthlyInterestRate) + monthlyContribution;
            totalContributions += monthlyContribution;
        }
        yearlyData.push({
            year: year,
            amount: futureValue
        });
    }
    
    const interestEarned = futureValue - totalContributions;
    const goalProgress = Math.min((futureValue / goalAmount) * 100, 100);
    
    // Update display with animations
    updateResults(futureValue, totalContributions, interestEarned, goalProgress, initialAmount, yearlyData);
    
    // Update breakdown chart
    updateBreakdownChart(initialAmount, totalContributions - initialAmount, interestEarned);
}

function updateResults(finalAmount, totalContributed, interestEarned, goalProgress, initialAmount, yearlyData) {
    // Animate numbers
    animateValue('finalAmount', 0, finalAmount, 2000, true);
    animateValue('totalContributed', 0, totalContributed, 2000, true);
    animateValue('interestEarned', 0, interestEarned, 2000, true);
    animateValue('goalProgress', 0, goalProgress, 2000, false, '%');
    
    // Update progress bar
    setTimeout(() => {
        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');
        progressFill.style.width = Math.min(goalProgress, 100) + '%';
        progressPercent.textContent = Math.round(goalProgress) + '%';
    }, 500);
    
    // Update timeline
    updateTimeline(yearlyData);
}

function animateValue(id, start, end, duration, isCurrency = false, suffix = '') {
    const element = document.getElementById(id);
    const startTimestamp = performance.now();
    
    function step(timestamp) {
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = start + (end - start) * easeOutCubic(progress);
        
        if (isCurrency) {
            element.textContent = formatCurrency(current);
        } else {
            element.textContent = Math.round(current) + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }
    
    requestAnimationFrame(step);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function updateBreakdownChart(initial, contributions, interest) {
    const total = initial + contributions + interest;
    
    if (total === 0) return;
    
    const initialPercent = (initial / total) * 100;
    const contributionsPercent = (contributions / total) * 100;
    const interestPercent = (interest / total) * 100;
    
    setTimeout(() => {
        document.getElementById('initialSegment').style.width = initialPercent + '%';
        document.getElementById('contributionsSegment').style.width = contributionsPercent + '%';
        document.getElementById('interestSegment').style.width = interestPercent + '%';
    }, 1000);
}

function updateTimeline(yearlyData) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';
    
    yearlyData.forEach((data, index) => {
        setTimeout(() => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';
            timelineItem.style.opacity = '0';
            timelineItem.style.transform = 'translateX(-20px)';
            
            timelineItem.innerHTML = `
                <span class="timeline-year">Year ${data.year}</span>
                <span class="timeline-amount">${formatCurrency(data.amount)}</span>
            `;
            
            timeline.appendChild(timelineItem);
            
            // Animate timeline item
            setTimeout(() => {
                timelineItem.style.transition = 'all 0.3s ease';
                timelineItem.style.opacity = '1';
                timelineItem.style.transform = 'translateX(0)';
            }, 50);
        }, index * 100);
    });
}

// Auto-calculate on input change
function setupAutoCalculation() {
    const inputs = ['initialAmount', 'monthlyContribution', 'interestRate', 'timeframe', 'goalAmount'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', debounce(calculateSavings, 500));
        input.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#667eea';
        });
        input.addEventListener('blur', function() {
            this.parentElement.style.borderColor = 'transparent';
        });
    });
}

// Debounce function to limit API calls
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

// Add hover effects and tooltips
function addInteractivity() {
    // Add tooltips to metric cards
    const metricCards = document.querySelectorAll('.metric-card');
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to calculate button
    const calculateBtn = document.querySelector('.calculate-btn');
    calculateBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// Preset savings scenarios
function addPresetButtons() {
    const presets = [
        { name: 'Conservative', initial: 5000, monthly: 300, rate: 3, years: 20 },
        { name: 'Moderate', initial: 10000, monthly: 500, rate: 5, years: 15 },
        { name: 'Aggressive', initial: 15000, monthly: 1000, rate: 8, years: 10 }
    ];
    
    const goalSection = document.querySelector('.goal-section');
    const presetsContainer = document.createElement('div');
    presetsContainer.className = 'presets-container';
    presetsContainer.style.marginTop = '20px';
    
    const presetsTitle = document.createElement('h4');
    presetsTitle.textContent = 'Quick Scenarios';
    presetsTitle.style.marginBottom = '10px';
    presetsTitle.style.fontSize = '1rem';
    presetsTitle.style.opacity = '0.9';
    
    presetsContainer.appendChild(presetsTitle);
    
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.gap = '10px';
    buttonsContainer.style.flexWrap = 'wrap';
    
    presets.forEach(preset => {
        const button = document.createElement('button');
        button.textContent = preset.name;
        button.className = 'preset-btn';
        button.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 0.85rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        button.addEventListener('click', function() {
            document.getElementById('initialAmount').value = preset.initial;
            document.getElementById('monthlyContribution').value = preset.monthly;
            document.getElementById('interestRate').value = preset.rate;
            document.getElementById('timeframe').value = preset.years;
            calculateSavings();
        });
        
        buttonsContainer.appendChild(button);
    });
    
    presetsContainer.appendChild(buttonsContainer);
    goalSection.appendChild(presetsContainer);
}

// Email subscription function for lead generation
function subscribeUser() {
    const email = document.getElementById('userEmail').value;
    
    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Here you would typically send to your email service
    // For now, we'll simulate success
    showSuccessMessage('Thanks for subscribing! Check your email for financial tips.');
    
    // Track conversion for analytics
    trackEvent('email_subscription', {
        email: email,
        source: 'savings_calculator'
    });
    
    // Clear the input
    document.getElementById('userEmail').value = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(message) {
    const emailCapture = document.querySelector('.email-capture');
    
    // Remove existing success message
    const existingMessage = emailCapture.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    emailCapture.appendChild(successDiv);
    
    // Animate in
    setTimeout(() => {
        successDiv.classList.add('show');
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.classList.remove('show');
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Affiliate link tracking
function trackAffiliateClick(affiliate, source = 'calculator') {
    trackEvent('affiliate_click', {
        affiliate: affiliate,
        source: source,
        timestamp: new Date().toISOString()
    });
    
    // You can add specific affiliate URLs here
    const affiliateUrls = {
        'investment-app': 'https://example-investment-app.com?ref=smart-savings',
        'high-yield-savings': 'https://example-bank.com/savings?ref=smart-savings'
    };
    
    if (affiliateUrls[affiliate]) {
        window.open(affiliateUrls[affiliate], '_blank');
    }
}

// Analytics tracking function
function trackEvent(eventName, properties = {}) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // You can also send to other analytics services here
    console.log('Event tracked:', eventName, properties);
}

// Track calculator usage
function trackCalculatorUsage() {
    const initialAmount = parseFloat(document.getElementById('initialAmount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const timeframe = parseFloat(document.getElementById('timeframe').value) || 0;
    
    trackEvent('calculator_used', {
        initial_amount: initialAmount,
        monthly_contribution: monthlyContribution,
        timeframe: timeframe,
        goal_amount: parseFloat(document.getElementById('goalAmount').value) || 0
    });
}

// Add premium features teaser
function showPremiumFeatures() {
    if (document.querySelector('.premium-banner')) return; // Already shown
    
    const resultsSection = document.querySelector('.results-section');
    const premiumBanner = document.createElement('div');
    premiumBanner.className = 'premium-banner';
    premiumBanner.innerHTML = `
        <h3>🚀 Unlock Premium Features!</h3>
        <p>Get PDF reports, multiple scenarios, and advanced projections</p>
        <button class="premium-btn" onclick="trackPremiumClick()">Upgrade for $9.99/month</button>
    `;
    
    resultsSection.insertBefore(premiumBanner, resultsSection.querySelector('.breakdown-section'));
}

function trackPremiumClick() {
    trackEvent('premium_upgrade_click', {
        source: 'calculator_banner'
    });
    
    // Redirect to premium signup
    alert('Premium features coming soon! 🚀\nJoin our waitlist by subscribing to our email list.');
}

// Enhanced calculate function with tracking
function calculateSavingsWithTracking() {
    calculateSavings();
    trackCalculatorUsage();
    
    // Show premium features after 3 calculations
    const calculations = parseInt(localStorage.getItem('calculation_count') || '0') + 1;
    localStorage.setItem('calculation_count', calculations.toString());
    
    if (calculations >= 3) {
        setTimeout(showPremiumFeatures, 2000);
    }
}

// Lead scoring system
function calculateLeadScore() {
    let score = 0;
    
    const initialAmount = parseFloat(document.getElementById('initialAmount').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('monthlyContribution').value) || 0;
    const goalAmount = parseFloat(document.getElementById('goalAmount').value) || 0;
    
    // Score based on investment amounts
    if (initialAmount > 10000) score += 30;
    else if (initialAmount > 5000) score += 20;
    else if (initialAmount > 1000) score += 10;
    
    if (monthlyContribution > 1000) score += 25;
    else if (monthlyContribution > 500) score += 15;
    else if (monthlyContribution > 100) score += 10;
    
    if (goalAmount > 100000) score += 20;
    else if (goalAmount > 50000) score += 10;
    
    // Track high-value leads
    if (score > 50) {
        trackEvent('high_value_lead', {
            score: score,
            initial_amount: initialAmount,
            monthly_contribution: monthlyContribution,
            goal_amount: goalAmount
        });
    }
    
    return score;
}

// Update the original calculateSavings to include tracking
const originalCalculateSavings = calculateSavings;
calculateSavings = function() {
    originalCalculateSavings();
    trackCalculatorUsage();
    calculateLeadScore();
    
    // Show premium features after multiple uses
    const calculations = parseInt(localStorage.getItem('calculation_count') || '0') + 1;
    localStorage.setItem('calculation_count', calculations.toString());
    
    if (calculations === 3) {
        setTimeout(showPremiumFeatures, 3000);
    }
};

// Set up affiliate click tracking
document.addEventListener('DOMContentLoaded', function() {
    setupAutoCalculation();
    addInteractivity();
    addPresetButtons();
    
    // Track affiliate clicks
    document.addEventListener('click', function(e) {
        const affiliateCard = e.target.closest('.affiliate-card');
        if (affiliateCard) {
            e.preventDefault();
            const affiliate = affiliateCard.dataset.affiliate;
            trackAffiliateClick(affiliate);
        }
    });
    
    // Calculate initial values
    calculateSavings();
    
    // Track page view
    trackEvent('calculator_page_view', {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent
    });
    
    // Add some visual flair
    setTimeout(() => {
        document.querySelector('.header').style.opacity = '1';
        document.querySelector('.header').style.transform = 'translateY(0)';
    }, 200);
});

// Add CSS for header animation
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    header.style.opacity = '0';
    header.style.transform = 'translateY(-20px)';
    header.style.transition = 'all 0.8s ease';
}); 