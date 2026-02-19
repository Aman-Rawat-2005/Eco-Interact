import { useState, useEffect, useCallback } from 'react';

// 📊 MOCK DATA - जब तक API properly integrate न हो
const generateMockHistoricalData = (ecosystem) => {
  const years = [];
  const startYear = 1900;
  const endYear = 2024;
  const step = 10;
  
  // Base values according to ecosystem
  let basePopulation, baseForest;
  
  switch(ecosystem) {
    case 'forest':
      basePopulation = 50000;
      baseForest = 80; // 80% forest cover
      break;
    case 'marine':
      basePopulation = 1000000;
      baseForest = 100; // Marine doesn't have forest, using fish stock index
      break;
    case 'desert':
      basePopulation = 10000;
      baseForest = 5; // Desert has minimal vegetation
      break;
    default:
      basePopulation = 50000;
      baseForest = 80;
  }
  
  for (let year = startYear; year <= endYear; year += step) {
    // Decline factor - population decreases over time
    const declineFactor = 1 - ((year - startYear) / (endYear - startYear)) * 0.7;
    // Forest loss accelerates in later years
    const forestLossFactor = year < 1950 ? 0.98 : 0.95;
    
    const population = Math.round(basePopulation * declineFactor * (0.95 + Math.random() * 0.1));
    const forestArea = baseForest * Math.pow(forestLossFactor, (year - startYear) / 20);
    const biodiversity = population / 1000 * (forestArea / 100);
    
    years.push({
      year,
      population: Math.max(population, 1000),
      forestArea: Math.max(forestArea, 1),
      biodiversity: Math.max(biodiversity, 0.1),
      populationTrend: year > startYear ? -5 + Math.random() * 10 : 0,
      forestTrend: year > startYear ? -2 + Math.random() * 4 : 0
    });
  }
  
  return years;
};

export const useHistoricalData = (ecosystem = 'forest', country = 'IN') => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(2024);

  // Fetch historical data (using mock data for now)
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // TODO: Replace with actual API calls when backend is ready
        // For now, using mock data
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate mock data based on ecosystem
        const mockData = generateMockHistoricalData(ecosystem);
        setHistoricalData(mockData);
        
      } catch (err) {
        console.error('Error fetching historical data:', err);
        setError(err.message || 'Failed to load historical data');
        
        // Fallback to mock data even on error
        const mockData = generateMockHistoricalData(ecosystem);
        setHistoricalData(mockData);
        setError(null); // Clear error since we have fallback
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [ecosystem, country]);

  // Get data for specific year
  const getDataForYear = useCallback((year) => {
    if (!historicalData.length) return null;
    
    // Find closest year in data
    const closest = historicalData.reduce((prev, curr) => {
      return (Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev);
    });
    
    return closest;
  }, [historicalData]);

  // Calculate population multiplier for energy adjustment
  const getPopulationMultiplier = useCallback((year) => {
    const data = getDataForYear(year);
    const currentData = getDataForYear(2024);
    
    if (!data || !currentData) return 1;
    
    // Avoid division by zero
    if (currentData.population === 0) return 1;
    
    return data.population / currentData.population;
  }, [historicalData, getDataForYear]);

  return {
    historicalData,
    loading,
    error,
    selectedYear,
    setSelectedYear,
    getPopulationMultiplier,
    getDataForYear
  };
};