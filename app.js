/**
 * Philosafi Portfolio - Core Application Logic
 * Fixed Version: Robust Navigation, Centering, and Event Handling
 */

// ==========================================
// CONFIGURATION
// ==========================================
const CONFIG = {
    // API & UI
    ELEVENLABS_API: 'https://api.elevenlabs.io/v1/text-to-speech',
    DEFAULT_API_KEY: '94ac572b315ad0a59b8ac3146b3f1465e824dd51f9ba9e9e7c06dc384b8ea685',
    MODEL_ID: 'eleven_multilingual_v2',
    VOICES: {
        rachel: '21m00Tcm4TlvDq8ikWAM',
        drew: '29vD33N1CtxCmqQRPOHJ',
        bella: 'EXAVITQu4vr4xnSDxMaL',
        josh: 'TxGEqnHWrfWFTfGW9XjX'
    },

    // Canvas Dimensions
    SLIDE_WIDTH: 960,
    SLIDE_HEIGHT: 540,
    GRID_GAP: 160, // Increased gap for better separation

    // Zoom Settings
    ZOOM: {
        MAX: 2.0,
        MIN: 0.05,
        FOCUSED: 1.0,
        OVERVIEW: 0.12 // Calculated dynamically usually, but good fallback
    },

    // Animation
    TRANSITION_DURATION: 1500 // Even slower transition (was 1200)
};

// ==========================================
// STATE
// ==========================================
const state = {
    canvas: {
        x: 0,
        y: 0,
        scale: CONFIG.ZOOM.OVERVIEW,
        isDragging: false,
        startX: 0,
        startY: 0
    },
    navigation: {
        currentIndex: 0,
        mode: 'overview', // 'overview' | 'focused'
        isAnimating: false
    },
    presenter: {
        active: false,
        playing: false,
        audio: null,
        voice: localStorage.getItem('voice_id') || 'rachel',
        apiKey: (function () {
            const stored = localStorage.getItem('elevenlabs_key');
            // If the stored key is the old placeholder or starts with 'sk_', ignore it and use the new default
            if (!stored || stored.startsWith('sk_') || stored === 'sk_2f66eb5deddfcf0fa64cceab97c3207060058e3c308e110d') {
                return CONFIG.DEFAULT_API_KEY;
            }
            return stored;
        })()
    }
};

// ==========================================
// UTILS
// ==========================================
const $ = (selector) => {
    const el = document.querySelector(selector);
    if (!el) console.warn(`Element not found: ${selector}`);
    return el;
};
const $$ = (selector) => document.querySelectorAll(selector);

// ==========================================
// INITIALIZATION
// ==========================================
async function init() {
    console.log('Initializing Philosafi Portfolio...');

    // 1. Render Content
    renderSlides();
    renderSidebarNav();

    // 2. Setup Interactions
    setupCanvasInteractions();
    setupNavigationControls();
    setupSidebar();
    setupPresenter();

    // 3. Start Intro Sequence
    // Start with overview layout behind the overlay
    showOverview();

    setTimeout(() => {
        const intro = $('#intro-overlay');
        if (intro) {
            // Fade out overlay
            intro.style.opacity = '0';

            // Wait for fade to complete, then zoom in
            setTimeout(() => {
                intro.classList.add('hidden');
                // Longer pause to admire the grid (was 800)
                setTimeout(() => focusSlide(0), 1200);
            }, 1000);
        } else {
            focusSlide(0);
        }
    }, 2000); // Intro stays longer (was 1500)
}

