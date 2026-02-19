export const GBIF_BASE_URL = 'https://api.gbif.org/v1';
export const OWID_BASE_URL = 'https://ourworldindata.org/grapher';

export const API_ENDPOINTS = {
  GBIF: {
    SPECIES_SEARCH: `${GBIF_BASE_URL}/species/search`,
    OCCURRENCE: `${GBIF_BASE_URL}/occurrence/search`,
    OCCURRENCE_COUNT: `${GBIF_BASE_URL}/occurrence/count`
  },
  OWID: {
    FOREST_AREA: `${OWID_BASE_URL}/forest-area.csv`,
    CO2: `${OWID_BASE_URL}/co2.csv`,
    POPULATION: `${OWID_BASE_URL}/world-population.csv`,
    TEMPERATURE: `${OWID_BASE_URL}/temperature-anomaly.csv`
  }
};