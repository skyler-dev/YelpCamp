const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), users.login);

//공격방지를 위해 연습 이후 POST라우트로 수정할 것.
router.get('/logout', users.logout)

module.exports = router;