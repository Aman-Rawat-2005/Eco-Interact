/**
 * ECOLOGICAL SUCCESSION DATA
 * Complete dataset for succession simulation
 * @version 2.0.0
 */

// ==================== STAGE DATA ====================

export const SUCCESSION_STAGES = {
  PRIMARY: [
    {
      id: 0,
      name: "Bare Rock",
      shortName: "Bare",
      timeframe: "Year 0",
      description: "Newly formed volcanic rock or exposed bedrock with no soil or vegetation.",
      icon: "🪨",
      iconComponent: "Mountain",
      color: "#4B5563",
      lightColor: "#9CA3AF",
      speciesBase: 2,
      energyBase: 100,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      characteristics: ["No soil present", "Extreme temperatures", "No organic matter", "High UV exposure"],
      pioneerSpecies: ["Lichens", "Mosses", "Bacteria"]
    },
    {
      id: 1,
      name: "Pioneer Species",
      shortName: "Pioneer",
      timeframe: "1-10 Years",
      description: "Lichens and mosses colonize rock surface, beginning soil formation through chemical weathering.",
      icon: "🌿",
      iconComponent: "Sprout",
      color: "#65A30D",
      lightColor: "#A3E635",
      speciesBase: 10,
      energyBase: 500,
      imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=800",
      characteristics: ["Thin soil layer forming", "Lichens break down rock", "Organic matter accumulation", "Microhabitats forming"],
      pioneerSpecies: ["Lichens", "Mosses", "Ferns", "Grasses"]
    },
    {
      id: 2,
      name: "Early Succession",
      shortName: "Early",
      timeframe: "10-100 Years",
      description: "Small plants, grasses, and herbs establish as soil depth increases.",
      icon: "🌱",
      iconComponent: "Leaf",
      color: "#16A34A",
      lightColor: "#4ADE80",
      speciesBase: 25,
      energyBase: 2000,
      imageUrl: "https://images.unsplash.com/photo-1439853949127-fa647821eba0?w=800",
      characteristics: ["Soil depth increasing", "Annual plants dominate", "Increased biodiversity", "Insect populations grow"],
      pioneerSpecies: ["Grasses", "Wildflowers", "Ferns", "Small shrubs"]
    },
    {
      id: 3,
      name: "Mid Succession",
      shortName: "Mid",
      timeframe: "100-300 Years",
      description: "Shrubs and small trees establish, creating diverse habitats and complex interactions.",
      icon: "🌳",
      iconComponent: "TreePine",
      color: "#2D8C5A",
      lightColor: "#6EE7B7",
      speciesBase: 60,
      energyBase: 5000,
      imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      characteristics: ["Shrub layer develops", "Young trees appear", "Soil fully developed", "Wildlife increases"],
      pioneerSpecies: ["Shrubs", "Pine trees", "Oak saplings", "Ferns"]
    },
    {
      id: 4,
      name: "Climax Community",
      shortName: "Climax",
      timeframe: "300+ Years",
      description: "Mature, stable forest ecosystem with complex food webs and maximum biodiversity.",
      icon: "🏔️",
      iconComponent: "Mountain",
      color: "#059669",
      lightColor: "#34D399",
      speciesBase: 120,
      energyBase: 10000,
      imageUrl: "https://images.unsplash.com/photo-1425913397330-cf8af2f40e1f?w=800",
      characteristics: ["Mature forest", "Closed canopy", "Maximum biodiversity", "Stable ecosystem"],
      pioneerSpecies: ["Oak", "Maple", "Pine", "Ferns", "Mosses", "Wildlife"]
    }
  ],

  SECONDARY: [
    {
      id: 0,
      name: "Disturbance Event",
      shortName: "Disturbance",
      timeframe: "Year 0",
      description: "Forest fire, logging, or other disturbance removes vegetation but leaves soil intact.",
      icon: "🔥",
      iconComponent: "Flame",
      color: "#B91C1C",
      lightColor: "#F87171",
      speciesBase: 5,
      energyBase: 200,
      imageUrl: "https://images.unsplash.com/photo-1545239351-ef35f43d514b?w=800",
      characteristics: ["Soil remains intact", "Seeds in soil survive", "Root systems present", "Rapid recovery possible"],
      pioneerSpecies: ["Fireweed", "Grasses", "Ferns"]
    },
    {
      id: 1,
      name: "Pioneer Species",
      shortName: "Pioneer",
      timeframe: "1-2 Years",
      description: "Fast-growing annual plants and grasses quickly colonize the disturbed area.",
      icon: "🌾",
      iconComponent: "Sprout",
      color: "#65A30D",
      lightColor: "#A3E635",
      speciesBase: 15,
      energyBase: 800,
      imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
      characteristics: ["Rapid colonization", "Annual plants dominate", "Sun-loving species", "Quick ground cover"],
      pioneerSpecies: ["Grasses", "Fireweed", "Raspberry", "Sunflowers"]
    },
    {
      id: 2,
      name: "Grassland Stage",
      shortName: "Grassland",
      timeframe: "2-15 Years",
      description: "Perennial grasses and herbaceous plants dominate the landscape.",
      icon: "🌿",
      iconComponent: "Leaf",
      color: "#16A34A",
      lightColor: "#4ADE80",
      speciesBase: 30,
      energyBase: 2500,
      imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed3aaeb?w=800",
      characteristics: ["Perennial grasses dominate", "Wildflowers return", "Insect populations recover", "Small mammals appear"],
      pioneerSpecies: ["Goldenrod", "Asters", "Switchgrass", "Buttercups"]
    },
    {
      id: 3,
      name: "Shrubland Stage",
      shortName: "Shrubland",
      timeframe: "15-50 Years",
      description: "Shrubs establish, transitioning from open grassland to dense shrubland.",
      icon: "🌲",
      iconComponent: "TreePine",
      color: "#2D8C5A",
      lightColor: "#6EE7B7",
      speciesBase: 50,
      energyBase: 4000,
      imageUrl: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800",
      characteristics: ["Shrub layer develops", "Tree saplings appear", "Bird populations increase", "More complex food web"],
      pioneerSpecies: ["Sumac", "Dogwood", "Willow", "Blackberry"]
    },
    {
      id: 4,
      name: "Forest Recovery",
      shortName: "Forest",
      timeframe: "50+ Years",
      description: "Forest regenerates to original state, canopy closes, biodiversity peaks.",
      icon: "🌳",
      iconComponent: "TreePine",
      color: "#059669",
      lightColor: "#34D399",
      speciesBase: 100,
      energyBase: 9000,
      imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
      characteristics: ["Mature trees dominate", "Closed canopy", "Rich understory", "Full ecosystem restored"],
      pioneerSpecies: ["Oak", "Maple", "Pine", "Hickory", "Beech"]
    }
  ]
};

