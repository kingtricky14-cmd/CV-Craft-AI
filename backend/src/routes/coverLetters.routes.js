import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  listCoverLetters,
  getCoverLetter,
  createCoverLetter,
  updateCoverLetter,
  deleteCoverLetter,
} from '../controllers/coverLetters.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listCoverLetters);
router.post('/', createCoverLetter);
router.get('/:id', getCoverLetter);
router.patch('/:id', updateCoverLetter);
router.delete('/:id', deleteCoverLetter);

export default router;
