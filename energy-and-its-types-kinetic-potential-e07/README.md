<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Energy Simulation</title>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<style>
*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, sans-serif;
}

body{
    background:#eef5f7;
    padding:20px;
}

.container{
    max-width:1400px;
    margin:auto;
}

h1{
    text-align:center;
    color:#10105e;
    font-size:55px;
    margin-bottom:10px;
}

h2{
    text-align:center;
    color:#2f8f4e;
    margin-bottom:20px;
}

.info-box{
    width:60%;
    margin:0 auto 20px auto;
    background:white;
    border:2px solid #d8d8d8;
    border-radius:12px;
    padding:15px;
    text-align:center;
    font-size:22px;
    font-weight:bold;
}

.main{
    display:flex;
    gap:20px;
}

.simulation{
    flex:3;
    height:600px;
    background:linear-gradient(#b8e4ff,#d9f3ff);
    border-radius:25px;
    border:2px solid #cfd8dc;
    position:relative;
    overflow:hidden;
}

.message-box{
    position:absolute;
    left:20px;
    top:20px;
    background:white;
    padding:15px;
    border-radius:15px;
    border:2px solid #999;
    width:220px;
    text-align:center;
    line-height:1.7;
    z-index:5;
}

.hill{
    width:800px;
    height:400px;
    background:#5fae37;
    border-radius:50% 50% 0 0;
    position:absolute;
    bottom:0;
    left:50%;
    transform:translateX(-50%);
}

.ball{
    width:70px;
    height:70px;
    background:red;
    border-radius:50%;
    position:absolute;
    top:-35px;
    left:365px;
    box-shadow:0 0 15px rgba(0,0,0,.4);
}

.controls{
    flex:1;
    background:white;
    border-radius:20px;
    border:2px solid #d8d8d8;
    padding:25px;
}

.controls h3{
    margin-bottom:25px;
    color:#1d3557;
}

.controls label{
    display:block;
    margin-top:20px;
    margin-bottom:8px;
    font-size:18px;
    font-weight:bold;
}

.controls span{
    float:right;
    color:#2f8f4e;
}

.controls input{
    width:100%;
}

button{
    width:100%;
    padding:14px;
    border:none;
    border-radius:10px;
    color:white;
    font-size:18px;
    cursor:pointer;
    margin-top:20px;
}

button:first-of-type{
    background:#2ea44f;
}

.reset{
    background:#1565c0;
}

.cards{
    display:flex;
    gap:20px;
    margin-top:20px;
}

.card{
    flex:1;
    background:white;
    padding:25px;
    border-radius:20px;
    border:2px solid #d8d8d8;
    text-align:center;
}

.card h3{
    margin-bottom:15px;
}

.card p{
    font-size:36px;
    font-weight:bold;
}

.bottom{
    display:flex;
    gap:20px;
    margin-top:20px;
}

.graph-box{
    flex:1.4;
    background:white;
    border-radius:20px;
    border:2px solid #d8d8d8;
    padding:20px;
}

.how{
    flex:1;
    background:white;
    border-radius:20px;
    border:2px solid #d8d8d8;
    padding:20px;
}

.how h3{
    margin-bottom:15px;
    color:#1d3557;
}

.how p{
    margin-bottom:15px;
    font-size:18px;
    line-height:1.6;
}

canvas{
    width:100% !important;
    height:300px !important;
}
</style>

</head>
<body>

<div class="container">

<h1>⚡ ENERGY SIMULATION ⚡</h1>
<h2>Kinetic Energy & Potential Energy</h2>

<div class="info-box">
Total Mechanical Energy is always conserved (PE + KE = Constant)
</div>

<div class="main">

<div class="simulation">

<div class="message-box">
<b>Ball is at Top</b><br>
High Potential Energy<br>
Low Kinetic Energy
</div>

<div class="hill">
<div class="ball" id="ball"></div>
</div>

</div>

<div class="controls">

<h3>⚙️ Adjust Parameters</h3>

<label>Height (m):
<span id="heightValue">10</span>
</label>

<input type="range" id="height" min="1" max="20" value="10">

<label>Mass (kg):
<span id="massValue">1</span>
</label>

<input type="range" id="mass" min="1" max="10" value="1">

<label>Speed (m/s):
<span id="speedValue">0</span>
</label>

<input type="range" id="speed" min="0" max="20" value="0">

<button onclick="startSimulation()">▶️ Start / Release</button>

<button class="reset" onclick="resetSimulation()">↻ Reset</button>

</div>

</div>

<div class="cards">

<div class="card">
<h3>Potential Energy</h3>
<p id="pe">98.10 J</p>
</div>

<div class="card">
<h3>Kinetic Energy</h3>
<p id="ke">0.00 J</p>
</div>

<div class="card">
<h3>Total Energy</h3>
<p id="te">98.10 J</p>
</div>

</div>

<div class="bottom">

<div class="graph-box">
<h3>Energy Graph</h3>
<canvas id="energyChart"></canvas>
</div>

<div class="how">
<h3>💡 How It Works</h3>

<p>🟢 At higher positions, the ball has more Potential Energy.</p>
<p>🔵 As the ball moves down, Potential Energy converts into Kinetic Energy.</p>
<p>🟣 At the bottom, Potential Energy is minimum and Kinetic Energy is maximum.</p>
<p>🟠 Total Mechanical Energy remains constant.</p>
</div>

</div>

</div>

<script>
const heightSlider = document.getElementById("height");
const massSlider = document.getElementById("mass");
const speedSlider = document.getElementById("speed");

const heightValue = document.getElementById("heightValue");
const massValue = document.getElementById("massValue");
const speedValue = document.getElementById("speedValue");

const peText = document.getElementById("pe");
const keText = document.getElementById("ke");
const teText = document.getElementById("te");

const ball = document.getElementById("ball");

heightSlider.addEventListener("input", updateSimulation);
massSlider.addEventListener("input", updateSimulation);
speedSlider.addEventListener("input", updateSimulation);

const ctx = document.getElementById("energyChart").getContext("2d");

const energyChart = new Chart(ctx,{
    type:"bar",
    data:{
        labels:["Potential Energy","Kinetic Energy","Total Energy"],
        datasets:[{
            data:[98.1,0,98.1],
            backgroundColor:["#4CAF50","#2196F3","#9C27B0"]
        }]
    },
    options:{
        responsive:true,
        plugins:{
            legend:{display:false}
        },
        scales:{
            y:{beginAtZero:true}
        }
    }
});

function updateSimulation(){

    let h=parseFloat(heightSlider.value);
    let m=parseFloat(massSlider.value);
    let v=parseFloat(speedSlider.value);

    heightValue.textContent=h;
    massValue.textContent=m;
    speedValue.textContent=v;

    let g=9.81;

    let PE=m*g*h;
    let KE=0.5*m*v*v;
    let TE=PE+KE;

    peText.textContent=PE.toFixed(2)+" J";
    keText.textContent=KE.toFixed(2)+" J";
    teText.textContent=TE.toFixed(2)+" J";

    energyChart.data.datasets[0].data=[PE,KE,TE];
    energyChart.update();
}

function startSimulation(){

    let h=parseFloat(heightSlider.value);

    ball.style.transition="all 2s ease";

    let newTop=280-(h*10);

    ball.style.top=newTop+"px";
    ball.style.left="620px";

    updateSimulation();
}

function resetSimulation(){

    heightSlider.value=10;
    massSlider.value=1;
    speedSlider.value=0;

    ball.style.transition="none";
    ball.style.left="365px";
    ball.style.top="-35px";

    updateSimulation();
}

updateSimulation();
</script>

</body>
</html