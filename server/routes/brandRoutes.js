import express from 'express';
import {
  getBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandWorkspace,
} from '../controllers/brandController.js';

const router = express.Router();

router.get('/', getBrands);
router.post('/', createBrand);
router.get('/:id', getBrandById);
router.put('/:id', updateBrand);
router.delete('/:id', deleteBrand);
router.get('/:id/workspace', getBrandWorkspace);

export default router;

