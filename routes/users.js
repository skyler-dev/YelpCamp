const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', users.renderRegister);

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login);

//공격방지를 위해 연습 이후 POST라우트로 수정할 것.
router.get('/logout', users.logout)

module.exports = router;