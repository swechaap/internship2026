/**
 * ==========================================================================
 * VOLTACADEMY 2D CIRCUIT SANDBOX - GAME ENGINE & SIMULATOR LOGIC
 * ==========================================================================
 * This file coordinates the interactive circuit loop.
 * It manages:
 * - Dynamic slot positions (4, 6, 8 slots) inside absolute coordinates.
 * - Selecting and placing components from inventory grid.
 * - Dynamic series circuit resistance calculations and ammeter/voltmeter readings.
 * - safety blow logic on fuse.
 * - Interactive step-by-step tutorial state machine.
 */

// --- CURRICULUM COMPONENT SPECIFICATION REGISTRY ---
const COMPONENT_DATA = {
  "battery": {
    id: "battery",
    name: "1.5V Battery",
    type: "power",
    grade: "Class 6",
    desc: "Provides the electrical push (voltage) that drives electric charges through the circuit.",
    resistance: 0.1,
    voltage: 1.5,
    behavior: "Provides electrical potential to create current flow.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 90,50" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round" />
        <rect x="25" y="32" width="45" height="36" rx="4" fill="#334155" stroke="#f1f5f9" stroke-width="3" />
        <rect x="25" y="32" width="12" height="36" rx="2" fill="#d97706" />
        <rect x="70" y="44" width="6" height="12" rx="2" fill="#f1f5f9" />
        <text x="31" y="54" fill="#f8fafc" font-size="10" font-family="'Orbitron', sans-serif" font-weight="bold">+</text>
        <text x="58" y="54" fill="#f8fafc" font-size="10" font-family="'Orbitron', sans-serif" font-weight="bold">-</text>
        <text x="39" y="52" fill="#94a3b8" font-size="7" font-family="sans-serif">1.5V</text>
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const rotate = (orientation === "left" || orientation === "right") ? 90 : 0;
      return `
        <svg viewBox="0 0 100 100" style="transform: rotate(${rotate}deg);">
          <path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="8" stroke-linecap="round" />
          <rect x="25" y="30" width="45" height="40" rx="6" fill="#1e293b" stroke="#f8fafc" stroke-width="4" />
          <rect x="25" y="30" width="15" height="40" rx="3" fill="#ea580c" />
          <rect x="70" y="43" width="7" height="14" rx="2" fill="#f8fafc" />
          <text x="32" y="55" fill="#f8fafc" font-size="12" font-family="'Orbitron', sans-serif" font-weight="bold" text-anchor="middle">+</text>
          <text x="58" y="55" fill="#f8fafc" font-size="12" font-family="'Orbitron', sans-serif" font-weight="bold" text-anchor="middle">-</text>
          <text x="45" y="53" fill="#64748b" font-size="7" font-family="'Orbitron', sans-serif" text-anchor="middle">1.5V</text>
        </svg>
      `;
    }
  },
  "bulb": {
    id: "bulb",
    name: "Light Bulb",
    type: "load",
    grade: "Class 6",
    desc: "A common output device (load) that consumes electrical energy and transforms it into bright light.",
    resistance: 2.5,
    behavior: "Glows yellow when current is flowing through the closed loop.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 90,50" stroke="#cbd5e1" stroke-width="6" />
        <rect x="40" y="50" width="20" height="14" rx="2" fill="#64748b" />
        <line x1="42" y1="55" x2="58" y2="55" stroke="#475569" stroke-width="2" />
        <line x1="44" y1="60" x2="56" y2="60" stroke="#475569" stroke-width="2" />
        <circle cx="50" cy="40" r="18" fill="rgba(255,255,255,0.05)" stroke="#f1f5f9" stroke-width="3" />
        <path d="M 44,45 L 48,34 L 52,34 L 56,45" fill="none" stroke="#e2e8f0" stroke-width="2" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      return `
        <svg viewBox="0 0 100 100">
          ${orientation === "left" || orientation === "right" 
            ? '<path d="M 50,0 L 50,100" stroke="#b45309" stroke-width="8" />' 
            : '<path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="8" />'
          }
          <circle cx="50" cy="45" r="28" fill="url(#bulb-glow-grad)" class="glow-active light-bulb-glow-halo" style="opacity:0;" />
          <rect x="40" y="56" width="20" height="14" rx="2" fill="#475569" stroke="#334155" stroke-width="2" />
          <line x1="40" y1="61" x2="60" y2="61" stroke="#334155" stroke-width="2" />
          <line x1="42" y1="66" x2="58" y2="66" stroke="#334155" stroke-width="2" />
          <path d="M 44,56 L 47,42 L 53,42 L 56,56" fill="none" stroke="#94a3b8" stroke-width="2.5" />
          <path d="M 47,42 Q 50,34 53,42" fill="none" stroke="#94a3b8" stroke-width="2" class="glow-active light-bulb-rays" style="stroke:#94a3b8;" />
          <circle cx="50" cy="42" r="20" fill="rgba(255, 255, 255, 0.05)" stroke="#f8fafc" stroke-width="3.5" class="glow-active light-bulb-glow" style="fill:rgba(255, 255, 255, 0.05);" />
          
          <g class="glow-active light-bulb-rays" style="opacity:0; stroke:#eab308; stroke-width:2;">
            <line x1="50" y1="12" x2="50" y2="4" />
            <line x1="28" y1="21" x2="22" y2="15" />
            <line x1="20" y1="42" x2="12" y2="42" />
            <line x1="72" y1="21" x2="78" y2="15" />
            <line x1="80" y1="42" x2="88" y2="42" />
          </g>
          <defs>
            <radialGradient id="bulb-glow-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      `;
    }
  },
  "wire": {
    id: "wire",
    name: "Wire",
    type: "conductor",
    grade: "Class 6",
    desc: "A solid metallic path (usually copper) that offers very low resistance to the flow of electric current.",
    resistance: 0.1,
    behavior: "Acts as a simple conductor to close a loop segment.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 90,50" stroke="#b45309" stroke-width="10" stroke-linecap="round" />
        <path d="M 10,50 L 90,50" stroke="#ea580c" stroke-width="4" stroke-linecap="round" />
        <circle cx="15" cy="50" r="6" fill="#cbd5e1" />
        <circle cx="85" cy="50" r="6" fill="#cbd5e1" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const rotate = (orientation === "left" || orientation === "right") ? 90 : 0;
      return `
        <svg viewBox="0 0 100 100" style="transform: rotate(${rotate}deg);">
          <path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="12" stroke-linecap="round" />
          <path d="M 0,50 L 100,50" stroke="#f97316" stroke-width="4" stroke-linecap="round" />
          <circle cx="12" cy="50" r="7" fill="#f8fafc" stroke="#475569" stroke-width="2" />
          <circle cx="88" cy="50" r="7" fill="#f8fafc" stroke="#475569" stroke-width="2" />
        </svg>
      `;
    }
  },
  "switch-open": {
    id: "switch-open",
    name: "Switch (Open)",
    type: "insulator",
    grade: "Class 6",
    desc: "An open control device that breaks the continuous path, stopping the flow of electricity.",
    resistance: Infinity,
    behavior: "Acts as a break in the circuit. Prevents current from flowing.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 35,50" stroke="#cbd5e1" stroke-width="6" />
        <path d="M 65,50 L 90,50" stroke="#cbd5e1" stroke-width="6" />
        <circle cx="35" cy="50" r="6" fill="#64748b" />
        <circle cx="65" cy="50" r="6" fill="#64748b" />
        <line x1="35" y1="50" x2="60" y2="25" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const rotate = (orientation === "left" || orientation === "right") ? 90 : 0;
      return `
        <svg viewBox="0 0 100 100" style="transform: rotate(${rotate}deg);">
          <path d="M 0,50 L 30,50" stroke="#b45309" stroke-width="8" />
          <path d="M 70,50 L 100,50" stroke="#b45309" stroke-width="8" />
          <circle cx="30" cy="50" r="7" fill="#94a3b8" stroke="#334155" stroke-width="2" />
          <circle cx="70" cy="50" r="7" fill="#94a3b8" stroke="#334155" stroke-width="2" />
          <line x1="30" y1="50" x2="62" y2="20" stroke="#f8fafc" stroke-width="8" stroke-linecap="round" />
        </svg>
      `;
    }
  },
  "switch-closed": {
    id: "switch-closed",
    name: "Switch (Closed)",
    type: "conductor",
    grade: "Class 6",
    desc: "A closed control device that creates a continuous path, allowing current to flow freely.",
    resistance: 0.1,
    behavior: "Completes the circuit path. Behaves like a conductor wire.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 30,50" stroke="#cbd5e1" stroke-width="6" />
        <path d="M 70,50 L 90,50" stroke="#cbd5e1" stroke-width="6" />
        <circle cx="30" cy="50" r="6" fill="#64748b" />
        <circle cx="70" cy="50" r="6" fill="#64748b" />
        <line x1="30" y1="50" x2="70" y2="50" stroke="#cbd5e1" stroke-width="6" stroke-linecap="round" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const rotate = (orientation === "left" || orientation === "right") ? 90 : 0;
      return `
        <svg viewBox="0 0 100 100" style="transform: rotate(${rotate}deg);">
          <path d="M 0,50 L 30,50" stroke="#b45309" stroke-width="8" />
          <path d="M 70,50 L 100,50" stroke="#b45309" stroke-width="8" />
          <circle cx="30" cy="50" r="7" fill="#94a3b8" stroke="#334155" stroke-width="2" />
          <circle cx="70" cy="50" r="7" fill="#94a3b8" stroke="#334155" stroke-width="2" />
          <line x1="30" y1="50" x2="70" y2="50" stroke="#f8fafc" stroke-width="8" stroke-linecap="round" />
        </svg>
      `;
    }
  },
  "eraser": {
    id: "eraser",
    name: "Rubber Eraser",
    type: "insulator",
    grade: "Class 6",
    desc: "An insulating object that prevents the movement of electric charges because it has high resistance.",
    resistance: Infinity,
    behavior: "Acts as a total barrier to electricity, creating an open circuit.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 90,50" stroke="#cbd5e1" stroke-width="4" stroke-dasharray="4 4" />
        <g transform="translate(10, -5) rotate(15, 50, 50)">
          <rect x="25" y="38" width="30" height="24" rx="2" fill="#f43f5e" />
          <rect x="55" y="38" width="20" height="24" rx="2" fill="#3b82f6" />
          <rect x="48" y="36" width="10" height="28" fill="#f8fafc" opacity="0.9" />
        </g>
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const rotate = (orientation === "left" || orientation === "right") ? 90 : 0;
      return `
        <svg viewBox="0 0 100 100" style="transform: rotate(${rotate}deg);">
          <path d="M 0,50 L 25,50" stroke="#475569" stroke-width="8" stroke-dasharray="4 4" />
          <path d="M 75,50 L 100,50" stroke="#475569" stroke-width="8" stroke-dasharray="4 4" />
          <circle cx="25" cy="50" r="5" fill="#475569" />
          <circle cx="75" cy="50" r="5" fill="#475569" />
          <g transform="translate(0, 0) rotate(10, 50, 50)">
            <rect x="25" y="36" width="30" height="28" rx="3" fill="#ec4899" stroke="#be185d" stroke-width="2" />
            <rect x="55" y="36" width="20" height="28" rx="3" fill="#2563eb" stroke="#1d4ed8" stroke-width="2" />
            <rect x="48" y="34" width="10" height="32" fill="#ffffff" />
          </g>
        </svg>
      `;
    }
  },
  "heater": {
    id: "heater",
    name: "Heating Coil",
    type: "load",
    grade: "Class 7",
    desc: "A high-resistance wire loop that converts electrical energy directly into heat through resistance.",
    resistance: 1.8,
    behavior: "Glows bright red/orange and releases hot air waves when active.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 25,50" stroke="#cbd5e1" stroke-width="6" />
        <path d="M 75,50 L 90,50" stroke="#cbd5e1" stroke-width="6" />
        <path d="M 25,50 C 28,30 32,30 35,50 C 38,70 42,70 45,50 C 48,30 52,30 55,50 C 58,70 62,70 65,50 C 68,30 72,30 75,50" 
              fill="none" stroke="#94a3b8" stroke-width="4" stroke-linecap="round" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      return `
        <svg viewBox="0 0 100 100">
          ${orientation === "left" || orientation === "right" 
            ? '<path d="M 50,0 L 50,100" stroke="#b45309" stroke-width="8" />' 
            : '<path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="8" />'
          }
          <rect x="22" y="24" width="56" height="52" rx="6" fill="#111827" stroke="#374151" stroke-width="3" />
          <path d="M 30,50 Q 35,38 40,50 Q 45,62 50,50 Q 55,38 60,50 Q 65,62 70,50" 
                fill="none" stroke="#64748b" stroke-width="5" stroke-linecap="round" class="glow-active heating-coil-wire" />
          <g class="glow-active heat-wave" style="opacity:0; fill:none; stroke:#f97316; stroke-width:1.5;">
            <path d="M 35,20 Q 38,15 35,10" />
            <path d="M 50,18 Q 53,13 50,8" />
            <path d="M 65,20 Q 68,15 65,10" />
          </g>
        </svg>
      `;
    }
  },
  "fuse": {
    id: "fuse",
    name: "Fuse",
    type: "conductor",
    grade: "Class 7",
    desc: "A protective safety device containing a thin wire designed to melt and open the circuit if current exceeds 2.0 A.",
    resistance: 0.1,
    behavior: "Acts as a conductor. If current exceeds 2.0 A, it breaks permanently.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 90,50" stroke="#cbd5e1" stroke-width="6" />
        <rect x="25" y="38" width="50" height="24" rx="2" fill="rgba(255,255,255,0.08)" stroke="#cbd5e1" stroke-width="2" />
        <rect x="25" y="38" width="10" height="24" fill="#94a3b8" />
        <rect x="65" y="38" width="10" height="24" fill="#94a3b8" />
        <line x1="35" y1="50" x2="65" y2="50" stroke="#cbd5e1" stroke-width="1.5" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const rotate = (orientation === "left" || orientation === "right") ? 90 : 0;
      const blownClass = (state && state.blown) ? "fuse-blown" : "";
      return `
        <svg viewBox="0 0 100 100" class="${blownClass}" style="transform: rotate(${rotate}deg);">
          <path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="8" />
          <rect x="20" y="35" width="60" height="30" rx="4" fill="rgba(255,255,255,0.08)" stroke="#94a3b8" stroke-width="3" class="fuse-glass" />
          <rect x="20" y="35" width="12" height="30" fill="#cbd5e1" class="fuse-cap" />
          <rect x="68" y="35" width="12" height="30" fill="#cbd5e1" class="fuse-cap" />
          <line x1="32" y1="50" x2="68" y2="50" stroke="#f8fafc" stroke-width="2" class="normal-fuse-wire" />
          <g class="blown-fuse-wire">
            <path d="M 32,50 L 46,49 M 54,51 L 68,50" stroke="#ef4444" stroke-width="2" />
            <circle cx="50" cy="50" r="3" fill="#ef4444" />
          </g>
          <circle cx="50" cy="50" r="10" fill="url(#spark-grad)" class="fuse-spark" style="display:none;" />
          <defs>
            <radialGradient id="spark-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#facc15" stop-opacity="1"/>
              <stop offset="60%" stop-color="#ef4444" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#ef4444" stop-opacity="0"/>
            </radialGradient>
          </defs>
        </svg>
      `;
    }
  },
  "led": {
    id: "led",
    name: "LED (Load)",
    type: "load",
    grade: "Class 8",
    desc: "Light Emitting Diode: A modern semiconductor load that emits green light efficiently when current passes.",
    resistance: 1.2,
    behavior: "Glows a bright emerald green when current is flowing through the closed loop.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 90,50" stroke="#cbd5e1" stroke-width="6" />
        <rect x="42" y="30" width="16" height="32" rx="4" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2" />
        <line x1="46" y1="44" x2="46" y2="58" stroke="#cbd5e1" stroke-width="2" />
        <path d="M 50,44 L 54,40 L 54,58" fill="none" stroke="#cbd5e1" stroke-width="2" />
        <rect x="40" y="60" width="20" height="4" fill="#cbd5e1" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      return `
        <svg viewBox="0 0 100 100">
          ${orientation === "left" || orientation === "right" 
            ? '<path d="M 50,0 L 50,100" stroke="#b45309" stroke-width="8" />' 
            : '<path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="8" />'
          }
          <polygon points="50,45 20,10 80,10" fill="url(#led-beam-grad)" class="glow-active led-beam" style="opacity:0;" />
          <rect x="36" y="58" width="28" height="6" rx="1" fill="#475569" stroke="#334155" stroke-width="1.5" />
          <line x1="45" y1="58" x2="45" y2="70" stroke="#94a3b8" stroke-width="2.5" />
          <line x1="55" y1="58" x2="55" y2="70" stroke="#94a3b8" stroke-width="2.5" />
          <path d="M 38,58 L 38,40 A 12,12 0 0,1 62,40 L 62,58 Z" fill="rgba(16, 185, 129, 0.15)" stroke="#10b981" stroke-width="3.5" class="glow-active led-glow" />
          <path d="M 45,58 L 45,46 L 49,42 L 52,48 L 55,48 L 55,58" fill="none" stroke="#34d399" stroke-width="1.5" opacity="0.6" />
        </svg>
      `;
    }
  },
  "saltwater": {
    id: "saltwater",
    name: "Beaker of Saltwater",
    type: "conductor",
    grade: "Class 8",
    desc: "A liquid electrolyte solution containing free Na+ and Cl- ions that allow electric current to pass.",
    resistance: 0.8,
    behavior: "Acts as a conductor. Active current triggers visible chemical electrolysis (gas bubbles).",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 90,50" stroke="#cbd5e1" stroke-width="4" stroke-dasharray="4 4" />
        <rect x="30" y="30" width="40" height="42" rx="2" fill="none" stroke="#cbd5e1" stroke-width="3" />
        <rect x="32" y="44" width="36" height="26" fill="rgba(59, 130, 246, 0.25)" />
        <line x1="42" y1="24" x2="42" y2="48" stroke="#94a3b8" stroke-width="2" />
        <line x1="58" y1="24" x2="58" y2="48" stroke="#94a3b8" stroke-width="2" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      return `
        <svg viewBox="0 0 100 100">
          ${orientation === "left" || orientation === "right"
            ? `
              <path d="M 50,0 L 50,22" stroke="#b45309" stroke-width="8" />
              <path d="M 50,78 L 50,100" stroke="#b45309" stroke-width="8" />
              <path d="M 50,22 L 40,22" stroke="#b45309" stroke-width="8" />
              <path d="M 50,78 L 60,78" stroke="#b45309" stroke-width="8" />
            `
            : `
              <path d="M 0,50 L 38,50" stroke="#b45309" stroke-width="8" />
              <path d="M 62,50 L 100,50" stroke="#b45309" stroke-width="8" />
            `
          }
          <path d="M 32,25 L 32,75 A 3,3 0 0,0 35,78 L 65,78 A 3,3 0 0,0 68,75 L 68,25" fill="none" stroke="#f8fafc" stroke-width="3.5" />
          <rect x="30" y="22" width="40" height="3" fill="#f8fafc" rx="1.5" />
          <path d="M 34,44 L 34,74 A 2,2 0 0,0 36,76 L 64,76 A 2,2 0 0,0 66,74 L 66,44 Z" fill="rgba(59, 130, 246, 0.35)" />
          <line x1="42" y1="18" x2="42" y2="54" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
          <line x1="58" y1="18" x2="58" y2="54" stroke="#94a3b8" stroke-width="3" stroke-linecap="round" />
          <g class="ion-charge ion-charge-pos">
            <circle cx="39" cy="62" r="4" fill="#3b82f6" opacity="0.8" />
            <text x="39" y="65" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">+</text>
          </g>
          <g class="ion-charge ion-charge-neg">
            <circle cx="61" cy="66" r="4" fill="#10b981" opacity="0.8" />
            <text x="61" y="68" fill="#ffffff" font-size="8" font-weight="bold" text-anchor="middle">-</text>
          </g>
          <g class="beaker-bubbles">
            <circle cx="42" cy="46" r="1.5" fill="#ffffff" opacity="0" class="beaker-bubble" />
            <circle cx="43" cy="38" r="1" fill="#ffffff" opacity="0" class="beaker-bubble beaker-bubble-2" />
            <circle cx="58" cy="42" r="1.5" fill="#ffffff" opacity="0" class="beaker-bubble" />
            <circle cx="57" cy="48" r="1" fill="#ffffff" opacity="0" class="beaker-bubble beaker-bubble-2" />
          </g>
        </svg>
      `;
    }
  },
  "resistor": {
    id: "resistor",
    name: "Resistor",
    type: "load",
    grade: "Class 10",
    desc: "An electrical load that actively resists the flow of charges to drop the current according to Ohm's Law.",
    resistance: 8.0,
    behavior: "Restricts current flow, lowering Ammeter readings and bulb brightness.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <path d="M 10,50 L 90,50" stroke="#cbd5e1" stroke-width="6" />
        <rect x="28" y="38" width="44" height="24" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
        <rect x="36" y="38" width="4" height="24" fill="#854d0e" />
        <rect x="44" y="38" width="4" height="24" fill="#000000" />
        <rect x="52" y="38" width="4" height="24" fill="#b45309" />
        <rect x="60" y="38" width="4" height="24" fill="#ca8a04" />
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const rotate = (orientation === "left" || orientation === "right") ? 90 : 0;
      return `
        <svg viewBox="0 0 100 100" style="transform: rotate(${rotate}deg);">
          <path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="8" />
          <rect x="22" y="34" width="56" height="32" rx="8" fill="#d1d5db" stroke="#4b5563" stroke-width="3" />
          <rect x="32" y="34" width="5" height="32" fill="#7c2d12" />
          <rect x="42" y="34" width="5" height="32" fill="#000000" />
          <rect x="52" y="34" width="5" height="32" fill="#c2410c" />
          <rect x="62" y="34" width="5" height="32" fill="#b45309" />
        </svg>
      `;
    }
  },
  "ammeter": {
    id: "ammeter",
    name: "Ammeter",
    type: "meter",
    grade: "Class 10",
    desc: "A device with very low resistance (0.05 Ω) that measures the rate of flow of current in amperes, placed in series.",
    resistance: 0.05,
    behavior: "Displays the active current flowing through the loop in real-time.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <rect x="25" y="25" width="50" height="50" rx="6" fill="#1e293b" stroke="#0891b2" stroke-width="2" />
        <rect x="33" y="33" width="34" height="16" fill="#020617" rx="2" />
        <text x="50" y="45" fill="#10b981" font-size="9" font-family="'Orbitron', sans-serif" text-anchor="middle">0.00</text>
        <text x="50" y="65" fill="#f8fafc" font-size="12" font-family="'Orbitron', sans-serif" font-weight="bold" text-anchor="middle">A</text>
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const currentText = (state && state.currentVal !== undefined) ? state.currentVal.toFixed(2) + " A" : "0.00 A";
      const screenOffClass = (state && state.active) ? "" : "off";
      return `
        <svg viewBox="0 0 100 100">
          ${orientation === "left" || orientation === "right" 
            ? '<path d="M 50,0 L 50,100" stroke="#b45309" stroke-width="8" />' 
            : '<path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="8" />'
          }
          <rect x="20" y="20" width="60" height="60" rx="8" fill="#1e293b" stroke="#0891b2" stroke-width="3" />
          <rect x="28" y="28" width="44" height="20" fill="#040711" rx="4" stroke="#334155" stroke-width="1.5" />
          <text x="50" y="43" class="meter-text ${screenOffClass}" text-anchor="middle">${currentText}</text>
          <circle cx="50" cy="65" r="10" fill="#0f172a" stroke="#0891b2" stroke-width="1.5" />
          <text x="50" y="69" fill="#0891b2" font-size="10" font-family="'Orbitron', sans-serif" font-weight="bold" text-anchor="middle">A</text>
          <circle cx="34" cy="65" r="3" fill="#ef4444" />
          <circle cx="66" cy="65" r="3" fill="#000000" />
        </svg>
      `;
    }
  },
  "voltmeter": {
    id: "voltmeter",
    name: "Voltmeter",
    type: "meter",
    grade: "Class 10",
    desc: "A device with massive resistance (10 MΩ). In series, it acts as an open loop, reading the total source voltage.",
    resistance: 10000000,
    behavior: "Blocks active current flow (open circuit). Displays source voltage across its terminals.",
    inventorySvg: `
      <svg viewBox="0 0 100 100">
        <rect x="25" y="25" width="50" height="50" rx="6" fill="#1e293b" stroke="#8b5cf6" stroke-width="2" />
        <rect x="33" y="33" width="34" height="16" fill="#020617" rx="2" />
        <text x="50" y="45" fill="#10b981" font-size="9" font-family="'Orbitron', sans-serif" text-anchor="middle">0.00</text>
        <text x="50" y="65" fill="#f8fafc" font-size="12" font-family="'Orbitron', sans-serif" font-weight="bold" text-anchor="middle">V</text>
      </svg>
    `,
    slotSvg: (orientation, state) => {
      const voltText = (state && state.voltVal !== undefined) ? state.voltVal.toFixed(2) + " V" : "0.00 V";
      const screenOffClass = (state && state.active) ? "" : "off";
      return `
        <svg viewBox="0 0 100 100">
          ${orientation === "left" || orientation === "right" 
            ? '<path d="M 50,0 L 50,100" stroke="#b45309" stroke-width="8" />' 
            : '<path d="M 0,50 L 100,50" stroke="#b45309" stroke-width="8" />'
          }
          <rect x="20" y="20" width="60" height="60" rx="8" fill="#1e293b" stroke="#8b5cf6" stroke-width="3" />
          <rect x="28" y="28" width="44" height="20" fill="#040711" rx="4" stroke="#334155" stroke-width="1.5" />
          <text x="50" y="43" class="meter-text ${screenOffClass}" text-anchor="middle">${voltText}</text>
          <circle cx="50" cy="65" r="10" fill="#0f172a" stroke="#8b5cf6" stroke-width="1.5" />
          <text x="50" y="69" fill="#8b5cf6" font-size="10" font-family="'Orbitron', sans-serif" font-weight="bold" text-anchor="middle">V</text>
          <circle cx="34" cy="65" r="3" fill="#ef4444" />
          <circle cx="66" cy="65" r="3" fill="#000000" />
        </svg>
      `;
    }
  }
};

