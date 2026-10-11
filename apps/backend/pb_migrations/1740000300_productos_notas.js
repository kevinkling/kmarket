/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const productos = app.findCollectionByNameOrId('productos');
  productos.fields.removeByName('intervaloDias');
  productos.fields.add(new TextField({
    name: 'notas',
    max: 500,
  }));
  app.save(productos);
}, (app) => {
  const productos = app.findCollectionByNameOrId('productos');
  productos.fields.removeByName('notas');
  productos.fields.add(new NumberField({
    name: 'intervaloDias',
    required: false,
  }));
  app.save(productos);
});
