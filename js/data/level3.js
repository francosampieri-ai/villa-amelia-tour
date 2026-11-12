// Nivel N3 · +4.30 / +4.90 · Estar familiar (mezzanine), terrazas 2 y 3, y techo +7.40 (PLAN §5 y §11.4)
import { W, door, win, vano, glassDoor, slab, stair, column, room, F } from './common.js';

const Z = 4.30, Z3 = 4.90, ZT = 7.10, ZR = 7.40;

export const level3 = {
  id: 3, name: 'N3 · Estar familiar y terrazas', z: Z,
  spawn: { x: 20.5, y: 14.5, yaw: 180 },

  walls: [
    W('W3.1', [18.9, 11.8], [18.9, 17.45], 0.05, Z, 5.35, 'vid', [], { mullions: [13.7, 15.6], transoms: [] }),
    // Borde sur del estar sobre la caja de escaleras: baranda de vidrio (E6: montantes en y≈11.5), entrada libre en 18.9..19.5
    W('W3.2', [19.5, 11.5], [23.0, 11.5], 0.05, Z, 5.35, 'vid', [], { mullions: [20.4, 21.3, 22.2], transoms: [] }),
    W('W3.3', [23.0, 11.65], [23.0, 17.65], 0.20, Z, ZT, 'ext', [glassDoor(16.5, 17.4, Z, 2.3)]),
    // Terraza 2: antepecho 1.10 (hueco para la llegada de E3.1 al NE)
    W('W3.4a', [23.0, 17.65], [23.0, 23.25], 0.15, Z, 5.40, 'ant'),
    W('W3.4b', [23.0, 23.25], [27.6, 23.25], 0.15, Z, 5.40, 'ant'),
    W('W3.4c', [29.45, 17.65], [29.45, 23.25], 0.15, Z, 5.40, 'ant'),
    W('W3.5', [23.0, 17.65], [27.7, 17.65], 0.15, Z, 6.0, 'ant'),
    // Terraza 3: antepechos 1.10 sobre +4.90
    W('W3.6', [29.45, 9.4], [29.45, 17.65], 0.15, Z3, 6.0, 'ant'),
    W('W3.6b', [29.0, 17.65], [29.45, 17.65], 0.05, Z3, 6.0, 'vid'),             // E3.2 llega a la terraza 3 en 27.7..29.0
    // Descanso de llegada de E3.1 en la esquina NE de la terraza 2, con baranda de vidrio
    W('W3.14', [29.0, 24.8], [29.45, 24.8], 0.05, Z, 5.35, 'vid'),
    W('W3.15', [29.45, 23.25], [29.45, 24.8], 0.05, Z, 5.35, 'vid'),
    // Caja abierta de la escalera E2.2: muro norte desde el piso del distribuidor y baranda en el borde de la terraza 3
    // E6: la terraza 3 (+4.90) cubre de D1 (23.0) a F; su borde sur (y 11.2) es la baranda sobre la caja abierta de E2.2
    W('W3.13', [23.0, 11.2], [28.3, 11.2], 0.05, Z3, Z3 + 1.05, 'vid', [], { mullions: [24.0, 25.0, 26.0, 27.0], transoms: [] }),
  ],

  columns: [],

  slabs: [
    slab([18.75, 23.0, 11.65, 17.65], Z - 0.25, Z, 'floorBed', 'ceiling'),        // estar familiar (techo de la cocina +4.05)
    slab([18.75, 19.4, 9.4, 11.65], Z - 0.25, Z, 'floorBed', 'ceiling'),          // descanso alto de E2.1 (entra al estar por 18.9..19.5)
    slab([23.0, 29.45, 17.65, 23.25], Z - 0.25, Z, 'deckWood', 'ceiling'),        // terraza 2 (techo del BBQ)
    slab([29.0, 29.45, 23.25, 24.8], Z - 0.25, Z, 'deckWood', 'ceiling'),         // descanso de llegada de E3.1
    slab([23.0, 29.45, 11.2, 17.65], Z3 - 0.25, Z3, 'deckWood', 'ceiling'),       // terraza 3 (techo de la suite y del pasillo D1-E), caja de E2.2 abierta en 23..28.3 × 9.6..11.2
    slab([28.3, 29.45, 9.4, 11.2], Z3 - 0.25, Z3, 'deckWood', 'ceiling'),
    slab([24.55, 28.3, 9.4, 9.6], Z3 - 0.25, Z3, 'deckWood', 'ceiling'),
  ],

  stairs: [
    stair('E3.1', [23.0, 29.0, 23.4, 24.8], 1.40, Z, '+x', 17, 'stair', { rail: '+y' }),   // E4: 'S' en x 22.4, treads 23..29, y 23.6..25.0
    stair('E3.2', [27.7, 29.0, 17.65, 18.9], Z, Z3, '-y', 4, 'stair', { rail: '-x' }),      // E6: 'ABAJO', 3 huellas 17.9..18.5
  ],
  ramps: [],

  rooms: [
    room('Estar familiar', [18.75, 23.0, 11.65, 17.65], Z, 22.3), room('Terraza 2', [23.0, 29.45, 17.65, 23.25], Z, 36),
    room('Terraza 3', [23.0, 29.45, 11.2, 17.65], Z3, 41.6),
  ],

  furniture: [
    F('sofa', 20.4, 12.55, Z, 2.2, 1.1, 0.8, 0), F('sofa', 20.4, 15.6, Z, 2.2, 1.1, 0.8, 180), F('armchair', 21.9, 13.9, Z, 0.8, 0.8, 0.8, 215),
    F('coffeeTable', 20.3, 14.75, Z, 1.0, 0.9, 0.35), F('rug', 20.5, 14.75, Z, 3.0, 3.6, 0.01, 0, { color: 0xc4bbaf }),
    F('tv', 22.85, 14.65, Z, 0.08, 1.6, 0.95, 0), F('floorLamp', 22.3, 16.5, Z, 0.4, 0.4, 1.8), F('plant', 19.3, 17.0, Z, 0.7, 0.7, 1.6),
    // Terraza 2
    F('lounger', 24.65, 21.8, Z, 2.3, 0.8, 0.4, 90), F('lounger', 24.65, 20.15, Z, 2.3, 0.8, 0.4, 90), F('armchair', 26.05, 21.85, Z, 0.8, 0.8, 0.75, 90),
    F('coffeeTable', 26.7, 21.1, Z, 1.4, 0.8, 0.35), F('outSofa', 27.15, 21.5, Z, 1.0, 3.0, 0.7, 0), F('coffeeTable', 27.55, 22.75, Z, 2.0, 0.6, 0.45),
    F('planterPot', 23.6, 18.2, Z, 0.7, 0.7, 1.4), F('planterPot', 26.6, 18.2, Z, 0.7, 0.7, 1.4),
    // Terraza 3 (propuesta)
    F('pergola', 27.0, 13.5, Z3, 4.0, 4.0, 2.5), F('diningTable', 27.0, 13.5, Z3, 0.9, 2.0, 0.75),
    ...[12.8, 13.5, 14.2].flatMap(y => [F('chair', 26.4, y, Z3, 0.45, 0.45, 0.9, -90), F('chair', 27.6, y, Z3, 0.45, 0.45, 0.9, 90)]),
    F('lounger', 26.0, 16.3, Z3, 0.7, 1.9, 0.4), F('lounger', 27.2, 16.3, Z3, 0.7, 1.9, 0.4),
    F('planterPot', 25.0, 17.1, Z3, 0.8, 0.8, 1.5), F('planterPot', 29.0, 17.1, Z3, 0.8, 0.8, 1.5),
  ],

  // Cubierta +7.40: se construye en un grupo aparte que el dollhouse oculta
  roof: {
    slabs: [
      // Bloque de dormitorios (fachada sur en y 1.95, E5); huecos: patio sur 2.15..8.9 × 1.95..3.3, lucernario del baño 3 18.6..20.1 × 1.95..4.03
      slab([-0.3, 2.15, 1.95, 3.3], ZT, ZR, 'roof', 'ceiling'), slab([8.9, 18.6, 1.95, 3.3], ZT, ZR, 'roof', 'ceiling'), slab([20.1, 23.1, 1.95, 3.3], ZT, ZR, 'roof', 'ceiling'),
      slab([-0.3, 18.6, 3.3, 4.03], ZT, ZR, 'roof', 'ceiling'), slab([20.1, 23.1, 3.3, 4.03], ZT, ZR, 'roof', 'ceiling'),
      slab([-0.3, 23.1, 4.03, 6.5], ZT, ZR, 'roof', 'ceiling'),
      slab([-0.3, 3.6, 6.5, 9.4], ZT, ZR, 'roof', 'ceiling'), slab([16.5, 23.1, 6.5, 9.4], ZT, ZR, 'roof', 'ceiling'),
      slab([3.6, 16.5, 6.5, 9.4], ZR - 0.06, ZR, 'glassRoof', 'glassRoof'),           // lucernario del hall
      slab([-0.3, 23.1, 9.4, 17.65], ZT, ZR, 'roof', 'ceiling'),
      slab([-0.3, 23.1, 17.65, 18.6], ZR - 0.20, ZR, 'roof', 'conc'),                 // volado norte
      slab([23.1, 30.3, 1.95, 9.4], ZT, ZR, 'roof', 'ceiling'),                       // bloque master (vuela hasta x 30.3, E5)
    ],
    walls: [
      W('W3.10a', [2.0, 2.4], [21.5, 2.4], 0.05, ZR, 7.90, 'rail'), W('W3.10b', [21.5, 2.4], [21.5, 17.65], 0.05, ZR, 7.90, 'rail'),
      W('W3.10c', [21.5, 17.65], [2.0, 17.65], 0.05, ZR, 7.90, 'rail'), W('W3.10d', [2.0, 17.65], [2.0, 2.4], 0.05, ZR, 7.90, 'rail'),
    ],
    louvers: [{ a: [6.25, 18.5], b: [23.0, 18.5], z0: 4.30, z1: 7.40, step: 0.35, w: 0.08, h: 0.25, mat: 'dark' }],
  },
};