// ==================== CLIMATE DATA ====================

export const CLIMATE_RANGES = {
  RAINFALL: {
    min: 0,
    max: 4000,
    step: 50,
    default: 1200,
    thresholds: {
      extremeDrought: { min: 0, max: 250, label: "Extreme Drought", icon: "🏜️", color: "text-yellow-600" },
      arid: { min: 250, max: 500, label: "Arid", icon: "🏜️", color: "text-orange-500" },
      dry: { min: 500, max: 1000, label: "Dry", icon: "🌾", color: "text-amber-500" },
      temperate: { min: 1000, max: 2000, label: "Temperate", icon: "🌳", color: "text-green-500" },
      wet: { min: 2000, max: 3000, label: "Wet", icon: "🌴", color: "text-emerald-500" },
      superHumid: { min: 3000, max: 4000, label: "Super Humid", icon: "💧", color: "text-blue-500" }
    }
  },
  TEMPERATURE: {
    min: -20,
    max: 45,
    step: 1,
    default: 20,
    thresholds: {
      polar: { min: -20, max: -10, label: "Polar", icon: "❄️", color: "text-blue-300" },
      freezing: { min: -10, max: 0, label: "Freezing", icon: "🧊", color: "text-blue-400" },
      cold: { min: 0, max: 10, label: "Cold", icon: "🥶", color: "text-blue-500" },
      cool: { min: 10, max: 20, label: "Cool", icon: "🍂", color: "text-cyan-500" },
      optimal: { min: 20, max: 25, label: "Optimal", icon: "🌱", color: "text-green-500" },
      warm: { min: 25, max: 30, label: "Warm", icon: "☀️", color: "text-amber-500" },
      hot: { min: 30, max: 40, label: "Hot", icon: "🔥", color: "text-orange-500" },
      extreme: { min: 40, max: 45, label: "Extreme", icon: "🥵", color: "text-red-500" }
    }
  }
};

