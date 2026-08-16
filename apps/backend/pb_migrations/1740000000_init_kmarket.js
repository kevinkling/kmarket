/// <reference path="../pb_data/types.d.ts" />

migrate((app) => {
  const users = app.findCollectionByNameOrId('users');
  users.listRule = '@request.auth.id != ""';
  users.viewRule = '@request.auth.id != ""';
  users.createRule = null;
  users.updateRule = 'id = @request.auth.id';
  users.deleteRule = null;
  app.save(users);

  const idField = {
    name: 'id',
    type: 'text',
    primaryKey: true,
    system: true,
    required: true,
    min: 1,
    max: 100,
    pattern: '^[a-zA-Z0-9_-]+$',
    autogeneratePattern: '[a-z0-9]{15}',
  };

  const createdField = {
    name: 'created',
    type: 'autodate',
    onCreate: true,
    onUpdate: false,
  };

  const updatedField = {
    name: 'updated',
    type: 'autodate',
    onCreate: true,
    onUpdate: true,
  };

  const familyRule = '@request.auth.id != ""';

  const categorias = new Collection({
    name: 'categorias',
    type: 'base',
    listRule: familyRule,
    viewRule: familyRule,
    createRule: familyRule,
    updateRule: familyRule,
    deleteRule: familyRule,
    fields: [
      idField,
      { name: 'nombre', type: 'text', required: true },
      { name: 'orden', type: 'number', required: true },
      { name: 'activa', type: 'bool' },
      createdField,
      updatedField,
    ],
  });
  app.save(categorias);

  const productos = new Collection({
    name: 'productos',
    type: 'base',
    listRule: familyRule,
    viewRule: familyRule,
    createRule: familyRule,
    updateRule: familyRule,
    deleteRule: familyRule,
    fields: [
      idField,
      { name: 'nombre', type: 'text', required: true },
      {
        name: 'categoriaId',
        type: 'relation',
        required: true,
        collectionId: categorias.id,
        cascadeDelete: false,
        maxSelect: 1,
      },
      { name: 'intervaloDias', type: 'number', required: true },
      { name: 'activo', type: 'bool' },
      createdField,
      updatedField,
    ],
  });
  app.save(productos);

  const estadosProducto = new Collection({
    name: 'estados_producto',
    type: 'base',
    listRule: familyRule,
    viewRule: familyRule,
    createRule: familyRule,
    updateRule: familyRule,
    deleteRule: familyRule,
    fields: [
      idField,
      {
        name: 'productoId',
        type: 'relation',
        required: true,
        collectionId: productos.id,
        cascadeDelete: true,
        maxSelect: 1,
      },
      { name: 'ultimaCompra', type: 'date' },
      { name: 'comprar', type: 'bool' },
      createdField,
      updatedField,
    ],
  });
  app.save(estadosProducto);
}, (app) => {
  const names = ['estados_producto', 'productos', 'categorias'];
  for (const name of names) {
    try {
      app.delete(app.findCollectionByNameOrId(name));
    } catch (_) {
      // ignore if the collection was never created
    }
  }
});
