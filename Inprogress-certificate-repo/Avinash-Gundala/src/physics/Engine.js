import Particle from "./Particle";
import Renderer from "./Renderer";
import { ACID_IONS, BASE_IONS } from "../utils/constants";
import { random } from "../utils/helpers";
import ReactionManager from "./ReactionManager";
export default class Engine {

    constructor(
        canvas,
        setProgress,
        setStatus,
        setWaterCount,
        setSaltCount,
        onEvent
) {

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // 👇 ADD THESE FOUR LINES HERE
    this.setProgress = setProgress;
    this.setStatus = setStatus;
    this.setWaterCount = setWaterCount;
    this.setSaltCount = setSaltCount;
    this.onEvent = onEvent || (() => {});

    this.renderer = new Renderer(this.ctx);

    this.animation = null;

    this.particles = [];

    this.bubbles = [];

    this.createParticles();

    this.createBubbles();

    this.isRunning = false;

    this.reaction = new ReactionManager();

    this.progress = 0;

    this.reactionSpeed = 90;
}

    createParticles() {

        this.particles = [];

        // Acid ions
        for (let i = 0; i < 40; i++) {

            const ion = ACID_IONS[
                Math.floor(Math.random() * ACID_IONS.length)
            ];

            this.particles.push(
                new Particle(
                    random(150,290),
                    random(150, 330),
                    ion.type,
                    ion.color
                )
            );
        }

        // Base ions
        for (let i = 0; i < 40; i++) {

            const ion = BASE_IONS[
                Math.floor(Math.random() * BASE_IONS.length)
            ];

            this.particles.push(
                new Particle(
                    random(1160,1300),
                    random(150, 330),
                    ion.type,
                    ion.color
                )
            );
        }

    }

    createBubbles() {

        this.bubbles = [];

        for (let i = 0; i < 25; i++) {

            this.bubbles.push({
                x: random(150,290),
                y: random(180, 360),
                r: random(2, 5),
                speed: random(0.3, 1)
            });

            this.bubbles.push({
                x: random(1160,1300),
                y: random(180, 360),
                r: random(2, 5),
                speed: random(0.3, 1)
            });

        }

    }

    drawBubbles() {

        const ctx = this.ctx;

        this.bubbles.forEach(b => {

            b.y -= b.speed;

            if (b.y < 180) {

                b.y = 360;

            }

            ctx.beginPath();

            ctx.strokeStyle = "rgba(255,255,255,0.35)";

            ctx.arc(
                b.x,
                b.y,
                b.r,
                0,
                Math.PI * 2
            );

            ctx.stroke();

        });

    }

