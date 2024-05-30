const Medecin = require('../medecin/medecinshema');
const Assistant = require('../aide/aideshema');

const globalMedecin = async (req, res) => {
    try {
      // Effectuer une requête pour obtenir le nombre global de patients
      const totalMedecin = await Medecin.countDocuments();
      // Vous pouvez également effectuer d'autres calculs ou agrégations ici si nécessaire
  
      // Formater les données pour les renvoyer
      const globalMedecinsData = {
        total: totalMedecin,
        percentChange: 'Medecins', // Le pourcentage de changement que vous souhaitez afficher
        chartData: {/* Format de données de graphique */}
      };
  
     
      res.json(globalMedecinsData);
    } catch (error) {
      console.error('Error fetching global medecins data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  const globalAssistant = async (req, res) => {
    try {
      // Effectuer une requête pour obtenir le nombre global de patients
      const totalAides= await Assistant.countDocuments();
      // Vous pouvez également effectuer d'autres calculs ou agrégations ici si nécessaire
  
      // Formater les données pour les renvoyer
      const globalAidesData = {
        total: totalAides,
        percentChange: 'Assistants', // Le pourcentage de changement que vous souhaitez afficher
        chartData: {/* Format de données de graphique */}
      };
  
     
      res.json(globalAidesData);
    } catch (error) {
      console.error('Error fetching global aides data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
  
  module.exports = { globalMedecin, globalAssistant }; 
  