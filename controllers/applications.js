const express = require('express');
const router = express.Router();
const User = require('../models/user');

// GET /users/:userId/applications
router.get('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        res.render('applications/index.ejs', {
            applications: currentUser.applications
        });
        // pass the current user's applications to the index page
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

// GET /users/:userId/applications/new
router.get('/new', async (req, res) => {
    res.render('applications/new.ejs');
});

// POST /users/:userId/applications
router.post('/', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        currentUser.applications.push(req.body); 
        // this changes the applications list in memory ONLY - NOT in the database
        await currentUser.save(); // this makes the changes permanent in the database
        res.redirect(`/users/${currentUser._id}/applications`);
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

router.get('/:applicationId', async (req, res) => {
    try {
      // Look up the user from req.session
      const currentUser = await User.findById(req.session.user._id);
      // Find the application by the applicationId supplied from req.params
      const application = currentUser.applications.id(req.params.applicationId);
      // Render the show view, passing the application data in the context object
      res.render('applications/show.ejs', {
        application: application,
      });
    } catch (error) {
      // If any errors, log them and redirect back home
      console.log(error);
      res.redirect('/');
    }
  });
  
module.exports = router;
