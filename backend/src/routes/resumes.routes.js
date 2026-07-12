import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
  listResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} from '../controllers/resumes.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', listResumes);
router.post('/', createResume);
router.get('/:id', getResume);
router.patch('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/duplicate', duplicateResume);

export default router;
