/* ==========================================
   ELECTRIC SHOCK EXPLORER - LOGIC ENGINE
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------------------
    // STATE VARIABLES
    // -----------------------------------------------------------------
    let state = {
        earthing: true,          // true = ON, false = OFF
        handCondition: 'dry',    // 'dry' | 'wet'
        soilCondition: 'dry',    // 'dry' | 'wet'
        leakage: 60,             // 0 to 100%
        timeMode: 'play',        // 'play' | 'pause' | 'slow'
        activeChallenge: 1,      // 1 | 2 | 3
        challengesCompleted: {
            1: false,
            2: false,
            3: false
        },
        starsEarned: 1           // Starts at 1/9 (matching reference image)
    };

    // -----------------------------------------------------------------
    // DOM ELEMENTS
    // -----------------------------------------------------------------
    // Controls
    const btnEarthingOn = document.getElementById("btn-earthing-on");
    const btnEarthingOff = document.getElementById("btn-earthing-off");
    const btnHandDry = document.getElementById("btn-hand-dry");
    const btnHandWet = document.getElementById("btn-hand-wet");
    const btnSoilDry = document.getElementById("btn-soil-dry");
    const btnSoilWet = document.getElementById("btn-soil-wet");
    const leakageSlider = document.getElementById("leakage-slider");
    const leakageValue = document.getElementById("leakage-value");

    // Header Time Controls
    const btnHeaderPause = document.getElementById("btn-header-pause");
    const btnHeaderSlow = document.getElementById("btn-header-slow");
    const btnHeaderReset = document.getElementById("btn-header-reset");

    // Left Time Controls
    const btnTimePlay = document.getElementById("time-play");
    const btnTimePause = document.getElementById("time-pause");
    const btnTimeSlow = document.getElementById("time-slow");

    // Simulation Elements
    const simulationSvg = document.getElementById("simulation-svg");
    const farmer = document.getElementById("farmer");
    const faceNormal = document.getElementById("face-normal");
    const faceShocked = document.getElementById("face-shocked");
    const sparksGroup = document.getElementById("sparks-group");
    const waterStreamInner = document.getElementById("water-stream-inner");

    const dangerCurrentGroup = document.getElementById("danger-current-group");
    const dangerPathGlow = document.getElementById("danger-path-glow");
    const dangerPathCore = document.getElementById("danger-path-core");

    const safeCurrentGroup = document.getElementById("safe-current-group");
    const safePathGlow = document.getElementById("safe-path-glow");
    const safePathCore = document.getElementById("safe-path-core");

    // Particle System Elements
    const safeParticlesContainer = document.getElementById("safe-particles-container");
    const dangerParticlesContainer = document.getElementById("danger-particles-container");

    // Analytics / Gauges
    const riskNeedle = document.getElementById("risk-needle");
    const riskBadge = document.getElementById("risk-badge");
    const resistanceNeedle = document.getElementById("resistance-needle");
    const resistanceBadge = document.getElementById("resistance-badge");
    const safetyStatusIcon = document.getElementById("safety-status-icon");
    const safetyStatusText = document.getElementById("safety-status-text");

    // Challenges
    const cardChallenge1 = document.getElementById("card-challenge-1");
    const cardChallenge2 = document.getElementById("card-challenge-2");
    const cardChallenge3 = document.getElementById("card-challenge-3");
    const starsChallenge1 = document.getElementById("stars-challenge-1");
    const starsChallenge2 = document.getElementById("stars-challenge-2");
    const starsChallenge3 = document.getElementById("stars-challenge-3");
    const progressText = document.getElementById("progress-text");

    // -----------------------------------------------------------------
    // ELECTRICAL CONSTANTS & CALCULATION ENGINE
    // -----------------------------------------------------------------
    const R_HUMAN_DRY = 100000;  // 100 kOhm
    const R_HUMAN_WET = 1000;    // 1 kOhm
    const R_SOIL_DRY = 500;      // 500 Ohm
    const R_SOIL_WET = 50;       // 50 Ohm
    const R_EARTH = 25;          // 25 Ohm (ground rod resistance)
    const V_SOURCE = 230;        // 230V AC Mains

    function calculateSystemState() {
        // 1. Determine resistances based on settings
        const rHuman = (state.handCondition === 'dry') ? R_HUMAN_DRY : R_HUMAN_WET;
        const rSoil = (state.soilCondition === 'dry') ? R_SOIL_DRY : R_SOIL_WET;

        // Loop resistance through the human to the earth
        const rHumanPath = rHuman + rSoil;

        // Fault resistance based on Leakage Slider (0% to 100%)
        // High leakage % = low insulation resistance (high fault)
        let rFault = Infinity;
        if (state.leakage > 0) {
            // Logarithmic interpolation: 100% leakage = 100 Ohm, 1% leakage = 100,000 Ohm
            rFault = Math.pow(10, 5 - (3 * (state.leakage / 100)));
        }

        // Parallel load connected to the casing
        let rLoad = rHumanPath;
        if (state.earthing) {
            rLoad = (rHumanPath * R_EARTH) / (rHumanPath + R_EARTH);
        }

        // Casing voltage calculation
        let vCasing = 0;
        if (state.leakage > 0) {
            vCasing = V_SOURCE * (rLoad / (rFault + rLoad));
        }

        // Currents
        const iHuman = vCasing / rHumanPath; // Amperes
        const iHuman_mA = iHuman * 1000;

        let iEarth_mA = 0;
        if (state.earthing) {
            iEarth_mA = (vCasing / R_EARTH) * 1000;
        }

        // Calculate Shock Risk percentage (0% to 100%)
        // Let's calibrate the risk scaling:
        // - Under 1 mA: barely felt, safe (0 to 5%)
        // - 1 to 10 mA: painful shock, muscle control kept (5% to 35%)
        // - 10 to 50 mA: muscular contraction, hard to let go (35% to 85%)
        // - >50 mA: severe hazard, ventricular fibrillation (85% to 100%)
        let shockRisk = 0;
        if (iHuman_mA < 0.05) {
            shockRisk = 0;
        } else if (iHuman_mA < 1) {
            shockRisk = iHuman_mA * 5;
        } else if (iHuman_mA < 10) {
            shockRisk = 5 + (iHuman_mA - 1) * 3.33;
        } else if (iHuman_mA < 50) {
            shockRisk = 35 + (iHuman_mA - 10) * 1.25;
        } else {
            shockRisk = 85 + (iHuman_mA - 50) * 0.3;
        }
        shockRisk = Math.min(100, Math.max(0, shockRisk));

        return {
            rHumanPath,
            vCasing,
            iHuman_mA,
            iEarth_mA,
            shockRisk
        };
    }

    // -----------------------------------------------------------------
    // RENDERING & UI UPDATE LOOP
    // -----------------------------------------------------------------
    function updateUI() {
        // Calculate physics values
        const metrics = calculateSystemState();

        // 1. Update Labels & Leakage Display
        leakageValue.textContent = `${state.leakage} %`;
        if (state.leakage > 60) {
            leakageValue.className = "highlight-val red-text";
        } else if (state.leakage > 20) {
            leakageValue.className = "highlight-val text-gold"; // custom gold styling
            leakageValue.style.color = "#F59E0B";
        } else {
            leakageValue.className = "highlight-val green-text";
            leakageValue.style.color = "";
        }

        // 2. Update Gauges
        // A. Shock Risk Needle and Badge
        // Needle rotation angle (0 degrees = left, 180 degrees = right)
        const riskAngle = metrics.shockRisk * 1.8;
        riskNeedle.setAttribute("transform", `translate(100, 100) rotate(${riskAngle})`);

        if (metrics.shockRisk > 60) {
            riskBadge.textContent = "DANGER";
            riskBadge.className = "danger-badge";
        } else if (metrics.shockRisk > 20) {
            riskBadge.textContent = "WARNING";
            riskBadge.className = "warn-badge";
        } else {
            riskBadge.textContent = "SAFE";
            riskBadge.className = "safe-badge";
        }

        // B. Resistance Needle and Badge
        // Logarithmic scale for human path resistance: High (100.5k Ohm) to Low (1.05k Ohm)
        const rMin = 1000;
        const rMax = 100000;
        const p = Math.max(0, Math.min(1, (Math.log10(metrics.rHumanPath) - Math.log10(rMin)) / (Math.log10(rMax) - Math.log10(rMin))));

        // 0 degrees = high resistance (safe), 180 degrees = low resistance (danger)
        const resistanceAngle = (1 - p) * 180;
        resistanceNeedle.setAttribute("transform", `translate(100, 100) rotate(${resistanceAngle})`);

        if (metrics.rHumanPath > 50000) {
            resistanceBadge.textContent = "HIGH RESISTANCE";
            resistanceBadge.className = "safe-badge";
        } else if (metrics.rHumanPath > 5000) {
            resistanceBadge.textContent = "MEDIUM RESISTANCE";
            resistanceBadge.className = "warn-badge";
        } else {
            resistanceBadge.textContent = "LOW RESISTANCE";
            resistanceBadge.className = "danger-badge";
        }

        // C. Safety Status Card
        if (metrics.shockRisk > 20) {
            // Set Warning Icon
            safetyStatusIcon.innerHTML = `
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
            `;
            safetyStatusIcon.className = "status-icon-box danger-icon-glow";
            safetyStatusText.textContent = "SHOCK RISK";
            safetyStatusText.className = "status-alert-text danger";
        } else {
            // Set Safe Shield Icon
            safetyStatusIcon.innerHTML = `
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
            `;
            safetyStatusIcon.className = "status-icon-box safe-icon-glow";
            safetyStatusText.textContent = "SYSTEM SAFE";
            safetyStatusText.className = "status-alert-text safe";
        }

        // 3. Update SVG Simulation Graphics & Animations
        // A. Water stream flow play-state / speed
        if (state.timeMode === 'pause') {
            waterStreamInner.style.animationPlayState = 'paused';
            if (simulationSvg.pauseAnimations) simulationSvg.pauseAnimations();
        } else {
            waterStreamInner.style.animationPlayState = 'running';
            if (simulationSvg.unpauseAnimations) simulationSvg.unpauseAnimations();

            const waterSpeed = (state.timeMode === 'slow') ? '7.5s' : '1.5s';
            waterStreamInner.style.animationDuration = waterSpeed;
        }

        // B. Currents Path Visibility & Particle Intensity
        // Live current path flowing through farmer
        if (state.leakage > 0 && metrics.iHuman_mA > 0.05) {
            dangerCurrentGroup.style.display = "block";

            // Sync current flow animation rate

            // Set opacity of current paths (fully opaque for solid visibility)
            const dangerOpacity = Math.max(0.95, Math.min(1.0, 0.8 + (metrics.iHuman_mA / 20)));
            dangerCurrentGroup.setAttribute("opacity", dangerOpacity.toString());

            // Make outer path glow and inner core expand dynamically
            const glowWidth = Math.max(8, Math.min(16, 6 + (metrics.iHuman_mA / 10)));
            dangerPathGlow.setAttribute("stroke-width", glowWidth.toString());
            const coreWidth = Math.max(2.5, Math.min(4.5, 1.5 + (metrics.iHuman_mA / 25)));
            dangerPathCore.setAttribute("stroke-width", coreWidth.toString());
        } else {
            dangerCurrentGroup.style.display = "none";
        }

        // Earthing current path
        if (state.earthing && state.leakage > 0 && metrics.iEarth_mA > 0.05) {
            safeCurrentGroup.style.display = "block";

            // Sync grounding current flow animation rate

            // Set opacity of grounding current paths (highly solid)
            const safeOpacity = Math.max(0.95, Math.min(1.0, 0.8 + (metrics.iEarth_mA / 40)));
            safeCurrentGroup.setAttribute("opacity", safeOpacity.toString());

            // Make safe path glow and inner core expand dynamically
            const safeGlowWidth = Math.max(8, Math.min(16, 6 + (metrics.iEarth_mA / 15)));
            safePathGlow.setAttribute("stroke-width", safeGlowWidth.toString());
            const safeCoreWidth = Math.max(2.5, Math.min(4.5, 1.5 + (metrics.iEarth_mA / 30)));
            safePathCore.setAttribute("stroke-width", safeCoreWidth.toString());
        } else {
            safeCurrentGroup.style.display = "none";
        }

        // C. Farmer Shock State (Sparks, Face expression, Jitter animation)
        // Muscular contraction threshold is ~10 mA. Shock reaction triggers here.
        if (metrics.iHuman_mA >= 10) {
            faceNormal.style.display = "none";
            faceShocked.style.display = "block";
            sparksGroup.style.display = "block";
            sparksGroup.classList.add("sparkle");
            farmer.classList.add("shock-jitter");
        } else {
            faceNormal.style.display = "block";
            faceShocked.style.display = "none";
            sparksGroup.style.display = "none";
            sparksGroup.classList.remove("sparkle");
            farmer.classList.remove("shock-jitter");
        }

        // 4. Evaluate Challenge Progress
        checkChallenges(metrics);
    }

    // -----------------------------------------------------------------
    // CHALLENGE VERIFICATION & PROGRESS
    // -----------------------------------------------------------------
    function checkChallenges(metrics) {
        let stateChanged = false;

        // Challenge 1 Check:
        // Target starting condition: Earthing OFF, Wet Hands, Wet Soil, High Leakage (at least 60%)
        // The user completes Challenge 1 by applying these settings to trigger the severe shock,
        // and then successfully making it safe (risk below 20%) to rescue the farmer!
        if (!state.challengesCompleted[1]) {
            // First mark that the user has initialized the hazardous state
            if (!state.earthing && state.handCondition === 'wet' && state.leakage >= 60) {
                // Once they resolve it: Earthing turned ON or Leakage reduced, lowering risk below 20%
                state.challenge1HazardTriggered = true;
            }
            if (state.challenge1HazardTriggered && metrics.shockRisk < 20) {
                state.challengesCompleted[1] = true;
                stateChanged = true;
                completeChallengeUI(1, starsChallenge1, 1); // 1 star reward
            }
        }

        // Challenge 2 Check:
        // Target: Reduce shock risk below 20% while starting from active Challenge 2 state.
        if (state.activeChallenge === 2 && !state.challengesCompleted[2]) {
            if (metrics.shockRisk < 20) {
                state.challengesCompleted[2] = true;
                stateChanged = true;
                completeChallengeUI(2, starsChallenge2, 2); // 2 star reward
            }
        }

        // Challenge 3 Check:
        // Target: Find the absolute safest settings (Earthing ON, Dry Hands, Dry Soil, Leakage < 10%).
        if (!state.challengesCompleted[3]) {
            if (state.earthing &&
                state.handCondition === 'dry' &&
                state.soilCondition === 'dry' &&
                state.leakage < 10) {
                state.challengesCompleted[3] = true;
                stateChanged = true;
                completeChallengeUI(3, starsChallenge3, 3); // 3 star reward
            }
        }

        if (stateChanged) {
            recalculateStarsProgress();
        }
    }

    function completeChallengeUI(num, container, starsCount) {
        // Mark card visually completed
        const card = document.getElementById(`card-challenge-${num}`);
        card.classList.add("completed");

        // Fill the stars
        let starsHTML = "";
        for (let i = 0; i < starsCount; i++) {
            starsHTML += `<span class="star-icon star-filled">★</span>`;
        }
        container.innerHTML = starsHTML;
    }

    function recalculateStarsProgress() {
        // Base stars is 1.
        // Challenge 1 complete: +2 stars (total 3)
        // Challenge 2 complete: +3 stars (total 6)
        // Challenge 3 complete: +3 stars (total 9)
        let totalStars = 1;
        if (state.challengesCompleted[1]) totalStars += 2;
        if (state.challengesCompleted[2]) totalStars += 3;
        if (state.challengesCompleted[3]) totalStars += 3;

        state.starsEarned = totalStars;
        progressText.textContent = `${state.starsEarned} / 9`;
    }

    // -----------------------------------------------------------------
    // CONTROL EVENT HANDLERS
    // -----------------------------------------------------------------
    // Earthing buttons
    btnEarthingOn.addEventListener("click", () => {
        state.earthing = true;
        btnEarthingOn.classList.add("active");
        btnEarthingOff.classList.remove("active");
        updateUI();
    });

    btnEarthingOff.addEventListener("click", () => {
        state.earthing = false;
        btnEarthingOff.classList.add("active");
        btnEarthingOn.classList.remove("active");
        updateUI();
    });

    // Hand condition buttons
    btnHandDry.addEventListener("click", () => {
        state.handCondition = 'dry';
        btnHandDry.classList.add("active");
        btnHandWet.classList.remove("active");
        updateUI();
    });

    btnHandWet.addEventListener("click", () => {
        state.handCondition = 'wet';
        btnHandWet.classList.add("active");
        btnHandDry.classList.remove("active");
        updateUI();
    });

    // Soil condition buttons
    btnSoilDry.addEventListener("click", () => {
        state.soilCondition = 'dry';
        btnSoilDry.classList.add("active");
        btnSoilWet.classList.remove("active");
        updateUI();
    });

    btnSoilWet.addEventListener("click", () => {
        state.soilCondition = 'wet';
        btnSoilWet.classList.add("active");
        btnSoilDry.classList.remove("active");
        updateUI();
    });

    // Leakage current slider
    leakageSlider.addEventListener("input", (e) => {
        state.leakage = parseInt(e.target.value);
        updateUI();
    });

    // Time controls - sync state across buttons
    function setTimeMode(mode) {
        state.timeMode = mode;

        // Header pause sync
        if (mode === 'pause') {
            btnHeaderPause.classList.add("active");
            btnHeaderSlow.classList.remove("active");
        } else if (mode === 'slow') {
            btnHeaderSlow.classList.add("active");
            btnHeaderPause.classList.remove("active");
        } else {
            btnHeaderPause.classList.remove("active");
            btnHeaderSlow.classList.remove("active");
        }

        // Left controls grid sync
        const timeButtons = [btnTimePlay, btnTimePause, btnTimeSlow];
        timeButtons.forEach(btn => btn.classList.remove("active"));

        if (mode === 'play') btnTimePlay.classList.add("active");
        if (mode === 'pause') btnTimePause.classList.add("active");
        if (mode === 'slow') btnTimeSlow.classList.add("active");

        updateUI();
    }

    btnHeaderPause.addEventListener("click", () => {
        if (state.timeMode === 'pause') setTimeMode('play');
        else setTimeMode('pause');
    });

    btnHeaderSlow.addEventListener("click", () => {
        if (state.timeMode === 'slow') setTimeMode('play');
        else setTimeMode('slow');
    });

    btnTimePlay.addEventListener("click", () => setTimeMode('play'));
    btnTimePause.addEventListener("click", () => setTimeMode('pause'));
    btnTimeSlow.addEventListener("click", () => setTimeMode('slow'));

    // Reset button
    function resetSimulation() {
        state.earthing = true;
        state.handCondition = 'dry';
        state.soilCondition = 'dry';
        state.leakage = 60;
        state.timeMode = 'play';

        // Reset controls visuals
        btnEarthingOn.classList.add("active");
        btnEarthingOff.classList.remove("active");

        btnHandDry.classList.add("active");
        btnHandWet.classList.remove("active");

        btnSoilDry.classList.add("active");
        btnSoilWet.classList.remove("active");

        leakageSlider.value = 60;

        setTimeMode('play');
        updateUI();
    }

    btnHeaderReset.addEventListener("click", resetSimulation);

    // -----------------------------------------------------------------
    // CHALLENGE SELECTION / INITS
    // -----------------------------------------------------------------
    cardChallenge1.addEventListener("click", () => {
        setActiveChallenge(1);
        // Force the starting condition for Challenge 1
        state.earthing = false;
        state.handCondition = 'wet';
        state.soilCondition = 'wet';
        state.leakage = 80;
        state.challenge1HazardTriggered = false; // reset solver check

        // Update control button visuals
        btnEarthingOff.classList.add("active");
        btnEarthingOn.classList.remove("active");
        btnHandWet.classList.add("active");
        btnHandDry.classList.remove("active");
        btnSoilWet.classList.add("active");
        btnSoilDry.classList.remove("active");
        leakageSlider.value = 80;

        updateUI();
    });

    cardChallenge2.addEventListener("click", () => {
        setActiveChallenge(2);
        // Set Challenge 2 start condition (an unsafe state that needs to be brought below 20%)
        // Example: Earthing OFF, Dry Hands, Wet Soil, High Leakage. (Risk ~ 30-40%)
        state.earthing = false;
        state.handCondition = 'dry';
        state.soilCondition = 'wet';
        state.leakage = 90;

        btnEarthingOff.classList.add("active");
        btnEarthingOn.classList.remove("active");
        btnHandDry.classList.add("active");
        btnHandWet.classList.remove("active");
        btnSoilWet.classList.add("active");
        btnSoilDry.classList.remove("active");
        leakageSlider.value = 90;

        updateUI();
    });

    cardChallenge3.addEventListener("click", () => {
        setActiveChallenge(3);
        // Challenge 3: Find safest settings
        // Start from a mixed unsafe state so they have to toggle multiple items
        state.earthing = false;
        state.handCondition = 'wet';
        state.soilCondition = 'wet';
        state.leakage = 70;

        btnEarthingOff.classList.add("active");
        btnEarthingOn.classList.remove("active");
        btnHandWet.classList.add("active");
        btnHandDry.classList.remove("active");
        btnSoilWet.classList.add("active");
        btnSoilDry.classList.remove("active");
        leakageSlider.value = 70;

        updateUI();
    });

    function setActiveChallenge(num) {
        state.activeChallenge = num;

        cardChallenge1.classList.remove("active");
        cardChallenge2.classList.remove("active");
        cardChallenge3.classList.remove("active");

        const activeCard = document.getElementById(`card-challenge-${num}`);
        activeCard.classList.add("active");
    }

    // -----------------------------------------------------------------
    // PARTICLE SYSTEM INITIALIZATION & LOOP
    // -----------------------------------------------------------------
    let safePathLength = 0;
    let dangerPathLength = 0;

    let safeParticles = [];
    let dangerParticles = [];
    const PARTICLE_COUNT = 12;

    function initPathLengths() {
        if (safePathCore) safePathLength = safePathCore.getTotalLength();
        if (dangerPathCore) dangerPathLength = dangerPathCore.getTotalLength();
    }

    function createParticles(container, count, color, particlesArray, pathElement, pathLength) {
        if (!container) return;
        container.innerHTML = "";
        particlesArray.length = 0;

        const spacing = pathLength / count;
        let startPt = { x: 0, y: 0 };
        try {
            if (pathElement && typeof pathElement.getPointAtLength === 'function') {
                startPt = pathElement.getPointAtLength(0);
            }
        } catch (e) {
            // Ignore any initialization issues
        }

        for (let i = 0; i < count; i++) {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute("class", "particle-group");

            // Set initial position to the start of the path instead of (0,0) to prevent sky dots
            g.setAttribute("transform", `translate(${startPt.x}, ${startPt.y})`);

            const glow = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            glow.setAttribute("r", "5.5");
            glow.setAttribute("fill", color);
            glow.setAttribute("opacity", "0.6");
            g.appendChild(glow);

            const core = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            core.setAttribute("r", "3");
            core.setAttribute("fill", "#FFFFFF");
            g.appendChild(core);

            container.appendChild(g);

            particlesArray.push({
                element: g,
                offset: i * spacing
            });
        }
    }

    function updateParticlePositions(particlesArray, pathElement, pathLength, speed) {
        particlesArray.forEach(p => {
            p.offset += speed;
            if (p.offset > pathLength) {
                p.offset = p.offset - pathLength;
            } else if (p.offset < 0) {
                p.offset = pathLength + p.offset;
            }

            // Ensure offset is strictly within safe bounds for getPointAtLength
            const safeOffset = Math.max(0, Math.min(pathLength - 0.1, p.offset));

            try {
                const pt = pathElement.getPointAtLength(safeOffset);
                p.element.setAttribute("transform", `translate(${pt.x}, ${pt.y})`);
            } catch (e) {
                // Ignore any SVG initialization subpixel frame errors
            }
        });
    }

    let animationFrameId = null;

    function animateParticles() {
        const metrics = calculateSystemState();

        // Lazy initialize path lengths and particles once SVG is laid out in DOM
        if (safePathLength < 50 && safePathCore) {
            const len = safePathCore.getTotalLength();
            if (len > 50) {
                safePathLength = len;
                createParticles(safeParticlesContainer, PARTICLE_COUNT, "#00FF00", safeParticles, safePathCore, safePathLength);
            }
        }
        if (dangerPathLength < 50 && dangerPathCore) {
            const len = dangerPathCore.getTotalLength();
            if (len > 50) {
                dangerPathLength = len;
                createParticles(dangerParticlesContainer, PARTICLE_COUNT, "#FF0000", dangerParticles, dangerPathCore, dangerPathLength);
            }
        }

        let speedFactor = 1.0;
        if (state.timeMode === 'pause') {
            speedFactor = 0;
        } else if (state.timeMode === 'slow') {
            speedFactor = 0.25;
        }

        // Safe Path electron animation
        if (state.earthing && state.leakage > 0 && metrics.iEarth_mA > 0.05) {
            safeParticlesContainer.style.display = "block";
            if (safePathLength > 0) {
                // Scale speed from ~0.25px/frame at low leakage to ~5.0px/frame at 100% leakage
                const safeSpeed = (0.25 + (state.leakage / 100) * 4.75) * speedFactor;
                updateParticlePositions(safeParticles, safePathCore, safePathLength, safeSpeed);
            }
        } else {
            safeParticlesContainer.style.display = "none";
        }

        // Danger Path (single path down right leg) electron animation
        if (state.leakage > 0 && metrics.iHuman_mA > 0.05) {
            dangerParticlesContainer.style.display = "block";
            if (dangerPathLength > 0) {
                // Scale speed similarly based on leakage percentage
                const dangerSpeed = (0.25 + (state.leakage / 100) * 4.75) * speedFactor;
                updateParticlePositions(dangerParticles, dangerPathCore, dangerPathLength, dangerSpeed);
            }
        } else {
            dangerParticlesContainer.style.display = "none";
        }

        animationFrameId = requestAnimationFrame(animateParticles);
    }

    // Start animation loop (which handles lazy path measurement and particle creation)
    animateParticles();

    // -----------------------------------------------------------------
    // INITIALIZATION
    // -----------------------------------------------------------------
    resetSimulation();
});
