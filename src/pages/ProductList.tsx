import { Container, Grid, Typography } from '@mui/material';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

export const ProductList = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Nos Produits
      </Typography>
      <Grid container spacing={2}>
       <p>zpeo</p>
      </Grid>
    </Container>
  );
};