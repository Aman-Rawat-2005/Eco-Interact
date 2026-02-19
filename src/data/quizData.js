// Quiz questions dataset for Ecology
export const quizQuestions = [
  // Energy Flow Questions (Easy)
  {
    id: 1,
    topic: "Energy Flow",
    difficulty: "easy",
    question: "Energy enters an ecosystem primarily through?",
    options: ["Producers", "Consumers", "Decomposers", "Carnivores"],
    correct: 0,
    explanation: "Producers (plants and algae) capture solar energy through photosynthesis, converting it into chemical energy that flows through the ecosystem."
  },
  {
    id: 2,
    topic: "Energy Flow",
    difficulty: "easy",
    question: "What percentage of energy is typically transferred from one trophic level to the next?",
    options: ["90%", "50%", "10%", "1%"],
    correct: 2,
    explanation: "Only about 10% of energy is transferred between trophic levels. The rest is lost as heat through metabolic processes."
  },
  {
    id: 3,
    topic: "Energy Flow",
    difficulty: "easy",
    question: "Which organisms are primary consumers?",
    options: ["Carnivores", "Herbivores", "Omnivores", "Decomposers"],
    correct: 1,
    explanation: "Primary consumers are herbivores that eat producers (plants) directly."
  },
  {
    id: 4,
    topic: "Energy Flow",
    difficulty: "easy",
    question: "What is the original source of energy for most ecosystems?",
    options: ["The Sun", "Hydrothermal Vents", "Geothermal Heat", "Chemical Reactions"],
    correct: 0,
    explanation: "The Sun is the primary energy source for most ecosystems, driving photosynthesis in producers."
  },
  {
    id: 5,
    topic: "Energy Flow",
    difficulty: "easy",
    question: "Which trophic level has the highest energy content?",
    options: ["Producers", "Primary Consumers", "Secondary Consumers", "Tertiary Consumers"],
    correct: 0,
    explanation: "Producers have the highest energy content as they directly capture energy from the sun."
  },

  // Energy Flow Questions (Medium)
  {
    id: 6,
    topic: "Energy Flow",
    difficulty: "medium",
    question: "The 10% law of energy transfer was proposed by?",
    options: ["Charles Darwin", "Rachel Carson", "Raymond Lindeman", "Eugene Odum"],
    correct: 2,
    explanation: "Raymond Lindeman proposed the 10% law in 1942, describing energy transfer efficiency between trophic levels."
  },
  {
    id: 7,
    topic: "Energy Flow",
    difficulty: "medium",
    question: "In an energy pyramid, which level shows the largest biomass?",
    options: ["Top carnivores", "Primary carnivores", "Herbivores", "Producers"],
    correct: 3,
    explanation: "Producers form the base of the energy pyramid with the largest biomass to support all higher trophic levels."
  },
  {
    id: 8,
    topic: "Energy Flow",
    difficulty: "medium",
    question: "What happens to the 90% of energy not transferred to the next trophic level?",
    options: ["Stored as biomass", "Converted to heat", "Used in reproduction", "Excreted as waste"],
    correct: 1,
    explanation: "The 90% of energy is lost as heat through respiration and metabolic processes."
  },
  {
    id: 9,
    topic: "Energy Flow",
    difficulty: "medium",
    question: "Gross Primary Productivity (GPP) minus respiration equals?",
    options: ["Net Primary Productivity", "Biomass", "Energy flow", "Trophic efficiency"],
    correct: 0,
    explanation: "NPP = GPP - Respiration. NPP represents the energy available to consumers."
  },
  {
    id: 10,
    topic: "Energy Flow",
    difficulty: "medium",
    question: "Which ecosystem has the highest net primary productivity?",
    options: ["Desert", "Tropical Rainforest", "Temperate Forest", "Open Ocean"],
    correct: 1,
    explanation: "Tropical rainforests have the highest NPP due to ideal growing conditions year-round."
  },

  // Succession Questions (Easy)
  {
    id: 11,
    topic: "Succession",
    difficulty: "easy",
    question: "What is ecological succession?",
    options: [
      "Seasonal changes in weather",
      "Predictable changes in species composition over time",
      "Migration of animals",
      "Daily temperature variations"
    ],
    correct: 1,
    explanation: "Ecological succession is the predictable process of change in species composition of a community over time."
  },
  {
    id: 12,
    topic: "Succession",
    difficulty: "easy",
    question: "Which type of succession begins on bare rock?",
    options: ["Secondary succession", "Primary succession", "Tertiary succession", "Climax succession"],
    correct: 1,
    explanation: "Primary succession begins in areas with no soil, like bare rock, lava flows, or areas exposed by retreating glaciers."
  },
  {
    id: 13,
    topic: "Succession",
    difficulty: "easy",
    question: "What are the first organisms to colonize bare rock called?",
    options: ["Grasses", "Lichens", "Ferns", "Mosses"],
    correct: 1,
    explanation: "Lichens are pioneer species that can grow on bare rock and begin soil formation."
  },
  {
    id: 14,
    topic: "Succession",
    difficulty: "easy",
    question: "Secondary succession occurs in areas where?",
    options: [
      "No life ever existed",
      "Soil is already present",
      "Only bacteria exist",
      "The climate is extreme"
    ],
    correct: 1,
    explanation: "Secondary succession occurs in areas where soil is already present, like abandoned farmland or burned forests."
  },
  {
    id: 15,
    topic: "Succession",
    difficulty: "easy",
    question: "The final stable community in succession is called?",
    options: ["Pioneer community", "Climax community", "Transition community", "Seral community"],
    correct: 1,
    explanation: "The climax community is the final, stable community that results from succession."
  },

  // Succession Questions (Medium)
  {
    id: 16,
    topic: "Succession",
    difficulty: "medium",
    question: "Which of the following is an example of primary succession?",
    options: [
      "Regrowth after forest fire",
      "Recovery of abandoned farmland",
      "Colonization of new volcanic island",
      "Regrowth after logging"
    ],
    correct: 2,
    explanation: "A new volcanic island has no soil or life, making colonization an example of primary succession."
  },
  {
    id: 17,
    topic: "Succession",
    difficulty: "medium",
    question: "What role do pioneer species play in succession?",
    options: [
      "Create shade for other plants",
      "Modify environment for later species",
      "Compete with all other species",
      "Prevent further colonization"
    ],
    correct: 1,
    explanation: "Pioneer species modify the environment (create soil, add nutrients) making it suitable for later species."
  },
  {
    id: 18,
    topic: "Succession",
    difficulty: "medium",
    question: "During succession, biodiversity typically?",
    options: ["Decreases", "Increases then stabilizes", "Remains constant", "Fluctuates randomly"],
    correct: 1,
    explanation: "Biodiversity typically increases during succession and stabilizes at climax community."
  },

  // Food Chain Questions
  {
    id: 19,
    topic: "Food Chain",
    difficulty: "easy",
    question: "A food chain shows?",
    options: [
      "Feeding relationships in an ecosystem",
      "Weather patterns",
      "Soil composition",
      "Water cycle"
    ],
    correct: 0,
    explanation: "A food chain shows the linear feeding relationships between organisms in an ecosystem."
  },
  {
    id: 20,
    topic: "Food Chain",
    difficulty: "easy",
    question: "In a food chain, grass → grasshopper → frog → snake, the frog is a?",
    options: ["Primary consumer", "Secondary consumer", "Tertiary consumer", "Producer"],
    correct: 1,
    explanation: "The frog eats grasshoppers (primary consumers), making it a secondary consumer."
  },
  {
    id: 21,
    topic: "Food Chain",
    difficulty: "medium",
    question: "What is the difference between a food chain and a food web?",
    options: [
      "They are the same thing",
      "Food web is multiple interconnected food chains",
      "Food chain includes decomposers",
      "Food web only shows producers"
    ],
    correct: 1,
    explanation: "A food web consists of many interconnected food chains, showing complex feeding relationships."
  },

  // Biodiversity Questions
  {
    id: 22,
    topic: "Biodiversity",
    difficulty: "easy",
    question: "What is biodiversity?",
    options: [
      "Number of individual organisms",
      "Variety of life forms in an ecosystem",
      "Total biomass in an area",
      "Climate of a region"
    ],
    correct: 1,
    explanation: "Biodiversity refers to the variety of plant and animal life in a particular habitat or ecosystem."
  },
  {
    id: 23,
    topic: "Biodiversity",
    difficulty: "medium",
    question: "Which biodiversity hotspot is found in India?",
    options: [
      "Amazon Rainforest",
      "Western Ghats",
      "Great Barrier Reef",
      "Congo Basin"
    ],
    correct: 1,
    explanation: "The Western Ghats is one of the world's biodiversity hotspots, located in India."
  },

  // Hard Questions
  {
    id: 24,
    topic: "Energy Flow",
    difficulty: "hard",
    question: "If producers have 10,000 J of energy, how much will be available to tertiary consumers?",
    options: ["1000 J", "100 J", "10 J", "1 J"],
    correct: 2,
    explanation: "With 10% transfer efficiency: 10,000 → 1,000 (primary) → 100 (secondary) → 10 J (tertiary)."
  },
  {
    id: 25,
    topic: "Succession",
    difficulty: "hard",
    question: "What is the difference between autogenic and allogenic succession?",
    options: [
      "No difference",
      "Autogenic is caused by organisms, allogenic by external factors",
      "Autogenic is faster",
      "Allogenic only occurs in water"
    ],
    correct: 1,
    explanation: "Autogenic succession is driven by organisms modifying their environment, while allogenic is driven by external factors like climate change."
  },
  {
    id: 26,
    topic: "Carbon Cycle",
    difficulty: "hard",
    question: "Which process releases the most carbon dioxide into the atmosphere?",
    options: [
      "Photosynthesis",
      "Respiration",
      "Combustion of fossil fuels",
      "Decomposition"
    ],
    correct: 2,
    explanation: "While all listed processes release CO2, human combustion of fossil fuels is the largest source of excess atmospheric carbon."
  },

  // Additional questions for variety
  {
    id: 27,
    topic: "Biodiversity",
    difficulty: "medium",
    question: "What is an 'umbrella species'?",
    options: [
      "Species with large habitat requirements",
      "Species that live in groups",
      "Nocturnal species",
      "Migratory species"
    ],
    correct: 0,
    explanation: "Umbrella species require large areas of habitat; protecting them indirectly protects many other species."
  },
  {
    id: 28,
    topic: "Carbon Cycle",
    difficulty: "easy",
    question: "What is the largest carbon reservoir on Earth?",
    options: [
      "Atmosphere",
      "Oceans",
      "Forests",
      "Fossil fuels"
    ],
    correct: 1,
    explanation: "Oceans are the largest active carbon reservoir, containing about 50 times more carbon than the atmosphere."
  },
  {
    id: 29,
    topic: "Carbon Cycle",
    difficulty: "medium",
    question: "How do oceans absorb carbon dioxide?",
    options: [
      "Through waves only",
      "Through photosynthesis and diffusion",
      "Through animal respiration",
      "Through evaporation"
    ],
    correct: 1,
    explanation: "Oceans absorb CO2 through diffusion at the surface and through photosynthesis by marine plants."
  },
  {
    id: 30,
    topic: "Food Chain",
    difficulty: "hard",
    question: "What is a 'trophic cascade'?",
    options: [
      "Waterfall effect in rivers",
      "Predator effects rippling down food chain",
      "Energy loss between levels",
      "Seasonal food changes"
    ],
    correct: 1,
    explanation: "Trophic cascade occurs when predators suppress herbivores, allowing plants to thrive - effects ripple down the food chain."
  }
];

