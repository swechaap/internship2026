/**
 * JavaScript for the "What Is Inside Our Eyes?" Educational Simulation.
 * 
 * This file handles user interaction, diagram updates, path animation,
 * quiz grading, and the automatic fun-facts rotation. All functions are
 * structured clearly to make it easy for a student to explain.
 */

// ==========================================================================
// 1. DATA DEFINITIONS (Descriptions & Fun Facts)
// ==========================================================================

// Explanations for each eye part, shown when buttons are clicked
const eyePartsInfo = {
  cornea: {
    title: "Cornea",
    desc: "The Cornea is the clear, dome-shaped outer layer at the very front of the eye. It acts like a protective window and works to bend (refract) incoming light rays so they can focus properly."
  },
  iris: {
    title: "Iris",
    desc: "The Iris is the circular, colored part of your eye (blue, brown, green, etc.). It contains tiny muscles that contract or expand to control the size of the pupil, regulating how much light enters the eye."
  },
  pupil: {
    title: "Pupil",
    desc: "The Pupil is the black opening in the center of the iris. It looks like a black dot, but it is actually a hole that lets light enter the eye. It shrinks in bright light and expands in dim light."
  },
  lens: {
    title: "Lens",
    desc: "The Lens is a clear, flexible structure sitting right behind the pupil. It automatically changes its thickness to focus light rays directly onto the retina, allowing you to see objects clearly up-close or far away."
  },
  retina: {
    title: "Retina",
    desc: "The Retina is the light-sensitive lining on the back inside wall of the eyeball. It acts like the film in a camera, capturing the light patterns and converting them into electrical signals. Images hit the retina upside down!"
  },
  opticNerve: {
    title: "Optic Nerve",
    desc: "The Optic Nerve is the cable of nerve fibers that connects the eye to the brain. It acts like a messenger, carrying electrical signals from the retina to the brain. The brain then decodes these signals into the images we see."
  }
};

// Fun Facts list that rotates every 5 seconds
const funFacts = [
  "The muscles that control your eyes are the most active muscles in the entire human body!",
  "The images projected onto the back of your retina are actually upside down. Your brain automatically flips them right-side up!",
  "We blink about 15 to 20 times per minute to keep our eyes clean, lubricated, and healthy.",
  "Your eyes can detect about 10 million different colors, but cannot see anything without light.",
  "The human eye is so fast that it's the second most complex organ in the body, right after the brain!",
  "A human pupil can expand by up to 45% in darkness to help capture as much light as possible."
];

// Tracks current index of fun facts list
let factIndex = 0;


// ==========================================================================
// 2. INITIALIZATION (Runs when webpage loads)
// ==========================================================================
window.onload = function() {
  // Load the first fun fact immediately
  rotateFact();
  // Set up the interval timer to change fun facts every 5000 milliseconds (5 seconds)
  setInterval(rotateFact, 5000);
  
  // Set "Dim Light" as the default state for the simulation controls
  dimLight();
};


// ==========================================================================
// 3. CORE FUNCTIONALITY & SIMULATIONS
// ==========================================================================

/**
 * showPart: Triggered when an eye part button is clicked.
 * It updates active button state, updates right-panel information texts,
 * and highlights the corresponding HTML shape on the eye diagram.
 * 
 * @param {string} partName - The ID of the eye part clicked (e.g. 'cornea', 'iris')
 */
function showPart(partName) {
  // A. Update Active Button Highlighting (Left Panel)
  // Get all buttons in the parts list
  const buttons = document.querySelectorAll('.btn-part');
  buttons.forEach(btn => {
    btn.classList.remove('active'); // Remove highlight class from all buttons
  });
  
  // Add highlight to the specific button that was clicked
  const clickedBtnId = 'btn-' + partName.replace(/([A-Z])/g, "-$1").toLowerCase();
  const clickedBtn = document.getElementById(clickedBtnId);
  if (clickedBtn) {
    clickedBtn.classList.add('active');
  }

  // B. Update Information Texts (Right Panel)
  const infoTitle = document.getElementById('info-part-title');
  const infoDesc = document.getElementById('info-part-desc');
  
  if (eyePartsInfo[partName]) {
    infoTitle.innerText = eyePartsInfo[partName].title;
    infoDesc.innerText = eyePartsInfo[partName].desc;
  }

  // C. Highlight the Visual Shape on the Center Eye Diagram
  // First, remove highlights from all diagram parts
  const eyeComponents = document.querySelectorAll('.eye-component');
  eyeComponents.forEach(component => {
    component.classList.remove('highlight');
  });

  // Highlight the selected component
  let targetShapeId = 'part-' + partName.replace(/([A-Z])/g, "-$1").toLowerCase();
  
  // Adjust ID mapping for Sclera/Eyeball container highlight
  if (partName === 'sclera') {
    targetShapeId = 'part-eyeball';
  }
  
  const targetShape = document.getElementById(targetShapeId);
  if (targetShape) {
    targetShape.classList.add('highlight');
  }
}