// Syllabus categories mapping component lists
const SYLLABUS = {
  "Class 6": ["battery", "bulb", "wire", "switch-open", "switch-closed", "eraser"],
  "Class 7": ["battery", "bulb", "wire", "switch-open", "switch-closed", "eraser", "heater", "fuse"],
  "Class 8": ["battery", "bulb", "wire", "switch-open", "switch-closed", "eraser", "heater", "fuse", "led", "saltwater"],
  "Class 10": ["battery", "bulb", "wire", "switch-open", "switch-closed", "eraser", "heater", "fuse", "led", "saltwater", "resistor", "ammeter", "voltmeter"]
};

// SLOT POSITION LAYOUTS (relative to 480x480 circuit board container)
const SLOT_LAYOUTS = {
  4: [
    { name: "Slot A", x: 187, y: 20, orientation: "horizontal" },
    { name: "Slot B", x: 354, y: 187, orientation: "vertical" },
    { name: "Slot C", x: 187, y: 354, orientation: "horizontal" },
    { name: "Slot D", x: 20, y: 187, orientation: "vertical" }
  ],
  6: [
    { name: "Slot A", x: 107, y: 20, orientation: "horizontal" },
    { name: "Slot B", x: 267, y: 20, orientation: "horizontal" },
    { name: "Slot C", x: 354, y: 187, orientation: "vertical" },
    { name: "Slot D", x: 267, y: 354, orientation: "horizontal" },
    { name: "Slot E", x: 107, y: 354, orientation: "horizontal" },
    { name: "Slot F", x: 20, y: 187, orientation: "vertical" }
  ],
  8: [
    { name: "Slot A", x: 107, y: 20, orientation: "horizontal" },
    { name: "Slot B", x: 267, y: 20, orientation: "horizontal" },
    { name: "Slot C", x: 354, y: 107, orientation: "vertical" },
    { name: "Slot D", x: 354, y: 267, orientation: "vertical" },
    { name: "Slot E", x: 267, y: 354, orientation: "horizontal" },
    { name: "Slot F", x: 107, y: 354, orientation: "horizontal" },
    { name: "Slot G", x: 20, y: 267, orientation: "vertical" },
    { name: "Slot H", x: 20, y: 107, orientation: "vertical" }
  ]
};