// ==========================================
// RENDER LOGIC
// ==========================================
function renderSlides() {
    const canvas = $('#canvas');
    if (!canvas) return;

    canvas.innerHTML = '';

    // Find grid bounds to center the whole grid initially
    const maxRow = Math.max(...slidesData.map(s => s.row));
    const maxCol = Math.max(...slidesData.map(s => s.col));
    const gridWidth = (maxCol + 1) * (CONFIG.SLIDE_WIDTH + CONFIG.GRID_GAP);
    const gridHeight = (maxRow + 1) * (CONFIG.SLIDE_HEIGHT + CONFIG.GRID_GAP);

    canvas.style.width = `${gridWidth}px`;
    canvas.style.height = `${gridHeight}px`;

    slidesData.forEach((slide, index) => {
        const el = document.createElement('div');
        el.className = `slide ${slide.theme || 'dark'}`;
        el.id = `slide-${index}`;

        // Position
        const x = slide.col * (CONFIG.SLIDE_WIDTH + CONFIG.GRID_GAP);
        const y = slide.row * (CONFIG.SLIDE_HEIGHT + CONFIG.GRID_GAP);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;

        // Content
        const hasNote = localStorage.getItem(`note_${index}`);

        el.innerHTML = `
            <div class="slide-content">
                ${index === 0 ? '<div class="globe-container"><canvas id="globe-canvas"></canvas></div>' : ''}
                ${hasNote ? `<div class="slide-note-indicator" title="${hasNote}">📝</div>` : ''}
                ${slide.signature ? `<div class="slide-signature">${slide.signature}</div>` : ''}
                <div class="slide-subtitle">${slide.subtitle || ''}</div>
                <h2 class="slide-title">${slide.title}</h2>
                <div class="slide-description">${slide.description}</div>
                ${slide.link ? `<a href="${slide.link.url}" target="_blank" class="btn btn-ghost" style="margin-top:1rem; border:1px solid currentColor">${slide.link.text} ↗</a>` : ''}
            </div>
        `;

        if (index === 0) {
            setTimeout(initGlobe, 100);
        }

        // Click to Focus
        el.addEventListener('click', (e) => {
            if (state.canvas.isDragging) return;
            e.stopPropagation(); // Prevent canvas background click
            focusSlide(index);
        });

        canvas.appendChild(el);
    });
}

function renderSidebarNav() {
    const list = $('#nav-list');
    if (!list) return;

    list.innerHTML = '';

    navSections.forEach(section => {
        const li = document.createElement('li');

        const link = document.createElement('div');
        link.className = 'nav-item';
        if (section.children) link.classList.add('section-title');
        link.textContent = section.label;

        if (!section.children) {
            link.onclick = () => {
                const idx = slidesData.findIndex(s => s.id === section.slideId);
                if (idx !== -1) {
                    focusSlide(idx);
                    closeSidebar();
                }
            };
        }
        li.appendChild(link);

        if (section.children) {
            section.children.forEach(child => {
                const subLink = document.createElement('div');
                subLink.className = 'nav-item sub-item';
                subLink.textContent = child.label;
                subLink.onclick = () => {
                    const idx = slidesData.findIndex(s => s.id === child.slideId);
                    if (idx !== -1) {
                        focusSlide(idx);
                        closeSidebar();
                    }
                };
                li.appendChild(subLink);
            });
        }

        list.appendChild(li);
    });
}

