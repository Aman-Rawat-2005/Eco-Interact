export const processHistoricalData = (rawData) => {
  // Sort by year
  const sorted = [...rawData].sort((a, b) => a.year - b.year);
  
  // Calculate trends
  const withTrends = sorted.map((item, index, array) => {
    if (index === 0) {
      return {
        ...item,
        populationTrend: 0,
        forestTrend: 0
      };
    }

    const prev = array[index - 1];
    const populationTrend = ((item.population - prev.population) / prev.population) * 100;
    const forestTrend = ((item.forestArea - prev.forestArea) / prev.forestArea) * 100;

    return {
      ...item,
      populationTrend,
      forestTrend
    };
  });

  // Calculate normalized values (0-100 scale for charting)
  const maxPopulation = Math.max(...withTrends.map(d => d.population));
  const maxForest = Math.max(...withTrends.map(d => d.forestArea));

  return withTrends.map(item => ({
    ...item,
    populationNormalized: (item.population / maxPopulation) * 100,
    forestNormalized: (item.forestArea / maxForest) * 100,
    biodiversityIndex: item.biodiversity
  }));
};

export const formatYearLabel = (year) => {
  if (year < 0) return `${Math.abs(year)} BCE`;
  return year.toString();
};

export const getEraLabel = (year) => {
  if (year < 0) return 'Ancient Era';
  if (year < 1000) return 'Medieval Era';
  if (year < 1800) return 'Pre-Industrial';
  if (year < 1950) return 'Industrial Era';
  if (year < 2000) return 'Modern Era';
  return 'Contemporary';
};