// ==================== DISTURBANCE DATA ====================

export const DISTURBANCE_LEVELS = {
  stable: { min: 0, max: 20, label: "Stable", color: "text-green-400", icon: "🟢", severity: 1 },
  mild: { min: 20, max: 40, label: "Mild", color: "text-yellow-400", icon: "🟡", severity: 1 },
  moderate: { min: 40, max: 60, label: "Moderate", color: "text-orange-400", icon: "🟠", severity: 2 },
  severe: { min: 60, max: 80, label: "Severe", color: "text-red-400", icon: "🔴", severity: 2 },
  catastrophic: { min: 80, max: 100, label: "Catastrophic", color: "text-purple-400", icon: "💀", severity: 3 }
};

// ==================== BIODIVERSITY CALCULATORS ====================

export const BIODIVERSITY_FACTORS = {
  rainfall: {
    extremeDrought: 0.3,
    arid: 0.5,
    dry: 0.8,
    temperate: 1.2,
    wet: 1.0,
    superHumid: 0.7
  },
  temperature: {
    optimal: 1.3,
    good: 1.0,
    stressful: 0.7,
    harsh: 0.4,
    extreme: 0.2
  },
  recovery: {
    initial: 0.5,
    early: 0.7,
    medium: 0.9,
    full: 1.0,
    mature: 1.1
  }
};

// ==================== ECOLOGICAL FACTS ====================

export const ECOLOGICAL_FACTS = [
  { id: 1, title: "Primary Succession", fact: "Takes 1000+ years to reach climax community", icon: "🏔️", category: "succession" },
  { id: 2, title: "Secondary Succession", fact: "50-100 years faster due to existing soil", icon: "🌱", category: "succession" },
  { id: 3, title: "Pioneer Species", fact: "Lichens survive -20°C to 50°C temperature range", icon: "🪨", category: "species" },
  { id: 4, title: "10% Energy Rule", fact: "Only 10% of energy transfers between trophic levels", icon: "⚡", category: "energy" },
  { id: 5, title: "Soil Formation", fact: "Takes 100+ years to form 1cm of topsoil", icon: "🌍", category: "soil" },
  { id: 6, title: "Climax Biodiversity", fact: "Mature forests host 100+ species per hectare", icon: "🦊", category: "biodiversity" },
  { id: 7, title: "Disturbance Recovery", fact: "Fire-adapted ecosystems recover in 5-10 years", icon: "🔥", category: "disturbance" },
  { id: 8, title: "Climate Impact", fact: "1°C change can alter succession by 10-20 years", icon: "🌡️", category: "climate" }
];

// ==================== SUCCESSION RULES ====================

