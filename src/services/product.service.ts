import type { Product } from '../types/Product';
import { useAuth0 } from '@auth0/auth0-react';
import api from './api';

export const useProductService = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return [];
  };

  const getProduct = async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  };

  const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await api.post('/products', product);
    return response.data;
  };

  const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  };

  const deleteProduct = async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  };

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  };
};