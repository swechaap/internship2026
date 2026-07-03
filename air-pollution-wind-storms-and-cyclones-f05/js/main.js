/**
 * Atmosphere Explorer - Main Orchestrator
 * Binds UI components, handles event hooks, clocks loops, and animates environment.
 */
 
class SimulationController {
    constructor() {
        this.particleCanvas = document.getElementById('sim-canvas');
        this.scienceCanvas = document.getElementById('science-canvas');
        
        this.windSpeed = 15;
        this.windAngleDeg = 90;
        this.temperature = 25;
        this.humidity = 40;
        this.factoryEmission = true;
        this.vehicleEmission = true;
        
        this.stormActive = false;
        this.cycloneActive = false;
        
        this.isPaused = false;
        this.timeScale = 1.0;
        this.lastTime = 0;
        
        this.particles = new window.ParticleSystem(this.particleCanvas);
        this.weather = new window.WeatherEngine(this.scienceCanvas);
        this.challenge = new window.ChallengeManager(this);
 
        this.cloudDrifts = [0, 0, 0];
        this.currentQuizPage = 1;
        this.page1Submitted = false;
 
        this.initUI();
        this.bindEvents();
        this.resetSimState();
        
        requestAnimationFrame((t) => this.tick(t));
    }
 
    get aqi() {
        return this.particles.aqi;
    }
 
    initUI() {
        document.getElementById('slider-wind-speed').value = this.windSpeed;
        document.getElementById('slider-wind-dir').value = this.windAngleDeg;
        document.getElementById('slider-temp').value = this.temperature;
        document.getElementById('slider-humidity').value = this.humidity;
        document.getElementById('toggle-factory').checked = this.factoryEmission;
        document.getElementById('toggle-vehicles').checked = this.vehicleEmission;
 
        this.updateParamDisplays();
        this.setupTutorialCarousel();
        this.initQuizUI();
    }
 
    initQuizUI() {
        this.currentQuizPage = 1;
        this.page1Submitted = false;
        this.showQuizPage(1);
        const submitBtn = document.getElementById('btn-submit-page');
        const nextBtn = document.getElementById('btn-next-page');
        if (submitBtn) { submitBtn.classList.remove('hidden'); submitBtn.innerText = 'Submit Answers'; }
        if (nextBtn) nextBtn.classList.add('hidden');
        const progress = document.getElementById('quiz-progress');
        if (progress) progress.innerText = 'Questions 1–5 of 10';
        const resultEl = document.getElementById('quiz-result');
        if (resultEl) resultEl.innerText = '';
    }
 
    showQuizPage(page) {
        const page1 = document.getElementById('quiz-page-1');
        const page2 = document.getElementById('quiz-page-2');
        const progress = document.getElementById('quiz-progress');
        const submitBtn = document.getElementById('btn-submit-page');
        const nextBtn = document.getElementById('btn-next-page');
 
        this.currentQuizPage = page;
        if (page1 && page2) {
            page1.classList.toggle('hidden', page !== 1);
            page2.classList.toggle('hidden', page !== 2);
        }
        if (progress) {
            progress.innerText = page === 1 ? 'Questions 1–5 of 10' : 'Questions 6–10 of 10';
        }
        if (submitBtn && nextBtn) {
            if (page === 1) {
                submitBtn.classList.remove('hidden');
                nextBtn.classList.add('hidden');
                submitBtn.innerText = 'Submit Answers';
            } else {
                submitBtn.classList.remove('hidden');
                nextBtn.classList.add('hidden');
                submitBtn.innerText = 'Submit Answers';
            }
        }
    }
 
