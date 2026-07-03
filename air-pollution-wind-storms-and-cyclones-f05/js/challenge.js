
/**
 * Atmosphere Explorer - Challenge Mode Game Engine
 * Manages missions, objectives, timers, star ratings, and hint system.
 */
 
const MISSION_DATA = {
 
    1: {
        title: "🌬️ Wind Explorer",
        desc: "Use wind speed and wind direction to blow pollution away from the houses. Reduce AQI below 80.",
        duration: 60,
 
        goals: [
            {
                id: "aqi-limit",
                text: "Reduce AQI below 80",
                check: (sim) => sim.aqi < 80
            },
            {
                id: "hold-time",
                text: "Keep AQI below 80 for 5 seconds",
                check: (sim) => sim.holdTimer >= 5
            }
        ],
 
        setup: (sim) => {
            sim.lockFactory(true, true);
            sim.lockVehicles(false, false);
 
            sim.lockWindSpeed(false);
            sim.lockWindDir(false);
 
            sim.setWind(10, 90);
 
            sim.stopWeather();
        },
 
        hints: [
            "Increase Wind Speed.",
            "Change Wind Direction away from the houses.",
            "Watch the AQI value and try to keep it below 80."
        ],
 
        insight:
            "Wind spreads pollutants over a larger area, reducing pollution concentration in one place."
    },
 
    2: {
        title: "🌧️ Rain Cleaner",
 
        desc:
            "There is no wind. Use Storm Mode and rain to clean the polluted air. Reduce AQI below 40.",
 
        duration: 60,
 
        goals: [
            {
                id: "aqi-limit",
                text: "Reduce AQI below 40",
                check: (sim) => sim.aqi < 40
            },
            {
                id: "hold-time",
                text: "Keep AQI below 40 for 5 seconds",
                check: (sim) => sim.holdTimer >= 5
            }
        ],
 
        setup: (sim) => {
 
            sim.lockFactory(true, true);
 
            sim.lockVehicles(false, true);
 
            sim.lockWindSpeed(true, 0);
 
            sim.lockWindDir(true, 90);
 
            sim.setHumidity(90);
 
            sim.setTemp(35);
        },
 
        hints: [
            "Activate Storm Mode.",
            "Rain removes pollution particles from the air.",
            "Keep humidity high."
        ],
 
        insight:
            "Rain cleans the atmosphere through a process called wet deposition."
    },
 
    3: {
        title: "🌀 Cyclone Observer",
 
        desc:
            "Activate Cyclone Mode and use it to move pollution away from houses. Keep AQI below 80.",
 
        duration: 60,
 
        goals: [
            {
                id: "aqi-limit",
                text: "Reduce AQI below 80",
                check: (sim) => sim.aqi < 80
            },
            {
                id: "hold-time",
                text: "Keep AQI below 80 for 5 seconds",
                check: (sim) => sim.holdTimer >= 5
            }
        ],
 
        setup: (sim) => {
 
            sim.lockFactory(true, true);
 
            sim.lockVehicles(false, false);
 
            sim.lockWindSpeed(false);
 
            sim.lockWindDir(false);
 
            sim.startCyclone();
        },
 
        hints: [
            "Turn on Cyclone Mode.",
            "Move the cyclone near pollution.",
            "Watch how pollution rotates around the cyclone."
        ],
 
        insight:
            "Cyclones create rotating winds that can transport pollution."
    },
 
    4: {
        title: "🌎 Environment Master",
 
        desc:
            "Smoke is moving toward the houses. Use everything you've learned about wind, rain and cyclones to protect the houses. Keep AQI below 70.",
 
        duration: 60,
 
        goals: [
            {
                id: "aqi-limit",
                text: "Reduce AQI below 70",
                check: (sim) => sim.aqi < 70
            },
            {
                id: "hold-time",
                text: "Keep AQI below 70 for 5 seconds",
                check: (sim) => sim.holdTimer >= 5
            }
        ],
 
        setup: (sim) => {
 
            sim.lockFactory(true, true);
 
            sim.lockVehicles(true, false);
 
            sim.lockWindSpeed(false);
 
            sim.lockWindDir(false);
 
            sim.setWind(20, 90);
 
            sim.stopWeather();
        },
 
        hints: [
            "Rotate the wind away from the houses.",
            "Try North or South directions.",
            "Increase wind speed if smoke reaches houses."
        ],
 
        insight:
            "Changing wind direction can protect people from polluted air."
    }
};
 
