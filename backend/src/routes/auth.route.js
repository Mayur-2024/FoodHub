const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');


const router = express.Router();

// user auth routes
router.post('/user/register', authController.registerUser);
router.post('/user/login', authController.loginUser);
router.get('/user/logout', authController.logoutUser);
router.get('/user/profile', authMiddleware.authUserMiddleware, authController.getCurrentUserProfile);

// foodpartner auth routes
router.post('/foodpartner/register', authController.registerFoodPartner);
router.post('/foodpartner/login', authController.loginFoodPartner);
router.get('/foodpartner/logout', authController.logoutFoodPartner);
router.get('/foodpartner/profile', authMiddleware.authFoodPartnerMiddleware, authController.getCurrentFoodPartnerProfile);

module.exports = router;