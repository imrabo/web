import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';
import type { ConnectorFilters } from '../types/connector.types';
import type { CreateConnectorFormValues, UpdateConnectorFormValues } from '../schemas';
import { COLLECTIONS } from '@/lib/constants/COLLECTIONS';
import connectorService from '../services/connectorService';

/**
 * Hook to fetch all connectors with optional filters
 */
export const useConnectorsQuery = (filters?: ConnectorFilters) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, filters],
    queryFn: () =>
      connectorService.fetchConnectors(
        filters ? ({ ...filters } as Record<string, string | number | boolean | Date>) : undefined
      ),
  });
};

/**
 * Legacy hook to fetch both connectors and products for backward compatibility
 */
export const useConnectorsAndProductsQuery = () => {
  return useQuery({
    queryKey: ['connectors-and-products'],
    queryFn: async () => {
      const [files, products] = await Promise.all([
        connectorService.fetchFileConnectors(),
        connectorService.fetchProducts(),
      ]);
      return { files, products };
    },
  });
};

/**
 * Hook to fetch a single connector by ID
 */
export const useConnectorQuery = (id: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, id],
    queryFn: () => connectorService.fetchConnectorById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch connectors by creator
 */
export const useConnectorsByCreatorQuery = (creatorId: string) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, 'by-creator', creatorId],
    queryFn: () => connectorService.fetchConnectorsByCreator(creatorId),
    enabled: !!creatorId,
  });
};

/**
 * Hook to fetch connector statistics
 */
export const useConnectorStatsQuery = () => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, 'stats'],
    queryFn: () => connectorService.getConnectorStats(),
  });
};

/**
 * Hook to fetch popular connectors
 */
export const usePopularConnectorsQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, 'popular', limit],
    queryFn: () => connectorService.getPopularConnectors(limit),
  });
};

/**
 * Hook to fetch recent connectors
 */
export const useRecentConnectorsQuery = (limit: number = 10) => {
  return useQuery({
    queryKey: [COLLECTIONS.RESOURCES, 'recent', limit],
    queryFn: () => connectorService.getRecentConnectors(limit),
  });
};

/**
 * Hook to create a new connector
 */
export const useCreateConnectorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateConnectorFormValues) => connectorService.createConnector(data as any),

    onSuccess: (newConnector) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'stats'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'recent'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'popular'] });

      toast.success(`Connector "${newConnector.data?.title}" created successfully`);
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to create connector');
    },
  });
};

/**
 * Hook to create a new product for backward compatibility
 */
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => connectorService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectors-and-products'] });
      toast.success('Catalog product added successfully');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to add product');
    },
  });
};

/**
 * Hook to update an existing connector
 */
export const useUpdateConnectorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConnectorFormValues }) =>
      connectorService.updateConnector(id, data as any),

    onSuccess: (updatedConnector) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, updatedConnector.data?.id] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'recent'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'popular'] });

      toast.success(`Connector "${updatedConnector.data?.title}" updated successfully`);
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to update connector');
    },
  });
};

/**
 * Hook to delete a connector
 */
export const useDeleteConnectorMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => connectorService.deleteConnector(id),

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, id] });
      queryClient.invalidateQueries({ queryKey: ['connectors-and-products'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'stats'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'recent'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'popular'] });

      toast.success('Connector deleted successfully');
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete connector');
    },
  });
};

/**
 * Hook to delete a product for backward compatibility
 */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => connectorService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectors-and-products'] });
      toast.success('Product deleted from catalog');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete product');
    },
  });
};

/**
 * Hook to increment download count for a connector
 */
export const useIncrementDownloadsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => connectorService.incrementDownloads(id),

    onSuccess: (updatedConnector) => {
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, updatedConnector.data?.id] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'stats'] });
      queryClient.invalidateQueries({ queryKey: [COLLECTIONS.RESOURCES, 'popular'] });

      toast.success(`Download count incremented for "${updatedConnector.data?.title}"`);
    },

    onError: (err: any) => {
      toast.error(err.message || 'Failed to increment download count');
    },
  });
};