export const SUCCESSION_RULES = {
  baseProbability: { 0: 0.35, 1: 0.28, 2: 0.22, 3: 0.15, 4: 0.00 },
  rainfallOptimal: { min: 800, max: 2200, multiplier: 1.2 },
  temperatureOptimal: 20,
  energyTransfer: {
    producer: 1.0,
    primaryConsumer: 0.1,
    secondaryConsumer: 0.01,
    tertiaryConsumer: 0.001
  },
  timeEstimates: {
    primaryMin: 300,
    primaryMax: 1000,
    secondaryMin: 50,
    secondaryMax: 150,
    pioneerPhase: 10,
    earlyPhase: 90,
    midPhase: 200
  }
};

// ==================== SPECIES DATABASE ====================

export const SPECIES_BY_STAGE = {
  bareRock: [
    { name: "Crustose Lichens", type: "pioneer", tolerance: "extreme" },
    { name: "Endolithic Bacteria", type: "decomposer", tolerance: "extreme" },
    { name: "Atmospheric Algae", type: "producer", tolerance: "high" }
  ],
  pioneer: [
    { name: "Foliose Lichens", type: "pioneer", tolerance: "high" },
    { name: "Mosses", type: "pioneer", tolerance: "medium" },
    { name: "Ferns", type: "producer", tolerance: "medium" },
    { name: "Soil Bacteria", type: "decomposer", tolerance: "medium" }
  ],
  earlySuccession: [
    { name: "Wild Strawberry", type: "producer", tolerance: "medium" },
    { name: "Fireweed", type: "producer", tolerance: "high" },
    { name: "Grasshoppers", type: "consumer", tolerance: "medium" },
    { name: "Field Mice", type: "consumer", tolerance: "medium" },
    { name: "Soil Nematodes", type: "decomposer", tolerance: "medium" }
  ],
  midSuccession: [
    { name: "Raspberry Bushes", type: "producer", tolerance: "medium" },
    { name: "Young Pines", type: "producer", tolerance: "medium" },
    { name: "Warblers", type: "consumer", tolerance: "low" },
    { name: "Chipmunks", type: "consumer", tolerance: "low" },
    { name: "Earthworms", type: "decomposer", tolerance: "low" },
    { name: "Beetles", type: "consumer", tolerance: "medium" }
  ],
  climax: [
    { name: "Oak Trees", type: "producer", tolerance: "low" },
    { name: "Maple Trees", type: "producer", tolerance: "low" },
    { name: "Deer", type: "consumer", tolerance: "low" },
    { name: "Foxes", type: "consumer", tolerance: "low" },
    { name: "Owls", type: "consumer", tolerance: "low" },
    { name: "Fungi", type: "decomposer", tolerance: "low" },
    { name: "Squirrels", type: "consumer", tolerance: "low" }
  ]
};

// ==================== GRAPH COLORS ====================

export const GRAPH_COLORS = {
  biodiversity: {
    line: "#10B981",
    fill: "rgba(16, 185, 129, 0.2)",
    point: "#10B981",
    pointClimax: "#F59E0B"
  },
  stages: ["#4B5563", "#65A30D", "#16A34A", "#2D8C5A", "#059669"],
  climate: {
    rainfall: "#3B82F6",
    temperature: "#F97316",
    optimal: "#10B981",
    stressful: "#EF4444"
  }
};

// ==================== COMPARISON SCENARIOS ====================

export const COMPARISON_SCENARIOS = [
  {
    id: "low-vs-high",
    name: "Low vs High Disturbance",
    disturbanceA: 20,
    disturbanceB: 70,
    description: "Compare ecosystem recovery under different disturbance regimes"
  },
  {
    id: "optimal-vs-extreme",
    name: "Optimal vs Extreme Climate",
    rainfallA: 1200,
    rainfallB: 300,
    temperatureA: 20,
    temperatureB: 35,
    description: "Study climate change impacts on succession"
  },
  {
    id: "primary-vs-secondary",
    name: "Primary vs Secondary",
    typeA: "PRIMARY",
    typeB: "SECONDARY",
    description: "Compare succession starting conditions"
  }
];

