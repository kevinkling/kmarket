export interface SeedProducto {
  id: string;
  nombre: string;
  categoria: string;
  fechaAgregado?: string;
  mes?: string;
}

export const CATEGORIAS_SEED: { id: string; nombre: string; orden: number; intervaloPorDefecto: number }[] = [
  { id: 'almacen_secos', nombre: 'Almacén y Secos', orden: 1, intervaloPorDefecto: 30 },
  { id: 'panaderia_masas', nombre: 'Panadería y Masas', orden: 2, intervaloPorDefecto: 15 },
  { id: 'lacteos_huevos', nombre: 'Lácteos y Huevos', orden: 3, intervaloPorDefecto: 7 },
  { id: 'condimentos', nombre: 'Condimentos y Especias', orden: 4, intervaloPorDefecto: 60 },
  { id: 'frutas_verduras', nombre: 'Frutas y Verduras', orden: 5, intervaloPorDefecto: 7 },
  { id: 'carnes_congelados', nombre: 'Carnes y Congelados', orden: 6, intervaloPorDefecto: 15 },
  { id: 'higiene_personal', nombre: 'Higiene Personal', orden: 7, intervaloPorDefecto: 30 },
  { id: 'limpieza_hogar', nombre: 'Limpieza del Hogar', orden: 8, intervaloPorDefecto: 30 },
];

export const PRODUCTOS_SEED: SeedProducto[] = [
  { id: 'prod_001', nombre: 'Arroz', categoria: 'almacen_secos' },
  { id: 'prod_002', nombre: 'Aceite de oliva', categoria: 'almacen_secos' },
  { id: 'prod_003', nombre: 'Harina', categoria: 'almacen_secos' },
  { id: 'prod_004', nombre: 'Arvejas', categoria: 'almacen_secos' },
  { id: 'prod_005', nombre: 'Choclo', categoria: 'almacen_secos' },
  { id: 'prod_006', nombre: 'Garbanzos', categoria: 'almacen_secos' },
  { id: 'prod_007', nombre: 'Puré de tomate', categoria: 'almacen_secos' },
  { id: 'prod_008', nombre: 'Sal', categoria: 'almacen_secos' },
  { id: 'prod_009', nombre: 'Fideos largos', categoria: 'almacen_secos' },
  { id: 'prod_010', nombre: 'Fideos cortos', categoria: 'almacen_secos' },
  { id: 'prod_011', nombre: 'Aderezos', categoria: 'almacen_secos' },
  { id: 'prod_012', nombre: 'Mermelada', categoria: 'almacen_secos' },
  { id: 'prod_013', nombre: 'Yerba', categoria: 'almacen_secos' },
  { id: 'prod_014', nombre: 'Azúcar', categoria: 'almacen_secos' },
  { id: 'prod_015', nombre: 'Café', categoria: 'almacen_secos' },
  { id: 'prod_016', nombre: 'Té', categoria: 'almacen_secos' },
  { id: 'prod_017', nombre: 'Galletitas saladas', categoria: 'almacen_secos' },
  { id: 'prod_018', nombre: 'Prepizzas', categoria: 'panaderia_masas' },
  { id: 'prod_019', nombre: 'Tapa de empanada', categoria: 'panaderia_masas' },
  { id: 'prod_020', nombre: 'Tapa de tarta', categoria: 'panaderia_masas' },
  { id: 'prod_021', nombre: 'Manteca', categoria: 'lacteos_huevos' },
  { id: 'prod_022', nombre: 'Huevos', categoria: 'lacteos_huevos' },
  { id: 'prod_023', nombre: 'Leche', categoria: 'lacteos_huevos' },
  { id: 'prod_024', nombre: 'Quesos', categoria: 'lacteos_huevos' },
  { id: 'prod_025', nombre: 'Yogur', categoria: 'lacteos_huevos' },
  { id: 'prod_026', nombre: 'Pimienta', categoria: 'condimentos' },
  { id: 'prod_027', nombre: 'Orégano', categoria: 'condimentos' },
  { id: 'prod_028', nombre: 'Pimentón', categoria: 'condimentos' },
  { id: 'prod_029', nombre: 'Limón', categoria: 'frutas_verduras' },
  { id: 'prod_030', nombre: 'Ajo', categoria: 'frutas_verduras' },
  { id: 'prod_031', nombre: 'Cebolla', categoria: 'frutas_verduras' },
  { id: 'prod_032', nombre: 'Papa', categoria: 'frutas_verduras' },
  { id: 'prod_033', nombre: 'Morrón', categoria: 'frutas_verduras' },
  { id: 'prod_034', nombre: 'Frutas', categoria: 'frutas_verduras' },
  { id: 'prod_035', nombre: 'Milanesas', categoria: 'carnes_congelados' },
  { id: 'prod_036', nombre: 'Pollo', categoria: 'carnes_congelados' },
  { id: 'prod_037', nombre: 'Carne vacuna', categoria: 'carnes_congelados' },
  { id: 'prod_038', nombre: 'Shampoo', categoria: 'higiene_personal' },
  { id: 'prod_039', nombre: 'Jabón', categoria: 'higiene_personal' },
  { id: 'prod_040', nombre: 'Dentífrico', categoria: 'higiene_personal' },
  { id: 'prod_041', nombre: 'Desodorante', categoria: 'higiene_personal' },
  { id: 'prod_042', nombre: 'Servilletas', categoria: 'limpieza_hogar' },
  { id: 'prod_043', nombre: 'Papel higiénico', categoria: 'limpieza_hogar' },
  { id: 'prod_044', nombre: 'Bolsas de residuos', categoria: 'limpieza_hogar' },
  { id: 'prod_045', nombre: 'Detergente', categoria: 'limpieza_hogar' },
  { id: 'prod_046', nombre: 'Esponja', categoria: 'limpieza_hogar' },
  { id: 'prod_047', nombre: 'Lavandina', categoria: 'limpieza_hogar' },
];
