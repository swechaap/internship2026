export default class ReactionManager {

    constructor() {

        this.products = [];

        this.waterCount = 0;

        this.saltCount = 0;

        this.finished = false;

    }

    react(particles) {

        if (this.finished) {
            return particles;
        }

        while (true) {

            const acid = particles.find(
                p => p.type === "H⁺"
            );

            const base = particles.find(
                p => p.type === "OH⁻"
            );

            if (acid && base) {

                this.products.push({

                   x: 600 + (Math.random() * 120 - 60),
y: 270 + (Math.random() * 120 - 60),

                    baseY: (acid.y + base.y) / 2,

                    phase: Math.random() * Math.PI * 2,

                    type: "H₂O",

                    color: "#06b6d4"

                });

                this.waterCount++;

                particles = particles.filter(
                    p => p !== acid && p !== base
                );

            } else {

                break;

            }

        }

        while (true) {

            const na = particles.find(
                p => p.type === "Na⁺"
            );

            const cl = particles.find(
                p => p.type === "Cl⁻"
            );

            if (na && cl) {

                this.products.push({

                   x: 640 + Math.random() * 180,
y: 190 + Math.random() * 180,

                    baseY: (na.y + cl.y) / 2,

                    phase: Math.random() * Math.PI * 2,

                    type: "NaCl",

                    color: "#8b5cf6"

                });

                this.saltCount++;

                particles = particles.filter(
                    p => p !== na && p !== cl
                );

            } else {

                break;

            }

        }

        const hasH = particles.some(
            p => p.type === "H⁺"
        );

        const hasOH = particles.some(
            p => p.type === "OH⁻"
        );

        const hasNa = particles.some(
            p => p.type === "Na⁺"
        );

        const hasCl = particles.some(
            p => p.type === "Cl⁻"
        );

        if ((!hasH || !hasOH) && (!hasNa || !hasCl)) {

            this.finished = true;

        }

        return particles;

    }

}