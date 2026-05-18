// Objet API requis par ton code HTML
const api = {
  // 1. Récupère le menu depuis le fichier data.json
  async getMenu() {
    try {
      const response = await fetch('data.json');
      if (!response.ok) {
        throw new Error('Impossible de charger le menu');
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur API getMenu:", error);
      throw error;
    }
  },

  // 2. Envoie la commande finale (Simulation d'un envoi au serveur)
  async createOrder(orderData) {
    try {
      // On simule un délai réseau de 1.5 seconde (pour voir l'animation de chargement)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dans une vraie application, on ferait un fetch POST comme ceci :
      /*
      const response = await fetch('https://ton-serveur.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) throw new Error('Erreur lors de la création');
      return await response.json();
      */

      // Pour l'instant, on affiche simplement le résultat dans la console
      console.log("Commande envoyée avec succès au serveur ! 🚀", orderData);
      return { success: true, orderId: orderData.id };
    } catch (error) {
      console.error("Erreur API createOrder:", error);
      throw error;
    }
  }
};