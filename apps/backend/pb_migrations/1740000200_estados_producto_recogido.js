/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const collection = app.findCollectionByNameOrId('estados_producto');
  collection.fields.add(new BoolField({
    name: 'recogido',
  }));
  app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId('estados_producto');
  collection.fields.removeByName('recogido');
  app.save(collection);
});