// --- GAME ENGINE CLASS ---
class CircuitSandbox {
  constructor() {
    this.selectedGrade = "Class 6";
    this.selectedComponentId = null;
    
    // Dynamic slots config
    this.activeSlotCount = 4;
    this.slots = Array(this.activeSlotCount).fill(null);
    this.slotStates = Array(this.activeSlotCount).fill().map(() => ({}));

    this.circuitFlowing = false;

    // Guided tutorial state-machine values
    this.tutorialActive = false;
    this.tutorialStep = 1;

    // Cache core controls
    this.gradeSelect = document.getElementById("grade-select");
    this.inventoryGrid = document.getElementById("inventory-grid");
    this.workspaceArea = document.getElementById("workspace-area");
    this.terminalText = document.getElementById("terminal-text");
    this.btnTest = document.getElementById("btn-test");
    this.btnReset = document.getElementById("btn-reset");
    
    // Cache slots container and slot counters
    this.slotsContainer = document.getElementById("slots-container");
    this.btnAddSlot = document.getElementById("btn-add-slot");
    this.btnRemoveSlot = document.getElementById("btn-remove-slot");
    this.btnStartTutorial = document.getElementById("btn-start-tutorial");
    
    this.tutorialOverlay = document.getElementById("tutorial-overlay");
    this.tutorialStepNum = document.getElementById("tutorial-step-num");
    this.tutorialStepText = document.getElementById("tutorial-step-text");
    this.tutorialProgressBar = document.getElementById("tutorial-progress-bar");
    this.btnSkipTutorial = document.getElementById("btn-skip-tutorial");

    // Info Brief panels
    this.briefEmpty = document.getElementById("brief-empty");
    this.briefContent = document.getElementById("brief-content");
    this.briefIcon = document.getElementById("brief-icon");
    this.briefTitle = document.getElementById("brief-title");
    this.briefGrade = document.getElementById("brief-grade");
    this.briefBadge = document.getElementById("brief-badge");
    this.briefDesc = document.getElementById("brief-desc");
    this.briefPropBehavior = document.getElementById("brief-prop-behavior");
    this.briefPropResistance = document.getElementById("brief-prop-resistance");
    this.briefPropExtraLabel = document.getElementById("brief-prop-extra-label");
    this.briefPropExtraValue = document.getElementById("brief-prop-extra-value");
    this.briefPropExtraContainer = document.getElementById("brief-prop-extra-container");

    // Bind event callbacks
    this.gradeSelect.addEventListener("change", (e) => this.selectGrade(e.target.value));
    this.btnTest.addEventListener("click", () => this.testCircuit());
    this.btnReset.addEventListener("click", () => this.resetWorkspace());
    
    // Slot manipulations
    this.btnAddSlot.addEventListener("click", () => this.adjustSlotCount(2));
    this.btnRemoveSlot.addEventListener("click", () => this.adjustSlotCount(-2));
    
    // Tutorial binds
    this.btnStartTutorial.addEventListener("click", () => this.startTutorial());
    this.btnSkipTutorial.addEventListener("click", () => this.endTutorial());

    this.init();
  }

