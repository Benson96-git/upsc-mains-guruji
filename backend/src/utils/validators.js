class Validators {
  static validateUrl(url) {
    try {
      const urlObj = new URL(url);
      const allowedDomains = [
        'thehindu.com',
        'indianexpress.com',
        'timesofindia.indiatimes.com',
        'economictimes.indiatimes.com',
        'hindustantimes.com',
        'deccanherald.com'
      ];
      
      const domain = urlObj.hostname;
      const isAllowed = allowedDomains.some(allowed => domain.includes(allowed));
      
      return {
        isValid: isAllowed,
        error: isAllowed ? null : `Domain not supported. Supported domains: ${allowedDomains.join(', ')}`
      };
    } catch (error) {
      return {
        isValid: false,
        error: 'Invalid URL format. Please include http:// or https://'
      };
    }
  }

  static validateEditorialText(text) {
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return {
        isValid: false,
        error: 'Editorial text cannot be empty'
      };
    }

    if (text.length < 100) {
      return {
        isValid: false,
        error: 'Editorial text is too short (minimum 100 characters required)'
      };
    }

    if (text.length > 10000) {
      return {
        isValid: false,
        error: 'Editorial text is too long (maximum 10000 characters allowed)'
      };
    }

    return { isValid: true };
  }

  static validateQuestion(question) {
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return {
        isValid: false,
        error: 'Question cannot be empty'
      };
    }

    if (question.length < 10) {
      return {
        isValid: false,
        error: 'Question is too short'
      };
    }

    if (question.length > 1000) {
      return {
        isValid: false,
        error: 'Question is too long'
      };
    }

    return { isValid: true };
  }
}

module.exports = Validators;