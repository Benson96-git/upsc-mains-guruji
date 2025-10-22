const editorialService = require('../services/editorial.service');

class EditorialController {
  async extractEditorial(req, res, next) {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ 
          error: 'URL is required',
          details: 'Please provide a valid newspaper editorial URL'
        });
      }

      const result = await editorialService.extractEditorialContent(url);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async generateQuestions(req, res, next) {
    try {
      const { editorialText } = req.body;
      
      if (!editorialText || editorialText.trim().length === 0) {
        return res.status(400).json({ 
          error: 'Editorial text is required',
          details: 'Please provide editorial content to generate questions'
        });
      }

      const result = await editorialService.generateUPSCQuestions(editorialText);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async generateAnswer(req, res, next) {
    try {
      const { question, editorialContext } = req.body;
      
      if (!question || !editorialContext) {
        return res.status(400).json({ 
          error: 'Question and editorial context are required',
          details: 'Both question and editorial context are needed to generate an answer'
        });
      }

      const result = await editorialService.generateModelAnswer(question, editorialContext);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EditorialController();