  init() {
    this.renderInventory();
    this.updateWorkspace();
    this.logMessage("System initialized. Select a grade level and construct your circuit!");
  }

  // Outputs retro digital green/red warnings into terminal
  logMessage(text, type = "normal") {
    this.terminalText.innerText = text;
    this.terminalText.className = "terminal-output";
    if (type === "error") {
      this.terminalText.classList.add("error");
    } else if (type === "warning") {
      this.terminalText.classList.add("warning");
    }
  }

  // Expand or shrink loop (4, 6, 8 slots)
  adjustSlotCount(delta) {
    const newCount = this.activeSlotCount + delta;
    if (newCount < 4 || newCount > 8) {
      this.logMessage(`Slot count limits reached: 4 min, 8 max.`, "warning");
      return;
    }

    // Cancel current flows
    this.circuitFlowing = false;
    this.setFlowIntensity(0);
    this.workspaceArea.classList.remove("short-circuit-flash");

    if (delta > 0) {
      this.slots = [...this.slots, ...Array(delta).fill(null)];
      this.slotStates = [...this.slotStates, ...Array(delta).fill().map(() => ({}))];
    } else {
      this.slots = this.slots.slice(0, newCount);
      this.slotStates = this.slotStates.slice(0, newCount);
    }

    this.activeSlotCount = newCount;
    this.updateWorkspace();
    this.logMessage(`Circuit board updated to ${newCount} slots. Ready for testing.`);
  }

