// Complete ecosystem datasets with rich ecological data
export const ecosystems = {
  forest: {
    id: 'forest',
    name: 'Temperate Forest',
    shortName: 'Forest',
    emoji: ' ',
    description: 'Deciduous forest with diverse trophic levels',
    longDescription: 'Temperate forests experience four seasons and support complex food webs with high biodiversity. Trees like oak, maple, and pine dominate these ecosystems.',
    gradient: 'from-green-600 via-emerald-500 to-green-700',
    icon: ' ',
    color: '#166534',
    secondaryColor: '#22c55e',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    darkBgColor: 'dark:bg-green-900/20',
    borderColor: 'border-green-500',
    heroImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000',
    stats: {
      biodiversity: 'High (8,000 species)',
      annualRainfall: '750-1,500mm',
      temperature: '-30°C to 30°C',
      area: '15 million km²',
      carbonStorage: '250 tons/hectare',
      oxygenProduction: '28% of Earth\'s oxygen'
    },
    trophicLevels: [
      { 
        level: 'Producers', 
        levelId: 'producers',
        organisms: [
          { name: 'Oak Trees', emoji: '🌳', scientific: 'Quercus alba', mass: 5000, count: 1000 },
          { name: 'Ferns', emoji: '🌿', scientific: 'Polypodiopsida', mass: 50, count: 5000 },
          { name: 'Grasses', emoji: '🌱', scientific: 'Poaceae', mass: 10, count: 10000 },
          { name: 'Shrubs', emoji: '🪴', scientific: 'Frangula alnus', mass: 100, count: 2000 }
        ], 
        energy: 20000,
        biomass: 5000,
        population: 18000,
        percentage: 100,
        icon: '🌿',
        color: '#22c55e',
        darkColor: '#4ade80',
        fact: 'Producers capture only 1-3% of available sunlight',
        details: 'Convert solar energy into chemical energy through photosynthesis',
        energyPerOrganism: 1.11,
        biomassPerOrganism: 0.28
      },
      { 
        level: 'Primary Consumers', 
        levelId: 'primary',
        organisms: [
          { name: 'Deer', emoji: '🦌', scientific: 'Odocoileus virginianus', mass: 100, count: 200 },
          { name: 'Rabbits', emoji: '🐇', scientific: 'Oryctolagus cuniculus', mass: 2, count: 800 },
          { name: 'Squirrels', emoji: '🐿️', scientific: 'Sciurus carolinensis', mass: 0.5, count: 600 },
          { name: 'Insects', emoji: '🐛', scientific: 'Insecta', mass: 0.01, count: 10000 }
        ],
        energy: 2000,
        biomass: 500,
        population: 11600,
        percentage: 10,
        icon: '🦌',
        color: '#eab308',
        darkColor: '#facc15',
        fact: 'Herbivores convert only 10% of plant energy to body mass',
        details: 'Feed directly on producers, first step in energy transfer',
        energyPerOrganism: 0.17,
        biomassPerOrganism: 0.043
      },
      { 
        level: 'Secondary Consumers', 
        levelId: 'secondary',
        organisms: [
          { name: 'Foxes', emoji: '🦊', scientific: 'Vulpes vulpes', mass: 6, count: 50 },
          { name: 'Snakes', emoji: '🐍', scientific: 'Serpentes', mass: 2, count: 80 },
          { name: 'Owls', emoji: '🦉', scientific: 'Strigiformes', mass: 1.5, count: 30 },
          { name: 'Raccoons', emoji: '🦝', scientific: 'Procyon lotor', mass: 8, count: 40 }
        ],
        energy: 200,
        biomass: 50,
        population: 200,
        percentage: 1,
        icon: '🦊',
        color: '#f97316',
        darkColor: '#fb923c',
        fact: 'Carnivores need to eat 10x their body weight annually',
        details: 'Hunt primary consumers, regulate herbivore populations',
        energyPerOrganism: 1.0,
        biomassPerOrganism: 0.25
      },
      { 
        level: 'Tertiary Consumers', 
        levelId: 'tertiary',
        organisms: [
          { name: 'Wolves', emoji: '🐺', scientific: 'Canis lupus', mass: 45, count: 10 },
          { name: 'Bears', emoji: '🐻', scientific: 'Ursus americanus', mass: 200, count: 5 },
          { name: 'Hawks', emoji: '🦅', scientific: 'Buteo jamaicensis', mass: 1.2, count: 8 }
        ],
        energy: 20,
        biomass: 5,
        population: 23,
        percentage: 0.1,
        icon: '🐺',
        color: '#ef4444',
        darkColor: '#f87171',
        fact: 'Apex predators have the largest territory requirements',
        details: 'Top predators with no natural enemies in their ecosystem',
        energyPerOrganism: 0.87,
        biomassPerOrganism: 0.22
      }
    ],
    foodWeb: {
      producers: ['Oak Trees', 'Ferns', 'Grasses', 'Shrubs'],
      primary: ['Deer', 'Rabbits', 'Squirrels', 'Insects'],
      secondary: ['Foxes', 'Snakes', 'Owls', 'Raccoons'],
      tertiary: ['Wolves', 'Bears', 'Hawks'],
      decomposers: ['Fungi', 'Bacteria', 'Worms']
    },
    relationships: [
      { from: 'Grasses', to: 'Rabbits', energy: 850, type: 'herbivory' },
      { from: 'Rabbits', to: 'Foxes', energy: 85, type: 'predation' },
      { from: 'Foxes', to: 'Wolves', energy: 8.5, type: 'predation' },
      { from: 'Oak Trees', to: 'Squirrels', energy: 1200, type: 'herbivory' },
      { from: 'Squirrels', to: 'Owls', energy: 120, type: 'predation' }
    ],
    climate: {
      temperature: [-30, 30],
      rainfall: [750, 1500],
      seasons: ['Spring', 'Summer', 'Fall', 'Winter']
    }
  },
  
  marine: {
    id: 'marine',
    name: 'Marine Ecosystem',
    shortName: 'Marine',
    emoji: ' ',
    description: 'Ocean food web from plankton to apex predators',
    longDescription: 'Covers 71% of Earth\'s surface, contains 97% of water, and hosts the largest food chain on the planet.',
    gradient: 'from-blue-600 via-cyan-500 to-blue-700',
    icon: ' ',
    color: '#2563eb',
    secondaryColor: '#06b6d4',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    darkBgColor: 'dark:bg-blue-900/20',
    borderColor: 'border-blue-500',
    heroImage: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?auto=format&fit=crop&w=2000',
    stats: {
      biodiversity: 'Very High (230,000 species)',
      depth: 'Average 3,700m',
      temperature: '-2°C to 30°C',
      area: '361 million km²',
      oxygenProduction: '50-80%',
      carbonStorage: '38,000 billion tons'
    },
    trophicLevels: [
      { 
        level: 'Producers', 
        levelId: 'producers',
        organisms: [
          { name: 'Phytoplankton', emoji: '🌱', scientific: 'Cyanobacteria', mass: 0.000001, count: 1000000000000 },
          { name: 'Seaweed', emoji: '🌊', scientific: 'Macroalgae', mass: 10, count: 500000 },
          { name: 'Algae', emoji: '🍃', scientific: 'Chlorophyta', mass: 0.1, count: 10000000 },
          { name: 'Seagrass', emoji: '🌿', scientific: 'Zostera marina', mass: 5, count: 200000 }
        ],
        energy: 25000,
        biomass: 6000,
        population: 1000010500000,
        percentage: 100,
        icon: '🌱',
        color: '#22c55e',
        darkColor: '#4ade80',
        fact: 'Phytoplankton produce 50-80% of Earth\'s oxygen',
        details: 'Microscopic organisms that form the base of marine food webs',
        energyPerOrganism: 0.000025,
        biomassPerOrganism: 0.000006
      },
      { 
        level: 'Primary Consumers', 
        levelId: 'primary',
        organisms: [
          { name: 'Zooplankton', emoji: '🦐', scientific: 'Copepoda', mass: 0.0005, count: 500000000000 },
          { name: 'Krill', emoji: '🦐', scientific: 'Euphausia superba', mass: 0.002, count: 500000000 },
          { name: 'Small Fish', emoji: '🐟', scientific: 'Clupea harengus', mass: 0.1, count: 1000000000 },
          { name: 'Mussels', emoji: '🦪', scientific: 'Mytilus edulis', mass: 0.05, count: 200000000 }
        ],
        energy: 2500,
        biomass: 600,
        population: 501500000000,
        percentage: 10,
        icon: '🦐',
        color: '#eab308',
        darkColor: '#facc15',
        fact: 'Krill swarms can be seen from space',
        details: 'Filter feeders that consume phytoplankton',
        energyPerOrganism: 0.000005,
        biomassPerOrganism: 0.0000012
      },
      { 
        level: 'Secondary Consumers', 
        levelId: 'secondary',
        organisms: [
          { name: 'Herring', emoji: '🐟', scientific: 'Clupea harengus', mass: 0.5, count: 50000000 },
          { name: 'Squid', emoji: '🦑', scientific: 'Teuthida', mass: 2, count: 10000000 },
          { name: 'Jellyfish', emoji: '🎐', scientific: 'Scyphozoa', mass: 1, count: 20000000 },
          { name: 'Mackerel', emoji: '🐟', scientific: 'Scomber scombrus', mass: 0.8, count: 30000000 }
        ],
        energy: 250,
        biomass: 60,
        population: 110000000,
        percentage: 1,
        icon: '🐟',
        color: '#f97316',
        darkColor: '#fb923c',
        fact: 'Squid have three hearts and blue blood',
        details: 'Mid-level predators in the ocean food chain',
        energyPerOrganism: 0.00000227,
        biomassPerOrganism: 0.00000055
      },
      { 
        level: 'Tertiary Consumers', 
        levelId: 'tertiary',
        organisms: [
          { name: 'Tuna', emoji: '🐟', scientific: 'Thunnus', mass: 200, count: 1000000 },
          { name: 'Sharks', emoji: '🦈', scientific: 'Selachimorpha', mass: 500, count: 500000 },
          { name: 'Dolphins', emoji: '🐬', scientific: 'Delphinus', mass: 200, count: 800000 }
        ],
        energy: 25,
        biomass: 6,
        population: 2300000,
        percentage: 0.1,
        icon: '🦈',
        color: '#ef4444',
        darkColor: '#f87171',
        fact: 'Great white sharks can detect blood in water from 5km away',
        details: 'Apex predators that maintain balance in marine ecosystems',
        energyPerOrganism: 0.00001087,
        biomassPerOrganism: 0.00000261
      }
    ],
    foodWeb: {
      producers: ['Phytoplankton', 'Seaweed', 'Algae', 'Seagrass'],
      primary: ['Zooplankton', 'Krill', 'Small Fish', 'Mussels'],
      secondary: ['Herring', 'Squid', 'Jellyfish', 'Mackerel'],
      tertiary: ['Tuna', 'Sharks', 'Dolphins'],
      decomposers: ['Bacteria', 'Crabs', 'Worms']
    },
    relationships: [
      { from: 'Phytoplankton', to: 'Zooplankton', energy: 15000, type: 'filter feeding' },
      { from: 'Zooplankton', to: 'Herring', energy: 1500, type: 'predation' },
      { from: 'Herring', to: 'Tuna', energy: 150, type: 'predation' },
      { from: 'Krill', to: 'Squid', energy: 800, type: 'predation' },
      { from: 'Squid', to: 'Sharks', energy: 80, type: 'predation' }
    ],
    climate: {
      temperature: [-2, 30],
      rainfall: [500, 2500],
      seasons: ['Wet', 'Dry', 'Monsoon']
    }
  },
  
  desert: {
    id: 'desert',
    name: 'Desert Ecosystem',
    shortName: 'Desert',
    emoji: ' ',
    description: 'Adapted species in harsh, arid conditions',
    longDescription: 'Deserts receive less than 250mm of rain annually. Organisms have remarkable adaptations for water conservation and temperature regulation.',
    gradient: 'from-yellow-600 via-orange-500 to-amber-700',
    icon: ' ',
    color: '#b45309',
    secondaryColor: '#d97706',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-50',
    darkBgColor: 'dark:bg-amber-900/20',
    borderColor: 'border-amber-500',
    heroImage: 'https://media.istockphoto.com/id/185463796/photo/red-mountain-and-saguaro-cactus.jpg?s=612x612&w=0&k=20&c=8zosT0m01H7qB-qOf0dBvuswbJTxxnzEwPLfaS6ud0A=',
    stats: {
      biodiversity: 'Low to Medium (4,000 species)',
      annualRainfall: '<250mm',
      temperature: '0°C to 50°C',
      area: '33.7 million km²',
      carbonStorage: '50 tons/hectare',
      waterStorage: 'Minimal'
    },
    trophicLevels: [
      { 
        level: 'Producers', 
        levelId: 'producers',
        organisms: [
          { name: 'Cactus', emoji: '🌵', scientific: 'Cactaceae', mass: 100, count: 500 },
          { name: 'Creosote', emoji: '🌿', scientific: 'Larrea tridentata', mass: 50, count: 300 },
          { name: 'Desert Grasses', emoji: '🌱', scientific: 'Aristida', mass: 5, count: 1000 }
        ],
        energy: 8000,
        biomass: 2000,
        population: 1800,
        percentage: 100,
        icon: '🌵',
        color: '#22c55e',
        darkColor: '#4ade80',
        fact: 'Saguaro cactus can store 200 gallons of water',
        details: 'Specialized plants with adaptations for water conservation',
        energyPerOrganism: 4.44,
        biomassPerOrganism: 1.11
      },
      { 
        level: 'Primary Consumers', 
        levelId: 'primary',
        organisms: [
          { name: 'Kangaroo Rats', emoji: '🐀', scientific: 'Dipodomys', mass: 0.1, count: 200 },
          { name: 'Desert Tortoise', emoji: '🐢', scientific: 'Gopherus agassizii', mass: 5, count: 50 },
          { name: 'Insects', emoji: '🦗', scientific: 'Arthropleura', mass: 0.01, count: 2000 }
        ],
        energy: 800,
        biomass: 200,
        population: 2250,
        percentage: 10,
        icon: '🐀',
        color: '#eab308',
        darkColor: '#facc15',
        fact: 'Kangaroo rats never need to drink water',
        details: 'Herbivores adapted to extreme aridity',
        energyPerOrganism: 0.36,
        biomassPerOrganism: 0.089
      },
      { 
        level: 'Secondary Consumers', 
        levelId: 'secondary',
        organisms: [
          { name: 'Roadrunner', emoji: '🐦', scientific: 'Geococcyx', mass: 0.3, count: 30 },
          { name: 'Lizards', emoji: '🦎', scientific: 'Lacertilia', mass: 0.05, count: 100 },
          { name: 'Scorpions', emoji: '🦂', scientific: 'Scorpiones', mass: 0.02, count: 150 }
        ],
        energy: 80,
        biomass: 20,
        population: 280,
        percentage: 1,
        icon: '🦎',
        color: '#f97316',
        darkColor: '#fb923c',
        fact: 'Scorpions can survive for a year without food',
        details: 'Carnivores that hunt small prey',
        energyPerOrganism: 0.29,
        biomassPerOrganism: 0.071
      },
      { 
        level: 'Tertiary Consumers', 
        levelId: 'tertiary',
        organisms: [
          { name: 'Coyotes', emoji: '🐺', scientific: 'Canis latrans', mass: 15, count: 10 },
          { name: 'Hawks', emoji: '🦅', scientific: 'Buteo', mass: 1, count: 8 },
          { name: 'Rattlesnakes', emoji: '🐍', scientific: 'Crotalus', mass: 2, count: 12 }
        ],
        energy: 8,
        biomass: 2,
        population: 30,
        percentage: 0.1,
        icon: '🐺',
        color: '#ef4444',
        darkColor: '#f87171',
        fact: 'Coyotes can run at 40 mph for short bursts',
        details: 'Apex predators of the desert',
        energyPerOrganism: 0.27,
        biomassPerOrganism: 0.067
      }
    ],
    foodWeb: {
      producers: ['Cactus', 'Creosote', 'Desert Grasses'],
      primary: ['Kangaroo Rats', 'Desert Tortoise', 'Insects'],
      secondary: ['Roadrunner', 'Lizards', 'Scorpions'],
      tertiary: ['Coyotes', 'Hawks', 'Rattlesnakes'],
      decomposers: ['Dung Beetles', 'Bacteria', 'Fungi']
    },
    relationships: [
      { from: 'Cactus', to: 'Kangaroo Rats', energy: 400, type: 'herbivory' },
      { from: 'Kangaroo Rats', to: 'Roadrunner', energy: 40, type: 'predation' },
      { from: 'Roadrunner', to: 'Coyotes', energy: 4, type: 'predation' },
      { from: 'Insects', to: 'Lizards', energy: 300, type: 'predation' },
      { from: 'Lizards', to: 'Rattlesnakes', energy: 30, type: 'predation' }
    ],
    climate: {
      temperature: [0, 50],
      rainfall: [0, 250],
      seasons: ['Very Hot', 'Cold Night', 'Rain (rare)']
    }
  }
};

// Energy transfer rule constants
export const energyTransferRule = {
  efficiency: 0.1,
  lossReason: 'Respiration (60%), Heat (30%), Undigested (10%)',
  maxLevels: 4,
  trophicPyramidRatio: '100:10:1:0.1'
};

// API endpoints for real data
export const apiEndpoints = {
  gloBI: 'https://api.globalbioticinteractions.org/taxon/',
  eol: 'https://eol.org/api/',
  iucn: 'https://apiv3.iucnredlist.org/api/v3/'
};