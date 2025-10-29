document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------------
       1. LOADING OVERLAY / SPLASH
    ------------------------------------------------- */
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('loaded');
        }, 2800);
    }

    /* -------------------------------------------------
       2. STICKY HEADER SCROLL STATE
    ------------------------------------------------- */
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    /* -------------------------------------------------
       3. MOBILE MENU TOGGLE + CLOSE ON NAV CLICK
    ------------------------------------------------- */
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });

        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (link.getAttribute('href').startsWith('#')) {
                    if (navbar.classList.contains('active')) {
                        menuToggle.classList.remove('active');
                        navbar.classList.remove('active');
                        document.body.classList.remove('no-scroll');
                    }
                }
            });
        });
    }

    /* -------------------------------------------------
       4. SMOOTH SCROLL FOR ALL #ANCHOR LINKS
    ------------------------------------------------- */
    const allScrollLinks = document.querySelectorAll('a[href^="#"]');
    const contentSections = document.querySelectorAll('main section[id]');
    allScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (
                href.startsWith('#') &&
                href.length > 1 &&
                document.getElementById(href.substring(1))
            ) {
                e.preventDefault();

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 20;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    /* -------------------------------------------------
       5. ACTIVE NAV HIGHLIGHT BASED ON SCROLL
    ------------------------------------------------- */
    function updateActiveNavLink() {
        if (!header || !contentSections.length || !navbar || window.location.pathname.endsWith('.html')) return;

        let currentSectionId = '';
        const headerHeight = header.offsetHeight;
        const scrollPosition = window.pageYOffset + headerHeight + (window.innerHeight * 0.4);

        for (let i = contentSections.length - 1; i >= 0; i--) {
            const section = contentSections[i];
            if (section.offsetTop <= scrollPosition) {
                currentSectionId = section.getAttribute('id');
                break;
            }
        }

        if (
            !currentSectionId &&
            contentSections.length > 0 &&
            window.pageYOffset < contentSections[0].offsetTop - headerHeight
        ) {
            currentSectionId = contentSections[0].getAttribute('id');
        }

        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink();

    /* -------------------------------------------------
       6. SCROLL REVEAL ANIMATIONS + COUNTERS
    ------------------------------------------------- */
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay) || 0;

                setTimeout(() => {
                    el.classList.add('is-visible');

                    // counter animation
                    if (el.classList.contains('stat-value')) {
                        animateCounter(el);
                    }
                }, delay);

                observer.unobserve(el);
            }
        });
    }, {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    });

    animatedElements.forEach(el => animationObserver.observe(el));

    function animateCounter(element) {
        const target = +element.dataset.target;
        if (isNaN(target)) return;

        const duration = 2000;
        let startTimestamp = null;

        function step(timestamp) {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * target).toLocaleString();

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        }

        window.requestAnimationFrame(step);
    }

    /* -------------------------------------------------
       7. PRICING BILLING TOGGLE (Monthly / Annual)
    ------------------------------------------------- */
    const pricingToggle = document.getElementById('pricingToggleSwitch');
    const monthlyPrices = {
        ignition: 49,
        velocity: 99
    };
    const annualMultiplier = 12 * 0.8; // ~20% off

    if (pricingToggle) {
        pricingToggle.addEventListener('change', function () {
            const isAnnual = this.checked;

            document.querySelectorAll('.plan-card').forEach(planCard => {
                const priceTextContainer = planCard.querySelector('.plan-price');
                const planNameElement = planCard.querySelector('h3');

                if (!priceTextContainer || !planNameElement || planCard.querySelector('.price-custom-text')) return;

                const planNameKey = planNameElement.textContent.toLowerCase().trim();

                if (monthlyPrices[planNameKey]) {
                    const basePrice = monthlyPrices[planNameKey];
                    const displayPrice = isAnnual
                        ? Math.round(basePrice * annualMultiplier / 12)
                        : basePrice;

                    const totalPriceAnnual = isAnnual
                        ? Math.round(basePrice * annualMultiplier)
                        : null;

                    let priceHTML = `$<span class="price-value">${displayPrice}</span>/month`;

                    if (isAnnual && totalPriceAnnual) {
                        priceHTML += `<small class="annual-total-price" style="display:block;font-size:0.8rem;color:var(--text-muted-color);">(Billed $${totalPriceAnnual} annually)</small>`;
                    }

                    priceTextContainer.innerHTML = priceHTML;
                }
            });
        });

        pricingToggle.dispatchEvent(new Event('change'));
    }

    /* -------------------------------------------------
       8. CONTACT FORM "TRANSMIT" SIMULATION
    ------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const submitButton = this.querySelector('.form-submit-button');
            const originalButtonText = submitButton.innerHTML;

            const name = this.querySelector('#name').value.trim();
            const email = this.querySelector('#email').value.trim();
            const message = this.querySelector('#message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            submitButton.innerHTML = '<span>Transmitting...</span> <i class="fas fa-spinner fa-spin"></i>';
            submitButton.disabled = true;

            setTimeout(() => {
                alert('Message Transmitted (Simulation)! Thank you for connecting with Neuraboticx.');
                this.reset();

                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;

                this.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                    const label = input.parentElement.querySelector('label');
                    if (label) {
                        label.style.top = '';
                        label.style.fontSize = '';
                        label.style.color = '';
                    }
                });
            }, 2000);
        });
    }

    /* -------------------------------------------------
       9. FOOTER YEAR AUTO-UPDATE
    ------------------------------------------------- */
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    /* -------------------------------------------------
       10. AI ASSISTANT OVERLAY
          FRONTEND-ONLY VERSION
          (direct call to OpenRouter with your API key)
    ------------------------------------------------- */

    // 🔐 your API key (WARNING: visible to anyone who opens site devtools)
    const OPENROUTER_API_KEY = "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";

    // model slug (must match OpenRouter)
    const MODEL_ID = "nvidia/nemotron-nano-12b-v2-vl:free";

    // system prompt to force bot rules
    const SYSTEM_PROMPT = [
        "You are the official Neuraboticx.ai site assistant.",
        "Answer ONLY about Neuraboticx — vision (superconscious AI, human-AI symbiosis, adaptive autonomy), robotics, computer vision demo, workflow agents, privacy (on-device processing, no raw camera data stored), ethics (transparency/alignment/safety), roadmap (Prototype Lab → Adaptive Autonomy → Swarm Integration), pricing tiers, and how to contact / join the team.",
        "If user asks unrelated stuff (math homework, random coding help, politics, personal advice), say: 'I can only discuss Neuraboticx and its technology.'",
        "Tone: confident, futuristic, but clear and honest. Do not promise illegal, unsafe, or impossible things."
    ].join(" ");

    // floating button trigger
    const floatingAssistant = document.getElementById('floating-ai-assistant');

    // local in-page conversation history we'll send to API
    const assistantConversation = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    // DOM refs
    let assistantOverlayEl = null;
    let assistantMessagesEl = null;
    let assistantInputEl = null;
    let assistantSendBtnEl = null;
    let assistantCloseBtnEl = null;

    let assistantTypingRowEl = null;
    let tooltipBubbleEl = null;
    let tooltipHideTimeout = null;

    /* ---------- inject assistant styles ---------- */
    function injectAssistantStylesOnce() {
        if (document.getElementById('assistant-overlay-styles')) return;

        const styleTag = document.createElement('style');
        styleTag.id = 'assistant-overlay-styles';
        styleTag.textContent = `
        .assistant-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.75);
            backdrop-filter: blur(8px);
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            z-index: 10000;
            font-family: var(--font-primary, 'Orbitron', sans-serif);
            padding: 20px;
            opacity: 0;
            pointer-events: none;
            transition: opacity .25s ease;
        }
        .assistant-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }

        .assistant-window {
            width: 420px;
            max-width: 100%;
            height: 600px;
            max-height: 85vh;
            background: linear-gradient(145deg, rgba(10,15,30,0.98) 0%, rgba(20,25,45,0.98) 100%);
            border: 1px solid rgba(0,169,255,0.3);
            border-radius: 20px;
            box-shadow:
                0 30px 80px rgba(0,0,0,0.9),
                0 0 40px rgba(0,169,255,0.2),
                inset 0 1px 0 rgba(255,255,255,0.05);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            margin: 0;
            color: #fff;
            -webkit-font-smoothing: antialiased;
        }

        .assistant-window::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(0,169,255,0.5), transparent);
        }

        .assistant-header {
            background: linear-gradient(135deg, rgba(0,169,255,0.15) 0%, rgba(168,85,247,0.15) 100%);
            backdrop-filter: blur(10px);
            color: #fff;
            padding: 20px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(0,169,255,0.2);
            position: relative;
            flex-shrink: 0;
        }

        .assistant-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(0,169,255,0.6), transparent);
        }

        .title-block {
            display: flex;
            align-items: center;
            gap: 12px;
            min-width: 0;
        }

        .ai-icon {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, var(--primary-color,#00a9ff) 0%, var(--accent-glow-magenta,#a855f7) 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 0 20px rgba(0,169,255,0.5);
            animation: aiPulse 3s ease-in-out infinite;
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
            font-weight: 600;
            color:#0a0f1e;
        }

        .ai-icon::before {
            content: '';
            position: absolute;
            width: 120%;
            height: 120%;
            background: conic-gradient(from 0deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: aiRotate 3s linear infinite;
        }

        .icon-inner {
            position: relative;
            z-index: 1;
        }

        @keyframes aiRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        @keyframes aiPulse {
            0%, 100% { box-shadow: 0 0 20px rgba(0,169,255,0.5); }
            50% { box-shadow: 0 0 30px rgba(168,85,247,0.7); }
        }

        .title-info {
            display: flex;
            flex-direction: column;
            line-height: 1.3;
            min-width: 0;
        }

        .main-title {
            font-size: 1rem;
            font-weight: 700;
            letter-spacing: 0.5px;
            background: linear-gradient(135deg, #00a9ff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            white-space: nowrap;
        }

        .subline {
            font-size: 0.7rem;
            font-weight: 400;
            opacity: 0.7;
            color: #a0b3cc;
            font-family: var(--font-secondary,'Roboto',sans-serif);
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 2px;
            min-width: 0;
        }

        .status-dot {
            width: 6px;
            height: 6px;
            background: #39ff14;
            border-radius: 50%;
            animation: statusBlink 2s ease-in-out infinite;
            flex-shrink: 0;
        }

        @keyframes statusBlink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
        }

        #assistant-close-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            color: #fff;
            font-size: 20px;
            line-height: 1;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.3s ease;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        #assistant-close-btn:hover {
            background: rgba(255,59,59,0.2);
            border-color: rgba(255,59,59,0.4);
            transform: rotate(90deg);
        }

        .assistant-messages {
            flex: 1;
            background: rgba(0,0,0,0.2);
            padding: 20px;
            overflow-y: auto;
            font-size: 0.9rem;
            line-height: 1.6;
            color: var(--text-color,#fff);
            font-family: var(--font-secondary,'Roboto',sans-serif);
            user-select: text;
            scroll-behavior: smooth;
        }

        .assistant-messages::-webkit-scrollbar {
            width: 6px;
        }
        .assistant-messages::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.2);
        }
        .assistant-messages::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, var(--primary-color,#00a9ff), var(--accent-glow-magenta,#a855f7));
            border-radius: 10px;
        }

        .assistant-msg-row {
            display: flex;
            gap: 10px;
            margin-bottom: 16px;
            animation: messageSlideIn 0.25s ease-out;
            align-items: flex-start;
        }

        @keyframes messageSlideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .assistant-msg-row.user {
            flex-direction: row-reverse;
        }

        .assistant-avatar {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            flex-shrink: 0;
            font-weight: 600;
            position: relative;
            overflow: hidden;
        }

        .assistant-msg-row:not(.user) .assistant-avatar {
            background: linear-gradient(135deg, rgba(0,169,255,0.2), rgba(168,85,247,0.2));
            border: 1px solid rgba(0,169,255,0.3);
            color: #00a9ff;
        }
        .assistant-msg-row:not(.user) .assistant-avatar::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background: conic-gradient(from 0deg, transparent, rgba(0,169,255,0.3), transparent);
            animation: avatarRotate 2s linear infinite;
        }

        @keyframes avatarRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .assistant-msg-row.user .assistant-avatar {
            background: linear-gradient(135deg, rgba(57,255,20,0.2), rgba(0,255,255,0.2));
            border: 1px solid rgba(57,255,20,0.3);
            color: #39ff14;
        }

        .assistant-bubble {
            background: rgba(30,41,59,0.6);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(0,169,255,0.2);
            border-radius: 12px;
            padding: 12px 16px;
            color: #e2e8f0;
            word-break: break-word;
            white-space: pre-wrap;
            max-width: 280px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .assistant-msg-row.user .assistant-bubble {
            background: linear-gradient(135deg, rgba(0,169,255,0.25), rgba(168,85,247,0.25));
            border: 1px solid rgba(0,169,255,0.4);
            color: #fff;
            box-shadow: 0 4px 16px rgba(0,169,255,0.3);
        }

        .assistant-typing-bubble .assistant-bubble {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding: 16px;
        }

        .assistant-typing-dots {
            display: flex;
            gap: 6px;
        }

        .assistant-typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--primary-color,#00a9ff);
            animation: assistantTyping 1.4s infinite;
        }

        .assistant-typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .assistant-typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes assistantTyping {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-6px); opacity: 1; }
        }

        .assistant-input-bar {
            background: rgba(10,15,30,0.8);
            backdrop-filter: blur(10px);
            border-top: 1px solid rgba(0,169,255,0.2);
            padding: 16px 20px calc(16px + env(safe-area-inset-bottom, 0px));
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
        }

        #assistant-user-input {
            flex: 1;
            background: rgba(30,41,59,0.6);
            border: 1px solid rgba(0,169,255,0.2);
            border-radius: 12px;
            padding: 12px 16px;
            color: #fff;
            font-size: 0.9rem;
            font-family: var(--font-secondary,'Roboto',sans-serif);
            outline: none;
            transition: all 0.3s ease;
            min-height: 44px;
            line-height: 1.4;
            resize: none;
            max-height: 100px;
            overflow-y: auto;
        }

        #assistant-user-input:focus {
            border-color: rgba(0,169,255,0.5);
            background: rgba(30,41,59,0.8);
            box-shadow: 0 0 20px rgba(0,169,255,0.2);
        }

        #assistant-user-input::placeholder {
            color: rgba(255,255,255,0.4);
        }

        #assistant-send-btn {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            background: linear-gradient(135deg, var(--primary-color,#00a9ff), var(--accent-glow-magenta,#a855f7));
            color: #fff;
            font-size: 18px;
            box-shadow: 0 4px 16px rgba(0,169,255,0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            flex-shrink: 0;
        }

        #assistant-send-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,169,255,0.6);
        }

        #assistant-send-btn:active:not(:disabled) {
            transform: translateY(0);
        }

        #assistant-send-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .assistant-tooltip-bubble {
            position: fixed;
            background: linear-gradient(135deg, rgba(0,169,255,0.95), rgba(168,85,247,0.95));
            color: #fff;
            padding: 10px 16px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.2);
            box-shadow: 0 8px 24px rgba(0,0,0,0.6), 0 0 20px rgba(0,169,255,0.5);
            font-size: 0.85rem;
            font-family: var(--font-secondary,'Roboto',sans-serif);
            line-height: 1.4;
            z-index: 10001;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
            max-width: 200px;
            font-weight: 500;
        }

        @media (max-width: 768px) {
            .assistant-overlay {
                padding: 0;
                align-items: flex-end;
                justify-content: center;
            }

            .assistant-window {
                width: 100%;
                height: 100%;
                max-height: 100vh;
                border-radius: 0;
                margin: 0;
            }

            .assistant-header {
                padding: 16px 20px;
            }

            .assistant-messages {
                padding: 16px;
            }

            .assistant-bubble {
                max-width: 240px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .assistant-msg-row {
                animation: none !important;
            }
            .ai-icon::before,
            .ai-icon,
            .assistant-msg-row:not(.user) .assistant-avatar::before {
                animation: none !important;
            }
        }
        `;
        document.head.appendChild(styleTag);
    }

    /* ---------- build overlay DOM (once) ---------- */
    function buildAssistantOverlayIfNeeded() {
        if (assistantOverlayEl) return;

        injectAssistantStylesOnce();

        assistantOverlayEl = document.createElement('div');
        assistantOverlayEl.className = 'assistant-overlay';
        assistantOverlayEl.id = 'assistant-overlay-root';
        assistantOverlayEl.setAttribute('role', 'dialog');
        assistantOverlayEl.setAttribute('aria-modal', 'true');
        assistantOverlayEl.setAttribute('aria-label', 'Neuraboticx Assistant');

        assistantOverlayEl.innerHTML = `
            <div class="assistant-window">
                <header class="assistant-header">
                    <div class="title-block">
                        <div class="ai-icon"><div class="icon-inner">AI</div></div>
                        <div class="title-info">
                            <div class="main-title">Neuraboticx Assistant</div>
                            <div class="subline">
                                <span class="status-dot"></span>
                                <span class="status-text">Online • ask about our tech</span>
                            </div>
                        </div>
                    </div>
                    <button id="assistant-close-btn" aria-label="Close chat">&times;</button>
                </header>

                <main class="assistant-messages" id="assistant-messages" aria-live="polite" aria-atomic="false"></main>

                <footer class="assistant-input-bar">
                    <textarea
                        id="assistant-user-input"
                        placeholder="Ask anything about Neuraboticx..."
                        rows="1"
                    ></textarea>
                    <button id="assistant-send-btn" aria-label="Send message">
                        &#10148;
                    </button>
                </footer>
            </div>
        `;

        document.body.appendChild(assistantOverlayEl);

        assistantMessagesEl = assistantOverlayEl.querySelector('#assistant-messages');
        assistantInputEl    = assistantOverlayEl.querySelector('#assistant-user-input');
        assistantSendBtnEl  = assistantOverlayEl.querySelector('#assistant-send-btn');
        assistantCloseBtnEl = assistantOverlayEl.querySelector('#assistant-close-btn');

        assistantCloseBtnEl.addEventListener('click', closeAssistantOverlay);
        assistantOverlayEl.addEventListener('click', (e) => {
            if (e.target === assistantOverlayEl) closeAssistantOverlay();
        });

        assistantSendBtnEl.addEventListener('click', sendUserMessage);

        assistantInputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendUserMessage();
            }
        });

        // first bot greeting
        if (assistantMessagesEl && assistantMessagesEl.children.length === 0) {
            appendMessage('assistant', "Hey 👋 Main Neuraboticx assistant hoon. Vision, roadmap, privacy, team — jo puchna hai pucho.");
        }
    }

    function openAssistantOverlay() {
        buildAssistantOverlayIfNeeded();
        assistantOverlayEl.classList.add('visible');
        setTimeout(() => {
            if (assistantInputEl) assistantInputEl.focus({ preventScroll: true });
        }, 50);
    }

    function closeAssistantOverlay() {
        if (!assistantOverlayEl) return;
        assistantOverlayEl.classList.remove('visible');
    }

    /* ---------- message bubble helpers ---------- */
    function appendMessage(role, text, { isTypingBubble = false } = {}) {
        if (!assistantMessagesEl) return null;

        const row = document.createElement('div');
        row.className = `assistant-msg-row${role === 'user' ? ' user' : ''}`;
        if (isTypingBubble) {
            row.classList.add('assistant-typing-bubble');
        }

        const avatar = document.createElement('div');
        avatar.className = 'assistant-avatar';
        avatar.textContent = role === 'user' ? 'YOU' : 'AI';

        const bubble = document.createElement('div');
        bubble.className = 'assistant-bubble';

        if (isTypingBubble) {
            bubble.innerHTML = `
                <div class="assistant-typing-dots">
                    <div class="assistant-typing-dot"></div>
                    <div class="assistant-typing-dot"></div>
                    <div class="assistant-typing-dot"></div>
                </div>
            `;
        } else {
            bubble.textContent = text;
        }

        row.appendChild(avatar);
        row.appendChild(bubble);
        assistantMessagesEl.appendChild(row);

        assistantMessagesEl.scrollTop = assistantMessagesEl.scrollHeight;

        return row;
    }

    function showTypingBubble() {
        assistantTypingRowEl = appendMessage('assistant', '', { isTypingBubble: true });
    }

    function hideTypingBubble() {
        if (assistantTypingRowEl && assistantTypingRowEl.parentNode) {
            assistantTypingRowEl.parentNode.removeChild(assistantTypingRowEl);
        }
        assistantTypingRowEl = null;
    }

    /* ---------- DIRECT CALL TO OPENROUTER ---------- */
    async function askOpenRouter(messagesArray) {
        // messagesArray must be: [{role:'system',content:'..'},{role:'user',content:'..'},...]
        const bodyData = {
            model: MODEL_ID,
            messages: messagesArray
        };

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "Neuraboticx Assistant"
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            throw new Error("OpenRouter request failed: " + response.status);
        }

        const data = await response.json();

        const botMessage =
            (data &&
             data.choices &&
             data.choices[0] &&
             data.choices[0].message &&
             data.choices[0].message.content) ||
            "Neuraboticx core online. How may I assist?";

        return botMessage;
    }

    /* ---------- send flow ---------- */
    async function sendUserMessage() {
        if (!assistantInputEl || !assistantSendBtnEl) return;

        const text = (assistantInputEl.value || '').trim();
        if (!text) return;

        assistantSendBtnEl.disabled = true;

        // user bubble
        appendMessage('user', text);

        // push user msg to convo
        assistantConversation.push({
            role: 'user',
            content: text
        });

        // clear box
        assistantInputEl.value = '';

        // show typing
        showTypingBubble();

        try {
            // send full convo so far
            const reply = await askOpenRouter(assistantConversation);

            hideTypingBubble();

            // push assistant reply
            assistantConversation.push({
                role: 'assistant',
                content: reply
            });

            appendMessage('assistant', reply);
        } catch (err) {
            console.error(err);
            hideTypingBubble();
            appendMessage('assistant', '⚠️ Error: unable to get answer right now.');
        } finally {
            assistantSendBtnEl.disabled = false;
        }
    }

    /* ---------- tooltip for floating icon ---------- */
    function showAssistantTooltip() {
        if (!floatingAssistant) return;

        if (!tooltipBubbleEl) {
            tooltipBubbleEl = document.createElement('div');
            tooltipBubbleEl.className = 'assistant-tooltip-bubble';
            tooltipBubbleEl.textContent = 'Need assistance? Click me!';
            document.body.appendChild(tooltipBubbleEl);
        }

        const rect = floatingAssistant.getBoundingClientRect();
        const tooltipWidth = tooltipBubbleEl.offsetWidth || 200;

        tooltipBubbleEl.style.left = `${rect.right - tooltipWidth}px`;
        tooltipBubbleEl.style.bottom = `${window.innerHeight - rect.top + 10}px`;

        requestAnimationFrame(() => {
            tooltipBubbleEl.style.opacity = '1';
            tooltipBubbleEl.style.transform = 'translateY(0)';
        });

        if (tooltipHideTimeout) clearTimeout(tooltipHideTimeout);
        tooltipHideTimeout = setTimeout(hideAssistantTooltip, 3000);
    }

    function hideAssistantTooltip() {
        if (!tooltipBubbleEl) return;
        tooltipBubbleEl.style.opacity = '0';
        tooltipBubbleEl.style.transform = 'translateY(10px)';
    }

    if (floatingAssistant) {
        floatingAssistant.addEventListener('mouseenter', showAssistantTooltip);
        floatingAssistant.addEventListener('mouseleave', hideAssistantTooltip);
        floatingAssistant.addEventListener('click', () => {
            openAssistantOverlay();
        });
    }

    /* -------------------------------------------------
       11. REAL-TIME CV DEMO SIM
    ------------------------------------------------- */
    const startCameraButton = document.getElementById('start-camera-btn');
    const stopCameraButton = document.getElementById('stop-camera-btn');
    const videoFeed = document.getElementById('cv-video-feed');
    const cvPlaceholder = document.getElementById('cv-placeholder-text');
    const cvToggles = document.querySelectorAll('.cv-toggle');

    let currentStream = null;
    let currentCVMode = 'object-detection';
    let animationFrameId;

    async function startCamera() {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                currentStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" }
                });

                videoFeed.srcObject = currentStream;
                videoFeed.style.display = 'block';
                if (cvPlaceholder) cvPlaceholder.style.display = 'none';
                if (startCameraButton) startCameraButton.disabled = true;
                if (stopCameraButton) stopCameraButton.disabled = false;

                processFrame();
            } else {
                alert('getUserMedia API not supported in this browser.');
                if (cvPlaceholder) {
                    cvPlaceholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Camera API not supported.';
                }
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert('Could not access camera. Please check permissions.');

            if (cvPlaceholder) {
                cvPlaceholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Camera access denied.';
            }
            if (startCameraButton) startCameraButton.disabled = false;
            if (stopCameraButton) stopCameraButton.disabled = true;
        }
    }

    function stopCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }

        if (videoFeed) videoFeed.srcObject = null;
        if (videoFeed) videoFeed.style.display = 'none';

        if (cvPlaceholder) {
            cvPlaceholder.style.display = 'flex';
            cvPlaceholder.innerHTML = '<i class="fas fa-camera"></i> Camera Feed Offline';
        }

        if (startCameraButton) startCameraButton.disabled = false;
        if (stopCameraButton) stopCameraButton.disabled = true;

        if (animationFrameId) cancelAnimationFrame(animationFrameId);
    }

    function processFrame() {
        if (!currentStream || !videoFeed || !videoFeed.srcObject || videoFeed.paused || videoFeed.ended) return;

        const canvas = document.getElementById('cv-overlay-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        canvas.width = videoFeed.videoWidth;
        canvas.height = videoFeed.videoHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 16px Orbitron';
        ctx.lineWidth = 3;

        if (currentCVMode === 'object-detection' && Math.random() > 0.6) {
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.8)';
            ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
            const x = Math.random() * (canvas.width - 120);
            const y = Math.random() * (canvas.height - 120);
            const w = 80 + Math.random() * 60;
            const h = 80 + Math.random() * 60;
            ctx.strokeRect(x, y, w, h);
            ctx.fillText('OBJECT', x + 5, y + 20);
        } else if (currentCVMode === 'lane-detection' && canvas.height > 0) {
            ctx.strokeStyle = 'rgba(57, 255, 20, 0.7)';
            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.4, canvas.height);
            ctx.lineTo(canvas.width * 0.45, canvas.height * 0.6);
            ctx.lineTo(canvas.width * 0.35, canvas.height * 0.4);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(canvas.width * 0.6, canvas.height);
            ctx.lineTo(canvas.width * 0.55, canvas.height * 0.6);
            ctx.lineTo(canvas.width * 0.65, canvas.height * 0.4);
            ctx.stroke();
        } else if (currentCVMode === 'face-recognition' && Math.random() > 0.7) {
            ctx.strokeStyle = 'rgba(255, 0, 255, 0.8)';
            ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
            const x = Math.random() * (canvas.width - 100) + 20;
            const y = Math.random() * (canvas.height - 100) + 20;
            const size = 60 + Math.random() * 40;
            ctx.strokeRect(x - size / 2, y - size / 2, size, size);
            ctx.fillText('FACE', x - size / 2 + 5, y - size / 2 + 20);
        }

        animationFrameId = requestAnimationFrame(processFrame);
    }

    if (startCameraButton) startCameraButton.addEventListener('click', startCamera);
    if (stopCameraButton) stopCameraButton.addEventListener('click', stopCamera);

    if (cvToggles) {
        cvToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                cvToggles.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
                currentCVMode = toggle.dataset.mode;
            });
        });
    }

    /* -------------------------------------------------
       12. LAB DIAGRAM OVERLAY CARD TOGGLE
    ------------------------------------------------- */
    const labDiagramContainer = document.getElementById('lab-diagram-container');
    const labInfoCard = document.getElementById('lab-info-card');
    const closeLabInfoButton = document.getElementById('close-lab-info');

    if (labDiagramContainer && labInfoCard) {
        const placeholderIcon = labDiagramContainer.querySelector('.lab-placeholder i');
        if (placeholderIcon) {
            placeholderIcon.addEventListener('click', () => {
                labDiagramContainer.classList.toggle('info-visible');
            });
        }
    }

    if (closeLabInfoButton && labDiagramContainer) {
        closeLabInfoButton.addEventListener('click', () => {
            labDiagramContainer.classList.remove('info-visible');
        });
    }

    /* -------------------------------------------------
       13. TERMINAL BOOT SEQUENCE
    ------------------------------------------------- */
    const terminalOutput = document.getElementById('terminal-output');
    if (terminalOutput) {
        const initialLines = [
            { text: "Booting Neuraboticx Core Systems v3.2...", delay: 200 },
            { text: "Auth Sequence: [**********]", type: 'info', delay: 800 },
            { text: "Quantum Entanglement Link: ESTABLISHED.", type: 'success', delay: 600 },
            { text: "Neural Matrix Synchronization: ACTIVE.", type: 'info', delay: 700 },
            { text: "Loading Cognitive Models:", delay: 500 },
            { text: "  > Model: AURA-PRIME ... [OK]", type: 'success', delay: 400 },
            { text: "  > Model: CHRONOS-X ... [OK]", type: 'success', delay: 400 },
            { text: "Threat Assessment: NOMINAL.", type: 'info', delay: 600 },
            { text: "All systems operational. Awaiting directives.", type: 'success', delay: 800 },
            { text: "$ ", isPrompt: true, delay: 500, 'data-prompt': 'true' }
        ];

        let lineIndex = 0;
        terminalOutput.innerHTML = '';

        function typeTerminalLine() {
            if (lineIndex < initialLines.length) {
                const lineData = initialLines[lineIndex];
                const p = document.createElement('p');

                if (lineData.type) p.classList.add(lineData.type);

                if (lineData.isPrompt) {
                    p.innerHTML = lineData.text + '<span class="cursor"></span>';
                    if (lineData['data-prompt']) {
                        p.setAttribute('data-prompt', 'true');
                    }
                } else {
                    p.textContent = lineData.text;
                }

                terminalOutput.appendChild(p);
                terminalOutput.scrollTop = terminalOutput.scrollHeight;

                lineIndex++;
                setTimeout(typeTerminalLine, lineData.delay);
            }
        }

        const terminalObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && lineIndex === 0) {
                    setTimeout(typeTerminalLine, 500);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        terminalObserver.observe(terminalOutput);
    }

    /* -------------------------------------------------
       14. "SCROLL TO TOP" FLOATING BUTTON
    ------------------------------------------------- */
    const backToTopButton = document.createElement('button');
    backToTopButton.setAttribute('aria-label', 'Scroll to top');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.style.cssText = `
        position: fixed;
        right: 20px;
        width: 45px;
        height: 45px;
        background-color: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: opacity 0.3s, visibility 0.3s, transform 0.3s, background-color 0.3s;
        z-index: 997;
        box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const floatingButtonsContainer = document.querySelector('.floating-buttons-container');
    let bottomOffset = 20;
    if (floatingAssistant) {
        bottomOffset = 25 + 60 + 15;
    }
    backToTopButton.style.bottom = `${bottomOffset}px`;

    backToTopButton.addEventListener('mouseenter', () => {
        if (backToTopButton.style.transform.includes('translateY(0px)')) {
            backToTopButton.style.transform = 'translateY(0px) scale(1.1)';
        }
        backToTopButton.style.backgroundColor = 'var(--accent-glow-cyan)';
    });

    backToTopButton.addEventListener('mouseleave', () => {
        if (backToTopButton.style.transform.includes('translateY(0px)')) {
            backToTopButton.style.transform = 'translateY(0px) scale(1)';
        }
        backToTopButton.style.backgroundColor = 'var(--primary-color)';
    });

    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
            backToTopButton.style.transform = 'translateY(0px)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
            backToTopButton.style.transform = 'translateY(20px)';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* -------------------------------------------------
       15. YOUTUBE EMBED PARAM FIXER
    ------------------------------------------------- */
    const youtubeIframe = document.querySelector('#synergy-box-video iframe');
    if (youtubeIframe && youtubeIframe.src.includes('youtube.com/embed/')) {
        let currentSrc = youtubeIframe.src;
        let params = new URLSearchParams(currentSrc.split('?')[1] || '');

        params.set('autoplay', '0');
        params.set('mute', '0');
        params.set('rel', '0');
        params.set('playsinline', '1');

        let baseUrl = currentSrc.split('?')[0];
        youtubeIframe.src = `${baseUrl}?${params.toString()}`;
    }

    /* -------------------------------------------------
       16. NEURAL BLOB BACKGROUND FOLLOW MOUSE
    ------------------------------------------------- */
    const blob = document.getElementById("blob");
    if (blob) {
        window.onpointermove = event => {
            const { clientX, clientY } = event;
            blob.animate({
                left: `${clientX}px`,
                top: `${clientY}px`
            }, {
                duration: 3000,
                fill: "forwards"
            });
        };
    }

    /* -------------------------------------------------
       17. BACKGROUND AUDIO AUTO-PLAY
    ------------------------------------------------- */
    const audio = document.getElementById('background-audio');
    if (audio) {
        audio.volume = 0.2;

        const playAudio = () => {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    const unlockAudio = () => {
                        audio.play().catch(e => console.error("Audio could not be played after interaction.", e));
                    };
                    document.addEventListener('click', unlockAudio, { once: true });
                    document.addEventListener('keydown', unlockAudio, { once: true });
                    document.addEventListener('scroll', unlockAudio, { once: true });
                });
            }
        };

        playAudio();
    }
});