    drawParticles() {

    this.particles.forEach(particle => {

    if (particle.state === "moving") {

        particle.update();

    } else {

        if (!this.isRunning) {

            if (particle.x < 500) {

                particle.update(
                    120,
                    300,
                    100,
                    380
                );

            } else {

                particle.update(
                    1150,
                    1330,
                    100,
                    380
                );

            }

        }

    }
   

    particle.draw(this.ctx);

});

}
    startReaction() {

    this.isRunning = true;
this.frameCount = 0;
    this.particles.forEach(particle => {

        particle.moveTo(
    random(650,800),
    random(180,340)
);

    });
    this.onEvent("Reaction started: ions are moving toward the reaction chamber.");

}

pause() {

    this.isRunning = false;

}



render() {

    const chamberX = 725;
    const chamberY = 270;

    this.renderer.drawBackground(this.canvas);

    this.renderer.drawBeaker(
        120,
        120,
        "Acid",
        "rgba(59,130,246,0.35)"
    );

    this.renderer.drawReactionBox();

    this.renderer.drawBeaker(
        1170,
        120,
        "Base",
        "rgba(34,197,94,0.35)"
    );

    this.drawBubbles();

    // Slow reaction
    if (this.isRunning) {

        if (!this.frameCount) {
            this.frameCount = 0;
        }

        this.frameCount++;

        if (this.frameCount % this.reactionSpeed === 0) {
            const prevWater = this.reaction.waterCount;
            const prevSalt = this.reaction.saltCount;

            this.particles = this.reaction.react(this.particles);

            const newWater = this.reaction.waterCount;
            const newSalt = this.reaction.saltCount;

            if (newWater > prevWater) {
                const delta = newWater - prevWater;
                for (let i = 0; i < delta; i++) {
                    this.onEvent("H⁺ + OH⁻ collided → H₂O formed");
                }
            }

            if (newSalt > prevSalt) {
                const delta = newSalt - prevSalt;
                for (let i = 0; i < delta; i++) {
                    this.onEvent("Na⁺ + Cl⁻ collided → NaCl (salt) formed");
                }
            }
        }
    }

    this.drawParticles();

    // Spark effect while reacting
    if (this.isRunning && !this.reaction.finished) {

        this.ctx.save();

        for (let i = 0; i < 8; i++) {

            this.ctx.beginPath();

            this.ctx.fillStyle = "rgba(255,255,255,0.8)";

            this.ctx.arc(
                chamberX + Math.random() * 60 - 30,
                chamberY + Math.random() * 60 - 30,
                2,
                0,
                Math.PI * 2
            );

            this.ctx.fill();
        }

        this.ctx.restore();
    }

    // Draw products
    this.reaction.products.forEach(product => {

        if (product.phase !== undefined) {
            product.phase += 0.03;
            product.y = product.baseY + Math.sin(product.phase) * 4;
        }
        product.x = Math.max(640, Math.min(810, product.x));
product.y = Math.max(180, Math.min(340, product.y));

        this.ctx.save();

        this.ctx.shadowColor = product.color;
        this.ctx.shadowBlur = 20;

        this.ctx.beginPath();
        this.ctx.fillStyle = product.color;

        this.ctx.arc(
            product.x,
            product.y,
            10,
            0,
            Math.PI * 2
        );

        this.ctx.fill();

        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 10px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";

        this.ctx.fillText(
            product.type,
            product.x,
            product.y
        );

        this.ctx.restore();

    });

    // Reaction complete animation
    if (this.reaction.finished) {

        this.ctx.save();

        // White glow
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(255,255,255,0.12)";
        this.ctx.arc(
            chamberX,
            chamberY,
            90,
            0,
            Math.PI * 2
        );
        this.ctx.fill();

        // Blue ring
        this.ctx.strokeStyle = "#38bdf8";
        this.ctx.lineWidth = 5;
        this.ctx.shadowBlur = 30;
        this.ctx.shadowColor = "#38bdf8";

        this.ctx.beginPath();
        this.ctx.arc(
            chamberX,
            chamberY,
            70,
            0,
            Math.PI * 2
        );
        this.ctx.stroke();

        // Success message
        this.ctx.fillStyle = "#22c55e";
        this.ctx.font = "bold 34px Arial";
        this.ctx.textAlign = "center";

        this.ctx.fillText(
            "✔ Reaction Complete",
            chamberX,
            500
        );

        // Floating success particles
        for (let i = 0; i < 20; i++) {

            this.ctx.beginPath();

            this.ctx.fillStyle = "rgba(255,255,255,0.8)";

            this.ctx.arc(
                chamberX + Math.random() * 120 - 60,
                chamberY + Math.random() * 120 - 60,
                2,
                0,
                Math.PI * 2
            );

            this.ctx.fill();

        }

        this.ctx.restore();
    }

}

    animate = () => {

    this.render();

    const totalProducts = 40;

this.progress = Math.floor(
    (this.reaction.products.length / totalProducts) * 100
);

this.progress = Math.min(100, this.progress);
    this.setProgress(this.progress);
    this.setWaterCount(this.reaction.waterCount);
this.setSaltCount(this.reaction.saltCount);
if (this.reaction.finished) {

    this.progress = 100;

    this.setProgress(100);

    this.setStatus("Reaction Complete");

    this.isRunning = false;

}
else if (this.progress > 0) {

    this.setStatus("Reacting");

}
else {

    this.setStatus("Waiting");

}

    this.animation = requestAnimationFrame(this.animate);

}

    start() {

        this.animate();

    }

    stop() {

        cancelAnimationFrame(
            this.animation
        );

    }
   reset() {

    this.isRunning = false;

    this.progress = 0;
    this.reaction = new ReactionManager();

    this.frameCount = 0;

    this.createParticles();

    this.createBubbles();

    this.setProgress(0);

    this.setStatus("Waiting");

}
}