  selectGrade(grade) {
    this.selectedGrade = grade;
    this.selectedComponentId = null;
    this.renderInventory();
    this.updateBrief(null);
    this.logMessage(`Loaded syllabus: ${grade}. Updated Component inventory.`);
  }

  renderInventory() {
    this.inventoryGrid.innerHTML = "";
    const availableIds = SYLLABUS[this.selectedGrade];
    
    availableIds.forEach(id => {
      const comp = COMPONENT_DATA[id];
      const card = document.createElement("div");
      card.className = "component-card";
      card.dataset.id = id;
      if (this.selectedComponentId === id) {
        card.classList.add("selected");
      }
      
      let badgeClass = `badge-${comp.type}`;
      
      card.innerHTML = `
        <div class="component-card-icon">${comp.inventorySvg}</div>
        <div class="component-card-name">${comp.name}</div>
        <span class="component-card-badge ${badgeClass}">${comp.type}</span>
      `;
      
      card.addEventListener("click", () => this.selectInventoryComponent(id));
      this.inventoryGrid.appendChild(card);
    });

    if (this.tutorialActive) {
      this.updateTutorialVisuals();
    }
  }

  selectInventoryComponent(id) {
    this.selectedComponentId = id;
    
    const cards = this.inventoryGrid.querySelectorAll(".component-card");
    const availableIds = SYLLABUS[this.selectedGrade];
    const activeIndex = availableIds.indexOf(id);
    
    cards.forEach((card, idx) => {
      if (idx === activeIndex) {
        card.classList.add("selected");
      } else {
        card.classList.remove("selected");
      }
    });

    this.updateBrief(COMPONENT_DATA[id]);
    this.handleTutorialAction("select_component", id);
  }

