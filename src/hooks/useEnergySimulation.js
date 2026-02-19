import { useState, useEffect, useCallback, useMemo } from 'react';
import { ecosystems } from '../data/ecosystems';

export const useEnergySimulation = (initialEcosystemId) => {
  const [ecosystemId, setEcosystemId] = useState(initialEcosystemId || 'forest');
  const [producerEnergy, setProducerEnergy] = useState(20000);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [energyHistory, setEnergyHistory] = useState([]);
  const [selectedOrganism, setSelectedOrganism] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [timeStep, setTimeStep] = useState(0);

  // Get current ecosystem data
  const currentEcosystem = useMemo(() => {
    return ecosystems[ecosystemId] || ecosystems.forest;
  }, [ecosystemId]);

  // Calculate energy at each trophic level (10% rule)
  const calculateEnergyLevels = useCallback((baseEnergy) => {
    return currentEcosystem.trophicLevels.map((level, index) => ({
      level: level.level,
      levelId: level.levelId,
      energy: baseEnergy * Math.pow(0.1, index),
      percentage: 100 * Math.pow(0.1, index),
      biomass: currentEcosystem.trophicLevels[index].biomass * (baseEnergy / 20000),
      population: Math.round(currentEcosystem.trophicLevels[index].population * (baseEnergy / 20000)),
      color: level.color,
      organisms: level.organisms,
      fact: level.fact,
      details: level.details
    }));
  }, [currentEcosystem]);

  // Calculate biomass based on energy
  const calculateBiomass = useCallback((energy, trophicIndex) => {
    const baseBiomass = currentEcosystem.trophicLevels[trophicIndex]?.biomass || 0;
    return baseBiomass * (energy / 20000);
  }, [currentEcosystem]);

  // Calculate number of organisms
  const calculateOrganisms = useCallback((biomass, avgMass) => {
    return Math.round(biomass / avgMass);
  }, []);

  // Get all organisms with their current stats
  const getAllOrganisms = useCallback(() => {
    const energyLevels = calculateEnergyLevels(producerEnergy);
    return currentEcosystem.trophicLevels.flatMap((level, index) => 
      level.organisms.map(org => ({
        ...org,
        trophicLevel: level.level,
        trophicIndex: index,
        currentEnergy: energyLevels[index].energy * (org.mass / level.biomass),
        currentBiomass: energyLevels[index].biomass * (org.mass / level.biomass),
        currentPopulation: Math.round(energyLevels[index].population * (org.count / level.population))
      }))
    );
  }, [currentEcosystem, producerEnergy, calculateEnergyLevels]);

  // Energy levels based on current producer energy
  const energyLevels = useMemo(() => 
    calculateEnergyLevels(producerEnergy),
    [producerEnergy, calculateEnergyLevels]
  );

  // Animation effect
  useEffect(() => {
    let interval;
    let animationFrame;
    
    if (isAnimating) {
      interval = setInterval(() => {
        setProducerEnergy(prev => {
          // Cycle between 5000 and 25000 with smooth sine wave
          const range = 20000;
          const midPoint = 15000;
          const newEnergy = midPoint + Math.sin(timeStep * 0.1 * simulationSpeed) * (range / 2);
          return Math.round(newEnergy);
        });
        setTimeStep(prev => prev + 1);
      }, 50);
    }
    return () => {
      clearInterval(interval);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isAnimating, simulationSpeed, timeStep]);

  // Record energy history for charts
  useEffect(() => {
    setEnergyHistory(prev => {
      const newHistory = [...prev, {
        time: Date.now(),
        producer: producerEnergy,
        primary: producerEnergy * 0.1,
        secondary: producerEnergy * 0.01,
        tertiary: producerEnergy * 0.001,
        efficiency: 10,
        loss: 90
      }];
      // Keep last 30 data points for smooth chart
      return newHistory.slice(-30);
    });
  }, [producerEnergy]);

  // Calculate energy loss
  const energyLoss = useMemo(() => {
    return {
      totalLoss: producerEnergy - (producerEnergy * 0.001),
      percentage: 99.9,
      byLevel: energyLevels.map((level, i) => ({
        level: level.level,
        loss: i === 0 ? producerEnergy * 0.9 : producerEnergy * Math.pow(0.1, i) * 0.9,
        remaining: level.energy
      }))
    };
  }, [producerEnergy, energyLevels]);

  // Get relationship data for food web
  const relationships = useMemo(() => {
    return currentEcosystem.relationships.map(rel => ({
      ...rel,
      currentEnergy: rel.energy * (producerEnergy / 20000)
    }));
  }, [currentEcosystem, producerEnergy]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setProducerEnergy(20000);
    setTimeStep(0);
    setIsAnimating(false);
    setEnergyHistory([]);
  }, []);

  // Change ecosystem
  const changeEcosystem = useCallback((newEcosystemId) => {
    setEcosystemId(newEcosystemId);
    resetSimulation();
  }, [resetSimulation]);

  return {
    // State
    ecosystemId,
    currentEcosystem,
    producerEnergy,
    simulationSpeed,
    isAnimating,
    energyLevels,
    energyHistory,
    selectedOrganism,
    showDetails,
    energyLoss,
    relationships,
    allOrganisms: getAllOrganisms(),
    
    // Setters
    setProducerEnergy,
    setSimulationSpeed,
    setIsAnimating,
    setSelectedOrganism,
    setShowDetails,
    
    // Actions
    resetSimulation,
    changeEcosystem,
    calculateBiomass,
    calculateOrganisms
  };
};