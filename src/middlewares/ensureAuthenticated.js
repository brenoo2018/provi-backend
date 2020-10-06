const { verify } = require('jsonwebtoken');

const authConfig = require('../config/auth');

module.exports = function ensureAuthenticated(request, response, next) {
  // validaçao token jwt

  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.json({ message: 'JWT token is missing' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded;

    request.user = {
      user_uuid: sub,
    };

    return next();
  } catch (error) {
    console.log(error);
    return response.json({ message: 'Invalid JWT token' });
  }
};