// ==========================================
// CORE NAVIGATION & TRANSFORMS
// ==========================================
function updateCanvasTransform() {
    const canvas = $('#canvas');
    if (!canvas) return;

    canvas.style.transform = `translate(${state.canvas.x}px, ${state.canvas.y}px) scale(${state.canvas.scale})`;

    // Update UI
    const zoomDisplay = $('#zoom-display');
    if (zoomDisplay) zoomDisplay.textContent = `${Math.round(state.canvas.scale * 100)}%`;

    // Update active class
    $$('.slide').forEach((el, i) => {
        if (state.navigation.mode === 'focused' && i === state.navigation.currentIndex) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    // Update Counter
    const counter = $('#current-slide-num');
    if (counter) counter.textContent = state.navigation.currentIndex + 1;
    const total = $('#total-slides');
    if (total) total.textContent = slidesData.length;
}

function focusSlide(index) {
    if (index < 0 || index >= slidesData.length) return;

    state.navigation.currentIndex = index;
    state.navigation.mode = 'focused';

    const slide = slidesData[index];
    const x = slide.col * (CONFIG.SLIDE_WIDTH + CONFIG.GRID_GAP);
    const y = slide.row * (CONFIG.SLIDE_HEIGHT + CONFIG.GRID_GAP);

    // Viewport Center
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Target Scale - Smart Fit
    const padding = 40; // px
    const scaleX = (vw - padding) / CONFIG.SLIDE_WIDTH;
    const scaleY = (vh - padding) / CONFIG.SLIDE_HEIGHT;

    // Use the smaller scale to ensure fit, but cap at MAX
    let scale = Math.min(scaleX, scaleY);
    // Also cap at FOCUSED (1.0) if screen is huge? Or let it grow? 
    // Let's cap at 1.2 to avoid pixelation, but allow < 1 for mobile
    scale = Math.min(scale, 1.2);

    state.canvas.scale = scale;

    // Calculate translate to put center of slide at center of viewport
    // Canvas Origin is 0,0 (Top Left)
    // Slide Center relative to canvas = x + Width/2, y + Height/2
    // We want that point to be at vw/2, vh/2
    // TranslateX = (vw/2) - (SlideCenterX * scale)

    const slideCenterX = x + CONFIG.SLIDE_WIDTH / 2;
    const slideCenterY = y + CONFIG.SLIDE_HEIGHT / 2;

    state.canvas.x = (vw / 2) - (slideCenterX * scale);
    state.canvas.y = (vh / 2) - (slideCenterY * scale);

    updateCanvasTransform();
    updateButtonStates();

    updateButtonStates();

    // Auto-read if presenter panel is active (Continuous Mode)
    if (state.presenter.active && !state.canvas.isDragging) {
        // Debounce slightly to prevent rapid-fire API calls if scrolling fast
        if (state.presenter.debounce) clearTimeout(state.presenter.debounce);
        state.presenter.debounce = setTimeout(() => {
            playNarration(index);
        }, 500);
    }
}

function showOverview() {
    state.navigation.mode = 'overview';

    // Calculate total grid size
    const maxCol = Math.max(...slidesData.map(s => s.col));
    const maxRow = Math.max(...slidesData.map(s => s.row));
    const totalW = (maxCol + 1) * (CONFIG.SLIDE_WIDTH + CONFIG.GRID_GAP);
    const totalH = (maxRow + 1) * (CONFIG.SLIDE_HEIGHT + CONFIG.GRID_GAP);

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Fit with padding
    const scaleX = (vw - 100) / totalW;
    const scaleY = (vh - 100) / totalH;
    const scale = Math.min(scaleX, scaleY, CONFIG.ZOOM.OVERVIEW);

    state.canvas.scale = scale;
    state.canvas.x = (vw - (totalW * scale)) / 2;
    state.canvas.y = (vh - (totalH * scale)) / 2;

    updateCanvasTransform();
    updateButtonStates();
}

function navigateStep(direction) {
    // If in overview, just go to first or current
    if (state.navigation.mode === 'overview') {
        focusSlide(state.navigation.currentIndex);
        return;
    }

    const currentSlide = slidesData[state.navigation.currentIndex];
    let nextIndex = -1;

    if (direction === 'next') nextIndex = state.navigation.currentIndex + 1;
    if (direction === 'prev') nextIndex = state.navigation.currentIndex - 1;

    // Spatial Navigation
    if (['up', 'down', 'left', 'right'].includes(direction)) {
        const dRow = direction === 'down' ? 1 : direction === 'up' ? -1 : 0;
        const dCol = direction === 'right' ? 1 : direction === 'left' ? -1 : 0;

        const targetRow = currentSlide.row + dRow;
        const targetCol = currentSlide.col + dCol;

        nextIndex = slidesData.findIndex(s => s.row === targetRow && s.col === targetCol);
    }

    if (nextIndex >= 0 && nextIndex < slidesData.length) {
        focusSlide(nextIndex);
    }
}

// ==========================================
// CONTROLS & EVENTS
// ==========================================
function setupNavigationControls() {
    // Toolbar
    const bind = (id, fn) => {
        const el = $(id);
        if (el) el.onclick = fn;
    };

    bind('#btn-zoom-in', () => {
        state.canvas.scale = Math.min(state.canvas.scale + 0.1, CONFIG.ZOOM.MAX);
        updateCanvasTransform();
    });

    bind('#btn-zoom-out', () => {
        state.canvas.scale = Math.max(state.canvas.scale - 0.1, CONFIG.ZOOM.MIN);
        updateCanvasTransform();
    });

    bind('#btn-overview', showOverview);
    bind('#btn-fit', () => focusSlide(state.navigation.currentIndex));

    bind('#btn-fullscreen', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            $('.fs-enter').classList.add('hidden');
            $('.fs-exit').classList.remove('hidden');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                $('.fs-enter').classList.remove('hidden');
                $('.fs-exit').classList.add('hidden');
            }
        }
    });

    // D-Pad
    bind('#nav-up', () => navigateStep('up'));
    bind('#nav-down', () => navigateStep('down'));
    bind('#nav-left', () => navigateStep('left'));
    bind('#nav-right', () => navigateStep('right'));
    bind('#nav-center', () => {
        if (state.navigation.mode === 'overview') focusSlide(state.navigation.currentIndex);
        else showOverview();
    });

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (state.presenter.active && $('#presenter-panel.hidden')) return; // Don't hijack if typing in inputs? No inputs commonly

        switch (e.key) {
            case 'ArrowRight': navigateStep('next'); break;
            case 'ArrowLeft': navigateStep('prev'); break;
            case 'ArrowUp': navigateStep('up'); break;
            case 'ArrowDown': navigateStep('down'); break;
            case ' ': // Space toggle
                if (state.navigation.mode === 'overview') focusSlide(state.navigation.currentIndex);
                else showOverview();
                break;
            case 'Escape':
                showOverview();
                closeSidebar();
                break;
        }
    });
}