/**
 * brightLight: Simulates shining bright light into the eye.
 * It constricts (shrinks) the pupil so that less light can enter.
 */
function brightLight() {
  const pupil = document.getElementById('part-pupil');
  const btnBright = document.getElementById('btn-bright');
  const btnDim = document.getElementById('btn-dim');

  // Add the 'bright' class (sizes pupil down in CSS) and remove 'dim'
  pupil.classList.remove('dim');
  pupil.classList.add('bright');

  // Update active state style on the light controls buttons
  btnBright.classList.add('active');
  btnDim.classList.remove('active');
}

/**
 * dimLight: Simulates entering a dark or dim room.
 * It dilates (enlarges) the pupil so that more light can be captured.
 */
function dimLight() {
  const pupil = document.getElementById('part-pupil');
  const btnBright = document.getElementById('btn-bright');
  const btnDim = document.getElementById('btn-dim');

  // Add the 'dim' class (sizes pupil up in CSS) and remove 'bright'
  pupil.classList.remove('bright');
  pupil.classList.add('dim');

  // Update active state style on the light controls buttons
  btnDim.classList.add('active');
  btnBright.classList.remove('active');
}

/**
 * showObject: Simulates looking at a specific object (Cat, Tree, Car).
 * It animates the pathway of light entering the eye, going through parts
 * sequentially, and reaching the brain.
 * 
 * @param {string} objectName - Name of the selected object (e.g. 'Cat')
 */
function showObject(objectName) {
  // A. Highlight Active Object Button
  const objButtons = document.querySelectorAll('.btn-object');
  objButtons.forEach(btn => {
    btn.classList.remove('active');
  });

  const activeBtnId = 'btn-' + objectName.toLowerCase();
  document.getElementById(activeBtnId).classList.add('active');

  // B. Define the Path Steps (IDs)
  const steps = [
    'step-object',
    'arrow-1',
    'step-cornea',
    'arrow-2',
    'step-pupil',
    'arrow-3',
    'step-lens',
    'arrow-4',
    'step-retina',
    'arrow-5',
    'step-brain'
  ];

  // C. Reset all path elements and remove previous active highlights
  steps.forEach(stepId => {
    const el = document.getElementById(stepId);
    if (el) {
      el.classList.remove('active');
    }
  });

  // Set the visual label of the first step to display the clicked object
  let emoji = "🐱";
  if (objectName === 'Tree') emoji = "🌲";
  if (objectName === 'Car') emoji = "🚗";
  document.getElementById('step-object').innerText = objectName + " " + emoji;

  // D. Animate sequentially using Javascript timeouts (300ms intervals)
  steps.forEach((stepId, index) => {
    setTimeout(() => {
      const el = document.getElementById(stepId);
      if (el) {
        el.classList.add('active');
      }

      // Optional: As path hits corresponding anatomical parts, highlight them on the main diagram too!
      if (stepId === 'step-cornea') showPart('cornea');
      if (stepId === 'step-pupil') showPart('pupil');
      if (stepId === 'step-lens') showPart('lens');
      if (stepId === 'step-retina') showPart('retina');
      if (stepId === 'step-brain') showPart('opticNerve');
    }, index * 300); // 300ms delays creates a smooth, visual flowchart animation
  });
}

/**
 * quizAnswer: Evaluates the user's choice in the right-panel quiz.
 * 
 * @param {string} selectedAnswer - The answer clicked by user ('Lens' or 'Iris')
 */
function quizAnswer(selectedAnswer) {
  const btnLens = document.getElementById('quiz-btn-lens');
  const btnIris = document.getElementById('quiz-btn-iris');
  const feedback = document.getElementById('quiz-feedback');

  // Reset the button styles first
  btnLens.className = 'btn-quiz';
  btnIris.className = 'btn-quiz';

  // Check if answer is correct (Iris controls the size of the pupil)
  if (selectedAnswer === 'Iris') {
    // Show correct status (styles green)
    btnIris.classList.add('quiz-correct');
    feedback.innerText = "🎉 Correct! The Iris contains muscles that adjust the pupil size.";
    feedback.style.color = "#22c55e"; // Success green text
  } else {
    // Show incorrect status (styles red)
    btnLens.classList.add('quiz-incorrect');
    btnIris.classList.add('quiz-correct'); // Helper: show the right answer
    feedback.innerText = "❌ Incorrect. The Lens focuses light, but the Iris controls pupil size!";
    feedback.style.color = "#ef4444"; // Warning red text
  }
}

/**
 * rotateFact: Swaps out the current fun fact inside the fact box
 * and increments the index so a new one is selected next time.
 */
function rotateFact() {
  const factText = document.getElementById('fun-fact-text');
  
  // Fade out effect before text changes
  factText.style.opacity = '0';
  
  setTimeout(() => {
    // Update the text to the next fact in the array
    factText.innerText = funFacts[factIndex];
    
    // Fade back in
    factText.style.opacity = '1';
    
    // Cycle to next fact index, wrapping back to 0 at the end
    factIndex = (factIndex + 1) % funFacts.length;
  }, 200);
}