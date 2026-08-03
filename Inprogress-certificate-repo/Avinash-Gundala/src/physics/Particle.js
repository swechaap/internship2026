export default class Particle {

    constructor(x, y, type, color) {

        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;

        this.radius = 12;

        this.type = type;
        this.color = color;

        this.state = "beaker";

        this.targetX = x;
        this.targetY = y;
    }

    moveTo(x, y) {

        this.targetX = x;
        this.targetY = y;

        this.state = "moving";

    }

    update(left, right, top, bottom) {

        if (this.state === "moving") {

            this.x += (this.targetX - this.x) * 0.03;
            this.y += (this.targetY - this.y) * 0.03;

            return;
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < left + this.radius || this.x > right - this.radius) {
            this.vx *= -1;
        }

        if (this.y < top + this.radius || this.y > bottom - this.radius) {
            this.vy *= -1;
        }
    }

    draw(ctx) {

        ctx.beginPath();

        ctx.fillStyle = this.color;
ctx.save();

ctx.shadowColor=this.color;

ctx.shadowBlur=18;
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );
ctx.restore();
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
            this.type,
            this.x,
            this.y
        );
    }

}