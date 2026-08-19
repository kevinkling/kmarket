/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const users = app.findCollectionByNameOrId('users');
  users.authToken.duration = 90 * 24 * 60 * 60;
  app.save(users);
}, (app) => {
  const users = app.findCollectionByNameOrId('users');
  users.authToken.duration = 7 * 24 * 60 * 60;
  app.save(users);
});
