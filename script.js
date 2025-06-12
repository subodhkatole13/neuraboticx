document.addEventListener('DOMContentLoaded', () => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
        setTimeout(() => {
            loadingOverlay.classList.add('loaded');
        }, 2800);
    }
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
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
    const allScrollLinks = document.querySelectorAll('a[href^="#"]');
    const contentSections = document.querySelectorAll('main section[id]');
    allScrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#') && href.length > 1 && document.getElementById(href.substring(1))) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const headerOffset = header ? header.offsetHeight : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - headerOffset - 20;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });
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
        if (!currentSectionId && contentSections.length > 0 && window.pageYOffset < contentSections[0].offsetTop - headerHeight) {
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
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.delay) || 0;
                setTimeout(() => {
                    el.classList.add('is-visible');
                    if (el.classList.contains('stat-value')) {
                        animateCounter(el);
                    }
                }, delay);
                observer.unobserve(el);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
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
    const pricingToggle = document.getElementById('pricingToggleSwitch');
    const monthlyPrices = { ignition: 49, velocity: 99 };
    const annualMultiplier = 12 * 0.8;
    if (pricingToggle) {
        pricingToggle.addEventListener('change', function() {
            const isAnnual = this.checked;
            document.querySelectorAll('.plan-card').forEach(planCard => {
                const priceTextContainer = planCard.querySelector('.plan-price');
                const planNameElement = planCard.querySelector('h3');
                if (!priceTextContainer || !planNameElement || planCard.querySelector('.price-custom-text')) return;
                const planNameKey = planNameElement.textContent.toLowerCase().trim();
                if (monthlyPrices[planNameKey]) {
                    const basePrice = monthlyPrices[planNameKey];
                    const displayPrice = isAnnual ? Math.round(basePrice * annualMultiplier / 12) : basePrice;
                    const totalPriceAnnual = isAnnual ? Math.round(basePrice * annualMultiplier) : null;
                    const perDurationText = isAnnual ? '/month' : '/month';
                    let priceHTML = `$<span class="price-value">${displayPrice}</span>${perDurationText}`;
                    if (isAnnual && totalPriceAnnual) {
                        priceHTML += `<small class="annual-total-price" style="display:block;font-size:0.8rem;color:var(--text-muted-color);">(Billed $${totalPriceAnnual} annually)</small>`;
                    }
                    priceTextContainer.innerHTML = priceHTML;
                }
            });
        });
        pricingToggle.dispatchEvent(new Event('change'));
    }
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
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    const floatingAssistant = document.getElementById('floating-ai-assistant');
    if (floatingAssistant) {
        floatingAssistant.addEventListener('click', () => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                 contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                 window.location.href = 'index.html#contact';
            }
        });
    }
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
                currentStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                videoFeed.srcObject = currentStream;
                videoFeed.style.display = 'block';
                if(cvPlaceholder) cvPlaceholder.style.display = 'none';
                if(startCameraButton) startCameraButton.disabled = true;
                if(stopCameraButton) stopCameraButton.disabled = false;
                processFrame();
            } else {
                alert('getUserMedia API not supported in this browser.');
                if(cvPlaceholder) cvPlaceholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Camera API not supported.';
            }
        } catch (err) {
            console.error("Error accessing camera: ", err);
            alert('Could not access camera. Please check permissions.');
            if(cvPlaceholder) cvPlaceholder.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Camera access denied.';
            if(startCameraButton) startCameraButton.disabled = false;
            if(stopCameraButton) stopCameraButton.disabled = true;
        }
    }
    function stopCamera() {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
        if(videoFeed) videoFeed.srcObject = null;
        if(videoFeed) videoFeed.style.display = 'none';
        if(cvPlaceholder) {
            cvPlaceholder.style.display = 'flex';
            cvPlaceholder.innerHTML = '<i class="fas fa-camera"></i> Camera Feed Offline';
        }
        if(startCameraButton) startCameraButton.disabled = false;
        if(stopCameraButton) stopCameraButton.disabled = true;
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
            ctx.strokeRect(x - size/2, y - size/2, size, size);
            ctx.fillText('FACE', x - size/2 + 5, y - size/2 + 20);
        }
        animationFrameId = requestAnimationFrame(processFrame);
    }
    if (startCameraButton) startCameraButton.addEventListener('click', startCamera);
    if (stopCameraButton) stopCameraButton.addEventListener('click', stopCamera);
    if(cvToggles) {
        cvToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                cvToggles.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
                currentCVMode = toggle.dataset.mode;
            });
        });
    }
    const labDiagramContainer = document.getElementById('lab-diagram-container');
    const labInfoCard = document.getElementById('lab-info-card');
    const closeLabInfoButton = document.getElementById('close-lab-info');
    if (labDiagramContainer && labInfoCard) {
        const placeholderIcon = labDiagramContainer.querySelector('.lab-placeholder i');
        if(placeholderIcon) {
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
                    if (lineData['data-prompt']) p.setAttribute('data-prompt', 'true');
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
        }, { threshold: 0.5 });
        terminalObserver.observe(terminalOutput);
    }
    const assistantButton = document.getElementById('floating-ai-assistant');
    if (assistantButton) {
        let tooltipElement = null;
        assistantButton.addEventListener('mouseenter', () => {
            if (!tooltipElement) {
                tooltipElement = document.createElement('div');
                tooltipElement.textContent = 'Need assistance? Click me!';
                tooltipElement.style.position = 'fixed';
                tooltipElement.style.backgroundColor = 'var(--card-bg-opaque)';
                tooltipElement.style.color = 'var(--text-color)';
                tooltipElement.style.padding = '8px 12px';
                tooltipElement.style.borderRadius = 'var(--border-radius-small)';
                tooltipElement.style.border = '1px solid var(--primary-color)';
                tooltipElement.style.boxShadow = 'var(--box-shadow-glow-primary)';
                tooltipElement.style.fontSize = '0.85rem';
                tooltipElement.style.fontFamily = 'var(--font-secondary)';
                tooltipElement.style.zIndex = '1000';
                tooltipElement.style.opacity = '0';
                tooltipElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                tooltipElement.style.transform = 'translateY(10px)';
                tooltipElement.style.pointerEvents = 'none';
                document.body.appendChild(tooltipElement);
            }
            const rect = assistantButton.getBoundingClientRect();
            const tooltipWidth = tooltipElement.offsetWidth;
            tooltipElement.style.left = `${rect.right - tooltipWidth}px`;
            tooltipElement.style.bottom = `${window.innerHeight - rect.top + 10}px`;
            requestAnimationFrame(() => {
                tooltipElement.style.transform = 'translateY(0)';
                tooltipElement.style.opacity = '1';
            });
        });
        assistantButton.addEventListener('mouseleave', () => {
            if (tooltipElement) {
                tooltipElement.style.opacity = '0';
                tooltipElement.style.transform = 'translateY(10px)';
            }
        });
    }
    const techCubeInstruction = document.querySelector('.tech-cube-instruction');
    if (techCubeInstruction && techCubeInstruction.innerHTML.trim() === '') {
        techCubeInstruction.textContent = '';
    }
    const backToTopButton = document.createElement('button');
    backToTopButton.setAttribute('aria-label', 'Scroll to top');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.style.cssText = `
        position: fixed; right: 20px; width: 45px; height: 45px;
        background-color: var(--primary-color); color: white;
        border: none; border-radius: 50%; font-size: 18px; cursor: pointer;
        opacity: 0; visibility: hidden; transform: translateY(20px);
        transition: opacity 0.3s, visibility 0.3s, transform 0.3s, background-color 0.3s;
        z-index: 997; box-shadow: 0 3px 10px rgba(0,0,0,0.25);
        display: flex; align-items: center; justify-content: center;
    `;
    const floatingButtonsContainer = document.querySelector('.floating-buttons-container');
    let bottomOffset = 20;
    if(floatingAssistant) {
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    const youtubeIframe = document.querySelector('#synergy-box-video iframe');
    if (youtubeIframe && youtubeIframe.src.includes('youtube.com/embed/')) {
        let currentSrc = youtubeIframe.src;
        let params = new URLSearchParams(currentSrc.split('?')[1] || '');
        params.set('autoplay', '0'); params.set('mute', '0');
        params.set('rel', '0'); params.set('playsinline', '1');
        let baseUrl = currentSrc.split('?')[0];
        youtubeIframe.src = `${baseUrl}?${params.toString()}`;
    }
    const blob = document.getElementById("blob");
    if (blob) {
        window.onpointermove = event => {
            const { clientX, clientY } = event;
            blob.animate({
                left: `${clientX}px`,
                top: `${clientY}px`
            }, { duration: 3000, fill: "forwards" });
        }
    }
    const audio = document.getElementById('background-audio');
    if (audio) {
        audio.volume = 0.2;
        const playAudio = () => {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
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