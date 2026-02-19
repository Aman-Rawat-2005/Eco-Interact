import axios from 'axios';
import { OWID_BASE_URL } from '../../constants/apiEndpoints';

class OWIDService {
  constructor() {
    this.baseURL = OWID_BASE_URL;
  }

  // Get forest area data
  async getForestAreaData(country) {
    try {
      const response = await axios.get(`${this.baseURL}/forest-area.csv`);
      const parsedData = this.parseCSV(response.data);
      return this.filterByCountry(parsedData, country);
    } catch (error) {
      console.error('OWID API Error:', error);
      throw error;
    }
  }

  // Get CO2 emissions data
  async getCO2Data(country) {
    try {
      const response = await axios.get(`${this.baseURL}/co2.csv`);
      const parsedData = this.parseCSV(response.data);
      return this.filterByCountry(parsedData, country);
    } catch (error) {
      console.error('OWID API Error:', error);
      throw error;
    }
  }

  // Parse CSV data
  parseCSV(csvString) {
    const lines = csvString.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, i) => {
        obj[header.trim()] = values[i]?.trim();
        return obj;
      }, {});
    }).filter(row => row.year);
  }

  // Filter by country
  filterByCountry(data, country) {
    return data.filter(row => row.entity === country);
  }
}

export default new OWIDService();