// Topic metadata
export const topicMetadata = {
  "Energy Flow": {
    icon: "⚡",
    description: "Study of energy transfer through ecosystems",
    questionCount: 8
  },
  "Succession": {
    icon: "🌱",
    description: "Changes in community composition over time",
    questionCount: 6
  },
  "Food Chain": {
    icon: "🔄",
    description: "Feeding relationships in ecosystems",
    questionCount: 4
  },
  "Biodiversity": {
    icon: "🦋",
    description: "Variety of life in ecosystems",
    questionCount: 4
  },
  "Carbon Cycle": {
    icon: "🌍",
    description: "Movement of carbon through Earth systems",
    questionCount: 3
  }
};

// Helper functions
export const getQuestionsByTopic = (topic) => {
  return quizQuestions.filter(q => q.topic === topic);
};

export const getQuestionsByDifficulty = (difficulty) => {
  return quizQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByTopicAndDifficulty = (topic, difficulty) => {
  return quizQuestions.filter(q => q.topic === topic && q.difficulty === difficulty);
};

export const getRandomQuestions = (count, excludeIds = []) => {
  const available = quizQuestions.filter(q => !excludeIds.includes(q.id));
  const shuffled = [...available].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getTopics = () => {
  return Object.keys(topicMetadata);
};

export const getTopicStats = () => {
  const stats = {};
  quizQuestions.forEach(q => {
    if (!stats[q.topic]) {
      stats[q.topic] = {
        total: 0,
        easy: 0,
        medium: 0,
        hard: 0
      };
    }
    stats[q.topic].total++;
    stats[q.topic][q.difficulty]++;
  });
  return stats;
};

export default quizQuestions;