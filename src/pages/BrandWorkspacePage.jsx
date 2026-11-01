import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BrandWorkspaceView } from '../components/brands/BrandWorkspaceView';
import { BrandModal } from '../components/brands/BrandModal';
import brandService from '../services/brandService';

export function BrandWorkspacePage() {
  const { brandId } = useParams();
  const navigate = useNavigate();
  const [editingBrand, setEditingBrand] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveBrand = async (formData) => {
    if (editingBrand) {
      await brandService.updateBrand(editingBrand.id, formData);
      setEditingBrand(null);
      setIsModalOpen(false);
      window.location.reload();
    }
  };

  return (
    <>
      <BrandWorkspaceView
        brandId={brandId || 'village-company'}
        onBack={() => navigate('/brands')}
        onEdit={(brand) => {
          setEditingBrand(brand);
          setIsModalOpen(true);
        }}
      />

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBrand(null);
        }}
        onSave={handleSaveBrand}
        brand={editingBrand}
      />
    </>
  );
}

export default BrandWorkspacePage;

