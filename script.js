document.addEventListener('DOMContentLoaded', () => {
    let appData = {};
    let searchIndex = [];
    let navHistory = []; // For breadcrumbs

    // DOM Elements
    const searchInput = document.getElementById('hero-search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    const dynamicList = document.getElementById('dynamic-list');
    const breadcrumbsContainer = document.getElementById('breadcrumbs');
    const tabs = document.querySelectorAll('.tab-btn');

    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            appData = data;
            
            // 1. ALWAYS build the search index so the Search Bar works
            if (typeof buildSearchIndex === 'function') {
                buildSearchIndex(data);
            }

            // 2. Only load the "Hub/List" view if the container exists (prevents errors on Home Page)
            // We check for 'dynamicList' which is defined at the top of your script
            if (dynamicList && typeof loadCollegesView === 'function') {
                loadCollegesView();
            }

            // B. Logic for Contributors Page (Core Team Grid)
            const teamGridContainer = document.getElementById('core-team-grid');
            if (teamGridContainer && data.team) {
                renderCoreTeam(data.team);
            }
        })
        .catch(err => console.error("Error loading data:", err));


    // --- 2. Tabbed Interface Logic ---
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active tab styling
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.dataset.target;
            if (target === 'university-list') {
                navHistory = []; // Reset history for top level
                loadCollegesView();
            } else if (target === 'documents-list') {
                dynamicList.innerHTML = '<p class="loading-text" style="grid-column: 1/-1; text-align:center; padding: 2rem;">Latest documents view coming soon...</p>';
                breadcrumbsContainer.innerHTML = '';
            } else {
                 dynamicList.innerHTML = '<p class="loading-text" style="grid-column: 1/-1; text-align:center; padding: 2rem;">Books view coming soon...</p>';
                 breadcrumbsContainer.innerHTML = '';
            }
        });
    });


    // --- 3. View Renderers (The core hub logic) ---

    function loadCollegesView() {
        updateBreadcrumbs();
        renderCards(appData.colleges, 'college');
    }

    function loadSemestersView(college) {
        navHistory.push({ name: college.name, type: 'college', data: college });
        updateBreadcrumbs();
        renderCards(college.semesters, 'semester');
    }

    function loadSubjectsView(semester) {
        navHistory.push({ name: semester.name, type: 'semester', data: semester });
        updateBreadcrumbs();
        renderCards(semester.subjects, 'subject');
    }

    function loadCategoriesView(subject) {
        navHistory.push({ name: subject.name, type: 'subject', data: subject });
        updateBreadcrumbs();
        renderCards(subject.categories, 'resource');
    }


    // Generic Card Renderer
    function renderCards(items, type) {
        dynamicList.innerHTML = '';
        dynamicList.className = 'content-grid';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'grid-card';
            
            let icon = '📄';
            if(type === 'college') icon = '🏛️';
            if(type === 'semester') icon = '📅';
            if(type === 'subject') icon = '📚';
            if(type === 'resource') icon = '🔗';

            let subtitle = type === 'college' ? `${item.semesters.length} Semesters` : 
                           type === 'subject' ? `${item.categories.length} Resource categories` : '';

            card.innerHTML = `
                <div class="card-icon">${icon}</div>
                <div>
                    <div class="card-title">${item.name}</div>
                    ${subtitle ? `<div class="card-subtitle">${subtitle}</div>` : ''}
                </div>
            `;

            card.onclick = () => {
                if (type === 'college') loadSemestersView(item);
                else if (type === 'semester') loadSubjectsView(item);
                else if (type === 'subject') loadCategoriesView(item);
                else if (type === 'resource') window.open(item.url, '_blank');
            };

            dynamicList.appendChild(card);
        });
    }

        // --- Global State ---
    let selectedCollege = null;

        // --- Function to Switch Views ---
    function openSemesterView(collegeId, pushToHistory = true) {
        if (pushToHistory) {
            history.pushState({ page: 'semester', collegeId: collegeId }, '', `#semester-${collegeId}`);
        }

        // Hide ALL Home Sections
        document.querySelector('.hero-section').style.display = 'none';
        document.querySelector('.colleges-selection-section').style.display = 'none';
        
        const features = document.querySelector('.features-section');
        if(features) features.style.display = 'none';

        // --- NEW: Hide Stats Section ---
        const statsSection = document.querySelector('.stats-section');
        if(statsSection) statsSection.style.display = 'none';

        // --- NEW: Hide Testimonials and CTA ---
        const testimonials = document.querySelector('.testimonials-section');
        if(testimonials) testimonials.style.display = 'none';

        const ctaHighlight = document.querySelector('.cta-highlight-section');
        if(ctaHighlight) ctaHighlight.style.display = 'none';
        // --------------------------------------

        // Show Semester View
        const semSection = document.getElementById('semester-view');
        semSection.style.display = 'block';
        
        window.scrollTo(0, 0);

        // 5. Populate Data
        const collegeData = appData.colleges.find(c => c.id === collegeId) || appData.colleges[0];
        selectedCollege = collegeData;
        const crumbName = document.getElementById('college-name-crumb');
        if(crumbName) crumbName.textContent = collegeData.name;
        
        // ... (Generating semester cards logic) ...
        const grid = document.getElementById('semester-grid');
        grid.innerHTML = ''; 
        for(let i = 1; i <= 8; i++) {
             // ... existing loop logic ...
             // (Use your existing code for creating cards)
             const semesterData = collegeData.semesters.find(s => s.id === `sem_${i}`);
             const exists = !!semesterData;
             const card = document.createElement('div');
             card.className = 'semester-card';
             const iconColors = ['bg-blue', 'bg-purple', 'bg-pink', 'bg-green', 'bg-orange', 'bg-blue', 'bg-purple', 'bg-pink'];

            // Professional SVG Icons (Feather Icons Style)
            const icons = [
                // 1. Compass (Orientation)
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
                
                // 2. Rocket (Launch/Noob)
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
                
                // 3. Lightbulb (Reality Hit/Idea)
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.4 1.5-3.8 0-3.9-3.1-7-7-7S4 4.1 4 8c0 1.4.5 2.8 1.5 3.8.8.8 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
                
                // 4. Hourglass (Adapt or Die/Time)
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/></svg>`,
                
                // 5. Trending Up (Serious Mode/Growth)
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
                
                // 6. Laptop/Terminal (Programming)
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
                
                // 7. Target (Almost Engineer)
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
                
                // 8. Graduation Cap (Freedom)
                `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`
            ];
             const titles = ["Orientation Era", "Overconfident Noob", "Reality Hit", "Adapt or Die", "Serious Mode (Fake)", "Panic Programming", "Almost Engineer", "Emotion + Freedom"];
             const numStr = i.toString().padStart(2, '0');
             card.innerHTML = `<div class="sem-number-watermark">${numStr}</div><div class="sem-icon-box ${iconColors[i-1]}">${icons[i-1]}</div><h3>Semester ${i}</h3><p>${exists ? titles[i-1] : 'Coming Soon'}</p>`;
            // REPLACE THIS SECTION INSIDE openSemesterView function loop:
            if (exists) {
                card.onclick = (e) => {
                    e.preventDefault(); // Stop immediate redirect
                    
                    // Call the loader with a callback function
                    runSemesterLoader(() => {
                        window.location.href = semesterData.url;
                    });
                };
            }
             else { card.style.opacity = '0.6'; card.style.cursor = 'default'; }
             grid.appendChild(card);
        }
    }

    // Update this function
    function resetToHome() {
        document.getElementById('semester-view').style.display = 'none';

        // Show ALL Home Sections again
        document.querySelector('.hero-section').style.display = 'block';
        document.querySelector('.colleges-selection-section').style.display = 'block';
        
        const features = document.querySelector('.features-section');
        if(features) features.style.display = 'block';

        // --- NEW: Show Stats Section ---
        const statsSection = document.querySelector('.stats-section');
        if(statsSection) statsSection.style.display = 'block';

        // --- NEW: Show Testimonials and CTA ---
        const testimonials = document.querySelector('.testimonials-section');
        if(testimonials) testimonials.style.display = 'block';

        const ctaHighlight = document.querySelector('.cta-highlight-section');
        if(ctaHighlight) ctaHighlight.style.display = 'block'; // Make sure this matches your class name (block/flex depending on your css, block is usually safe)
        // --------------------------------------

        window.scrollTo(0, 0);
    }


    // --- Browser Back Button Listener ---
    window.addEventListener('popstate', (event) => {
        // If state is null, we are back at the root (Home)
        if (!event.state) {
            resetToHome();
        } else if (event.state.page === 'semester') {
            // If user went "Forward" to a semester view
            openSemesterView(event.state.collegeId, false); // false = don't push state again
        }
    });

    // Expose functions to Window so HTML can see them
    window.openSemesterView = openSemesterView;
    window.resetToHome = () => {
        history.back(); // Using history.back() for the UI "Home" button ensures consistency
    };


    // --- 4. Breadcrumbs Logic ---
    function updateBreadcrumbs() {
        if (navHistory.length === 0) {
            breadcrumbsContainer.innerHTML = 'Select a university to get started.';
            return;
        }

        let html = '<span class="link" onclick="resetToHome()">University</span>';
        navHistory.forEach((step, index) => {
            html += ' > ';
             // If it's not the last item, make it clickable to go back
            if (index < navHistory.length - 1) {
                 html += `<span class="link" onclick="goBackTo(${index})">${step.name}</span>`;
            } else {
                 html += `<span>${step.name}</span>`; // Last item is current view
            }
        });
        breadcrumbsContainer.innerHTML = html;
    }

    window.resetToHome = () => {
        navHistory = [];
        loadCollegesView();
    };
    
    window.goBackTo = (index) => {
        // Get the target view data
        const targetStep = navHistory[index];
        // Slice history up to that point
        navHistory = navHistory.slice(0, index);
        
        // Re-load based on type
        if(targetStep.type === 'college') loadSemestersView(targetStep.data);
        if(targetStep.type === 'semester') loadSubjectsView(targetStep.data);
    };


    // --- 5. Search Functionality (Fixed & Improved) ---
    function buildSearchIndex(data) {
        searchIndex = [];
        data.colleges.forEach(college => {
            // 1. Index the College Name (e.g., "ITER")
            searchIndex.push({ name: college.name, type: 'college', data: college });

            // 2. Safely Index Semesters and Subjects
            if (college.semesters) {
                college.semesters.forEach(sem => {
                    
                    // Check if subjects exist before looping (Fixes the crash for SIT/IIIT)
                    if (sem.subjects && Array.isArray(sem.subjects)) {
                        sem.subjects.forEach(subject => {
                            // Index the Subject (e.g., "UPM")
                            searchIndex.push({ 
                                name: subject.name, 
                                type: 'subject', 
                                data: subject,
                                // Context helps user see: "ITER > 1st Semester"
                                context: `${college.name} • ${sem.name}`
                            });

                            // Index specific Resources/Categories if needed
                            if (subject.categories) {
                                subject.categories.forEach(cat => {
                                    searchIndex.push({
                                        name: `${subject.name} - ${cat.name}`,
                                        type: 'resource',
                                        url: cat.url,
                                        context: 'Direct Link'
                                    });
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        searchDropdown.innerHTML = '';

        if (query.length < 2) {
            searchDropdown.style.display = 'none';
            return;
        }

        const matches = searchIndex.filter(item => item.name.toLowerCase().includes(query)).slice(0, 5);

        if (matches.length > 0) {
            searchDropdown.style.display = 'block';
            matches.forEach(match => {
                // ... (Keep your existing match rendering code here) ...
                const item = document.createElement('div');
                item.className = 'search-result-item';
                let icon = match.type === 'college' ? '🏛️' : match.type === 'subject' ? '📚' : '📄';
                // Highlight the matching text
                const regex = new RegExp(`(${query})`, 'gi');
                const highlightedName = match.name.replace(regex, '<span style="color:var(--primary-blue); font-weight:bold;">$1</span>');

                item.innerHTML = `
                    <span>${icon}</span>
                    <div>
                        <div>${highlightedName}</div> 
                        ${match.context ? `<div class="result-context">${match.context}</div>` : ''}
                    </div>
                `;
                item.onclick = () => handleSearchClick(match);
                searchDropdown.appendChild(item);
            });
        } else {
            // --- NEW: Empty State with CTA ---
            searchDropdown.style.display = 'block';
            searchDropdown.innerHTML = `
                <div class="search-result-item" onclick="window.open('https://forms.gle/bbWV2wqrHFeoYZVv6', '_blank')" style="justify-content: center; text-align: center; color: var(--primary-blue);">
                    <div>
                        <div style="font-weight: 600;">No results found</div>
                        <div class="result-context">Tap here to request this resource</div>
                    </div>
                </div>
            `;
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header-search-wrapper')) {
            searchDropdown.style.display = 'none';
        }
    });

    function handleSearchClick(match) {
        searchDropdown.style.display = 'none';
        searchInput.value = '';
        
        // Priority 1: Check for direct URL (Works for most items in your current JSON)
        const targetUrl = match.url || (match.data && match.data.url);

        if (targetUrl) {
            window.location.href = targetUrl; 
            return;
        }

        // Priority 2: Try to load internal view (Only if the container exists)
        const dynamicList = document.getElementById('dynamic-list');
        
        if (dynamicList) {
            // Scroll to hub
            const hub = document.getElementById('hub');
            if (hub) hub.scrollIntoView({ behavior: 'smooth' });

            navHistory = []; 
            if (match.type === 'college') {
                loadSemestersView(match.data);
            } else if (match.type === 'subject') {
                loadCategoriesView(match.data); 
                if(breadcrumbsContainer) breadcrumbsContainer.innerHTML = `Search Result: ${match.name}`;
            }
        } else {
            // Fallback if we are on Home Page without the Hub elements
            console.warn("Internal view container 'dynamic-list' not found. Cannot render subject view.");
            if(match.type === 'college') {
                 // Use the existing Home Page function for colleges
                 openSemesterView(match.data.id);
            } else {
                 alert("This resource is part of a collection. Please select the college from the list below.");
            }
        }
    }
    // --- 6. Mobile "See All" Logic ---
    window.toggleCollegeView = function() {
        const grid = document.getElementById('college-grid');
        grid.classList.add('expanded');
        // The button hides itself via CSS when grid has 'expanded' class
    };

    // --- 7. Online College Search (Updated) ---
    const collegeInput = document.getElementById('college-search-input');
    const collegeResults = document.getElementById('college-search-results');
    let externalColleges = []; 

    fetch('https://raw.githubusercontent.com/VarthanV/Indian-Colleges-List/refs/heads/master/colleges.json')
        .then(res => res.json())
        .then(data => {
            externalColleges = data;
            console.log("Colleges loaded:", externalColleges.length);
        })
        .catch(err => console.error("Error loading colleges:", err));

    if (collegeInput) {
        collegeInput.addEventListener('input', (e) => {
            const val = e.target.value.toLowerCase().trim();
            collegeResults.innerHTML = '';

            if (val.length < 3) { 
                collegeResults.style.display = 'none';
                return;
            }

            // Expanded Filter Logic: Checks Name, University, State, District, and Type
            const matches = externalColleges.filter(item => {
                const searchStr = val;
                
                // Helper to safely check inclusion
                const check = (field) => field && field.toLowerCase().includes(searchStr);

                return check(item.college) || 
                       check(item.university) || 
                       check(item.state) || 
                       check(item.district) || 
                       check(item.college_type);
            }).slice(0, 10);

            if (matches.length > 0) {
                collegeResults.style.display = 'block';
                matches.forEach(match => {
                    const div = document.createElement('div');
                    div.className = 'college-result-item';
                    
                    div.innerHTML = `
                        <h4>${match.college}</h4>
                        <p>
                            <span class="college-result-tag">${match.college_type || 'College'}</span>
                            ${match.university ? `Affiliated to ${match.university}` : ''}
                        </p>
                        <p style="margin-top:2px; font-size:0.75rem; color:#9ca3af;">
                            📍 ${match.district}, ${match.state}
                        </p>
                    `;

                    div.onclick = () => {
                        collegeInput.value = match.college;
                        collegeResults.style.display = 'none';
                        alert(`Selected: ${match.college}`);
                    };

                    collegeResults.appendChild(div);
                });
            } else {
                collegeResults.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.college-search-container')) {
                collegeResults.style.display = 'none';
            }
        });
    }

    // --- Mobile Menu Toggle Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileNavMenu = document.getElementById('mobile-nav-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileNavMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mobileNavMenu.classList.toggle('active');
            // Prevent background scrolling when menu is open
            document.body.style.overflow = mobileNavMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileNavMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 8. Stats Carousel Logic (Swipe Enabled) ---
    const statsContainer = document.querySelector('.mobile-stats');
    const track = document.getElementById('stats-track');

    if (statsContainer && track) {
        // Clone first slide for infinite effect
        const firstSlide = track.children[0].cloneNode(true);
        track.appendChild(firstSlide);

        const slides = track.children; 
        // Target ONLY the dots inside the carousel container
        const dots = document.querySelectorAll('.carousel-dots .dot');
        const colors = ['purple', 'green', 'orange'];
        
        let currentIndex = 0;
        let slideInterval;
        let startX = 0;
        let currentTranslate = 0;
        let isDragging = false;

        // --- Core Movement Function ---
        function moveToSlide(index, animate = true) {
            currentIndex = index;
            track.style.transition = animate ? 'transform 0.5s ease-out' : 'none';
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update dots (handle clone index)
            const dotIndex = currentIndex >= slides.length - 1 ? 0 : currentIndex;
            dots.forEach(d => d.classList.remove('active', 'purple', 'green', 'orange'));
            if(dots[dotIndex]) dots[dotIndex].classList.add('active', colors[dotIndex]);
        }

        function nextSlide() {
            moveToSlide(currentIndex + 1);
            // Handle Infinite Loop
            if (currentIndex === slides.length - 1) {
                setTimeout(() => {
                    moveToSlide(0, false); // Snap back instantly
                }, 500);
            }
        }

        function startAutoPlay() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3000);
        }

        // Initialize
        moveToSlide(0);
        startAutoPlay();

        // --- Touch Swipe Logic ---
        track.addEventListener('touchstart', (e) => {
            clearInterval(slideInterval); // Pause
            startX = e.touches[0].clientX;
            isDragging = true;
            // Get current transform value to dragging feels natural
            track.style.transition = 'none'; 
        });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const currentX = e.touches[0].clientX;
            const diff = currentX - startX;
            // Calculate pixel movement based on percentage width
            const slideWidth = track.offsetWidth; 
            const movePercent = (diff / slideWidth) * 100;
            const target = -(currentIndex * 100) + movePercent;
            
            track.style.transform = `translateX(${target}%)`;
        });

        track.addEventListener('touchend', (e) => {
            isDragging = false;
            const endX = e.changedTouches[0].clientX;
            const diff = endX - startX;

            // Threshold to change slide (e.g., 50px)
            if (Math.abs(diff) > 50) {
                if (diff > 0 && currentIndex > 0) {
                    moveToSlide(currentIndex - 1); // Swipe Right (Prev)
                } else if (diff < 0 && currentIndex < slides.length - 1) {
                    nextSlide(); // Swipe Left (Next)
                } else {
                    moveToSlide(currentIndex); // Snap back if at edge
                }
            } else {
                moveToSlide(currentIndex); // Snap back if swipe too small
            }
            startAutoPlay(); // Resume
        });
    }

    function runSemesterLoader(onComplete) {
    const overlay = document.getElementById('semester-loader');
    // Ensure we are selecting the correct list items
    const steps = document.querySelectorAll('.step-item'); 
    
    // 1. Show Overlay
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);

    // 2. Reset Steps
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
    });

    // 3. Animation Sequence
    let currentStep = 0;
    const totalSteps = steps.length;
    const stepDuration = 600; // Increased slightly for better UX (3s total approx)

    function processStep() {
        if (currentStep < totalSteps) {
            const stepEl = steps[currentStep];
            
            // Mark Active
            stepEl.classList.add('active');

            // Wait, then Mark Complete
            setTimeout(() => {
                stepEl.classList.remove('active');
                stepEl.classList.add('completed');
                
                currentStep++;
                processStep(); 
            }, stepDuration);
        } else {
            // 4. Finished -> Redirect
            setTimeout(() => {
                onComplete();
                
                // Optional: Clean up after redirect (if user comes back)
                setTimeout(() => {
                    overlay.classList.remove('active');
                    overlay.style.display = 'none';
                }, 1000);
            }, 300);
        }
    }

    processStep();
}
    
    // --- UPDATED RENDER TEAM FUNCTION ---
    function renderCoreTeam(teamData) {
        const grid = document.getElementById('core-team-grid');
        if (!grid) return;

        grid.innerHTML = ''; 

        // Filter for core members
        const coreMembers = teamData.filter(member => member.isCore);

        // Render Cards
        coreMembers.forEach(member => {
            const card = document.createElement('div');
            card.className = 'core-card';
            
            // Socials Logic
            let socialsHtml = '';
            if (member.socials) {
                if (member.socials.portfolio && member.socials.portfolio !== '#') socialsHtml += `<a href="${member.socials.portfolio}" target="_blank" class="action-icon">🌐</a>`;
                if (member.socials.linkedin && member.socials.linkedin !== '#') socialsHtml += `<a href="${member.socials.linkedin}" target="_blank" class="action-icon">🔗</a>`;
            }

            card.innerHTML = `
                <div class="core-card-left">
                    <div class="core-avatar">
                        <img src="${member.avatarUrl}" alt="${member.name}" loading="lazy">
                    </div>
                </div>
                <div class="core-card-right">
                    <br>
                    <h3>${member.name}</h3>
                    <span class="role-badge">${member.role.toUpperCase()}</span>
                    <p class="core-meta">${member.branch} • ${member.college}</p>
                    
                    <div class="core-actions">${socialsHtml}</div>
                    <button class="btn-connect" onclick="window.open('${member.connectUrl}', '_blank')">Connect +</button>
                </div>
            `;
            grid.appendChild(card);
        });

        // Initialize the auto-scroll ONLY after cards are rendered
        // We use a slight delay to ensure the DOM is painted and widths are calculable
        setTimeout(() => {
            setupInfiniteScroll(grid, 0.6); // 0.6 is the speed
        }, 500);
    }

    // --- GENERIC INFINITE SCROLL HELPER ---
    // This handles both the Team Grid and Testimonials
    function setupInfiniteScroll(container, speed = 0.5) {
        // 1. Safety Checks: Only run on mobile (< 768px) and if container exists
        if (window.innerWidth > 768 || !container) return;

        // 2. Identify the moving track
        // For Team Grid: The container itself is the flex parent
        // For Testimonials: The first child (.marquee-track) is the flex parent
        let track = container;
        if (container.classList.contains('marquee-wrapper')) {
            track = container.firstElementChild;
        }

        // 3. Duplicate Content (Once)
        // Check if we've already cloned to prevent exponential growth if called twice
        if (container.dataset.cloned === "true") return;
        
        const children = Array.from(track.children);
        if (children.length === 0) return;

        children.forEach(child => {
            track.appendChild(child.cloneNode(true));
        });
        
        // Mark as cloned
        container.dataset.cloned = "true";

        // 4. Animation Loop
        let isPaused = false;
        
        function animate() {
            if (!isPaused) {
                // We scroll the overflow container
                container.scrollLeft += speed;

                // Reset logic: If we've scrolled past the halfway point (the original content width), snap back
                // This creates the illusion of infinity
                if (container.scrollLeft >= (container.scrollWidth / 2)) {
                    container.scrollLeft = 0; // Or better: container.scrollLeft - (container.scrollWidth / 2) for smoothness
                }
            }
            requestAnimationFrame(animate);
        }
        
        // Start Loop
        animate();

        // 5. Touch Interruption Logic
        // Pause when the user touches the screen
        container.addEventListener('touchstart', () => { 
            isPaused = true; 
        }, { passive: true });
        
        // Resume shortly after they lift their finger
        container.addEventListener('touchend', () => { 
            setTimeout(() => { isPaused = false; }, 1000); 
        });
    }

    // --- Unified Continuous Scroll Logic (Testimonials & Team) ---
    // Targets specific containers to apply infinite scroll on mobile
    
    // 1. Setup Testimonials
    const testimonialWrapper = document.querySelector('.marquee-wrapper');
    if (testimonialWrapper) setupInfiniteScroll(testimonialWrapper, 0.5);

    // 2. Setup Team Grid (Wait for content to render first)
    // We use the existing logic hook inside 'renderCoreTeam' to call this, 
    // OR we can observe the element. Since renderCoreTeam calls 'initMobileAutoScroll',
    // let's replace 'initMobileAutoScroll' with this generic one.

    function setupInfiniteScroll(container, speed = 0.5) {
        // Safety check: Only run on mobile
        if (window.innerWidth > 768 || !container) return;

        // 1. Duplicate Content for Infinite Effect
        // We need a wrapper inside to be the moving track if the container itself isn't the flex parent
        // For Testimonials: container is .marquee-wrapper, track is .marquee-track
        // For Team: container is #core-team-grid (which is the flex parent)
        
        let track = container.firstElementChild; 
        
        // Handle case where container IS the track (like Team Grid)
        if (!track || !track.classList.contains('marquee-track')) {
             track = container; // The container itself is the scrollable track
        }
        
        // Duplicate children to ensure we have enough to scroll
        const children = Array.from(track.children);
        if (children.length === 0) return;
        
        children.forEach(child => {
            track.appendChild(child.cloneNode(true));
        });

        // 2. Animation Variables
        let scrollPos = 0;
        let isPaused = false;
        let animationId;

        // 3. The Animation Loop
        function animate() {
            if (!isPaused) {
                // Determine if we are scrolling the Window (overflow) or a Transform
                // For "Touch to scroll" to work best, we manipulate 'scrollLeft' 
                // because that allows native browser swipe to takeover automatically.
                
                if (track === container) {
                    // Case: Container has overflow (Team Grid)
                    container.scrollLeft += speed;
                    // Reset if reached halfway (since we doubled content)
                    if (container.scrollLeft >= (container.scrollWidth / 2)) {
                        container.scrollLeft = 0;
                    }
                } else {
                    // Case: Wrapper has overflow (Testimonials)
                    container.scrollLeft += speed;
                    if (container.scrollLeft >= (container.scrollWidth / 2)) {
                        container.scrollLeft = 0;
                    }
                }
            }
            animationId = requestAnimationFrame(animate);
        }

        // 4. Start Animation
        animate();

        // 5. Touch Interaction (The "Stop on Touch" feature)
        container.addEventListener('touchstart', () => { isPaused = true; }, { passive: true });
        container.addEventListener('touchend', () => { 
            setTimeout(() => { isPaused = false; }, 1000); // Wait 1s before resuming
        });
    }

    // Update your renderCoreTeam function to call this:
    // ... inside renderCoreTeam ...
    // setTimeout(() => setupInfiniteScroll(document.getElementById('core-team-grid'), 0.8), 500);

}); // End of DOMContentLoaded