// ==================== HELPER FUNCTIONS ====================

export const getStage = (type, id) => SUCCESSION_STAGES[type]?.find(stage => stage.id === id);

export const calculateBiodiversity = (stage, rainfall, temperature, yearsSinceDisturbance) => {
  let base = stage.speciesBase;
  if (rainfall < 250) base *= BIODIVERSITY_FACTORS.rainfall.extremeDrought;
  else if (rainfall < 500) base *= BIODIVERSITY_FACTORS.rainfall.arid;
  else if (rainfall < 800) base *= BIODIVERSITY_FACTORS.rainfall.dry;
  else if (rainfall <= 2000) base *= BIODIVERSITY_FACTORS.rainfall.temperate;
  else if (rainfall <= 3000) base *= BIODIVERSITY_FACTORS.rainfall.wet;
  else base *= BIODIVERSITY_FACTORS.rainfall.superHumid;

  const tempDiff = Math.abs(temperature - SUCCESSION_RULES.temperatureOptimal);
  if (tempDiff <= 5) base *= BIODIVERSITY_FACTORS.temperature.optimal;
  else if (tempDiff <= 10) base *= BIODIVERSITY_FACTORS.temperature.good;
  else if (tempDiff <= 15) base *= BIODIVERSITY_FACTORS.temperature.stressful;
  else if (tempDiff <= 20) base *= BIODIVERSITY_FACTORS.temperature.harsh;
  else base *= BIODIVERSITY_FACTORS.temperature.extreme;

  if (yearsSinceDisturbance < 1) base *= BIODIVERSITY_FACTORS.recovery.initial;
  else if (yearsSinceDisturbance < 3) base *= BIODIVERSITY_FACTORS.recovery.early;
  else if (yearsSinceDisturbance < 5) base *= BIODIVERSITY_FACTORS.recovery.medium;
  else if (yearsSinceDisturbance < 10) base *= BIODIVERSITY_FACTORS.recovery.full;
  else base *= BIODIVERSITY_FACTORS.recovery.mature;

  return Math.max(1, Math.round(base));
};

export const getDisturbanceLevel = (intensity) => {
  if (intensity <= 20) return DISTURBANCE_LEVELS.stable;
  if (intensity <= 40) return DISTURBANCE_LEVELS.mild;
  if (intensity <= 60) return DISTURBANCE_LEVELS.moderate;
  if (intensity <= 80) return DISTURBANCE_LEVELS.severe;
  return DISTURBANCE_LEVELS.catastrophic;
};

export const getRainfallDescription = (rainfall) => {
  const t = CLIMATE_RANGES.RAINFALL.thresholds;
  if (rainfall <= 250) return t.extremeDrought;
  if (rainfall <= 500) return t.arid;
  if (rainfall <= 1000) return t.dry;
  if (rainfall <= 2000) return t.temperate;
  if (rainfall <= 3000) return t.wet;
  return t.superHumid;
};

export const getTemperatureDescription = (temp) => {
  const t = CLIMATE_RANGES.TEMPERATURE.thresholds;
  if (temp <= -10) return t.polar;
  if (temp <= 0) return t.freezing;
  if (temp <= 10) return t.cold;
  if (temp <= 20) return t.cool;
  if (temp <= 25) return t.optimal;
  if (temp <= 30) return t.warm;
  if (temp <= 40) return t.hot;
  return t.extreme;
};

export default {
  SUCCESSION_STAGES, CLIMATE_RANGES, DISTURBANCE_LEVELS, BIODIVERSITY_FACTORS,
  ECOLOGICAL_FACTS, SUCCESSION_RULES, SPECIES_BY_STAGE, GRAPH_COLORS,
  COMPARISON_SCENARIOS, getStage, calculateBiodiversity, getDisturbanceLevel,
  getRainfallDescription, getTemperatureDescription
};