// ========================================
// FORGED SOLUTIONS - Main JavaScript
// Version: 2.0 - Project Builder
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Forged JS v2.0 loaded');

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav__toggle');
    const navLinks = document.querySelector('.nav__links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add 'scrolled' class to nav on scroll
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // PROJECT BUILDER WIZARD
    // ========================================

    const pathSelection = document.getElementById('path-selection');
    const quickInquiry = document.getElementById('quick-inquiry');
    const projectWizard = document.getElementById('project-wizard');

    // Only run wizard code if elements exist
    if (pathSelection && quickInquiry && projectWizard) {
        console.log('Project Builder elements found, initializing...');
        initProjectBuilder();
    } else {
        console.log('Project Builder elements not found:', { pathSelection: !!pathSelection, quickInquiry: !!quickInquiry, projectWizard: !!projectWizard });
    }

    function initProjectBuilder() {
        // Wizard state
        const wizardState = {
            currentStep: 1,
            totalSteps: 5,
            data: loadWizardData()
        };

        // Path selection
        const pathCards = document.querySelectorAll('.path-card');
        const backToPathButtons = document.querySelectorAll('.back-to-paths');

        pathCards.forEach(card => {
            card.addEventListener('click', () => {
                const path = card.dataset.path;
                console.log('Path card clicked:', path);
                pathSelection.style.display = 'none';

                if (path === 'quick') {
                    quickInquiry.style.display = 'block';
                } else if (path === 'wizard') {
                    projectWizard.style.display = 'block';
                    updateProgress();
                    updateSummary();
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        backToPathButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                quickInquiry.style.display = 'none';
                projectWizard.style.display = 'none';
                pathSelection.style.display = 'block';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });

        // Step 1: Selection cards
        const selectionCards = document.querySelectorAll('.selection-card');
        selectionCards.forEach(card => {
            card.addEventListener('click', () => {
                selectionCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                wizardState.data.projectType = card.dataset.value;
                saveWizardData(wizardState.data);

                // Enable next button
                const nextBtn = document.querySelector('[data-step="1"] .wizard-next');
                if (nextBtn) nextBtn.disabled = false;

                // Update fields visibility for step 2
                updateSystemFields();
            });
        });

        // Pill buttons (timeline)
        const pills = document.querySelectorAll('.pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const name = pill.dataset.name;
                // Deselect siblings with same name
                document.querySelectorAll(`.pill[data-name="${name}"]`).forEach(p => {
                    p.classList.remove('selected');
                });
                pill.classList.add('selected');
                wizardState.data[name] = pill.dataset.value;
                saveWizardData(wizardState.data);
                updateSummary();
            });
        });

        // Budget cards
        const budgetCards = document.querySelectorAll('.budget-card');
        budgetCards.forEach(card => {
            card.addEventListener('click', () => {
                budgetCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                wizardState.data.budget = card.dataset.value;
                saveWizardData(wizardState.data);
                updateSummary();
            });
        });

        // Navigation buttons
        document.querySelectorAll('.wizard-next').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.disabled) return;
                collectStepData(wizardState.currentStep);
                goToStep(wizardState.currentStep + 1);
            });
        });

        document.querySelectorAll('.wizard-back').forEach(btn => {
            btn.addEventListener('click', () => {
                goToStep(wizardState.currentStep - 1);
            });
        });

        document.querySelectorAll('.wizard-skip').forEach(btn => {
            btn.addEventListener('click', () => {
                // For "Not Sure" on step 1, skip step 2
                if (wizardState.currentStep === 1 && !wizardState.data.projectType) {
                    wizardState.data.projectType = 'notsure';
                    saveWizardData(wizardState.data);
                    goToStep(3); // Skip to step 3
                } else if (wizardState.currentStep === 1 && wizardState.data.projectType === 'notsure') {
                    goToStep(3); // Skip step 2
                } else {
                    goToStep(wizardState.currentStep + 1);
                }
            });
        });

        function goToStep(step) {
            // Handle "Not Sure" skipping step 2
            if (step === 2 && wizardState.data.projectType === 'notsure') {
                step = 3;
            }

            // Going back from step 3 with "Not Sure" should go to step 1
            if (step === 2 && wizardState.currentStep === 3 && wizardState.data.projectType === 'notsure') {
                step = 1;
            }

            if (step < 1 || step > wizardState.totalSteps) return;

            // Update step visibility
            document.querySelectorAll('.wizard-step').forEach(s => {
                s.classList.remove('active');
            });

            const targetStep = document.querySelector(`.wizard-step[data-step="${step}"]`);
            if (targetStep) {
                targetStep.classList.add('active');
            }

            wizardState.currentStep = step;
            updateProgress();
            updateSummary();

            // Scroll to top of wizard
            projectWizard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        function updateProgress() {
            // Update progress bar fill
            const progressFill = document.getElementById('progress-fill');
            const percentage = (wizardState.currentStep / wizardState.totalSteps) * 100;
            if (progressFill) {
                progressFill.style.width = `${percentage}%`;
            }

            // Update step indicators
            document.querySelectorAll('.wizard-progress__step').forEach(step => {
                const stepNum = parseInt(step.dataset.step);
                step.classList.remove('active', 'completed');

                if (stepNum < wizardState.currentStep) {
                    step.classList.add('completed');
                } else if (stepNum === wizardState.currentStep) {
                    step.classList.add('active');
                }
            });
        }

        function updateSystemFields() {
            const projectType = wizardState.data.projectType;

            // Hide all field sets
            document.querySelectorAll('.wizard-fields').forEach(f => f.style.display = 'none');

            // Show appropriate field set
            if (projectType === 'integration') {
                const fields = document.querySelector('.wizard-fields--integration');
                if (fields) fields.style.display = 'block';
            } else if (projectType === 'automation') {
                const fields = document.querySelector('.wizard-fields--automation');
                if (fields) fields.style.display = 'block';
            } else if (projectType === 'custom') {
                const fields = document.querySelector('.wizard-fields--custom');
                if (fields) fields.style.display = 'block';
            }
        }

        function collectStepData(step) {
            const stepEl = document.querySelector(`.wizard-step[data-step="${step}"]`);
            if (!stepEl) return;

            // Collect form inputs
            stepEl.querySelectorAll('input, select, textarea').forEach(input => {
                if (input.name) {
                    if (input.type === 'checkbox') {
                        if (!wizardState.data[input.name]) {
                            wizardState.data[input.name] = [];
                        }
                        if (input.checked) {
                            if (!wizardState.data[input.name].includes(input.value)) {
                                wizardState.data[input.name].push(input.value);
                            }
                        } else {
                            wizardState.data[input.name] = wizardState.data[input.name].filter(v => v !== input.value);
                        }
                    } else {
                        wizardState.data[input.name] = input.value;
                    }
                }
            });

            saveWizardData(wizardState.data);
        }

        function updateSummary() {
            const summaryContent = document.getElementById('summary-content');
            if (!summaryContent) return;

            const data = wizardState.data;
            let html = '';

            // Project type
            if (data.projectType) {
                const typeLabels = {
                    'integration': 'System Integration',
                    'automation': 'Workflow Automation',
                    'custom': 'Custom Application',
                    'notsure': 'Not Sure Yet'
                };
                html += createSummaryItem('Project Type', typeLabels[data.projectType] || data.projectType, 1);
            }

            // Systems (integration)
            if (data.projectType === 'integration' && (data.sourceSystem || data.targetSystem)) {
                let systemsText = '';
                if (data.sourceSystem) systemsText += formatSystemName(data.sourceSystem);
                if (data.sourceSystem && data.targetSystem) systemsText += ' → ';
                if (data.targetSystem) systemsText += formatSystemName(data.targetSystem);
                if (systemsText) html += createSummaryItem('Systems', systemsText, 2);
            }

            // Systems (automation)
            if (data.projectType === 'automation' && data.primarySystem) {
                html += createSummaryItem('Primary System', formatSystemName(data.primarySystem), 2);
            }

            // Systems (custom - checkboxes)
            if (data.projectType === 'custom' && data.systems && data.systems.length > 0) {
                const systemNames = data.systems.map(formatSystemName).join(', ');
                html += createSummaryItem('Connected Systems', systemNames, 2);
            }

            // Challenge
            if (data.currentSituation || data.desiredOutcome) {
                let challengeText = '';
                if (data.currentSituation) {
                    challengeText = data.currentSituation.substring(0, 100);
                    if (data.currentSituation.length > 100) challengeText += '...';
                }
                if (challengeText) html += createSummaryItem('Current Situation', challengeText, 3);
            }

            // Timeline
            if (data.timeline) {
                const timelineLabels = {
                    'asap': 'ASAP',
                    'soon': '1-2 months',
                    'planning': '3+ months',
                    'exploring': 'Just exploring'
                };
                html += createSummaryItem('Timeline', timelineLabels[data.timeline] || data.timeline, 4);
            }

            // Budget
            if (data.budget) {
                const budgetLabels = {
                    'under10k': 'Under $10K',
                    '10-25k': '$10K - $25K',
                    '25-50k': '$25K - $50K',
                    '50k+': '$50K+',
                    'discuss': 'Let\'s discuss'
                };
                html += createSummaryItem('Budget', budgetLabels[data.budget] || data.budget, 4);
            }

            if (html) {
                summaryContent.innerHTML = html;
            } else {
                summaryContent.innerHTML = '<p class="summary-empty">Complete the previous steps to build your project summary.</p>';
            }
        }

        function createSummaryItem(label, value, editStep) {
            return `
                <div class="summary-item">
                    <div class="summary-item__label">${label}</div>
                    <div class="summary-item__value">
                        ${value}
                        <span class="summary-item__edit" data-step="${editStep}">Edit</span>
                    </div>
                </div>
            `;
        }

        function formatSystemName(value) {
            const names = {
                'sap-ecc': 'SAP ECC',
                's4hana': 'S/4HANA',
                'salesforce': 'Salesforce',
                'servicenow': 'ServiceNow',
                'sharepoint': 'SharePoint',
                'docusign': 'DocuSign',
                'teams': 'Microsoft Teams',
                'custom': 'Custom / Other',
                'none': 'Standalone'
            };
            return names[value] || value;
        }

        // Edit links in summary
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('summary-item__edit')) {
                const step = parseInt(e.target.dataset.step);
                if (step) goToStep(step);
            }
        });

        // Initialize on load
        updateSystemFields();

        // Restore previously selected card
        if (wizardState.data.projectType) {
            const card = document.querySelector(`.selection-card[data-value="${wizardState.data.projectType}"]`);
            if (card) {
                card.classList.add('selected');
                const nextBtn = document.querySelector('[data-step="1"] .wizard-next');
                if (nextBtn) nextBtn.disabled = false;
            }
        }

        // Restore pills
        if (wizardState.data.timeline) {
            const pill = document.querySelector(`.pill[data-value="${wizardState.data.timeline}"]`);
            if (pill) pill.classList.add('selected');
        }

        // Restore budget
        if (wizardState.data.budget) {
            const card = document.querySelector(`.budget-card[data-value="${wizardState.data.budget}"]`);
            if (card) card.classList.add('selected');
        }

        // Restore form fields
        Object.keys(wizardState.data).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input && !['projectType', 'timeline', 'budget', 'systems'].includes(key)) {
                input.value = wizardState.data[key];
            }
        });

        // Restore checkboxes
        if (wizardState.data.systems) {
            wizardState.data.systems.forEach(value => {
                const checkbox = document.querySelector(`input[name="systems"][value="${value}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
    }

    // LocalStorage helpers
    function saveWizardData(data) {
        try {
            localStorage.setItem('forged_wizard_data', JSON.stringify(data));
        } catch (e) {
            console.warn('Could not save wizard data to localStorage');
        }
    }

    function loadWizardData() {
        try {
            const saved = localStorage.getItem('forged_wizard_data');
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            return {};
        }
    }

    // ========================================
    // FORM SUBMISSIONS
    // ========================================

    // Quick inquiry form
    const quickForm = document.getElementById('quick-form');
    if (quickForm) {
        quickForm.addEventListener('submit', handleFormSubmit);
    }

    // Wizard form
    const wizardForm = document.getElementById('wizard-form');
    if (wizardForm) {
        wizardForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Merge wizard data with form data
            const formData = new FormData(this);
            const wizardData = loadWizardData();

            const submitData = {
                ...wizardData,
                ...Object.fromEntries(formData),
                submittedAt: new Date().toISOString(),
                source: 'project-builder'
            };

            // Log and show confirmation
            console.log('Project Brief submitted:', submitData);

            // Clear saved wizard data
            localStorage.removeItem('forged_wizard_data');

            alert('Thanks for your detailed project brief! I\'ll review everything and get back to you within 24 hours.');

            // Reset and go back to path selection
            this.reset();
            document.querySelectorAll('.selection-card').forEach(c => c.classList.remove('selected'));
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('selected'));
            document.querySelectorAll('.budget-card').forEach(c => c.classList.remove('selected'));

            const projectWizard = document.getElementById('project-wizard');
            const pathSelection = document.getElementById('path-selection');
            if (projectWizard) projectWizard.style.display = 'none';
            if (pathSelection) pathSelection.style.display = 'block';

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function handleFormSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Basic validation
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ef4444';
            } else {
                field.style.borderColor = '';
            }
        });

        if (isValid) {
            data.submittedAt = new Date().toISOString();
            data.source = 'quick-inquiry';

            console.log('Form submitted:', data);
            alert('Thanks for reaching out! I\'ll get back to you within 24 hours.');
            form.reset();
        }
    }

});
