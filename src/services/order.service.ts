import { useAuth0 } from '@auth0/auth0-react';

export interface Order {
  id: string;
  dateCreation: string;
  dateModification: string;
  estActif: boolean;
  clientId: string;
  produitIds: string[];
}

export const useOrderService = () => {
  const { getAccessTokenSilently } = useAuth0();
  const API_URL = process.env.VITE_API_COMMANDE_URL;

  const getOrders = async (): Promise<Order[]> => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data.data)) {
        console.log(data.data);
        return data.data as Order[];
      } else {
        throw new Error("Structure de données API inattendue.");
      }

    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
      throw error;
    }
  };

  const getOrder = async (id: string): Promise<Order> => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${API_URL}/get/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      if (data) {
          return data as Order;
      } else {
           throw new Error("Structure de données API inattendue pour une seule commande.");
      }

    } catch (error) {
      console.error(`Erreur lors de la récupération de la commande ${id}:`, error);
      throw error;
    }
  };


  const createOrder = async (clientId: string, produitIds: string[]): Promise<Order> => {
      try {
          const token = await getAccessTokenSilently();
          const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  clientId: clientId,
                  produitIds: produitIds
              })
          });

          if (!response.ok) {
              throw new Error(`Erreur API: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();

          if (data) {
              return data as Order;
          } else {
              throw new Error("Structure de données API inattendue après création.");
          }

      } catch (error) {
          console.error("Erreur lors de la création de la commande:", error);
          throw error;
      }
  };

  return {
    getOrders,
    getOrder,
    createOrder,
  };
};
