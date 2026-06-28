// AI Features Logic

async function evaluateSpeech() {
  const aiResultsDiv = document.getElementById('ai-results');
  const aiFeedbackP = document.getElementById('ai-feedback');
  const token = localStorage.getItem('token');

  aiResultsDiv.classList.remove('hidden');
  aiFeedbackP.innerText = "Analyzing your speech (mock data for demo)...";

  // Simulate an API call delay
  setTimeout(() => {
    aiFeedbackP.innerText = "Your pacing was excellent! However, try to reduce filler words like 'um' and 'ah'. Overall Score: 85/100.";
  }, 2000);
}
