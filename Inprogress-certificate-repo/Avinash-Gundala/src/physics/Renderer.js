export default class Renderer {

    constructor(ctx) {
        this.ctx = ctx;
    }

    drawBackground(canvas) {

        const ctx = this.ctx;

        const gradient = ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );

        gradient.addColorStop(0, "#0f172a");
        gradient.addColorStop(1, "#1e293b");

        ctx.fillStyle = gradient;

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

    }

    drawBeaker(x, y, title, liquidColor) {

    const ctx = this.ctx;

    const width = 170;
    const height = 290;
    const radius = 18;

    ctx.save();

    // Glass shadow
    ctx.shadowColor = "#7dd3fc";
    ctx.shadowBlur = 15;

    // Glass outline
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 5;

    ctx.beginPath();

    // Top lip
    ctx.moveTo(x + radius, y);

    ctx.lineTo(x + width - radius, y);

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.stroke();

    // Liquid
    ctx.beginPath();

    ctx.moveTo(x + 5, y + 120);

    ctx.lineTo(x + 5, y + height - radius);

    ctx.quadraticCurveTo(
        x + 5,
        y + height - 5,
        x + radius,
        y + height - 5
    );

    ctx.lineTo(
        x + width - radius,
        y + height - 5
    );

    ctx.quadraticCurveTo(
        x + width - 5,
        y + height - 5,
        x + width - 5,
        y + height - radius
    );

    ctx.lineTo(
        x + width - 5,
        y + 120
    );

    ctx.closePath();

    ctx.fillStyle = liquidColor;

    ctx.fill();

    // Liquid surface
    ctx.beginPath();

    ctx.strokeStyle = "rgba(255,255,255,0.45)";

    ctx.lineWidth = 2;

    ctx.moveTo(x + 8, y + 120);

    for(let i=0;i<=width-16;i+=10){

        ctx.lineTo(

            x + 8 + i,

            y + 120 +

            Math.sin(i*0.08)*3

        );

    }

    ctx.stroke();

    // Glass reflection

    ctx.beginPath();

    ctx.strokeStyle =

        "rgba(255,255,255,0.25)";

    ctx.lineWidth = 5;

    ctx.moveTo(x + 22, y + 25);

    ctx.lineTo(x + 22, y + 230);

    ctx.stroke();

    // Top rim

    ctx.beginPath();

    ctx.strokeStyle = "#ffffff";

    ctx.lineWidth = 3;

    ctx.moveTo(x - 4, y);

    ctx.lineTo(x + width + 4, y);

    ctx.stroke();

    // Label

    ctx.fillStyle = "white";

    ctx.font = "bold 26px Arial";

    ctx.textAlign = "center";

    ctx.fillText(

        title,

        x + width/2,

        y - 20

    );

    ctx.restore();

}

    drawReactionBox() {

    const ctx = this.ctx;

    // Canvas width = 1450
    // Chamber width = 340
    // Center X = (1450 - 340) / 2 = 555

    const x = 555;
    const y = 120;
    const width = 340;
    const height = 300;

    const centerX = x + width / 2;
    const centerY = y + height / 2;

    ctx.save();

    ctx.shadowColor = "#38bdf8";
    ctx.shadowBlur = 30;

    ctx.fillStyle = "#1e293b";

    ctx.beginPath();
    ctx.roundRect(
        x,
        y,
        width,
        height,
        20
    );

    ctx.fill();

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.shadowBlur = 0;

    // Title
    ctx.fillStyle = "white";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
        "Reaction Chamber",
        centerX,
        y + 50
    );

    // Flask emoji
    ctx.font = "70px Arial";

    ctx.fillText(
        "⚗️",
        centerX,
        centerY + 20
    );

    ctx.restore();

}

}