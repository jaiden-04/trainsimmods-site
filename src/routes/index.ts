import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes';
import modRoutes from './modRoutes';
import categoryRoutes from './categoryRoutes';
import adminRoutes from './adminRoutes';
import { ModController } from '../controllers/ModController';

const router = Router();
const modController = new ModController();

router.get('/', (request: Request, response: Response) => {
  response.redirect('/mods');
});

router.use('/', authRoutes);
router.use('/mods', modRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);
router.get('/category/:slug', modController.showModsByCategory.bind(modController));

export default router;