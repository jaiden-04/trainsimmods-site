import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticatePage } from '../middleware/authenticate';

const router = Router();
const adminController = new AdminController();

router.get('/reports', authenticatePage, adminController.showReports);
router.post('/reports/:id/resolve', authenticatePage, adminController.resolveReport);
router.post('/reports/:id/dismiss', authenticatePage, adminController.dismissReport);

export default router;