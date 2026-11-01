import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductDetailView } from '../components/products/ProductDetailView';
import productService from '../services/productService';
import { Skeleton } from '../components/common/Skeleton';

export function ProductDetailPage() {
  const { asin } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    productService
      .getProductByAsin(asin)
      .then((p) => {
        if (mounted) {
          setProduct(p);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          console.error(err);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [asin]);

  if (loading || !product) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <ProductDetailView
      product={product}
      onBack={() => navigate('/analytics')}
    />
  );
}

export default ProductDetailPage;

