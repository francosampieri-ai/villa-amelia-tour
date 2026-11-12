// Nivel N1 · +1.40 · Barra social, suite E-F, BBQ, deck (PLAN §3 y §11.2)
import { W, door, win, vano, glassDoor, slab, floor, stair, column, room, F } from './common.js';

const Z = 1.40, ZT = 7.10;
// Montantes de la mampara norte (cotas E4 desde x = 0.2) y travesaño a +4.30
const MULL_N = [4.40, 5.59, 6.78, 7.97, 9.16, 11.48, 12.68, 13.88, 16.20, 17.35, 18.50, 19.65, 21.74];

export const level1 = {
  id: 1, name: 'N1 · Área social y piscina', z: Z,
  spawn: { x: 12.8, y: 12.6, yaw: 90 },

  walls: [
    // Mampara norte M1.1 (vidrio piso-techo en dos bandas)
    W('W1.1', [0.2, 17.45], [22.85, 17.45], 0.05, Z, ZT, 'vid', [
      glassDoor(0.3, 1.3, Z, 2.9),          // P1.2 estudio → deck
      glassDoor(12.68, 14.8, Z, 2.9),       // P1.4 corredera (dos paños abiertos)
      glassDoor(20.5, 21.5, Z, 2.9),        // P1.5 corredera cocina (un paño abierto)
    ], { mullions: MULL_N, transoms: [4.30] }),
    // Fachada oeste del estudio M1.2 + fin de concreto
    W('W1.2', [0.2, 11.65], [0.2, 16.2], 0.05, Z, ZT, 'vid', [], { mullions: [13.1, 14.6], transoms: [4.30] }),
    W('W1.2b', [0.2, 16.2], [0.2, 17.45], 0.25, Z, ZT, 'ext'),
    W('W1.3', [0.0, 9.4], [0.0, 11.65], 0.20, Z, 3.2, 'ext'),
    // Jardinera-antepecho hacia el pasillo de entrada
    W('W1.4a', [0.2, 11.65], [1.3, 11.65], 0.20, Z, ZT, 'ext'),
    W('W1.4b', [1.3, 11.65], [5.1, 11.65], 0.20, Z, 2.1, 'planter'),
    // Muro TV + estantería-celosía encima (M1.5)
    W('W1.5', [6.25, 11.65], [13.4, 11.65], 0.20, Z, 3.47, 'wood'),
    W('W1.6', [13.4, 11.65], [18.75, 11.65], 0.15, Z, 3.47, 'int'),
    // Galería y cajas de escaleras
    W('W1.7', [6.25, 9.5], [13.4, 9.5], 0.20, Z, 3.47, 'ext'),
    W('W1.8', [13.4, 9.4], [23.0, 9.4], 0.20, Z, 3.47, 'ext'),
    W('W1.9a', [18.75, 9.4], [18.75, 11.65], 0.15, Z, 3.47, 'int'),
    W('W1.10', [22.6, 9.4], [22.6, 11.65], 0.15, 0.40, 3.47, 'int'),
    // Baranda de vidrio de la cocina sobre la caja de escaleras E0.3/E2.1 (fila de montantes en E4, y≈11.5)
    W('W1.26', [19.4, 11.5], [22.6, 11.5], 0.05, Z, Z + 1.0, 'vid', [], { mullions: [20.2, 21.0, 21.8], transoms: [] }),
    // Muro este de la barra (D1) y pasillo D1-E
    // Muro D1: entre y 9.4 y 11.65 sólo hasta +3.47 (encima, W2.26a con el paso E2.1 ↔ distribuidor ↔ E2.2)
    W('W1.11a', [23.0, 9.4], [23.0, 11.65], 0.20, 0.40, 3.47, 'ext'),
    W('W1.11', [23.0, 11.65], [23.0, 17.65], 0.20, Z, 4.30, 'ext', [door(12.0, 12.8, Z), door(15.6, 16.4, Z)]),
    // Tramo de la antesala con techo a +3.47 (la escalera E2.2 pasa encima, 2.07 m libres); el resto hasta +4.65
    W('W1.12a', [24.55, 9.4], [24.55, 11.65], 0.15, Z, 3.47, 'int', [door(10.6, 11.4, Z)]),
    W('W1.12', [24.55, 11.65], [24.55, 17.65], 0.15, Z, 4.65, 'int', [door(15.2, 16.0, Z)]),
    W('W1.13', [23.0, 17.65], [29.45, 17.65], 0.20, Z, 4.05, 'ext', [door(23.3, 24.1, Z), door(26.5, 27.9, Z, 2.1, false)]),
    W('W1.14', [29.45, 9.4], [29.45, 17.65], 0.20, Z, 4.65, 'ext', [win(9.6, 11.3, Z, 3.5), win(12.4, 13.0, 3.0, 3.6), door(15.5, 16.3, Z)]),
    W('W1.15', [24.55, 11.4], [29.45, 11.4], 0.15, Z, 4.65, 'int', [door(27.0, 27.8, Z)]),
    W('W1.16', [24.55, 13.0], [29.45, 13.0], 0.15, Z, 4.65, 'int', [door(25.0, 25.8, Z)]),
    W('W1.17', [26.6, 11.4], [26.6, 13.0], 0.15, Z, 4.65, 'int'),
    W('W1.18', [24.55, 9.4], [29.45, 9.4], 0.20, Z, 4.65, 'ext'),                 // E4: entre 23.0 y 24.55 pasa la escalera E0.4
    // Caja del baño de visitas (volumen de altura completa, revestido en madera)
    W('W1.19a', [4.35, 13.2], [6.3, 13.2], 0.15, Z, ZT, 'woodSlats'),
    W('W1.19b', [6.3, 13.2], [6.3, 16.1], 0.15, Z, ZT, 'woodSlats'),
    W('W1.19c', [4.35, 16.1], [6.3, 16.1], 0.15, Z, ZT, 'woodSlats', [door(5.3, 6.1, Z)]),
    W('W1.19d', [4.35, 13.2], [4.35, 16.1], 0.15, Z, ZT, 'woodSlats'),
    // Murete bajo de la escalera exterior E3.1
    W('W1.21', [23.0, 23.25], [29.45, 23.25], 0.20, Z, 2.5, 'conc'),
    // Módulo de servicio MS (celdas con puerta al este)
    W('W1.22a', [-3.2, 17.7], [-3.2, 31.5], 0.15, Z, 4.8, 'ext', [door(20.3, 21.1, Z), door(23.3, 24.1, Z), door(26.3, 27.1, Z), door(29.0, 29.8, Z)]),
    W('W1.22b', [-5.55, 17.7], [-3.2, 17.7], 0.15, Z, 4.8, 'ext'),
    W('W1.22c', [-5.7, 19.62], [-3.2, 19.62], 0.15, Z, 4.8, 'int'),
    W('W1.22d', [-6.0, 22.73], [-3.2, 22.73], 0.15, Z, 4.8, 'int'),
    W('W1.22e', [-6.25, 25.62], [-3.2, 25.62], 0.15, Z, 4.8, 'int'),
    W('W1.22f', [-6.45, 27.5], [-3.2, 27.5], 0.15, Z, 4.8, 'int'),
    W('W1.22g', [-6.8, 31.5], [-3.2, 31.5], 0.15, Z, 4.8, 'ext'),
    // Contención del deck sobre el jardín frontal
    W('W1.25', [-4.8, 17.65], [-0.3, 17.65], 0.20, 0.0, Z, 'conc'),
  ],

  columns: [
    ...[0, 6.25, 12.5, 18.75, 23.0].map(x => column(x, 17.65, Z, ZT)),
    ...[0, 6.25, 12.5, 18.75].map(x => column(x, 11.65, Z, ZT)),
    column(23.0, 23.25, Z, 4.30), column(29.45, 17.65, Z, 4.30), column(29.45, 23.25, Z, 4.30),
    column(24.55, 9.4, Z, 4.65), column(24.55, 17.65, Z, 4.65),
  ],

  slabs: [
    slab([-0.3, 23.0, 11.65, 17.65], Z - 0.25, Z, 'floorSocial', 'ceiling'),     // barra social
    slab([6.2, 19.4, 9.4, 11.65], Z - 0.25, Z, 'floorSocial', 'ceiling'),        // galería, base E1.1 y descanso alto de E0.3
    slab([23.0, 24.55, 11.65, 17.65], Z - 0.25, Z, 'floorSocial', 'ceiling'),    // pasillo D1-E (E0.4 llega en y 11.65)
    slab([24.5, 29.45, 9.4, 17.65], Z - 0.25, Z, 'floorBed', 'ceiling'),         // suite E-F
    // Deck y patios (adoquín espina de pez)
    slab([-3.2, 0.5, 17.65, 26.5], Z - 0.25, Z, 'pavers', 'conc'),
    slab([0.5, 7.7, 17.65, 21.5], Z - 0.25, Z, 'pavers', 'conc'),
    slab([7.7, 21.5, 17.65, 21.9], Z - 0.25, Z, 'pavers', 'conc'),
    slab([7.7, 21.5, 25.7, 26.5], Z - 0.25, Z, 'pavers', 'conc'),
    slab([21.5, 23.0, 17.65, 26.5], Z - 0.25, Z, 'pavers', 'conc'),
    slab([23.0, 29.45, 17.65, 23.25], Z - 0.25, Z, 'pavers', 'conc'),            // BBQ
    slab([23.0, 33.0, 23.25, 26.5], Z - 0.25, Z, 'pavers', 'conc'),
    slab([31.1, 33.0, 11.65, 23.25], Z - 0.25, Z, 'pavers', 'conc'),             // patio este (al este de la rampa)
    slab([29.45, 31.1, 13.9, 23.25], Z - 0.25, Z, 'pavers', 'conc'),             // patio este (cabecera de la rampa)
    slab([-5.55, -3.2, 17.7, 31.5], Z - 0.25, Z, 'tileGrey', 'conc'),            // piso del MS
    slab([-6.8, -3.2, 17.7, 31.5], 4.8, 5.05, 'conc', 'ceiling'),                // techo del MS
  ],

  stairs: [
    stair('E1.1', [14.0, 18.0, 9.6, 11.5], Z, 3.47, '-x', 13),                    // E4: 12 huellas 14.0..18.0, 'S' al este, sube al oeste
  ],
  ramps: [],

  rooms: [
 room('Estudio / recibo', [0.2, 4.3, 11.8, 17.45], Z, 23.2),
    room('Baño de visitas', [4.35, 6.3, 13.2, 16.1], Z, 4.6), room('Bar', [6.3, 10.8, 11.8, 17.45], Z, 7.8),
    room('Sala', [10.8, 14.8, 11.8, 17.45], Z, 22.7), room('Galería', [6.25, 13.4, 9.4, 11.65], Z, 15),
    room('Comedor', [14.8, 18.75, 11.8, 17.45], Z, 22.3), room('Cocina', [18.75, 23.0, 11.8, 17.45], Z, 22.3),
    room('Pasillo D1-E', [23.0, 24.55, 9.4, 17.65], Z, 12.8), room('Suite · dormitorio de huéspedes', [24.55, 29.45, 13.0, 17.65], Z, 22.8),
    room('Suite · baño y closet', [24.55, 29.45, 11.4, 13.0], Z, 7.8), room('Suite · antesala', [24.55, 29.45, 9.4, 11.4], Z, 9.8),
    room('BBQ · terraza cubierta', [23.0, 29.45, 17.65, 23.25], Z, 36), room('Deck y piscina', [-0.3, 23.0, 17.65, 27.0], Z, 300),
    room('Jardín / gimnasio exterior', [0.5, 9.0, 21.5, 28.5], Z, 60), room('Módulo de servicio', [-6.8, -3.2, 17.7, 31.5], Z, 44),
    room('Patio lateral este', [29.45, 33.0, 11.65, 17.65], Z, 21), room('Escalera principal', [13.4, 18.75, 9.4, 11.65], Z, 0),
  ],

  furniture: [
    // Estudio
    F('desk', 1.4, 14.5, Z, 1.2, 2.2, 0.75), F('chair', 0.65, 14.5, Z, 0.5, 0.5, 0.9, -90),
    F('daybed', 4.1, 14.65, Z, 1.6, 2.7, 0.45), F('roundTable', 4.6, 12.7, Z, 0.6, 0.6, 0.55),
    F('plant', 1.0, 12.3, Z, 0.7, 0.7, 1.7), F('rug', 2.2, 14.5, Z, 2.6, 3.4, 0.01, 0, { color: 0xb9b2a6 }),
    // Bar
    F('barCabinet', 6.6, 14.65, Z, 0.6, 2.7, 2.4), F('bar', 8.25, 14.65, Z, 0.5, 2.7, 1.05),
    ...[13.7, 14.33, 14.97, 15.6].map(y => F('stool', 8.85, y, Z, 0.4, 0.4, 0.75)),
    // Sala
    F('sofa', 12.8, 14.55, Z, 3.3, 1.0, 0.8, -90), F('chaise', 11.45, 15.5, Z, 1.1, 1.3, 0.8, 90),
    F('coffeeTable', 13.05, 14.0, Z, 1.0, 1.0, 0.35), F('pouf', 11.2, 12.6, Z, 0.6, 0.6, 0.4), F('pouf', 12.65, 12.6, Z, 0.6, 0.6, 0.4),
    F('rug', 12.7, 14.3, Z, 3.4, 4.2, 0.01, 0, { color: 0xcfc7b8 }), F('tv', 9.6, 11.78, Z, 1.8, 0.08, 1.0),
    F('plant', 14.4, 16.9, Z, 0.8, 0.8, 1.9), F('painting', 7.5, 11.78, Z, 1.6, 0.05, 1.1, 0, { color: 0x6b4a2b }),
    // Comedor
    F('diningTable', 16.15, 14.45, Z, 1.5, 3.1, 0.75),
    ...[13.2, 14.0, 14.8, 15.6].flatMap(y => [F('chair', 15.1, y, Z, 0.45, 0.45, 0.9, -90), F('chair', 17.2, y, Z, 0.45, 0.45, 0.9, 90)]),
    F('pendant', 16.15, 14.45, Z, 2.4, 0.12, 0.06, 90, { hang: 3.6 }), F('sideboard', 16.3, 11.95, Z, 2.2, 0.45, 0.8),
    // Cocina
    F('island', 20.0, 14.3, Z, 1.0, 3.0, 0.9), ...[13.1, 13.9, 14.7, 15.5].map(y => F('stool', 19.3, y, Z, 0.4, 0.4, 0.75)),
    F('counter', 22.5, 14.65, Z, 0.65, 5.3, 0.9), F('fridge', 22.5, 12.5, Z, 0.7, 0.9, 2.1), F('ovenTower', 22.5, 13.75, Z, 0.65, 0.6, 2.1),
    F('cabinet', 22.5, 17.0, Z, 0.65, 0.8, 2.1), F('hood', 22.4, 15.0, Z, 0.5, 0.9, 0.4, 0, { hang: 1.6 }),
    // Suite E-F
    F('bed', 27.0, 15.6, Z, 1.6, 2.0, 0.55, 0), F('nightstand', 25.95, 16.3, Z, 0.45, 0.45, 0.5), F('nightstand', 28.05, 16.3, Z, 0.45, 0.45, 0.5),
    F('armchair', 27.0, 10.4, Z, 0.8, 0.8, 0.8, 90), F('sink', 27.2, 12.85, Z, 0.5, 0.45, 0.85, 0), F('toilet', 28.6, 12.75, Z, 0.4, 0.65, 0.75, 0),
    F('shower', 29.0, 11.8, Z, 0.8, 0.8, 2.0), F('closet', 24.9, 12.2, Z, 0.6, 1.5, 2.3, 0), F('closet', 26.3, 12.2, Z, 0.5, 1.5, 2.3, 0),
    // BBQ
    F('roundTable', 24.8, 20.75, Z, 1.2, 1.2, 0.75), F('chair', 24.8, 19.9, Z, 0.45, 0.45, 0.9, 90), F('chair', 24.8, 21.6, Z, 0.45, 0.45, 0.9, -90),
    F('bar', 26.35, 20.55, Z, 0.7, 2.5, 1.0), ...[19.9, 20.4, 20.9, 21.4].map(y => F('stool', 25.75, y, Z, 0.4, 0.4, 0.75)),
    F('grill', 28.35, 20.55, Z, 0.7, 2.5, 0.9),
    // Deck
    ...[11.9, 13.2, 15.4, 16.7].map(x => F('lounger', x, 19.85, Z, 0.7, 1.9, 0.4)),
    F('outSofa', 20.5, 19.5, Z, 2.2, 0.9, 0.7), F('armchair', 22.0, 20.3, Z, 0.8, 0.8, 0.75, 180), F('armchair', 22.0, 21.0, Z, 0.8, 0.8, 0.75, 180),
    F('coffeeTable', 20.3, 20.8, Z, 0.9, 0.9, 0.35), F('umbrella', 10.2, 19.8, Z, 2.6, 2.6, 2.4),
    // Jardín
    F('gymBar', 3.2, 26.8, Z, 3.5, 0.9, 2.2), F('bench', 1.4, 24.8, Z, 1.2, 0.6, 0.45), F('dome', 3.5, 24.3, Z, 2.3, 2.3, 1.6),
    F('palm', 22.5, 24.5, Z, 1, 1, 7), F('tree', 29.0, 25.0, Z, 1, 1, 6),
    F('hedge', 14.0, 26.5, Z, 32.0, 0.6, 1.8), F('hedge', 31.5, 19.5, Z, 0.6, 14.0, 1.6),
    F('plant', 29.9, 17.2, Z, 0.9, 0.9, 1.6), F('plant', 23.4, 17.2, Z, 0.9, 0.9, 1.8),
    F('planter', 3.2, 11.78, Z + 0.7, 3.6, 0.25, 0.4),
  ],
};