function updateButtonStates() {
    const isOverview = state.navigation.mode === 'overview';
    const btnOverview = $('#btn-overview');
    const btnFit = $('#btn-fit');

    if (btnOverview) isOverview ? btnOverview.classList.add('active') : btnOverview.classList.remove('active');
    if (btnFit) !isOverview ? btnFit.classList.add('active') : btnFit.classList.remove('active');
}

function setupCanvasInteractions() {
    const container = $('#main-content');
    if (!container) return;

    container.addEventListener('mousedown', (e) => {
        // Don't drag if clicking a button or slide link
        if (e.target.closest('button') || e.target.closest('a')) return;

        state.canvas.isDragging = true;
        state.canvas.startX = e.clientX - state.canvas.x;
        state.canvas.startY = e.clientY - state.canvas.y;
        container.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
        if (!state.canvas.isDragging) return;
        e.preventDefault();
        state.canvas.x = e.clientX - state.canvas.startX;
        state.canvas.y = e.clientY - state.canvas.startY;
        updateCanvasTransform();
    });

    window.addEventListener('mouseup', () => {
        if (state.canvas.isDragging) {
            state.canvas.isDragging = false;
            container.style.cursor = 'grab';
        }
    });

    // Scroll to Zoom
    container.addEventListener('wheel', (e) => {
        if (state.navigation.mode === 'overview') return;
        e.preventDefault();

        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        state.canvas.scale = Math.max(Math.min(state.canvas.scale + delta, CONFIG.ZOOM.MAX), CONFIG.ZOOM.MIN);
        updateCanvasTransform();
    }, { passive: false });

    // Click background to overview?
    container.addEventListener('click', (e) => {
        if (e.target === container || e.target.id === 'canvas') {
            // Optional: Click background to overview
            // showOverview();
        }
    });

    // Touch Support for Swipe
    let touchStartX = 0;
    let touchStartY = 0;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (state.navigation.mode === 'overview') return; // Don't swipe in overview

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Horizontal Swipe
        if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 0) navigateStep('next'); // Swipe Left -> Next
            else navigateStep('prev'); // Swipe Right -> Prev
        }

        // Vertical Swipe (Optional: Up/Down navigation?)
        /*
        if (Math.abs(diffY) > 50 && Math.abs(diffY) > Math.abs(diffX)) {
             if (diffY > 0) navigateStep('down');
             else navigateStep('up');
        }
        */
    }, { passive: true });
}

function setupSidebar() {
    const sidebar = $('#sidebar');
    const backdrop = $('#sidebar-backdrop');
    const menuBtn = $('#menu-btn');
    const closeBtn = $('#close-sidebar');

    if (!sidebar || !backdrop) return;

    window.closeSidebar = () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('active');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    };

    const openSidebar = () => {
        sidebar.classList.add('open');
        backdrop.classList.add('active');
        if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    };

    if (menuBtn) menuBtn.onclick = openSidebar;
    if (closeBtn) closeBtn.onclick = closeSidebar;
    if (backdrop) backdrop.onclick = closeSidebar;
}

