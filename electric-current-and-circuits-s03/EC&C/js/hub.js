/**
 * ==========================================================================
 * SHOCK SQUAD EXPLORER HUB - SCRIPTS & DYNAMIC DATA
 * ==========================================================================
 * This file controls all dynamic behavior of the Shock Squad learning hub,
 * specifically handling the component grid initialization, click listeners,
 * and mapping values from the Component Database into the popup modal.
 */

// --- DYNAMIC ACADEMIC DATABASE ---
// Represents the electrical components taught across grades 6 to 10.
// This database serves as the source of truth for the entire platform.
const COMPONENT_DATABASE = {
  "battery": {
    name: "Battery (1.5V)",
    classText: "Class 6",
    type: "power",
    typeLabel: "Power Source",
    emoji: "🔋",
    howItWorks: "Uses chemical reactions to generate a potential difference (voltage) between its terminals, which creates an electric field that pushes charge carriers (electrons) through the conductive loop.",
    realWorldUse: "Powers portable appliances, smart phones, flashlights, and electrical backup power packs.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="42" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="58" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="42" y1="5" x2="42" y2="35" stroke="#ef4444" stroke-width="4" />
        <line x1="48" y1="12" x2="48" y2="28" stroke="#3b82f6" stroke-width="2" />
        <line x1="52" y1="5" x2="52" y2="35" stroke="#ef4444" stroke-width="4" />
        <line x1="58" y1="12" x2="58" y2="28" stroke="#3b82f6" stroke-width="2" />
        <text x="36" y="10" fill="#ef4444" font-size="10" font-weight="bold">+</text>
        <text x="62" y="10" fill="#3b82f6" font-size="10" font-weight="bold">-</text>
      </svg>
    `
  },
  "bulb": {
    name: "Light Bulb",
    classText: "Class 6",
    type: "load",
    typeLabel: "Electrical Load",
    emoji: "💡",
    howItWorks: "Electric current passes through a thin tungsten wire filament with high resistance. The collision of electrons heats the filament to temperatures around 2500°C, causing it to incandesce and glow.",
    realWorldUse: "Standard residential illumination, automotive headlights, and warning indicator displays.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="35" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="65" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <circle cx="50" cy="20" r="15" fill="none" stroke="#fbbf24" stroke-width="3" />
        <path d="M 38,28 Q 42,20 45,15 Q 50,7 50,15 L 50,22 Q 55,20 62,28" fill="none" stroke="#fbbf24" stroke-width="2.5" />
      </svg>
    `
  },
  "wire": {
    name: "Copper Wire",
    classText: "Class 6",
    type: "conductor",
    typeLabel: "Conductor",
    emoji: "🔌",
    howItWorks: "Constructed of metals like copper that possess an abundant sea of free electrons in their atomic structure. These electrons migrate effortlessly when exposed to an electric field.",
    realWorldUse: "Conveys electric current from utility grids into home outlets and internal component circuit boards.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="100" y2="20" stroke="#10b981" stroke-width="4" stroke-linecap="round" />
        <circle cx="20" cy="20" r="4" fill="#cbd5e1" />
        <circle cx="80" cy="20" r="4" fill="#cbd5e1" />
      </svg>
    `
  },
  "switch": {
    name: "Toggle Switch",
    classText: "Class 6",
    type: "control",
    typeLabel: "Control Unit",
    emoji: "🎛️",
    howItWorks: "A mechanical device that completes (closes) or breaks (opens) the physical path of a circuit, regulating whether electric charges can flow in a closed loop.",
    realWorldUse: "Appliance power switches, emergency circuit breakers, and electronic toggle gates.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="30" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="70" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <circle cx="30" cy="20" r="5" fill="#8b5cf6" />
        <circle cx="70" cy="20" r="5" fill="#8b5cf6" />
        <line x1="30" y1="20" x2="65" y2="5" stroke="#f8fafc" stroke-width="3" stroke-linecap="round" />
      </svg>
    `
  },
  "eraser": {
    name: "Rubber Eraser",
    classText: "Class 6",
    type: "insulator",
    typeLabel: "Insulator",
    emoji: "🧼",
    howItWorks: "Composed of rubber materials where valence electrons are tightly bound in covalent molecular bonds, preventing any current flow even under elevated electrical potential.",
    realWorldUse: "Protective coating sleeves for metal wiring, tool handles, and safety rubber gloves for high-voltage electricians.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="25" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="75" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <rect x="25" y="10" width="50" height="20" rx="3" fill="#64748b" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3 3" />
        <text x="50" y="24" fill="#cbd5e1" font-size="10" text-anchor="middle">GAP</text>
      </svg>
    `
  },
  "heater": {
    name: "Heating Coil",
    classText: "Class 7",
    type: "load",
    typeLabel: "Thermal Load",
    emoji: "🌀",
    howItWorks: "Utilizes Joule Heating principles. When current passes through the highly resistive alloy coil (like Nichrome), collisions between electrons and metal ions convert kinetic energy into thermal energy.",
    realWorldUse: "Water heaters, stoves, toasters, and industrial furnaces.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="20" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="80" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <path d="M 20,20 Q 25,10 30,20 Q 35,30 40,20 Q 45,10 50,20 Q 55,30 60,20 Q 65,10 70,20 Q 75,30 80,20" 
              fill="none" stroke="#fbbf24" stroke-width="3" />
      </svg>
    `
  },
  "fuse": {
    name: "Safety Fuse",
    classText: "Class 7",
    type: "safety",
    typeLabel: "Safety / Protection",
    emoji: "🛡️",
    howItWorks: "Contains a metallic wire strip with a low melting point. If the circuit's current rises above safe parameters (e.g. short circuit), the wire melts, breaking the path to protect other devices.",
    realWorldUse: "Electrical distribution panels, car electrical hubs, and delicate computer systems.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="25" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="75" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <rect x="25" y="10" width="50" height="20" rx="4" fill="none" stroke="#ef4444" stroke-width="2" />
        <path d="M 25,20 C 35,10 40,30 50,20 C 60,10 65,30 75,20" fill="none" stroke="#ef4444" stroke-width="2" />
      </svg>
    `
  },
  "led": {
    name: "LED (Diode)",
    classText: "Class 8",
    type: "load",
    typeLabel: "Semiconductor Load",
    emoji: "🚨",
    howItWorks: "Light Emitting Diode: A semiconductor p-n junction diode that releases energy in the form of photons when electrons recombine with electron holes as current flows in the forward-biased direction.",
    realWorldUse: "Displays, status indicators, household energy-saving lamps, and smartphone flashes.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="40" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="60" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <polygon points="40,10 40,30 60,20" fill="#fbbf24" stroke="#fbbf24" stroke-width="2" />
        <line x1="60" y1="10" x2="60" y2="30" stroke="#fbbf24" stroke-width="3" />
        <path d="M 45,5 L 37,-3 M 52,2 L 44,-6" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `
  },
  "saltwater": {
    name: "Saltwater Beaker",
    classText: "Class 8",
    type: "conductor",
    typeLabel: "Liquid Conductor",
    emoji: "🧪",
    howItWorks: "Dissolved table salt ($NaCl$) breaks down into positively charged sodium ($Na^+$) and negatively charged chlorine ($Cl^-$) ions, which act as mobile charge carriers, allowing current to conduct through a fluid.",
    realWorldUse: "Electrochemical processing, battery chemical cells, and ocean sensor instruments.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="35" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="65" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <rect x="35" y="5" width="30" height="30" rx="3" fill="none" stroke="#10b981" stroke-width="2.5" />
        <line x1="42" y1="10" x2="42" y2="25" stroke="#94a3b8" stroke-width="3" />
        <line x1="58" y1="10" x2="58" y2="25" stroke="#94a3b8" stroke-width="3" />
        <text x="50" y="32" fill="#10b981" font-size="7" text-anchor="middle">NaCl</text>
      </svg>
    `
  },
  "resistor": {
    name: "Resistor",
    classText: "Class 10",
    type: "load",
    typeLabel: "Current Limiter",
    emoji: "🛹",
    howItWorks: "A component designed to resist the flow of electrical current, lowering voltage drop and reducing current according to Ohm's Law ($R = V / I$). Use it to prevent components like LEDs from receiving too much current.",
    realWorldUse: "Dividing voltages, pulling signal lines up/down, and protecting fragile microchips.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="25" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="75" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <path d="M 25,20 L 30,10 L 38,30 L 46,10 L 54,30 L 62,10 L 70,30 L 75,20" fill="none" stroke="#fbbf24" stroke-width="3" />
      </svg>
    `
  },
  "ammeter": {
    name: "Ammeter",
    classText: "Class 10",
    type: "meter",
    typeLabel: "Current Meter",
    emoji: "⏱️",
    howItWorks: "Measures the rate of electric current in Amperes. To ensure accuracy without reducing the flow of current, it must be connected in SERIES with the circuit path and has nearly zero internal resistance.",
    realWorldUse: "Diagnosing current drain on automobile batteries and checking electric motor power draws.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="35" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="65" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <circle cx="50" cy="20" r="15" fill="none" stroke="#06b6d4" stroke-width="3" />
        <text x="50" y="24" fill="#06b6d4" font-family="'Orbitron', sans-serif" font-weight="bold" font-size="13" text-anchor="middle">A</text>
      </svg>
    `
  },
  "voltmeter": {
    name: "Voltmeter",
    classText: "Class 10",
    type: "meter",
    typeLabel: "Voltage Meter",
    emoji: "Compass",
    emoji: "🧭",
    howItWorks: "Measures the potential difference between two points in volts. It must be connected in PARALLEL across the target load. It features near-infinite internal resistance to prevent any current from diverting into it.",
    realWorldUse: "Inspecting electrical outlets, checking battery charge levels, and diagnostic grid validation.",
    symbolSvg: `
      <svg class="diagram-symbol-svg" viewBox="0 0 100 40">
        <line x1="0" y1="20" x2="35" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <line x1="65" y1="20" x2="100" y2="20" stroke="#cbd5e1" stroke-width="3" />
        <circle cx="50" cy="20" r="15" fill="none" stroke="#8b5cf6" stroke-width="3" />
        <text x="50" y="24" fill="#8b5cf6" font-family="'Orbitron', sans-serif" font-weight="bold" font-size="13" text-anchor="middle">V</text>
      </svg>
    `
  }
};

// --- DYNAMIC RENDERING CONTROLLER ---
class HubController {
  constructor() {
    this.learningGrid = document.getElementById("learning-grid");
    
    // Cache Modal Backdrop and control buttons
    this.backdrop = document.getElementById("modal-backdrop");
    this.closeBtn = document.getElementById("modal-close-btn");
    this.actionCloseBtn = document.getElementById("modal-action-close-btn");
    
    // Cache Modal fields for target data injection
    this.modalTitle = document.getElementById("modal-component-name");
    this.modalIcon = document.getElementById("modal-component-icon");
    this.modalGrade = document.getElementById("modal-component-grade");
    this.modalTypeBadge = document.getElementById("modal-component-type-badge");
    this.modalHowText = document.getElementById("modal-component-how");
    this.modalUseText = document.getElementById("modal-component-use");
    this.modalSvgWrap = document.getElementById("modal-schematic-svg-wrap");

    // Connect close callbacks
    this.closeBtn.addEventListener("click", () => this.closeModal());
    this.actionCloseBtn.addEventListener("click", () => this.closeModal());
    
    // Close modal if user clicks outside the modal card box on the backdrop
    this.backdrop.addEventListener("click", (e) => {
      if (e.target === this.backdrop) {
        this.closeModal();
      }
    });

    // Keyboard navigation accessibility: close modal on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.backdrop.classList.contains("show")) {
        this.closeModal();
      }
    });

    this.init();
  }

  // Populate component grid cards dynamically
  init() {
    this.learningGrid.innerHTML = "";
    
    // Build and append cards for each database component
    Object.keys(COMPONENT_DATABASE).forEach(key => {
      const comp = COMPONENT_DATABASE[key];
      const card = document.createElement("div");
      
      // Categorize border color class based on type
      card.className = `syllabus-card card-${comp.type}`;
      
      // Inject database key to fetch values in event listener
      card.dataset.componentKey = key;
      
      card.innerHTML = `
        <div class="card-top-row">
          <span class="card-class-badge">${comp.classText}</span>
          <span class="card-type type-${comp.type}">${comp.typeLabel}</span>
        </div>
        <div class="card-icon-wrap">${comp.emoji}</div>
        <h3 class="card-title">${comp.name}</h3>
      `;

      // Open Modal details when clicking card
      card.addEventListener("click", () => this.openModal(key));
      
      this.learningGrid.appendChild(card);
    });
  }

  // Retrieve data from registry and inject into active DOM elements
  openModal(key) {
    const comp = COMPONENT_DATABASE[key];
    if (!comp) return;

    // Inject database content
    this.modalTitle.innerText = comp.name;
    this.modalIcon.innerText = comp.emoji;
    this.modalGrade.innerText = comp.classText;
    this.modalTypeBadge.innerText = comp.typeLabel;
    this.modalTypeBadge.className = `card-class-badge type-${comp.type}`;
    
    this.modalHowText.innerText = comp.howItWorks;
    this.modalUseText.innerText = comp.realWorldUse;
    
    // Inject custom schematic symbol vector
    this.modalSvgWrap.innerHTML = comp.symbolSvg;

    // Add CSS show transitions
    this.backdrop.classList.add("show");
    
    // Set focus on close button for keyboard layout controls
    this.closeBtn.focus();
  }

  // Hide the active modal dialog box
  closeModal() {
    this.backdrop.classList.remove("show");
  }
}

// Initialise controller when page DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new HubController();
});
