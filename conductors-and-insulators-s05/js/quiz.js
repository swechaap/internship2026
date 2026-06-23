function calculateScore(){

let score = 0;

const answers = document.querySelectorAll(
'input[type="radio"]:checked'
);

answers.forEach(answer=>{
    score += Number(answer.value);
});

const result = document.getElementById("result");

let badge = "";

if(score === 5){
    badge = "🏆 Electricity Master";
}
else if(score >= 3){
    badge = "🥈 Electricity Explorer";
}
else{
    badge = "📚 Keep Learning";
}

result.innerHTML = `
<h2>Your Score: ${score}/5</h2>
<div class="badge">⚡</div>
<p>${badge}</p>
<br>
<a href="uses.html">
    <button>Next Activity ➜</button>
</a>
`;

}