function checkAnswer(material){

const bulb=document.getElementById("bulb");
const message=document.getElementById("message");
const next=document.getElementById("next");

if(material==="Copper"){

bulb.classList.add("glow");

message.innerHTML=
"✅ Correct! Copper is a conductor. The bulb lights up!";

message.style.color="#22c55e";

next.style.display="block";

}
else{

bulb.classList.remove("glow");

message.innerHTML=
"❌ Wrong! "+material+" is an insulator and cannot light the bulb.";

message.style.color="#ef4444";

}

}