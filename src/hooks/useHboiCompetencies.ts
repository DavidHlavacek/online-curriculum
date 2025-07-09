import { useState, useEffect } from 'react';
import { Competency } from '../types';
import { HboiApiService } from '../services/hboiApi';

// fallback mock data for when API is unavailable
const getMockCompetencies = (): Record<string, Competency[]> => {
  return {
    'User Interaction': [
      {
        id: 'UI_ANA_L2_1',
        text: 'Benchmark functionality, user experience, accessibility, and other design aspects for a client',
        level: 2,
        category: 'Analysis',
        domain: 'User Interaction',
        archCode: 'UI_ANA_L2_1'
      },
      {
        id: 'UI_ANA_L3_1',
        text: 'Analyse current and emerging interactive technologies',
        level: 3,
        category: 'Analysis',
        domain: 'User Interaction',
        archCode: 'UI_ANA_L3_1'
      }
    ],
    'Organisational processes': [
      {
        id: 'OP_ANA_L2_1',
        text: 'Analyze organizational processes and data flows',
        level: 2,
        category: 'Analysis',
        domain: 'Organisational processes',
        archCode: 'OP_ANA_L2_1'
      }
    ],
    'Infrastructure': [
      {
        id: 'INF_DES_L3_1',
        text: 'Design software architecture and infrastructure solutions',
        level: 3,
        category: 'Design',
        domain: 'Infrastructure',
        archCode: 'INF_DES_L3_1'
      }
    ],
    'Software': [
      {
        id: 'SW_REA_L3_1',
        text: 'Implement and test software solutions',
        level: 3,
        category: 'Realise',
        domain: 'Software',
        archCode: 'SW_REA_L3_1'
      }
    ],
    'Hardware-interfacing': [
      {
        id: 'HW_DES_L2_1',
        text: 'Design hardware interfaces and embedded systems',
        level: 2,
        category: 'Design',
        domain: 'Hardware-interfacing',
        archCode: 'HW_DES_L2_1'
      }
    ]
  };
};

export function useHboiCompetencies(language: 'en' | 'nl' = 'en') {
  const [competencies, setCompetencies] = useState<Record<string, Competency[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetencies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const api = new HboiApiService();
        const data = await api.getCompetencies(language);
        
        // transform CompetencyData to Competency and group by architecture layer
        const grouped = data.reduce((acc, item) => {
          // map API activity names to our category type (both English and Dutch)
          const categoryMapping: Record<string, Competency['category']> = {
            // English
            'Analysis': 'Analysis',
            'Advise': 'Advise',
            'Design': 'Design',
            'Realise': 'Realise',
            'Manage & Control': 'Manage & Control',
            'Manage & control': 'Manage & Control', 
            // Dutch
            'Analyseren': 'Analysis',
            'Adviseren': 'Advise',
            'Ontwerpen': 'Design',
            'Realiseren': 'Realise'
          };
          
          // map API layer names to our domain type (both English and Dutch)
          const domainMapping: Record<string, Competency['domain']> = {
            // English
            'User interaction': 'User Interaction',
            'Organisational processes': 'Organisational processes',
            'Infrastructure': 'Infrastructure',
            'Software': 'Software',
            'Hardware-interfacing': 'Hardware-interfacing',
            // Dutch
            'Gebruikersinteractie': 'User Interaction',
            'Organisatieprocessen': 'Organisational processes',
            'Infrastructuur': 'Infrastructure'
          };
          
          const mappedCategory = categoryMapping[item.activity];
          const mappedDomain = domainMapping[item.architectureLayer];
          
          // only include if we have valid mappings
          if (mappedCategory && mappedDomain) {
            const competency: Competency = {
              id: item.archCode,
              text: item.description,
              level: item.level,
              category: mappedCategory,
              domain: mappedDomain,
              archCode: item.archCode
            };
            
            if (!acc[mappedDomain]) {
              acc[mappedDomain] = [];
            }
            acc[mappedDomain].push(competency);
          }
          
          return acc;
        }, {} as Record<string, Competency[]>);
        
        // ensure all domains are present
        const allDomains: Competency['domain'][] = [
          'User Interaction',
          'Organisational processes',
          'Infrastructure',
          'Software',
          'Hardware-interfacing'
        ];
        
        allDomains.forEach(domain => {
          if (!grouped[domain]) {
            grouped[domain] = [];
          }
        });
        
        setCompetencies(grouped);
      } catch (err) {
        console.error('Error fetching competencies:', err);
        setError(err instanceof Error ? err.message : 'Failed to load competencies');
        
        // use mock data as fallback
        console.log('Using mock competencies as fallback');
        setCompetencies(getMockCompetencies());
      } finally {
        setLoading(false);
      }
    };

    fetchCompetencies();
  }, [language]);

  return { competencies, loading, error };
}