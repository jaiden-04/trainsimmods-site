import { Router } from 'express';
import passport from '../config/passport';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

router.get('/auth/steam', passport.authenticate('steam'));
router.get('/auth/steam/callback', passport.authenticate('steam', {
  successRedirect: '/',
  failureRedirect: '/login',
}));

router.post('/logout', authController.logout);

export default router;