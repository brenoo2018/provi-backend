const { Router } = require('express');

const usersRouter = Router();

usersRouter.get('/create', (req, res) => {
  res.send('page create user');
});

module.exports = usersRouter;