// ==========================================
// AI PRESENTER LOGIC
// ==========================================
function setupPresenter() {
    const btnStart = $('#presenter-btn');
    const btnClose = $('#presenter-close');
    const panel = $('#presenter-panel');

    const togglePanel = () => {
        if (panel.classList.contains('hidden')) {
            panel.classList.remove('hidden');
            state.presenter.active = true;
            // Check API Key
            if (!state.presenter.apiKey) {
                $('#api-modal').classList.add('active');
            } else {
                playNarration(state.navigation.currentIndex);
            }
        } else {
            panel.classList.add('hidden');
            state.presenter.active = false;
            stopAudio();
        }
    };

    if (btnStart) btnStart.onclick = togglePanel;
    if (btnClose) btnClose.onclick = togglePanel;

    // Modal
    const btnModalSave = $('#modal-save');
    const btnModalCancel = $('#modal-cancel');

    if (btnModalSave) {
        btnModalSave.onclick = () => {
            const key = $('#api-key-input').value.trim();
            const voice = $('#voice-select').value;
            if (key) {
                state.presenter.apiKey = key;
                state.presenter.voice = voice;
                localStorage.setItem('elevenlabs_key', key);
                localStorage.setItem('voice_id', voice);
                $('#api-modal').classList.remove('active');
                playNarration(state.navigation.currentIndex);
            }
        };
    }

    if (btnModalCancel) {
        btnModalCancel.onclick = () => $('#api-modal').classList.remove('active');
    }

    // Controls
    const btnPlay = $('#presenter-play');
    if (btnPlay) {
        btnPlay.onclick = () => {
            if (state.presenter.playing) {
                if (state.presenter.audio) state.presenter.audio.pause();
                state.presenter.playing = false;
                $('.icon-pause').classList.add('hidden');
                $('.icon-play').classList.remove('hidden');
            } else {
                if (state.presenter.audio) state.presenter.audio.play();
                else playNarration(state.navigation.currentIndex);

                state.presenter.playing = true;
                $('.icon-pause').classList.remove('hidden');
                $('.icon-play').classList.add('hidden');
            }
        };
    }

    const btnPrev = $('#presenter-prev');
    if (btnPrev) btnPrev.onclick = () => navigateStep('prev');

    const btnNext = $('#presenter-next');
    if (btnNext) btnNext.onclick = () => navigateStep('next');
}

async function playNarration(index) {
    if (index < 0 || index >= slidesData.length) return;
    const slide = slidesData[index];
    if (!slide.narration) return;

    stopAudio();

    const status = $('#presenter-status');
    const loader = $('#loading-overlay');

    if (status) status.textContent = 'Generating...';
    if (loader) loader.classList.remove('hidden');

    try {
        const audioBlob = await fetchTTS(slide.narration);
        const url = URL.createObjectURL(audioBlob);
        state.presenter.audio = new Audio(url);

        state.presenter.audio.onended = () => {
            // Auto Advance
            state.presenter.playing = false;
            $('.icon-pause').classList.add('hidden');
            $('.icon-play').classList.remove('hidden');
            if (status) status.textContent = 'Finished';

            // Auto Advance with Loop
            let countdown = 3;
            const updateCount = () => {
                if (status) status.textContent = `Next slide in ${countdown}s...`;
            };
            updateCount();

            const timer = setInterval(() => {
                countdown--;
                updateCount();
                if (countdown <= 0) {
                    clearInterval(timer);
                    navigateStep('next');
                }
            }, 1000);

            // Store timer to clear if user interrupts
            state.presenter.timer = timer;
        };

        state.presenter.audio.play();
        state.presenter.playing = true;

        if (loader) loader.classList.add('hidden');
        if (status) status.textContent = 'Speaking';
        $('.icon-pause').classList.remove('hidden');
        $('.icon-play').classList.add('hidden');

    } catch (err) {
        console.error(err);
        if (loader) loader.classList.add('hidden');
        if (status) status.textContent = 'Error';
        alert('Check API Key/Network');
    }
}

function stopAudio() {
    if (state.presenter.timer) {
        clearInterval(state.presenter.timer);
        state.presenter.timer = null;
    }
    if (state.presenter.audio) {
        state.presenter.audio.pause();
        state.presenter.audio = null;
    }
    state.presenter.playing = false;
    $('.icon-pause').classList?.add('hidden');
    $('.icon-play').classList?.remove('hidden');
}

