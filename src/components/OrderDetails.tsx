import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderService, type Order } from '../services/order.service';
import { Box, Typography, Paper, CircularProgress, Alert } from '@mui/material';

export const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrder } = useOrderService();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) {
          throw new Error('ID de commande non spécifié');
        }
        const orderData = await getOrder(id);
        setOrder(orderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, getOrder]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box p={2}>
        <Alert severity="info">Aucune commande trouvée</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Détails de la commande #{order.id}
        </Typography>
        
        <Box mt={2}>
          <Typography variant="subtitle1">
            <strong>Date de création:</strong> {new Date(order.dateCreation).toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Date de modification:</strong> {new Date(order.dateModification).toLocaleDateString()}
          </Typography>
          <Typography variant="subtitle1">
            <strong>Statut:</strong> {order.estActif ? 'Active' : 'Inactive'}
          </Typography>
          <Typography variant="subtitle1">
            <strong>ID Client:</strong> {order.clientId}
          </Typography>
        </Box>

        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Produits commandés
          </Typography>
          {order.produitIds.length > 0 ? (
            <ul>
              {order.produitIds.map((produitId) => (
                <li key={produitId}>
                  <Typography>{produitId}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography>Aucun produit dans cette commande</Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
};