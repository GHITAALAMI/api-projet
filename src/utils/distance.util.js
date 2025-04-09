/**
 * Calcule la distance en kilomètres entre deux points géographiques
 * en utilisant la formule de Haversine
 * 
 * @param {number} lat1 Latitude du premier point
 * @param {number} lon1 Longitude du premier point
 * @param {number} lat2 Latitude du deuxième point
 * @param {number} lon2 Longitude du deuxième point
 * @returns {number} Distance en kilomètres
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Rayon de la Terre en kilomètres
  const R = 6371;
  
  // Conversion des degrés en radians
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  // Formule de Haversine
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance en kilomètres
  
  return parseFloat(distance.toFixed(2)); // Arrondi à 2 décimales
}

/**
 * Calcule la distance totale d'un itinéraire composé de plusieurs points
 * 
 * @param {Array} stops Tableau d'objets avec latitude et longitude
 * @returns {number} Distance totale en kilomètres
 */
function calculateRouteDistance(stops) {
  if (!stops || stops.length < 2) {
    return 0;
  }
  
  let totalDistance = 0;
  
  for (let i = 0; i < stops.length - 1; i++) {
    const currentStop = stops[i];
    const nextStop = stops[i + 1];
    
    totalDistance += calculateDistance(
      currentStop.latitude,
      currentStop.longitude,
      nextStop.latitude,
      nextStop.longitude
    );
  }
  
  return parseFloat(totalDistance.toFixed(2));
}

module.exports = {
  calculateDistance,
  calculateRouteDistance
}; 