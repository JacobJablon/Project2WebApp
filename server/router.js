const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/account', mid.requiresLogin, controllers.Poem.accountPage);
  app.get('/getMyPoems', mid.requiresLogin, controllers.Poem.getMyPoems);
  app.delete('/deletePoem/:id', mid.requiresLogin, controllers.Poem.deletePoemById);

  app.get('/writer', mid.requiresLogin, controllers.Poem.writerPage);
  app.post('/writer', mid.requiresLogin, controllers.Poem.writePoem);
  app.get('/getMyPoemCount', mid.requiresLogin, controllers.Poem.getMyPoemCount);

  app.get('/feed', mid.requiresLogin, controllers.Poem.feedPage);
  app.get('/getAllPublicPoems', mid.requiresLogin, controllers.Poem.getAllPublicPoems);
  app.patch('/likeOrUnlikePoem/:id', mid.requiresLogin, controllers.Poem.likeOrUnlikePoem);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/*', (req, res) => {
    res.redirect('/feed');
  });
};

module.exports = router;
