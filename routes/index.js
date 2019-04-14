const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
// Wellcome Page
router.get('/',(req,res)=> res.render('wellcome'));

// Dashbord
router.get('/dashbord', ensureAuthenticated,(req,res)=> 
res.render('dashbord',{
    name:req.user.name
}));

module.exports = router;