  updateBrief(comp) {
    if (!comp) {
      this.briefEmpty.style.display = "flex";
      this.briefContent.style.display = "none";
      return;
    }

    this.briefEmpty.style.display = "none";
    this.briefContent.style.display = "flex";

    this.briefIcon.innerHTML = comp.inventorySvg;
    this.briefTitle.innerText = comp.name;
    this.briefGrade.innerText = comp.grade;
    
    this.briefBadge.className = `component-card-badge badge-${comp.type}`;
    this.briefBadge.innerText = comp.type;
    this.briefDesc.innerText = comp.desc;
    this.briefPropBehavior.innerText = comp.behavior;
    
    if (comp.resistance === Infinity) {
      this.briefPropResistance.innerText = "∞ Ω (Insulator)";
    } else {
      this.briefPropResistance.innerText = `${comp.resistance} Ω`;
    }

    if (comp.type === "power") {
      this.briefPropExtraContainer.style.display = "flex";
      this.briefPropExtraLabel.innerText = "Voltage:";
      this.briefPropExtraValue.innerText = `${comp.voltage} V`;
    } else {
      this.briefPropExtraContainer.style.display = "none";
    }
  }

  handleSlotClick(slotIndex, event) {
    if (event.target.classList.contains("slot-clear-btn")) {
      event.stopPropagation();
      this.removeComponentFromSlot(slotIndex);
      return;
    }

    const currentSlotItem = this.slots[slotIndex];

    if (currentSlotItem) {
      this.removeComponentFromSlot(slotIndex);
      this.updateBrief(null);
    } else {
      if (this.selectedComponentId) {
        this.slots[slotIndex] = this.selectedComponentId;
        this.slotStates[slotIndex] = {};
        this.updateWorkspace();
        
        const comp = COMPONENT_DATA[this.selectedComponentId];
        this.logMessage(`Placed ${comp.name} into Slot ${String.fromCharCode(65 + slotIndex)}.`);
        this.updateBrief(comp);
        this.handleTutorialAction("place_component", this.selectedComponentId);
      } else {
        this.logMessage("No component selected. Click a component in the inventory first!", "warning");
      }
    }
  }

