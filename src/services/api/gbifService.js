import axios from 'axios';
import { GBIF_BASE_URL } from '../../constants/apiEndpoints';

class GBIFService {
  constructor() {
    this.baseURL = GBIF_BASE_URL;
  }

  // Get species occurrence data over time
  async getSpeciesTrend(species, country, startYear = 1900, endYear = 2024) {
    try {
      const response = await axios.get(`${this.baseURL}/occurrence/search`, {
        params: {
          taxonKey: species,
          country: country,
          year: `${startYear},${endYear}`,
          limit: 0
        }
      });
      return response.data;
    } catch (error) {
      console.error('GBIF API Error:', error);
      throw error;
    }
  }

  // Get biodiversity index for a region
  async getBiodiversityIndex(country, year) {
    try {
      const response = await axios.get(`${this.baseURL}/occurrence/count`, {
        params: {
          country: country,
          year: year
        }
      });
      return response.data;
    } catch (error) {
      console.error('GBIF API Error:', error);
      throw error;
    }
  }

  // Get species list for ecosystem
  async getEcosystemSpecies(ecosystem, country) {
    const speciesMap = {
      forest: ['Quercus', 'Cervus', 'Vulpes', 'Canis lupus'],
      marine: ['Thunnus', 'Carcharodon', 'Delphinus'],
      desert: ['Cactaceae', 'Dipodomys', 'Canis latrans']
    };
    
    return speciesMap[ecosystem] || [];
  }
}

export default new GBIFService();