const substances = {
  water: {
    id: "water",
    name: "💧 Water",
    color: "#3b82f6",
    startTemp: -20,
    meltingPoint: 0,
    boilingPoint: 100,
    latentHeat: 334,
    theory:
      "Water absorbs latent heat during melting. Temperature remains constant until all ice melts.",
    assistant:
      "Water is heating. At 0°C it melts, and the temperature remains constant because the supplied heat is used as latent heat.",
  },

  ethanol: {
    id: "ethanol",
    name: "🧪 Ethanol",
    color: "#8be9fd",
    startTemp: -130,
    meltingPoint: -114,
    boilingPoint: 78,
    latentHeat: 108,
    theory:
      "Ethanol melts at −114°C and boils at 78°C because of weaker intermolecular forces.",
    assistant:
      "Ethanol changes phase at much lower temperatures than water.",
  },

  mercury: {
    id: "mercury",
    name: "🌡 Mercury",
    color: "#bcbcbc",
    startTemp: -50,
    meltingPoint: -39,
    boilingPoint: 357,
    latentHeat: 11.8,
    theory:
      "Mercury is a liquid metal with a very high boiling point.",
    assistant:
      "Mercury is one of the few metals that remains liquid near room temperature.",
  },

  saltWater: {
    id: "salt",
    name: "🧂 Salt Water",
    color: "#2563eb",
    startTemp: -10,
    meltingPoint: -2,
    boilingPoint: 102,
    latentHeat: 320,
    theory:
      "Salt lowers the freezing point and raises the boiling point of water.",
    assistant:
      "Salt changes the phase transition temperatures compared with pure water.",
  },
};

export default substances;