  // Generates slots dynamically on the coordinate grid
  updateWorkspace() {
    const layout = SLOT_LAYOUTS[this.activeSlotCount];
    this.slotsContainer.innerHTML = "";
    
    for (let i = 0; i < this.activeSlotCount; i++) {
      const item = this.slots[i];
      const state = this.slotStates[i];
      const slotMeta = layout[i];

      const slotEl = document.createElement("div");
      slotEl.id = `slot-${i}`;
      slotEl.className = `circuit-slot slot-${slotMeta.orientation}`;
      slotEl.style.left = `${slotMeta.x}px`;
      slotEl.style.top = `${slotMeta.y}px`;
      slotEl.dataset.slotIndex = i;

      slotEl.addEventListener("click", (e) => this.handleSlotClick(i, e));

      if (item) {
        slotEl.classList.add("occupied");
        const comp = COMPONENT_DATA[item];
        
        const compWrap = document.createElement("div");
        compWrap.className = "placed-component";
        
        const graphicDiv = document.createElement("div");
        graphicDiv.className = "placed-component-graphic";
        graphicDiv.innerHTML = comp.slotSvg(slotMeta.orientation, state);
        compWrap.appendChild(graphicDiv);

        const labelSpan = document.createElement("span");
        labelSpan.className = "placed-component-name";
        labelSpan.innerText = comp.name;
        compWrap.appendChild(labelSpan);

        const clearBtn = document.createElement("button");
        clearBtn.className = "slot-clear-btn";
        clearBtn.innerText = "×";
        compWrap.appendChild(clearBtn);

        slotEl.appendChild(compWrap);
      } else {
        slotEl.innerHTML = `
          <div class="slot-placeholder">
            <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            <span>${slotMeta.name}</span>
          </div>
        `;
      }

      this.slotsContainer.appendChild(slotEl);
    }

    const boardSvg = this.workspaceArea.querySelector(".wire-loop-svg");
    if (this.circuitFlowing) {
      boardSvg.classList.add("flowing");
    } else {
      boardSvg.classList.remove("flowing");
    }

    this.updateTutorialVisuals();
  }

  removeComponentFromSlot(slotIndex) {
    const item = this.slots[slotIndex];
    if (item) {
      const comp = COMPONENT_DATA[item];
      this.slots[slotIndex] = null;
      this.slotStates[slotIndex] = {};
      this.circuitFlowing = false;
      this.setFlowIntensity(0);
      this.updateWorkspace();
      this.logMessage(`Removed ${comp.name} from Slot ${String.fromCharCode(65 + slotIndex)}.`);
    }
  }

  resetWorkspace() {
    this.slots = Array(this.activeSlotCount).fill(null);
    this.slotStates = Array(this.activeSlotCount).fill().map(() => ({}));
    this.circuitFlowing = false;
    this.setFlowIntensity(0);
    this.workspaceArea.classList.remove("short-circuit-flash");
    this.updateWorkspace();
    this.updateBrief(null);
    this.logMessage("Workspace reset. All slots cleared.");
  }

  // --- CORE PHYSICS CALCULATIONS & SIMULATION RULES ---
  testCircuit() {
    this.circuitFlowing = false;
    this.setFlowIntensity(0);
    this.workspaceArea.classList.remove("short-circuit-flash");
    this.updateWorkspace();

    const placedItems = [];
    let hasBattery = false;
    let hasLoad = false;
    let hasOpenSwitch = false;
    let hasInsulator = false;
    let hasEmptySlot = false;
    let hasFuse = false;
    let fuseIndex = -1;
    let hasVoltmeter = false;
    let voltmeterIndex = -1;
    let hasAmmeter = false;
    let ammeterIndex = -1;

    let totalVoltage = 0.0;
    let totalResistance = 0.0;

    for (let i = 0; i < this.activeSlotCount; i++) {
      const itemId = this.slots[i];
      if (!itemId) {
        hasEmptySlot = true;
        totalResistance = Infinity;
        continue;
      }

      const comp = COMPONENT_DATA[itemId];
      placedItems.push({ index: i, comp: comp });

      if (comp.type === "power") {
        hasBattery = true;
        totalVoltage += comp.voltage;
      }

      if (itemId === "switch-open") {
        hasOpenSwitch = true;
        totalResistance = Infinity;
      } else if (comp.type === "insulator") {
        hasInsulator = true;
        totalResistance = Infinity;
      } else if (itemId === "fuse") {
        hasFuse = true;
        fuseIndex = i;
        if (this.slotStates[i].blown) {
          totalResistance = Infinity;
        } else {
          totalResistance += comp.resistance;
        }
      } else if (itemId === "voltmeter") {
        hasVoltmeter = true;
        voltmeterIndex = i;
        totalResistance += comp.resistance;
      } else if (itemId === "ammeter") {
        hasAmmeter = true;
        ammeterIndex = i;
        totalResistance += comp.resistance;
      } else {
        totalResistance += comp.resistance;
        if (comp.type === "load") {
          hasLoad = true;
        }
      }
    }

    // RULE 0: Power check
    if (!hasBattery) {
      this.logMessage("Circuit Incomplete: No power source. You need a battery to create voltage.", "warning");
      this.updateWorkspaceMeters(0, 0);
      return;
    }

    // RULE 1: Open paths
    const isBrokenCircuit = hasEmptySlot || hasOpenSwitch || hasInsulator || (hasFuse && this.slotStates[fuseIndex].blown);
    if (isBrokenCircuit && !hasVoltmeter) {
      this.logMessage("Circuit Incomplete: Current cannot flow. Make sure there are no empty slots, open switches, or insulators.", "warning");
      this.updateWorkspaceMeters(0, 0);
      return;
    }

    // RULE 2: Series Voltmeter (measures battery voltage across open terminal)
    if (hasVoltmeter) {
      const calculatedVoltage = totalVoltage;
      this.circuitFlowing = false;
      this.slotStates[voltmeterIndex].active = true;
      this.slotStates[voltmeterIndex].voltVal = calculatedVoltage;
      
      if (hasAmmeter) {
        this.slotStates[ammeterIndex].active = true;
        this.slotStates[ammeterIndex].currentVal = 0.0;
      }

      this.updateWorkspace();
      this.logMessage(`Open Circuit (High Resistance Voltmeter): Voltmeter reads ${calculatedVoltage.toFixed(2)} V. Current is 0.00 A.`, "warning");
      return;
    }

    // Current draw
    const current = totalVoltage / totalResistance;

    // RULE 3: Short Circuit (Power source with no load)
    if (!hasLoad) {
      if (hasFuse && !this.slotStates[fuseIndex].blown) {
        if (current > 2.0) {
          this.slotStates[fuseIndex].blown = true;
          this.circuitFlowing = false;
          this.updateWorkspace();
          this.logMessage("Safety Triggered: Fuse blew! The short circuit drew too much current (exceeding 2.0 A), melting the fuse wire to protect the loop.", "error");
          return;
        }
      }

      this.circuitFlowing = true;
      this.setFlowIntensity(current);
      this.workspaceArea.classList.add("short-circuit-flash");
      this.updateWorkspace();
      
      if (hasAmmeter) {
        this.slotStates[ammeterIndex].active = true;
        this.slotStates[ammeterIndex].currentVal = current;
        this.updateWorkspace();
      }

      this.logMessage(`Danger: Short Circuit! Current is dangerously high (${current.toFixed(2)} A)! You need a load (like a bulb or resistor) to consume the energy.`, "error");
      return;
    }

    // RULE 4: Success normal loop check
    if (hasFuse && !this.slotStates[fuseIndex].blown && current > 2.0) {
      this.slotStates[fuseIndex].blown = true;
      this.circuitFlowing = false;
      this.updateWorkspace();
      this.logMessage(`Safety Triggered: Fuse blew! The current of ${current.toFixed(2)} A exceeded the 2.0 A limit.`, "error");
      return;
    }

    this.circuitFlowing = true;
    this.setFlowIntensity(current);
    
    if (hasAmmeter) {
      this.slotStates[ammeterIndex].active = true;
      this.slotStates[ammeterIndex].currentVal = current;
    }

    this.updateWorkspace();
    this.logMessage(`Success: Current is flowing! Measured Current: ${current.toFixed(2)} A. Total Resistance: ${totalResistance.toFixed(2)} Ω.`, "normal");
    this.handleTutorialAction("test_circuit");
  }

