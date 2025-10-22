const express = require('express');
const editorialController = require('../controllers/editorial.controller');
const Validators = require('../utils/validators');

const router = express.Router();

// Middleware to validate URL
const validateUrl = (req, res, next) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ 
      error: 'URL is required',
      details: 'Please provide a valid newspaper editorial URL'
    });
  }

  const validation = Validators.validateUrl(url);
  if (!validation.isValid) {
    return res.status(400).json({ 
      error: 'Invalid URL',
      details: validation.error
    });
  }

  next();
};

// Middleware to validate editorial text
const validateEditorialText = (req, res, next) => {
  const { editorialText } = req.body;
  const validation = Validators.validateEditorialText(editorialText);
  
  if (!validation.isValid) {
    return res.status(400).json({ 
      error: 'Invalid editorial text',
      details: validation.error
    });
  }

  next();
};

router.post('/extract', validateUrl, editorialController.extractEditorial);
router.post('/generate-questions', validateEditorialText, editorialController.generateQuestions);
router.post('/generate-answer', editorialController.generateAnswer);

module.exports = router;