class ChallengeManager {
    constructor(mainSim) {
        this.sim = mainSim;
        this.currentMissionId = 1;
        this.isPlaying = false;
        this.timer = 0;
        this.holdTimer = 0;
        
        // Track visual rewards
        this.stars = 0;
        this.hintIndex = 0;
 
        this.bindEvents();
    }
 
    bindEvents() {
        // Mission Selection click events
        const buttons = document.querySelectorAll('.btn-challenge');
        buttons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.isPlaying) {
                    if (!confirm("Are you sure you want to quit the current mission?")) return;
                }
                const missionId = parseInt(e.target.getAttribute('data-mission'));
                this.selectMission(missionId);
            });
        });
 
        // Start/Restart and Hint triggers
        document.getElementById('btn-start-mission').addEventListener('click', () => this.togglePlayState());
        document.getElementById('btn-hint').addEventListener('click', () => this.showHint());
        // Modal Action bindings
        document.getElementById('btn-modal-next-mission').addEventListener('click', () => {
            this.closeCelebration();
            const nextId = this.currentMissionId < 4 ? this.currentMissionId + 1 : 1;
            this.selectMission(nextId);
            this.togglePlayState(); // auto start next mission
        });
 
        document.getElementById('btn-modal-replay').addEventListener('click', () => {
            this.closeCelebration();
            this.togglePlayState(); // restart
        });
 
        document.getElementById('btn-modal-close').addEventListener('click', () => {
            this.closeCelebration();
        });
    }
 
    selectMission(id) {
        this.currentMissionId = id;
        this.isPlaying = false;
        this.timer = MISSION_DATA[id].duration;
        this.holdTimer = 0;
        this.hintIndex = 0;
 
        // Toggle button states in panel list
        document.querySelectorAll('.btn-challenge').forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.getAttribute('data-mission')) === id) {
                btn.classList.add('active');
            }
        });
 
        // Update labels
        document.getElementById('lbl-mission-title').innerText = MISSION_DATA[id].title;
        document.getElementById('lbl-mission-desc').innerText = MISSION_DATA[id].desc;
        document.getElementById('lbl-mission-timer').innerText = this.timer + 's';
        
        const statusLbl = document.getElementById('lbl-mission-status');
        statusLbl.innerText = "Ready";
        statusLbl.className = "chal-val val-inactive";
 
        // Setup objective list HTML elements
        const objList = document.getElementById('objective-list');
        objList.innerHTML = '';
        MISSION_DATA[id].goals.forEach((goal) => {
            const li = document.createElement('li');
            li.id = `obj-${goal.id}`;
            li.className = 'incomplete';
            li.innerHTML = `<span>${goal.text}</span>`;
            objList.appendChild(li);
        });
 
        // Trigger simulation locks/parameters reset
        this.sim.resetSimState();
        MISSION_DATA[id].setup(this.sim);
        
        document.getElementById('btn-start-mission').innerText = "🚀 Start Mission";
        document.getElementById('btn-start-mission').className = "btn btn-primary";
    }
 
    togglePlayState() {
        if (this.isPlaying) {
            // Stop mission
            this.isPlaying = false;
            this.selectMission(this.currentMissionId);
        } else {
            // Start mission
            this.isPlaying = true;
            this.timer = MISSION_DATA[this.currentMissionId].duration;
            this.holdTimer = 0;
            this.hintIndex = 0;
 
            document.getElementById('btn-start-mission').innerText = "⏹️ Stop Mission";
            document.getElementById('btn-start-mission').className = "btn btn-danger";
            
            const statusLbl = document.getElementById('lbl-mission-status');
            statusLbl.innerText = "Active";
            statusLbl.className = "chal-val val-active";
 
            // Trigger reset of particle data to start fresh for evaluation
            this.sim.particles.reset();
            
            this.sim.showBanner(`Starting ${MISSION_DATA[this.currentMissionId].title}!`);
        }
    }
 
    update(dt) {
        if (!this.isPlaying) return;
        const aqiBox = document.getElementById("mission-aqi-value");
 
        if(aqiBox){
          aqiBox.innerText = Math.round(this.sim.aqi);
     }
 
        // Decrement mission duration timer
        this.timer -= dt;
        if (this.timer <= 0) {
            this.timer = 0;
            this.failMission();
            return;
        }
        document.getElementById('lbl-mission-timer').innerText = Math.ceil(this.timer) + 's';
 
        // Evaluate objectives
        const currentMission = MISSION_DATA[this.currentMissionId];
        let allSatisfied = true;
 
        // First goal check (dynamic threshold e.g. AQI < 50)
        const firstGoal = currentMission.goals[0];
        const firstGoalStatus = firstGoal.check(this.sim);
        const firstGoalLi = document.getElementById(`obj-${firstGoal.id}`);
        
        if (firstGoalStatus) {
            firstGoalLi.className = 'complete';
            // Accumulate hold duration
            this.holdTimer += dt;
        } else {
            firstGoalLi.className = 'incomplete';
            this.holdTimer = 0; // reset sequence if broken
        }
 
        // Second goal check (time hold)
        const secondGoal = currentMission.goals[1];
        const secondGoalLi = document.getElementById(`obj-${secondGoal.id}`);
        
        // Update hold objectives text dynamically to show progress e.g. (3s/5s)
        const reqHold = this.currentMissionId === 1 ? 5 : this.currentMissionId === 2 ? 8 : this.currentMissionId === 3 ? 6 : 7;
        secondGoalLi.innerHTML = `<span>${secondGoal.text} (${Math.min(reqHold, Math.floor(this.holdTimer))}s/${reqHold}s)</span>`;
 
        if (this.holdTimer >= reqHold) {
            secondGoalLi.className = 'complete';
        } else {
            secondGoalLi.className = 'incomplete';
            allSatisfied = false;
        }
 
        // Win state verification
        if (allSatisfied) {
            this.winMission();
        }
    }
 
    winMission() {
        this.isPlaying = false;
        
        // Calculate Star rewards based on speed
        const currentMission = MISSION_DATA[this.currentMissionId];
        const maxTime = currentMission.duration;
        const timeSpent = maxTime - this.timer;
        
        if (timeSpent < maxTime * 0.45) {
            this.stars = 3;
        } else if (timeSpent < maxTime * 0.75) {
            this.stars = 2;
        } else {
            this.stars = 1;
        }
 
        // Update celebration UI
        const starContainer = document.getElementById('celebration-stars');
        starContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            span.className = i < this.stars ? 'star-icon' : 'star-icon text-muted';
            span.innerHTML = '&#9733;';
            starContainer.appendChild(span);
        }
 
        document.getElementById('lbl-celebration-subtitle').innerText = `Completed in ${Math.round(timeSpent)}s with ${this.stars} Stars!`;
        document.getElementById('lbl-celebration-explain').innerText =
        `Mission Completed Successfully! You learned an important environmental science concept through experimentation.`;
        document.getElementById('lbl-celebration-insight').innerHTML = `<strong>Science Insight:</strong> ${currentMission.insight}`;
 
        // Toggle Next Mission button state
        const nextBtn = document.getElementById('btn-modal-next-mission');
        if (this.currentMissionId === 4) {
            nextBtn.innerText = "Replay Mission 1";
        } else {
            nextBtn.innerText = "Play Next Mission";
        }
 
        // Trigger visual modal
        const modal = document.getElementById('modal-celebration');
        modal.classList.add('modal-visible');
        modal.setAttribute('aria-hidden', 'false');
 
        // Reset play button
        document.getElementById('btn-start-mission').innerText = "🚀 Start Mission";
        document.getElementById('btn-start-mission').className = "btn btn-primary";
        
        const statusLbl = document.getElementById('lbl-mission-status');
        statusLbl.innerText = "Passed";
        statusLbl.className = "chal-val val-inactive";
        
        this.sim.showBanner(`Mission Accomplished! ★★★`);
    }
 
    failMission() {
    this.isPlaying = false;
 
    alert(
`❌ Mission Not Completed
 
Try Again!
 
Remember:
 
🌬️ Wind spreads pollution
 
🌧️ Rain removes pollution from the air
 
🌀 Cyclones move pollution in circular patterns
 
💡 Click the Hint button if you need help.`
    );
 
    this.selectMission(this.currentMissionId);
}
    showHint() {
        const currentMission = MISSION_DATA[this.currentMissionId];
        const hints = currentMission.hints;
        
        // Cycle through list of hints
        const hintText = hints[this.hintIndex % hints.length];
        this.hintIndex++;
        alert(`💡 Hint\n\n${hintText}`);
        
    }
 
    closeCelebration() {
        const modal = document.getElementById('modal-celebration');
        modal.classList.remove('modal-visible');
        modal.setAttribute('aria-hidden', 'true');
    }
}
 
 
window.ChallengeManager = ChallengeManager;