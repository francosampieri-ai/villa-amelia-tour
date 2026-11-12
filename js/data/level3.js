// Nivel N3 · +4.30 / +4.90 · Estar familiar (mezzanine), terrazas 2 y 3, y techo +7.40 (PLAN §5 y §11.4)
import { W, door, win, vano, glassDoor, slab, stair, column, room, F } from './common.js';

const Z = 4.30, Z3 = 4.90, ZT = 7.10, ZR = 7.40;

export const level3 = {
  id: 3, name: 'N3 · Estar familiar y terrazas', z: Z,
  spawn: { x: 20.5, y: 14.5, yaw: 180 },

  walls: [
    W('W3.1', [18.9, 11.8], [18.9, 17.45], 0.05, Z, 5.35, 'vid', [], { mullions: [13.7, 15.6], transoms: [] }),
    W('W3.2', [18.75, 11.65], [23.0, 11.65], 0.15, Z, ZT, 'int', [vano(19.0, 20.0, Z, 6.4)]),
    W('W3.3', [23.0, 11.65], [23.0, 17.65], 0.20, Z, ZT, 'ext', [glassDoor(16.5, 17.4, Z, 2.3)]),
    // Terraza 2: antepecho 1.10 (hueco para la llegada de E3.1 al NE)
    W('W3.4a', [23.0, 17.65], [23.0, 23.25], 0.15, Z, 5.40, 'ant'),
    W('W3.4b', [23.0, 23.25], [27.6, 23.25], 0.15, Z, 5.40, 'ant'),
    W('W3.4c', [29.45, 17.65], [29.45, 23.25], 0.15, Z, 5.40, 'ant'),
    W('W3.5', [23.0, 17.65], [27.7, 17.65], 0.15, Z, 6.0, 'ant'),
    // Terraza 3: antepechos 1.10 sobre +4.90
    W('W3.6', [29.45, 9.4], [29.45, 17.65], 0.15, Z3, 6.0, 'ant'),
    W('W3.7', [24.55, 9.4], [24.55, 17.65], 0.15, Z3, 6.0, 'ant', [vano(9.9, 11.5, Z3, 6.0)]),
    W('W3.6b', [27.7, 17.65], [29.45, 17.65], 0.05, Z3, 6.0, 'vid'),
    W('W3.8a', [23.0, 9.4], [24.55, 9.4], 0.15, 4.65, 6.0, 'ant'),
    W('W3.8b', [23.0, 11.65], [24.55, 11.65], 0.15, 4.65, 6.0, 'ant'),
  ],

  columns: [],

  slabs: [
    slab([18.75, 23.0, 11.65, 17.65], Z - 0.25, Z, 'floorBed', 'ceiling'),        // estar familiar (techo de la cocina +4.05)
    slab([19.0, 21.1, 9.9, 11.5], Z - 0.25, Z, 'floorBed', 'ceiling'),            // descanso de E2.1
    slab([23.0, 29.45, 17.65, 23.25], Z - 0.25, Z, 'deckWood', 'ceiling'),        // terraza 2 (techo del BBQ)
    slab([23.0, 24.55, 9.4, 17.65], 4.40, 4.65, 'conc', 'ceiling'),               // techo del pasillo D1-E y distribuidor
    slab([24.55, 29.45, 11.5, 17.65], Z3 - 0.25, Z3, 'deckWood', 'ceiling'),      // terraza 3 (techo de la suite)
    slab([27.3, 29.45, 9.4, 11.5], Z3 - 0.25, Z3, 'deckWood', 'ceiling'),
    slab([24.55, 27.3, 9.4, 9.9], Z3 - 0.25, Z3, 'deckWood', 'ceiling'),
  ],

  stairs: [
    stair('E3.1', [23.5, 29.0, 23.25, 24.5], 1.40, Z, '+x', 17, 'stair', { rail: '+y' }),
    stair('E3.2', [27.7, 29.0, 17.65, 19.0], Z, Z3, '-y', 4),
  ],
  ramps: [],

  rooms: [
    room('Estar familiar', [18.75, 23.0, 11.65, 17.65], Z, 22.3), room('Terraza 2', [23.0, 29.45, 17.65, 23.25], Z, 36),
    room('Terraza 3', [24.55, 29.45, 9.4, 17.65], Z3, 40.4),
  ],

  furniture: [
    F('sofa', 20.35, 13.3, Z, 2.3, 0.9, 0.8, 0), F('sofa', 20.35, 16.2, Z, 2.3, 0.9, 0.8, 180), F('armchair', 21.75, 14.65, Z, 0.8, 0.8, 0.8, 180),
    F('coffeeTable', 20.3, 14.75, Z, 1.0, 0.9, 0.35), F('rug', 20.5, 14.75, Z, 3.0, 3.6, 0.01, 0, { color: 0xc4bbaf }),
    F('tv', 22.85, 14.65, Z, 0.08, 1.6, 0.95, 0), F('floorLamp', 22.3, 16.5, Z, 0.4, 0.4, 1.8), F('plant', 19.3, 17.0, Z, 0.7, 0.7, 1.6),
    // Terraza 2
    F('lounger', 24.65, 21.8, Z, 2.3, 0.8, 0.4, 90), F('lounger', 24.65, 20.15, Z, 2.3, 0.8, 0.4, 90), F('armchair', 26.05, 21.85, Z, 0.8, 0.8, 0.75, 90),
    F('coffeeTable', 26.7, 21.1, Z, 1.4, 0.8, 0.35), F('outSofa', 27.15, 21.5, Z, 1.0, 3.0, 0.7, 0), F('coffeeTable', 27.55, 22.75, Z, 2.0, 0.6, 0.45),
    F('planterPot', 23.6, 18.2, Z, 0.7, 0.7, 1.4), F('planterPot', 28.9, 18.2, Z, 0.7, 0.7, 1.4),
    // Terraza 3 (propuesta)
    F('pergola', 27.0, 13.5, Z3, 4.0, 4.0, 2.5), F('diningTable', 27.0, 13.5, Z3, 0.9, 2.0, 0.75),
    ...[12.8, 13.5, 14.2].flatMap(y => [F('chair', 26.4, y, Z3, 0.45, 0.45, 0.9, -90), F('chair', 27.6, y, Z3, 0.45, 0.45, 0.9, 90)]),
    F('lounger', 26.0, 16.3, Z3, 0.7, 1.9, 0.4), F('lounger', 27.2, 16.3, Z3, 0.7, 1.9, 0.4),
    F('planterPot', 25.0, 10.2, Z3, 0.8, 0.8, 1.5), F('planterPot', 29.0, 17.1, Z3, 0.8, 0.8, 1.5),
  ],

  // Cubierta +7.40: se construye en un grupo aparte que el dollhouse oculta
  roof: {
    slabs: [
      slab([-0.3, 2.0, 1.0, 2.4], ZT, ZR, 'roof', 'ceiling'), slab([9.0, 23.1, 1.0, 2.4], ZT, ZR, 'roof', 'ceiling'),
      slab([-0.3, 18.8, 2.4, 6.5], ZT, ZR, 'roof', 'ceiling'), slab([18.8, 19.8, 2.4, 2.6], ZT, ZR, 'roof', 'ceiling'),
      slab([18.8, 19.8, 4.0, 6.5], ZT, ZR, 'roof', 'ceiling'), slab([19.8, 23.1, 2.4, 6.5], ZT, ZR, 'roof', 'ceiling'),
      slab([-0.3, 3.6, 6.5, 9.4], ZT, ZR, 'roof', 'ceiling'), slab([16.5, 23.1, 6.5, 9.4], ZT, ZR, 'roof', 'ceiling'),
      slab([3.6, 16.5, 6.5, 9.4], ZR - 0.06, ZR, 'glassRoof', 'glassRoof'),           // lucernario del hall
      slab([-0.3, 23.1, 9.4, 17.65], ZT, ZR, 'roof', 'ceiling'),
      slab([-0.3, 23.1, 17.65, 18.6], ZR - 0.20, ZR, 'roof', 'conc'),                 // volado norte
      slab([23.1, 29.6, 1.0, 9.4], ZT, ZR, 'roof', 'ceiling'),                        // bloque master
    ],
    walls: [
      W('W3.10a', [2.0, 2.4], [21.5, 2.4], 0.05, ZR, 7.90, 'rail'), W('W3.10b', [21.5, 2.4], [21.5, 17.65], 0.05, ZR, 7.90, 'rail'),
      W('W3.10c', [21.5, 17.65], [2.0, 17.65], 0.05, ZR, 7.90, 'rail'), W('W3.10d', [2.0, 17.65], [2.0, 2.4], 0.05, ZR, 7.90, 'rail'),
    ],
    louvers: [{ a: [6.25, 18.5], b: [23.0, 18.5], z0: 4.30, z1: 7.40, step: 0.35, w: 0.08, h: 0.25, mat: 'dark' }],
  },
};
