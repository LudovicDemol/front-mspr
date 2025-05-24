import { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useOrderService, type Order } from '../../services/order.service';

export const OrderManagement = () => {
  const { getOrders, getOrder } = useOrderService();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = async (orderId: string) => {
    try {
      const order = await getOrder(orderId);
      setSelectedOrder(order);
      setOpenDialog(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Chargement...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestion des commandes
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Client ID</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{new Date(order.dateCreation).toLocaleDateString()}</TableCell>
                <TableCell>{order.clientId}</TableCell>
                <TableCell>{order.estActif ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Détails de la commande #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                <strong>Date de création:</strong> {new Date(selectedOrder.dateCreation).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Date de modification:</strong> {new Date(selectedOrder.dateModification).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Client ID:</strong> {selectedOrder.clientId}
              </Typography>
              <Typography variant="subtitle1">
                <strong>Statut:</strong> {selectedOrder.estActif ? 'Active' : 'Inactive'}
              </Typography>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                <strong>Produits commandés:</strong>
              </Typography>
              <ul>
                {selectedOrder.produitIds.map((produitId) => (
                  <li key={produitId}>
                    <Typography>{produitId}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};