async function fetchTTS(text) {
    const voiceId = CONFIG.VOICES[state.presenter.voice] || CONFIG.VOICES.rachel;

    const response = await fetch(`${CONFIG.ELEVENLABS_API}/${voiceId}`, {
        method: 'POST',
        headers: {
            'xi-api-key': state.presenter.apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text,
            model_id: CONFIG.MODEL_ID,
            voice_settings: { stability: 0.5, similarity_boost: 0.75 }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('ElevenLabs Error:', errorData);
        throw new Error(errorData.detail?.status || errorData.detail || 'API Request Failed');
    }

    return await response.blob();
}
// ==========================================
// GLOBE ANIMATION
// ==========================================
function initGlobe() {
    const canvas = $('#globe-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = 400;
    let height = canvas.height = 400;

    // Config
    const GLOBE_RADIUS = 140;
    const DOT_RADIUS = 2;
    const DOT_COUNT = 400;
    const PERSPECTIVE = 300;
    const ROTATION_SPEED = 0.005;

    // Points
    const dots = [];
    for (let i = 0; i < DOT_COUNT; i++) {
        const theta = Math.random() * 2 * Math.PI; // Random angle around Y
        const phi = Math.acos((Math.random() * 2) - 1); // Random angle from pole

        const x = GLOBE_RADIUS * Math.sin(phi) * Math.cos(theta);
        const y = GLOBE_RADIUS * Math.sin(phi) * Math.sin(theta);
        const z = GLOBE_RADIUS * Math.cos(phi);

        dots.push({ x, y, z });
    }

    let angle = 0;

    function animate() {
        if (!state.navigation.mode === 'overview') {
            // Pause if zoomed out for performance? 
            // Actually, keep running for visual flair
        }

        ctx.clearRect(0, 0, width, height);
        angle += ROTATION_SPEED;

        ctx.fillStyle = '#3b82f6'; // Blue accent

        dots.forEach(dot => {
            // Rotate Y
            const x = dot.x * Math.cos(angle) - dot.z * Math.sin(angle);
            const z = dot.x * Math.sin(angle) + dot.z * Math.cos(angle);
            const y = dot.y;

            // Project
            const scale = PERSPECTIVE / (PERSPECTIVE + z + GLOBE_RADIUS + 50);
            const screenX = width / 2 + x * scale;
            const screenY = height / 2 + y * scale;

            // Draw scale opacity based on z
            const alpha = (z + GLOBE_RADIUS) / (2 * GLOBE_RADIUS);
            ctx.globalAlpha = Math.max(0.1, alpha);

            // Draw Heart? 
            // Just dots for now
            ctx.beginPath();
            ctx.arc(screenX, screenY, DOT_RADIUS * scale, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// ==========================================
// NOTES FEATURE
// ==========================================
function setupNotes() {
    const btnNote = $('#btn-note');
    const modal = $('#note-modal');
    const input = $('#note-input');
    const btnSave = $('#btn-save-note');
    const btnCancel = $('#btn-cancel-note');

    if (!btnNote || !modal) return;

    // Open Modal
    btnNote.onclick = () => {
        const idx = state.navigation.currentIndex;
        const existing = localStorage.getItem(`note_${idx}`);
        input.value = existing || '';
        modal.classList.remove('hidden');
        modal.classList.add('active'); // Ensure flex display if using active class in CSS (or just remove hidden)
    };

    // Close Modal
    const close = () => {
        modal.classList.add('hidden');
        modal.classList.remove('active');
    };
    btnCancel.onclick = close;

    // Save
    btnSave.onclick = () => {
        const idx = state.navigation.currentIndex;
        const text = input.value.trim();

        if (text) {
            localStorage.setItem(`note_${idx}`, text);
            // Update UI
            const slide = $(`#slide-${idx} .slide-content`);
            if (slide) {
                // Remove existing
                const existing = slide.querySelector('.slide-note-indicator');
                if (existing) existing.remove();

                // Add new
                const badge = document.createElement('div');
                badge.className = 'slide-note-indicator';
                badge.title = text;
                badge.textContent = '📝';

                // Insert after globe or as first child
                slide.insertBefore(badge, slide.firstChild);
            }
        } else {
            localStorage.removeItem(`note_${idx}`);
            const slide = $(`#slide-${idx} .slide-content`);
            const existing = slide?.querySelector('.slide-note-indicator');
            if (existing) existing.remove();
        }
        close();
    };

    // Emojis
    $$('.emoji-btn').forEach(btn => {
        btn.onclick = () => {
            input.value += btn.textContent;
            input.focus();
        };
    });
}
// Start
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupNotes();
});