  updateWorkspaceMeters(currentVal, voltVal) {
    for (let i = 0; i < this.activeSlotCount; i++) {
      const item = this.slots[i];
      if (item === "ammeter") {
        this.slotStates[i].active = (currentVal > 0);
        this.slotStates[i].currentVal = currentVal;
      }
      if (item === "voltmeter") {
        this.slotStates[i].active = (voltVal > 0);
        this.slotStates[i].voltVal = voltVal;
      }
    }
    this.updateWorkspace();
  }

  setFlowIntensity(current) {
    if (!current || current <= 0) {
      document.documentElement.style.setProperty('--current-intensity', 0);
      return;
    }
    const maxReferenceCurrent = 1.5 / 2.85;
    const intensity = Math.min(1.8, current / maxReferenceCurrent);
    document.documentElement.style.setProperty('--current-intensity', intensity);
  }

  // --- STATE MACHINE TUTORIAL CONTEXT ---
  startTutorial() {
    this.tutorialActive = true;
    this.tutorialStep = 1;
    this.tutorialOverlay.style.display = "block";
    this.resetWorkspace();
    this.selectGrade("Class 6");
    this.updateTutorialStep();
    this.logMessage("Tutorial started! Follow the steps to build your first circuit.");
  }

  endTutorial() {
    this.tutorialActive = false;
    this.tutorialOverlay.style.display = "none";
    this.removeTutorialHighlights();
    this.logMessage("Tutorial ended.");
  }

  updateTutorialStep() {
    if (!this.tutorialActive) return;

    this.tutorialStepNum.innerText = this.tutorialStep;
    this.tutorialProgressBar.style.width = `${this.tutorialStep * 20}%`;

    let text = "";
    switch (this.tutorialStep) {
      case 1:
        text = "Step 1: Select the 1.5V Battery from the sidebar inventory.";
        break;
      case 2:
        text = "Step 2: Great! Now click any empty slot in the workspace to place the Battery.";
        break;
      case 3:
        text = "Step 3: Excellent. Next, select the Light Bulb from the sidebar.";
        break;
      case 4:
        text = "Step 4: Now, place the Light Bulb in another slot, and fill all remaining empty slots with Wires to close the loop.";
        break;
      case 5:
        text = "Step 5: Perfect! The circuit is now closed. Click the green 'Test Circuit' button to run the flow!";
        break;
    }
    this.tutorialStepText.innerText = text;
    this.updateWorkspace();
  }

  handleTutorialAction(action, data) {
    if (!this.tutorialActive) return;

    if (this.tutorialStep === 1 && action === "select_component" && data === "battery") {
      this.tutorialStep = 2;
      this.updateTutorialStep();
    } else if (this.tutorialStep === 2 && action === "place_component" && data === "battery") {
      this.tutorialStep = 3;
      this.updateTutorialStep();
    } else if (this.tutorialStep === 3 && action === "select_component" && data === "bulb") {
      this.tutorialStep = 4;
      this.updateTutorialStep();
    } else if (this.tutorialStep === 4 && action === "place_component") {
      const allFilled = this.slots.every(slot => slot !== null);
      const hasBattery = this.slots.includes("battery");
      const hasBulb = this.slots.includes("bulb");
      
      if (allFilled && hasBattery && hasBulb) {
        this.tutorialStep = 5;
        this.updateTutorialStep();
      }
    } else if (this.tutorialStep === 5 && action === "test_circuit") {
      this.tutorialStepText.innerText = "🎉 Success! You've built a functional circuit. Explorer Badge Unlocked! ⚡";
      this.tutorialProgressBar.style.width = "100%";
      setTimeout(() => {
        this.endTutorial();
      }, 4000);
    }
  }

  updateTutorialVisuals() {
    this.removeTutorialHighlights();
    if (!this.tutorialActive) return;

    if (this.tutorialStep === 1) {
      const batteryCard = this.inventoryGrid.querySelector('[data-id="battery"]');
      if (batteryCard) batteryCard.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 2) {
      const slots = this.slotsContainer.querySelectorAll(".circuit-slot");
      slots.forEach(slot => slot.classList.add("tutorial-highlight"));
    } else if (this.tutorialStep === 3) {
      const bulbCard = this.inventoryGrid.querySelector('[data-id="bulb"]');
      if (bulbCard) bulbCard.classList.add("tutorial-highlight");
    } else if (this.tutorialStep === 4) {
      const slots = this.slotsContainer.querySelectorAll(".circuit-slot:not(.occupied)");
      slots.forEach(slot => slot.classList.add("tutorial-highlight"));
    } else if (this.tutorialStep === 5) {
      this.btnTest.classList.add("tutorial-highlight");
    }
  }

  removeTutorialHighlights() {
    const elements = document.querySelectorAll(".tutorial-highlight");
    elements.forEach(el => el.classList.remove("tutorial-highlight"));
  }
}

// Instantiate
document.addEventListener("DOMContentLoaded", () => {
  window.sandbox = new CircuitSandbox();
});
