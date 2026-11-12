// Nivel N0 · +0.00 · Garaje, pasillo de entrada, cuarto de guardia, módulo de servicio (PLAN §2 y §11.1)
import { W, door, win, vano, slab, floor, stair, column, room, F } from './common.js';

const Z0 = 0.0, ZT = 3.17; // piso garaje y cara inferior de la losa de dormitorios

export const level0 = {
  id: 0, name: 'N0 · Garaje y servicio', z: 0.0,
  spawn: { x: 10.0, y: 4.0, yaw: 180 },

  walls: [
    // Lindero sur: celosía de lamas entre columnas (A..D1) y muro ciego hasta el este
    W('W0.1a', [-4.0, -3.0], [23.0, -3.0], 0.20, 0, 3.0, 'lamas'),
    W('W0.1b', [23.0, -3.0], [32.5, -3.0], 0.20, 0, 3.0, 'ext'),
    // Lindero oeste (calle): portón de lamas P0.1 en y 0.3..5.0 (cerrado) + muro
    W('W0.2a', [-4.0, -3.0], [-4.21, 0.3], 0.20, 0, 3.17, 'ext'),
    W('W0.2b', [-4.21, 0.3], [-4.52, 5.0], 0.20, 0, 3.0, 'lamas'),
    W('W0.2c', [-4.52, 5.0], [-4.8, 9.4], 0.20, 0, 3.17, 'ext'),
    // Cuarto de guardia
    W('W0.3', [-1.4, 5.5], [-1.4, 9.4], 0.15, 0.0, ZT, 'int', [door(6.2, 7.0, 0.0, 2.3)]),
    W('W0.4', [-4.8, 5.5], [-1.4, 5.5], 0.15, 0.0, ZT, 'int'),
    W('W0.5a', [-3.4, 8.2], [-1.4, 8.2], 0.10, 0.25, 2.4, 'int', [door(-2.4, -1.7, 0.25, 2.1)]),
    W('W0.5b', [-3.4, 8.2], [-3.4, 9.4], 0.10, 0.25, 2.4, 'int'),
    // Muro norte del garaje bajo la barra social
    W('W0.6', [-4.8, 9.4], [23.0, 9.4], 0.20, 0, ZT, 'ext', [
      door(-3.6, -2.8, 0.25, 2.1),          // P0.5 pasillo → cuarto de guardia
      door(0.7, 2.2, 0.0, 2.3, false),      // P0.3 pasillo → garaje (doble batiente, abierta)
    ]),
    // Fondo norte del pasillo de entrada y frente de la losa social
    W('W0.7a', [-4.85, 11.65], [-0.3, 11.65], 0.20, 0.25, 3.2, 'ext', [door(-1.3, -0.3, 0.25, 2.1)]),
    W('W0.7b', [-0.3, 11.65], [5.1, 11.65], 0.20, 0.0, 1.40, 'conc'),
    // Reja peatonal (entrada principal) P0.2
    W('W0.8', [-4.85, 9.4], [-4.85, 11.65], 0.15, 0, 2.5, 'lamas', [door(9.9, 10.9, 0.25, 2.2, false)]),
    // Vestíbulo de garaje 0.4 (+0.40)
    W('W0.9a', [19.5, 7.5], [22.6, 7.5], 0.15, 0.0, ZT, 'int', [
      win(19.6, 21.6, 1.6, 2.2),              // V0.1 celosía alta
      door(21.7, 22.5, 0.0, 2.5),             // P0.7
    ]),
    W('W0.9b', [19.5, 7.5], [19.5, 9.4], 0.15, 0.0, ZT, 'int'),
    // Módulo de servicio
    W('W0.10', [23.0, -3.0], [23.0, 9.4], 0.20, 0, ZT, 'ext', [door(4.8, 5.6, 0.0, 2.5), door(7.9, 8.8, 0.0, 2.5)]),
    W('W0.11', [23.0, 0.0], [29.45, 0.0], 0.20, 0, ZT, 'ext', [door(27.8, 28.6, 0.0, 2.5)]),
    W('W0.12', [29.45, -3.0], [29.45, 11.65], 0.20, 0, ZT, 'ext', [win(3.0, 4.4, 1.6, 2.6), win(6.0, 7.2, 1.9, 2.5)]),
    W('W0.13', [24.55, 2.4], [24.55, 9.4], 0.15, 0.40, ZT, 'int', [door(3.0, 3.8, 0.40), door(6.3, 7.1, 0.40)]),
    W('W0.14', [23.0, 2.4], [29.45, 2.4], 0.15, 0.40, ZT, 'int', [door(23.3, 24.1, 0.40)]),
    W('W0.15', [24.55, 5.2], [29.45, 5.2], 0.15, 0.40, ZT, 'int'),
    W('W0.16', [27.5, 5.2], [27.5, 9.4], 0.15, 0.40, ZT, 'int', [door(6.4, 7.2, 0.40), door(8.0, 8.8, 0.40)]),
    W('W0.17', [27.5, 7.6], [29.45, 7.6], 0.15, 0.40, ZT, 'int'),
    W('W0.18', [27.0, 0.0], [27.0, 2.4], 0.15, 0.40, ZT, 'int', [door(0.6, 1.4, 0.40)]),
    // Rampa: contención este
    W('W0.19', [31.4, -3.0], [31.4, 11.65], 0.20, 0, 1.5, 'conc'),
    // Contención del deck frente al jardín frontal
    W('W0.21', [-0.3, 11.65], [-0.3, 17.65], 0.20, 0, 1.40, 'conc'),
  ],

  columns: [
    ...[0, 6.25, 12.5, 18.75].flatMap(x => [column(x, 4.10, 0, ZT), column(x, 9.40, 0, ZT)]),
    column(23.0, 0.0, 0, ZT), column(23.0, 4.10, 0, ZT), column(23.0, 9.40, 0, ZT),
    ...[0, 6.25, 12.5, 18.75, 23.0].map(x => column(x, -3.0, 0, 3.0)),
  ],

  slabs: [
    slab([-4.8, 32.5, -3.0, 9.4], -0.3, 0.0, 'garage', 'conc'),             // piso del garaje
    slab([-4.8, -1.4, 5.5, 9.4], 0.0, 0.25, 'tileGrey', 'conc'),             // cuarto de guardia
    slab([-4.85, 3.5, 9.4, 11.65], 0.0, 0.25, 'concPolished', 'conc'),       // pasillo de entrada
    slab([19.5, 22.6, 7.5, 9.4], 0.0, 0.40, 'tileGrey', 'conc'),             // vestíbulo 0.4
    slab([23.0, 29.45, 0.0, 9.4], 0.0, 0.40, 'tileGrey', 'conc'),            // módulo de servicio
    slab([-4.8, -0.3, 11.65, 17.65], -0.3, 0.0, 'grass', 'conc'),            // jardín frontal
    slab([-0.3, 2.2, 9.4, 11.65], 2.95, 3.20, 'conc', 'ceiling'),            // losa baja sobre el pasillo (E7)
  ],

  ramps: [
    { box: [29.6, 31.4, -3.0, 11.65], zStart: 0.0, zEnd: 1.17, dir: '+y', mat: 'concPolished' },
  ],

  stairs: [
    stair('E0.1', [3.5, 5.1, 9.9, 11.4], 0.25, 1.40, '+x', 6),
    stair('E0.2', [-1.9, -0.4, 12.5, 17.4], 0.0, 1.40, '+y', 10),
    stair('E0.3', [19.7, 22.6, 9.9, 11.4], 0.40, 1.40, '+y', 6),
    stair('E0.4', [23.2, 24.5, 9.9, 11.4], 0.40, 1.40, '+y', 6),
    stair('E0.5', [21.7, 22.5, 6.9, 7.5], 0.0, 0.40, '+y', 3),
    stair('E0.6', [22.3, 23.0, 7.9, 8.8], 0.0, 0.40, '+x', 3),
    stair('E0.7', [22.3, 23.0, 4.8, 5.6], 0.0, 0.40, '+x', 3),
  ],

  rooms: [
    room('Garaje', [-4.0, 23.0, -3.0, 9.4], 0.0, 335), room('Cuarto de guardia', [-4.8, -1.4, 5.5, 9.4], 0.25, 12.5),
    room('Pasillo de entrada', [-4.8, 3.5, 9.4, 11.65], 0.25, 18.7), room('Vestíbulo de garaje', [19.5, 22.6, 7.5, 9.4], 0.40, 5.9),
    room('Pasillo de servicio', [23.0, 24.55, 2.4, 9.4], 0.40, 14.6), room('Lavandería', [24.55, 27.5, 5.2, 9.4], 0.40, 12.4),
    room('Depósito', [27.5, 29.45, 7.6, 9.4], 0.40, 3.5), room('Baño de servicio', [27.5, 29.45, 5.2, 7.6], 0.40, 4.7),
    room('Dormitorio de servicio 1', [24.55, 29.45, 2.4, 5.2], 0.40, 13.7), room('Dormitorio de servicio 2', [23.0, 27.0, 0.0, 2.4], 0.40, 9.6),
    room('Baño 2 de servicio', [27.0, 29.45, 0.0, 2.4], 0.40, 5.9), room('Rampa vehicular', [29.6, 31.4, -3.0, 11.65], 0.0, 0),
    room('Jardín frontal', [-4.8, -0.3, 11.65, 17.65], 0.0, 27), room('Garaje · brazo sur', [23.0, 31.4, -3.0, 0.0], 0.0, 0),
  ],

  furniture: [
    F('car', 2.1, 3.4, 0, 1.9, 4.6, 1.5, 0, { color: 0x2b2f38 }),
    F('car', 5.9, 3.4, 0, 1.9, 4.6, 1.5, 0, { color: 0xd8d8d8 }),
    F('car', 13.7, 3.4, 0, 1.9, 4.6, 1.5, 0, { color: 0x8a1c1c }),
    F('car', 17.5, 3.4, 0, 1.9, 4.6, 1.5, 0, { color: 0x3a4a5a }),
    F('appliance', 25.6, 9.05, 0.40, 0.6, 0.65, 0.9), F('appliance', 26.3, 9.05, 0.40, 0.6, 0.65, 0.9),
    F('counter', 25.2, 5.55, 0.40, 1.2, 0.6, 0.9),
    F('bed', 26.0, 3.8, 0.40, 2.0, 1.0, 0.5), F('closet', 28.9, 3.8, 0.40, 0.6, 1.8, 2.2, 0),
    F('bed', 25.0, 1.2, 0.40, 2.0, 1.0, 0.5, 90), F('closet', 26.6, 1.2, 0.40, 0.6, 1.8, 2.2, 0),
    F('toilet', 28.9, 7.2, 0.40, 0.4, 0.65, 0.75, 0), F('sink', 28.0, 7.2, 0.40, 0.5, 0.45, 0.85, 0), F('shower', 27.9, 5.65, 0.40, 0.8, 0.9, 2.0),
    F('toilet', 29.0, 2.0, 0.40, 0.4, 0.65, 0.75, 0), F('sink', 28.2, 2.0, 0.40, 0.5, 0.45, 0.85, 0), F('shower', 27.4, 1.1, 0.40, 0.75, 0.9, 2.0),
    F('toilet', -2.3, 8.9, 0.25, 0.4, 0.65, 0.75, 0), F('sink', -3.0, 8.9, 0.25, 0.5, 0.45, 0.85, 0),
    F('bed', -3.1, 6.6, 0.25, 2.0, 1.0, 0.5, 90),
    F('shelf', 20.5, 9.2, 0.40, 1.6, 0.4, 2.0),
    F('plant', -2.5, 14.5, 0.0, 0.8, 0.8, 1.6), F('plant', -3.6, 16.5, 0.0, 0.9, 0.9, 1.8),
  ],
};