    bindEvents() {
        const submitBtn = document.getElementById('btn-submit-page');
        const nextBtn = document.getElementById('btn-next-page');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.checkQuiz());
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!this.page1Submitted) {
                    const resultEl = document.getElementById('quiz-result');
                    if (resultEl) {
                        resultEl.innerText = 'Please submit page 1 answers before proceeding.';
                        resultEl.style.color = '#f1c40f';
                    }
                    return;
                }
                this.showQuizPage(2);
                this.currentQuizPage = 2;
                // ensure buttons are in correct state
                const sBtn = document.getElementById('btn-submit-page');
                if (sBtn) { sBtn.classList.remove('hidden'); sBtn.innerText = 'Submit Answers'; }
                nextBtn.classList.add('hidden');
                const resultEl = document.getElementById('quiz-result'); if (resultEl) resultEl.innerText = '';
            });
        }
 
        document.getElementById('slider-wind-speed').addEventListener('input', (e) => {
            this.windSpeed = parseFloat(e.target.value);
            this.updateParamDisplays();
        });
        // register move on change (when user releases slider)
        document.getElementById('slider-wind-speed').addEventListener('change', () => {
            if (this.challenge) this.challenge.registerMove();
        });
 
        document.getElementById('slider-wind-dir').addEventListener('input', (e) => {
            this.windAngleDeg = parseFloat(e.target.value);
            this.updateParamDisplays();
        });
        document.getElementById('slider-wind-dir').addEventListener('change', () => {
            if (this.challenge) this.challenge.registerMove();
        });
 
        document.getElementById('slider-temp').addEventListener('input', (e) => {
            this.temperature = parseFloat(e.target.value);
            this.updateParamDisplays();
        });
        document.getElementById('slider-temp').addEventListener('change', () => {
            if (this.challenge) this.challenge.registerMove();
        });
 
        document.getElementById('slider-humidity').addEventListener('input', (e) => {
            this.humidity = parseFloat(e.target.value);
            this.updateParamDisplays();
        });
        document.getElementById('slider-humidity').addEventListener('change', () => {
            if (this.challenge) this.challenge.registerMove();
        });
 
        document.getElementById('toggle-factory').addEventListener('change', (e) => {
            this.factoryEmission = e.target.checked;
            if (this.challenge) this.challenge.registerMove();
        });
 
        document.getElementById('toggle-vehicles').addEventListener('change', (e) => {
            this.vehicleEmission = e.target.checked;
            if (this.challenge) this.challenge.registerMove();
        });
 
        document.getElementById('btn-storm').addEventListener('click', () => this.toggleStorm());
        document.getElementById('btn-cyclone').addEventListener('click', () => this.toggleCyclone());

        // Count toggling storm/cyclone as moves when in challenge
        document.getElementById('btn-storm').addEventListener('click', () => {
            if (this.challenge) this.challenge.registerMove();
        });
        document.getElementById('btn-cyclone').addEventListener('click', () => {
            if (this.challenge) this.challenge.registerMove();
        });
 
        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-speed').addEventListener('click', () => this.toggleSpeed());
        document.getElementById('btn-reset').addEventListener('click', () => this.resetSimState());
 
        document.getElementById('tab-explore').addEventListener('click', () => this.switchMode('explore'));
        document.getElementById('tab-challenge').addEventListener('click', () => this.switchMode('challenge'));
        document.getElementById('tab-quiz').addEventListener('click', () => this.switchMode('quiz'));
 
        const viewport = document.getElementById('canvas-viewport');
        viewport.addEventListener('mousedown', (e) => {
            if (this.cycloneActive) {
                const rect = viewport.getBoundingClientRect();
                const scaleX = 800 / rect.width;
                const scaleY = 500 / rect.height;
                const clickX = (e.clientX - rect.left) * scaleX;
                const clickY = (e.clientY - rect.top) * scaleY;
                this.weather.setCycloneCenter(clickX, clickY);
                this.updateCycloneEyeMarker();
            }
        });
 
        window.addEventListener('resize', () => this.handleResize());
        this.handleResize();
    }
 
    updateParamDisplays() {
        document.getElementById('val-wind-speed').innerText = this.windSpeed + ' m/s';
        
        let dirLabel = '';
        if (this.windAngleDeg >= 337 || this.windAngleDeg < 23) dirLabel = 'North';
        else if (this.windAngleDeg >= 23 && this.windAngleDeg < 68) dirLabel = 'North-East';
        else if (this.windAngleDeg >= 68 && this.windAngleDeg < 113) dirLabel = 'East';
        else if (this.windAngleDeg >= 113 && this.windAngleDeg < 158) dirLabel = 'South-East';
        else if (this.windAngleDeg >= 158 && this.windAngleDeg < 203) dirLabel = 'South';
        else if (this.windAngleDeg >= 203 && this.windAngleDeg < 248) dirLabel = 'South-West';
        else if (this.windAngleDeg >= 248 && this.windAngleDeg < 293) dirLabel = 'West';
        else if (this.windAngleDeg >= 293 && this.windAngleDeg < 337) dirLabel = 'North-West';
        
        document.getElementById('val-wind-dir').innerText = `${this.windAngleDeg}° (${dirLabel})`;
        
        const compassPointer = document.getElementById('compass-pointer');
        if (compassPointer) {
            compassPointer.style.transform = `translate(-50%, -50%) rotate(${this.windAngleDeg}deg)`;
        }
 
        document.getElementById('val-temp').innerText = this.temperature + '°C';
        document.getElementById('val-humidity').innerText = this.humidity + '%';
 
        if (!this.stormActive && this.temperature >= 32 && this.humidity >= 80) {
            this.toggleStorm(true);
            this.showBanner("Hot humid air triggers storm development!");
        }
    }
 
    setupTutorialCarousel() {
        const modal = document.getElementById('modal-tutorial');
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-nav .dot');
        const nextBtn = document.getElementById('btn-next-slide');
        const finishBtn = document.getElementById('btn-finish-tut');
        const closeTopBtn = document.getElementById('btn-close-tut-top');
        let currentSlide = 0;
 
        const showSlide = (idx) => {
            slides.forEach(s => s.classList.remove('slide-active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[idx].classList.add('slide-active');
            dots[idx].classList.add('active');
            currentSlide = idx;
 
            if (idx === slides.length - 1) {
                nextBtn.style.display = 'none';
                finishBtn.style.display = 'inline-flex';
            } else {
                nextBtn.style.display = 'inline-flex';
                finishBtn.style.display = 'none';
            }
        };
 
        nextBtn.addEventListener('click', () => {
            if (currentSlide < slides.length - 1) showSlide(currentSlide + 1);
        });
 
        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                showSlide(parseInt(e.target.getAttribute('data-slide')));
            });
        });
 
        const closeTutorial = () => modal.classList.remove('modal-visible');
        finishBtn.addEventListener('click', closeTutorial);
        closeTopBtn.addEventListener('click', closeTutorial);
        
        document.getElementById('btn-tutorial-trigger').addEventListener('click', () => {
            showSlide(0);
            modal.classList.add('modal-visible');
        });
    }
 
 
    switchMode(mode) {
        document.getElementById('tab-explore').classList.remove('tab-active');
        document.getElementById('tab-challenge').classList.remove('tab-active');
        document.getElementById('tab-quiz').classList.remove('tab-active');
        document.getElementById('section-metrics').classList.remove('active');
        document.getElementById('section-challenges').classList.remove('active');
        document.getElementById('section-quiz').classList.remove('active');
 
        if (mode === 'explore') {
            document.getElementById('tab-explore').classList.add('tab-active');
            document.getElementById('section-metrics').classList.add('active');
            if (this.challenge.isPlaying) this.challenge.togglePlayState();
            this.resetSimState();
        } else if (mode === 'challenge') {
            document.getElementById('tab-challenge').classList.add('tab-active');
            document.getElementById('section-challenges').classList.add('active');
            this.challenge.selectMission(1);
        } else if (mode === 'quiz') {
            document.getElementById('tab-quiz').classList.add('tab-active');
            document.getElementById('section-quiz').classList.add('active');
            if (this.challenge.isPlaying) this.challenge.togglePlayState();
        }
    }
 
    toggleStorm(forceState = null) {
        this.stormActive = forceState !== null ? forceState : !this.stormActive;
        const btn = document.getElementById('btn-storm');
        
        if (this.stormActive) {
            this.speak("Storm system activated");
            btn.classList.add('active-weather');
            btn.innerText = '⚡ Storm On';
            this.humidity = Math.max(70, this.humidity);
            document.getElementById('slider-humidity').value = this.humidity;
            this.updateParamDisplays();
            document.getElementById('sky-rect').style.fill = 'linear-gradient(180deg, #1c2833, #111a28, #2c3e50)';
        } else {
            btn.classList.remove('active-weather');
            btn.innerText = '⚡ Storm Mode';
            document.getElementById('sky-rect').style.fill = 'url(#sky-day)';
        }
    }
 
    toggleCyclone(forceState = null) {
        this.cycloneActive = forceState !== null ? forceState : !this.cycloneActive;
        const btn = document.getElementById('btn-cyclone');
        
        if (this.cycloneActive) {
            this.speak("Cyclone vortex activated");
            btn.classList.add('active-weather');
            btn.innerText = '🌀 Cyclone On';
            this.weather.setCycloneCenter(400, 220);
            this.updateCycloneEyeMarker();
            document.getElementById('cyclone-eye-marker').style.display = 'flex';
            this.showBanner("Cyclone vortex active. Click screen to move the eye!");
        } else {
            btn.classList.remove('active-weather');
            btn.innerText = '🌀 Cyclone Mode';
            document.getElementById('cyclone-eye-marker').style.display = 'none';
        }
    }
 
    updateCycloneEyeMarker() {
        const marker = document.getElementById('cyclone-eye-marker');
        marker.style.left = this.weather.cycloneCenter.x + 'px';
        marker.style.top = this.weather.cycloneCenter.y + 'px';
    }
 
    togglePause() {
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('btn-pause');
        if (this.isPaused) {
            btn.innerText = '▶️ Play';
            btn.className = 'btn btn-control btn-success';
        } else {
            btn.innerText = '⏸️ Pause';
            btn.className = 'btn btn-control btn-pause';
        }
    }
 
    toggleSpeed() {
        const btn = document.getElementById('btn-speed');
        if (this.timeScale === 1.0) {
            this.timeScale = 0.35;
            btn.innerText = '⏳ Normal';
            document.getElementById('clock-display').innerText = 'Speed: 0.35x';
        } else {
            this.timeScale = 1.0;
            btn.innerText = '⏳ Slow Mo';
            document.getElementById('clock-display').innerText = 'Speed: 1.0x';
        }
    }
 
    resetSimState() {
        this.windSpeed = 15;
        this.windAngleDeg = 90;
        this.temperature = 25;
        this.humidity = 40;
        this.factoryEmission = true;
        this.vehicleEmission = true;
        this.isPaused = false;
        this.timeScale = 1.0;
 
        this.unlockAllUIControls();
        this.toggleStorm(false);
        this.toggleCyclone(false);
        this.particles.reset();
        
        const pauseBtn = document.getElementById('btn-pause');
        pauseBtn.innerText = '⏸️ Pause';
        pauseBtn.className = 'btn btn-control btn-pause';
 
        const speedBtn = document.getElementById('btn-speed');
        speedBtn.innerText = '⏳ Slow Mo';
        document.getElementById('clock-display').innerText = 'Speed: 1.0x';
 
        this.initUI();
        this.showBanner("Simulation parameters reset.");
    }
 
    checkQuiz() {
        const answers = { q1: '1', q2: '1', q3: '1', q4: '1', q5: '1', q6: '1', q7: '1', q8: '1', q9: '0', q10: '1' };
        const resultEl = document.getElementById('quiz-result');
        const submitBtn = document.getElementById('btn-submit-page');
        const nextBtn = document.getElementById('btn-next-page');

        const scoreAnswers = (names) => {
            let s = 0;
            for (const name of names) {
                const selected = document.querySelector(`input[name="${name}"]:checked`);
                if (selected && selected.value === answers[name]) s++;
            }
            return s;
        };

        if (this.currentQuizPage === 1) {
            const page1 = ['q1', 'q2', 'q3', 'q4', 'q5'];
            const unanswered = page1.some((name) => !document.querySelector(`input[name="${name}"]:checked`));
            if (unanswered) {
                resultEl.innerText = 'Please answer all first 5 questions before continuing.';
                resultEl.style.color = '#f1c40f';
                return;
            }

            const s = scoreAnswers(page1);
            resultEl.innerText = `🏁 Page 1 Score: ${s}/5`;
            resultEl.style.color = s >= 4 ? '#2ecc71' : s >= 3 ? '#f1c40f' : '#e74c3c';

            if (submitBtn) submitBtn.classList.add('hidden');
            if (nextBtn) { nextBtn.classList.remove('hidden'); nextBtn.focus(); }

            this.page1Submitted = true;

            // disable page1 inputs to lock answers
            page1.forEach((name) => {
                const nodes = document.querySelectorAll(`input[name="${name}"]`);
                nodes.forEach(n => n.disabled = true);
            });
            return;
        }

        if (this.currentQuizPage === 2) {
            const page2 = ['q6', 'q7', 'q8', 'q9', 'q10'];
            const unanswered = page2.some((name) => !document.querySelector(`input[name="${name}"]:checked`));
            if (unanswered) {
                resultEl.innerText = 'Please answer all last 5 questions before submitting.';
                resultEl.style.color = '#f1c40f';
                return;
            }

            const s = scoreAnswers(page2);
            resultEl.innerText = `🏁 Page 2 Score: ${s}/5`;
            resultEl.style.color = s >= 4 ? '#2ecc71' : s >= 3 ? '#f1c40f' : '#e74c3c';

            if (submitBtn) submitBtn.classList.add('hidden');

            // disable page2 inputs to lock answers
            page2.forEach((name) => {
                const nodes = document.querySelectorAll(`input[name="${name}"]`);
                nodes.forEach(n => n.disabled = true);
            });
            return;
        }
    }
 
    unlockAllUIControls() {
        document.getElementById('toggle-factory').disabled = false;
        document.getElementById('toggle-vehicles').disabled = false;
        document.getElementById('slider-wind-speed').disabled = false;
        document.getElementById('slider-wind-dir').disabled = false;
        document.getElementById('slider-temp').disabled = false;
        document.getElementById('slider-humidity').disabled = false;
        document.getElementById('btn-storm').disabled = false;
        document.getElementById('btn-cyclone').disabled = false;
    }
 
    lockFactory(lock, state) {
        const toggle = document.getElementById('toggle-factory');
        toggle.checked = state;
        this.factoryEmission = state;
        toggle.disabled = lock;
    }
 
    lockVehicles(lock, state) {
        const toggle = document.getElementById('toggle-vehicles');
        toggle.checked = state;
        this.vehicleEmission = state;
        toggle.disabled = lock;
    }
 
    lockWindSpeed(lock, val = null) {
        const slider = document.getElementById('slider-wind-speed');
        slider.disabled = lock;
        if (val !== null) {
            slider.value = val;
            this.windSpeed = val;
            this.updateParamDisplays();
        }
    }
 
    lockWindDir(lock, val = null) {
        const slider = document.getElementById('slider-wind-dir');
        slider.disabled = lock;
        if (val !== null) {
            slider.value = val;
            this.windAngleDeg = val;
            this.updateParamDisplays();
        }
    }
 
    setWind(speed, dir) {
        this.windSpeed = speed;
        this.windAngleDeg = dir;
        document.getElementById('slider-wind-speed').value = speed;
        document.getElementById('slider-wind-dir').value = dir;
        this.updateParamDisplays();
    }
 
    setHumidity(val) {
        this.humidity = val;
        document.getElementById('slider-humidity').value = val;
        this.updateParamDisplays();
    }
 
    setTemp(val) {
        this.temperature = val;
        document.getElementById('slider-temp').value = val;
        this.updateParamDisplays();
    }
 
    stopWeather() {
        this.toggleStorm(false);
        this.toggleCyclone(false);
    }
 
    startCyclone() {
        this.toggleCyclone(true);
    }
 
    showBanner(msg) {
        const banner = document.getElementById('sim-alert-banner');
        banner.innerText = msg;
        banner.classList.remove('alert-hidden');
        if (this.bannerTimeout) clearTimeout(this.bannerTimeout);
        this.bannerTimeout = setTimeout(() => {
            banner.classList.add('alert-hidden');
        }, 3000);
    }
 
    speak(text) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(text);
        speech.rate = 1;
        speech.pitch = 1;
        speech.volume = 1;
        window.speechSynthesis.speak(speech);
    }
 
    handleResize() {
        const rect = this.particleCanvas.getBoundingClientRect();
        this.particleCanvas.width = 800;
        this.particleCanvas.height = 500;
        this.scienceCanvas.width = 800;
        this.scienceCanvas.height = 500;
    }
 
    // =========================================================
    //  SAFETY MEASURES — updates the safety card in Lab mode
    // =========================================================
    updateSafetyMeasures(aqi) {
        const safetyCard = document.getElementById('safety-card');
        const safetyContent = document.getElementById('safety-content');
        if (!safetyCard || !safetyContent) return;
 
        // Build a state key so we only re-render when state changes
        const stateKey = `${this.stormActive}-${this.cycloneActive}-${aqi > 150}-${aqi > 300}`;
        if (stateKey === this._lastSafetyState) return;
        this._lastSafetyState = stateKey;
 
        let tips = [];
 
        if (this.cycloneActive) {
            tips = [
                { icon: '🏠', cls: 'tip-cyclone', text: 'Stay indoors and away from windows during a cyclone.' },
                { icon: '📻', cls: 'tip-cyclone', text: 'Listen to emergency radio broadcasts for updates.' },
                { icon: '🚗', cls: 'tip-cyclone', text: 'Do not drive through flooded roads or storm areas.' },
                { icon: '🌀', cls: 'tip-cyclone', text: 'The eye of the cyclone may feel calm — stay sheltered, winds will return.' },
                { icon: '🔋', cls: 'tip-cyclone', text: 'Keep emergency kits ready: water, torch, first aid, medications.' },
            ];
        } else if (this.stormActive) {
            tips = [
                { icon: '⚡', cls: 'tip-storm', text: 'Avoid tall trees and open fields during lightning storms.' },
                { icon: '🏠', cls: 'tip-storm', text: 'Stay indoors, close all windows and doors.' },
                { icon: '🔌', cls: 'tip-storm', text: 'Unplug electrical appliances to prevent surge damage.' },
                { icon: '🚶', cls: 'tip-storm', text: 'Avoid walking through puddles — water may be electrically charged.' },
                { icon: '😷', cls: 'tip-storm', text: 'Wear a mask outdoors post-storm as dust and debris rise into air.' },
            ];
        } else if (aqi > 300) {
            tips = [
                { icon: '😷', cls: 'tip-pollution', text: 'HAZARDOUS AQI! Wear N95 masks if going outside is unavoidable.' },
                { icon: '🏠', cls: 'tip-pollution', text: 'Stay indoors. Keep doors, windows, and vents sealed.' },
                { icon: '🚫', cls: 'tip-pollution', text: 'Cancel all outdoor physical activity immediately.' },
                { icon: '🏥', cls: 'tip-pollution', text: 'Children, elderly and people with respiratory conditions need extra care.' },
                { icon: '🌿', cls: 'tip-pollution', text: 'Use air purifiers indoors to filter fine particles.' },
            ];
        } else if (aqi > 150) {
            tips = [
                { icon: '😷', cls: 'tip-pollution', text: 'Unhealthy AQI! Sensitive groups should wear masks outdoors.' },
                { icon: '🚴', cls: 'tip-pollution', text: 'Avoid prolonged outdoor exercise — breathe less polluted indoor air.' },
                { icon: '🪟', cls: 'tip-pollution', text: 'Keep windows closed during high-pollution hours (morning & evening).' },
                { icon: '🌳', cls: 'tip-pollution', text: 'Plant trees and shrubs around your home to filter PM2.5 naturally.' },
            ];
        } else if (aqi > 50) {
            tips = [
                { icon: '🌱', cls: 'tip-green', text: 'Moderate AQI. Use public transport or cycle to reduce vehicle emissions.' },
                { icon: '♻️', cls: 'tip-green', text: 'Avoid burning waste — it directly spikes local AQI levels.' },
                { icon: '🌳', cls: 'tip-green', text: 'Plant more trees in your neighbourhood to absorb CO₂ and pollutants.' },
                { icon: '💡', cls: 'tip-green', text: 'Switch to LED lighting and energy-efficient appliances to cut emissions.' },
            ];
        } else {
            tips = [
                { icon: '✅', cls: 'tip-green', text: 'Air quality is Good! Great conditions for outdoor activities.' },
                { icon: '🚲', cls: 'tip-green', text: 'Walk or cycle today — fewer vehicles means cleaner air for everyone.' },
                { icon: '🏭', cls: 'tip-green', text: 'Industries should use scrubbers and filters to maintain clean air.' },
                { icon: '🌿', cls: 'tip-green', text: 'Support green energy — solar and wind power reduce air pollution.' },
            ];
        }
 
        safetyContent.innerHTML = tips.map(t =>
            `<div class="safety-tip-item ${t.cls}">
                <span class="safety-tip-icon">${t.icon}</span>
                <span>${t.text}</span>
            </div>`
        ).join('');
    }
 
    tick(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        let dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        if (dt > 0.1) dt = 0.1;
 
        if (!this.isPaused) {
            const windAngleRad = (this.windAngleDeg * Math.PI) / 180;
            const stepScale = this.timeScale;
 
            this.particles.update(
                this.windSpeed,
                windAngleRad,
                stepScale,
                this.factoryEmission,
                this.vehicleEmission,
                this.cycloneActive,
                this.weather.cycloneCenter
            );
 
            this.weather.update(
                this.windSpeed,
                windAngleRad,
                this.temperature,
                this.humidity,
                stepScale,
                this.stormActive,
                this.cycloneActive
            );
 
            if (this.stormActive) {
                const cleans = this.particles.checkRainCollisions(this.weather.rainDrops);
                if (cleans > 0 && Math.random() < 0.05) {
                    this.showBanner("Rain washout: Cleaned PM2.5 particles!");
                }
            }
 
            this.animateEnvironment(windAngleRad, stepScale);
            this.challenge.update(dt * stepScale);
        }
 
        const showVectors = document.getElementById('check-vectors').checked;
        const showPressure = document.getElementById('check-pressure').checked;
        const showAQIGrid = document.getElementById('check-aqi-grid').checked;
 
        this.weather.draw(showVectors, showPressure, showAQIGrid, this.windSpeed, (this.windAngleDeg * Math.PI) / 180);
        this.particles.draw(showAQIGrid);
 
        this.updateDashboardMetrics();
 
        const aqi = this.particles?.aqi || 0;
 
        if (aqi > 200 && !this.highAQIWarning) {
            this.highAQIWarning = true;
            this.showBanner("Warning. Air quality has reached unhealthy levels.");
        }
        if (aqi < 150) this.highAQIWarning = false;
 
        // Update safety measures in Lab mode only
        const metricsPanel = document.getElementById('section-metrics');
        if (metricsPanel && metricsPanel.classList.contains('active')) {
            this.updateSafetyMeasures(aqi);
        }
 
        requestAnimationFrame((t) => this.tick(t));
    }
 
    animateEnvironment(windAngleRad, stepScale) {
        const windHorizontalForce = Math.cos(windAngleRad) * this.windSpeed;
        const swayAngle = windHorizontalForce * 0.35;
        const windPulseOsc = Math.sin(Date.now() * 0.005) * (this.windSpeed * 0.06);
 
        const trees = document.querySelectorAll('.tree-node');
        trees.forEach((tree, idx) => {
            const flex = 1 - (idx * 0.08);
            const finalAngle = (swayAngle + windPulseOsc) * flex;
            tree.style.transform = `rotate(${finalAngle}deg)`;
        });
 
        const clouds = document.querySelectorAll('.cloud-move');
        const windVelocityX = Math.cos(windAngleRad) * this.windSpeed * 0.02;
        clouds.forEach((cloud, idx) => {
            this.cloudDrifts[idx] += windVelocityX * stepScale;
            if (this.cloudDrifts[idx] > 800) this.cloudDrifts[idx] = -200;
            else if (this.cloudDrifts[idx] < -200) this.cloudDrifts[idx] = 800;
            cloud.style.transform = `translateX(${this.cloudDrifts[idx]}px)`;
        });
    }
 
    updateDashboardMetrics() {
        const missionAQI = document.getElementById("mission-aqi-value");
        if (missionAQI) missionAQI.innerText = Math.round(this.particles.aqi);
 
        const aqi = this.particles.aqi;
        
        const rot = -90 + (aqi / 500) * 180;
        document.getElementById('gauge-needle').style.transform = `rotate(${rot}deg)`;
        
        const numLbl = document.getElementById('lbl-aqi-num');
        const textLbl = document.getElementById('lbl-aqi-text');
        numLbl.innerText = String(Math.round(aqi)).padStart(3, '0');
 
        let aqiColor = '';
        let aqiText = '';
        let systemStability = 'Stable';
 
        if (aqi <= 50) {
            aqiColor = 'var(--aqi-good)'; aqiText = 'GOOD';
        } else if (aqi <= 100) {
            aqiColor = 'var(--aqi-moderate)'; aqiText = 'MODERATE';
        } else if (aqi <= 150) {
            aqiColor = 'var(--aqi-sensitive)'; aqiText = 'UNHEALTHY FOR SENSITIVE GROUPS';
        } else if (aqi <= 200) {
            aqiColor = 'var(--aqi-unhealthy)'; aqiText = 'UNHEALTHY';
        } else if (aqi <= 300) {
            aqiColor = 'var(--aqi-very-unhealthy)'; aqiText = 'VERY UNHEALTHY'; systemStability = 'Polluted';
        } else {
            aqiColor = 'var(--aqi-hazardous)'; aqiText = 'HAZARDOUS'; systemStability = 'Severe Hazard';
        }
 
        numLbl.style.color = aqiColor;
        textLbl.style.color = aqiColor;
        textLbl.innerText = aqiText;
 
        document.getElementById('stat-particles').innerText = this.particles.particles.length + ' active';
        const kmh = (this.windSpeed * 3.6).toFixed(1);
        document.getElementById('stat-speed').innerText = `${kmh} km/h`;
 
        const basePressure = 1013;
        const pressure = this.cycloneActive ? basePressure - 42 : basePressure + Math.round(this.windSpeed * 0.15);
        document.getElementById('stat-pressure').innerText = `${pressure} hPa`;
        document.getElementById('stat-stability').innerText = this.cycloneActive ? 'Cyclonic Flow' : this.stormActive ? 'Turbulent' : systemStability;
 
        const tipEl = document.getElementById('tip-content');
        if (tipEl) {
            if (this.cycloneActive) {
                tipEl.innerText = "Low-pressure cells spiral wind counter-clockwise (Northern Hemisphere), dragging particulates into the eye and creating concentration zones.";
            } else if (this.stormActive) {
                tipEl.innerText = "Rain collides with airborne particulates, cleaning the atmosphere by sweeping soot to the ground — a process called Wet Deposition.";
            } else if (this.windSpeed > 35) {
                tipEl.innerText = "High-velocity wind sweeps contaminants rapidly away and dilutes local pollution hotspots from industrial discharge.";
            } else if (this.windSpeed === 0) {
                tipEl.innerText = "Calm air locks pollutants in place. Without convective wind, industrial soot accumulates rapidly, spiking localized AQI levels.";
            } else {
                tipEl.innerText = "Varying temperature changes air pressure gradients. Air naturally flows from High Pressure (colder/denser) to Low Pressure (warmer/thinner) to produce wind.";
            }
        }
    }
}
 
window.addEventListener('DOMContentLoaded', () => {
    window.App = new SimulationController();
});