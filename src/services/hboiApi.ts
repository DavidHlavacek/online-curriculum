// HBO-i API Service for fetching competencies
const API_BASE_URL = 'https://api.domeinbeschrijving.hbo-i.nl';

export interface CompetencyData {
  archCode: string;
  description: string;
  level: number;
  activity: string;
  architectureLayer: string;
}

interface DescriptionItem {
  id: number;
  value: string;
  items: any[];
}

export class HboiApiService {
  private cache: Map<string, any> = new Map();
  private cacheExpiry = 3600000; // 1 hour
  
  clearCache() {
    this.cache.clear();
  }

  async getCompetencies(language: 'nl' | 'en' = 'en'): Promise<CompetencyData[]> {
    const cacheKey = `competencies_${language}`;
    
    // Check cache first
    const cached = this.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      // use language ID: 1 Dutch, 2 English
      const languageId = language === 'en' ? 2 : 1;
      const response = await fetch(`${API_BASE_URL}/api/descriptions?language=${languageId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch competencies: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // validate 
      if (!Array.isArray(data)) {
        throw new Error('Invalid API response format');
      }
      
      // transform the nested data into flat format
      const competencies = this.transformDescriptions(data);
      
      // cache the results
      this.setCache(cacheKey, competencies);
      
      return competencies;
    } catch (error) {
      console.error('Error fetching HBO-i competencies:', error);
      throw error; 
    }
  }

  private transformDescriptions(data: DescriptionItem[]): CompetencyData[] {
    const competencies: CompetencyData[] = [];
    
    // architecture layers
    data.forEach((layer: DescriptionItem) => {
      const architectureLayer = layer.value;
      
      // debugging
      if (!layer.value || !layer.items) {
        console.warn('Invalid layer structure:', layer);
        return;
      }
      
      // activities
      if (layer.items && Array.isArray(layer.items)) {
        layer.items.forEach((activity: DescriptionItem) => {
          const activityName = activity.value;
          
          // levels
          if (activity.items && Array.isArray(activity.items)) {
            activity.items.forEach((level: DescriptionItem) => {
              const levelNumber = parseInt(level.value);
              
              // skip invalid level 
              if (isNaN(levelNumber) || levelNumber < 1 || levelNumber > 4) {
                console.warn('Invalid level number:', level.value);
                return;
              }
              
              // descriptions
              if (level.items && Array.isArray(level.items) && level.items.length > 0) {
                level.items.forEach((description: string, index: number) => {
                  // skip empty descriptions
                  if (description && typeof description === 'string' && description.trim()) {
                    competencies.push({
                      archCode: `${this.getLayerCode(architectureLayer)}_${this.getActivityCode(activityName)}_L${levelNumber}_${index + 1}`,
                      description: description.trim(),
                      level: levelNumber,
                      activity: this.normalizeActivity(activityName),
                      architectureLayer: this.normalizeArchLayer(architectureLayer)
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
    
    return competencies;
  }

  private getLayerCode(layer: string): string {
    const mapping: Record<string, string> = {
      'User interaction': 'UI',
      'Organisational processes': 'OP',
      'Infrastructure': 'INF',
      'Software': 'SW',
      'Hardware-interfacing': 'HW'
    };
    return mapping[layer] || layer.substring(0, 3).toUpperCase();
  }

  private getActivityCode(activity: string): string {
    const mapping: Record<string, string> = {
      'Analysis': 'ANA',
      'Advise': 'ADV',
      'Design': 'DES',
      'Realise': 'REA',
      'Manage & Control': 'MC'
    };
    return mapping[activity] || activity.substring(0, 3).toUpperCase();
  }

  private normalizeActivity(activity: string): string {
    // normalize activity names
    const mapping: Record<string, string> = {
      // English
      'Analysis': 'Analysis',
      'Advise': 'Advise',
      'Design': 'Design',
      'Realise': 'Realise',
      'Manage & control': 'Manage & Control', 
      'Manage & Control': 'Manage & Control',
      // Dutch
      'Analyseren': 'Analysis',
      'Adviseren': 'Advise',
      'Ontwerpen': 'Design',
      'Realiseren': 'Realise'
    };
    return mapping[activity] || activity;
  }

  private normalizeArchLayer(layer: string): string {
    // normalize architecture layer names 
    const mapping: Record<string, string> = {
      // English
      'User interaction': 'User interaction',
      'Organisational processes': 'Organisational processes',
      'Infrastructure': 'Infrastructure',
      'Software': 'Software',
      'Hardware-interfacing': 'Hardware-interfacing',
      // Dutch
      'Gebruikersinteractie': 'User interaction',
      'Organisatieprocessen': 'Organisational processes',
      'Infrastructuur': 'Infrastructure'
    };
    return mapping[layer] || layer;
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // // get professional skills 
  // async getProfessionalSkills(language: 'nl' | 'en' = 'en'): Promise<any[]> {
  //   try {
  //     const languageId = language === 'en' ? 2 : 1;
  //     const response = await fetch(`${API_BASE_URL}/api/professional-skills?language=${languageId}`);
      
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch professional skills: ${response.statusText}`);
  //     }
      
  //     return await response.json();
  //   } catch (error) {
  //     console.error('Error fetching professional skills:', error);
  //     return [];
  //   }
  // }

  // get all data at once using export endpoint
  async getAllData(language: 'nl' | 'en' = 'en'): Promise<any> {
    try {
      const languageId = language === 'en' ? 2 : 1;
      const response = await fetch(`${API_BASE_URL}/api/export?language=${languageId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch all data: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching all data:', error);
      return null;
    }
  }
}