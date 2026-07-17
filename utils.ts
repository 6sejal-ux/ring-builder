import { useQuery } from '@tanstack/react-query';
import { storefrontApiRequest, STOREFRONT_PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify';

export function useProducts(first = 20, query?: string) {
  return useQuery({
    queryKey: ['shopify-products', first, query],
    queryFn: async (): Promise<ShopifyProduct[]> => {
      const data = await storefrontApiRequest(STOREFRONT_PRODUCTS_QUERY, { first, query });
      return data?.data?.products?.edges ?? [];
    },
  });
}
