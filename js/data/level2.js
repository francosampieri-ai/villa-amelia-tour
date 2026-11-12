// Nivel N2 · +3.47 · Dormitorios (PLAN §4 y §11.3)
import { W, door, win, vano, glassDoor, slab, stair, column, room, F } from './common.js';

const Z = 3.47, ZT = 7.10;

export const level2 = {
  id: 2, name: 'N2 · Dormitorios', z: Z,
  spawn: { x: 10.0, y: 8.5, yaw: 0 },

  walls: [
    // Muro-estantería hacia la doble altura: antepecho macizo + celosía; hueco de paso del desembarco
    W('W2.1a', [6.25, 9.4], [18.75, 9.4], 0.20, Z, 4.47, 'planter', [vano(12.3, 13.4, Z, 4.47)]),
    W('W2.1b', [6.25, 9.4], [18.75, 9.4], 0.15, 4.47, ZT, 'celosia', [vano(12.3, 13.4, 4.47, 5.6)]),
    // Estantería-celosía sobre el muro TV (M1.5), hacia la sala
    W('W1.5b', [6.25, 11.65], [18.75, 11.65], 0.15, Z, ZT, 'celosia'),
    W('W2.2a', [-0.3, 9.4], [6.25, 9.4], 0.20, Z, ZT, 'int'),
    W('W2.2b', [18.75, 9.4], [23.0, 9.4], 0.20, Z, ZT, 'int'),
    // Fachadas del bloque de dormitorios
    W('W2.3', [-0.3, 0.9], [-0.3, 9.4], 0.20, Z, ZT, 'ext'),
    W('W2.4a', [-0.3, 0.9], [2.0, 0.9], 0.20, Z, ZT, 'ext'),
    W('W2.4b', [2.0, 0.9], [9.0, 0.9], 0.20, Z, 4.5, 'ext'),                   // antepecho del patio sur
    W('W2.4c', [9.0, 0.9], [23.0, 0.9], 0.20, Z, ZT, 'ext', [win(13.0, 18.0, 5.3, 6.5)]),
    W('W2.5', [2.0, 2.3], [9.0, 2.3], 0.05, Z, 6.9, 'vid', [glassDoor(3.0, 3.9, Z, 2.4)], { mullions: [3.9, 6.1, 7.5], transoms: [] }),
    W('W2.6a', [2.0, 0.9], [2.0, 2.3], 0.20, Z, ZT, 'ext'),
    W('W2.6b', [9.0, 0.9], [9.0, 2.3], 0.20, Z, ZT, 'ext'),
    // Dormitorios 1 y 2
    W('W2.7', [0.3, 7.6], [9.0, 7.6], 0.15, Z, ZT, 'int', [door(3.9, 4.6, Z), door(8.3, 9.0, Z)]),
    W('W2.8', [6.1, 2.3], [6.1, 7.6], 0.15, Z, ZT, 'int'),
    W('W2.9a', [2.0, 7.6], [2.0, 9.4], 0.15, Z, ZT, 'int', [door(8.0, 8.8, Z, 2.1)]),
    W('W2.9b', [0.3, 8.8], [3.8, 8.8], 0.15, Z, ZT, 'int'),
    W('W2.10', [3.8, 7.6], [3.8, 9.4], 0.15, Z, ZT, 'int'),
    // Baños 2-3 y dormitorio 3
    W('W2.11', [9.0, 0.9], [9.0, 7.6], 0.15, Z, ZT, 'int', [door(3.4, 4.2, Z), door(5.0, 5.6, Z)]),
    W('W2.12a', [9.0, 4.2], [12.9, 4.2], 0.15, Z, ZT, 'int'),
    W('W2.12b', [10.9, 0.9], [10.9, 4.2], 0.15, Z, ZT, 'int'),
    W('W2.13', [9.0, 5.6], [18.6, 5.6], 0.15, Z, ZT, 'int', [door(17.6, 18.4, Z)]),
    W('W2.14a', [12.9, 0.9], [12.9, 5.6], 0.15, Z, ZT, 'int'),
    W('W2.14b', [13.5, 0.9], [13.5, 5.2], 0.15, Z, ZT, 'int', [door(2.0, 2.8, Z)]),
    W('W2.14c', [14.6, 0.9], [14.6, 5.2], 0.15, Z, ZT, 'int'),
    W('W2.15', [18.6, 0.9], [18.6, 9.4], 0.15, Z, ZT, 'int', [door(8.5, 9.3, Z)]),
    // Master: pasillo, vestidor, baño
    W('W2.16', [18.6, 8.0], [22.85, 8.0], 0.15, Z, ZT, 'int'),
    W('W2.17a', [18.6, 5.6], [22.6, 5.6], 0.15, Z, ZT, 'int'),
    W('W2.17b', [19.0, 5.6], [19.0, 8.0], 0.15, Z, ZT, 'int'),
    W('W2.18', [22.6, 2.4], [22.6, 8.0], 0.15, Z, ZT, 'int', [door(4.5, 5.3, Z), door(6.0, 6.8, Z)]),
    W('W2.19', [22.85, 8.0], [22.85, 9.4], 0.15, Z, ZT, 'int', [vano(8.3, 9.3, Z, 2.4)]),
    W('W2.20a', [18.6, 2.4], [22.6, 2.4], 0.20, Z, ZT, 'ext'),
    W('W2.20b', [18.6, 0.9], [18.6, 2.4], 0.20, Z, ZT, 'ext'),
    W('W2.20c', [19.8, 2.6], [19.8, 4.0], 0.05, Z, ZT, 'vid'),                  // V2.3 vidrio a la jardinera-lucernario
    W('W2.20d', [18.8, 2.6], [19.8, 2.6], 0.10, Z, ZT, 'int'),
    W('W2.20e', [18.8, 4.0], [19.8, 4.0], 0.10, Z, ZT, 'int'),
    // Dormitorio master
    W('W2.21', [23.0, 9.4], [29.45, 9.4], 0.20, Z, ZT, 'ext', [door(23.3, 24.1, Z)]),
    W('W2.22', [29.45, 1.6], [29.45, 9.4], 0.05, Z, ZT, 'vid', [glassDoor(5.0, 6.0, Z, 2.4)], { mullions: [3.2, 5.0, 6.0, 7.8], transoms: [] }),
    W('W2.23a', [31.0, 1.6], [31.0, 9.4], 0.20, Z, ZT, 'ext'),
    W('W2.23b', [29.45, 9.4], [31.0, 9.4], 0.20, Z, ZT, 'ext'),
    W('W2.23c', [29.45, 1.6], [31.0, 1.6], 0.20, Z, 5.0, 'ext'),
    W('W2.24', [23.0, 1.6], [29.45, 1.6], 0.20, Z, 5.0, 'ext', [glassDoor(25.5, 27.5, Z, 2.4), win(23.5, 25.3, Z + 0.9, 2.4 + Z), win(27.7, 29.3, Z + 0.9, 2.4 + Z)]),
    W('W2.24b', [23.0, 1.6], [23.0, 2.4], 0.20, Z, ZT, 'ext'),
    // Balcón-jardinera en U (antepecho)
    W('W2.25a', [23.5, 1.6], [23.5, -2.0], 0.30, Z, 4.6, 'planter'),
    W('W2.25b', [23.5, -2.0], [29.5, -2.0], 0.30, Z, 4.6, 'planter'),
    W('W2.25c', [29.5, -2.0], [29.5, 1.6], 0.30, Z, 4.6, 'planter'),
    // Distribuidor D1-E y lateral de E2.1
    W('W2.26a', [23.0, 9.4], [23.0, 11.65], 0.15, Z, 4.65, 'int', [vano(9.9, 11.5, Z, 4.65)]),
    W('W2.26b', [24.55, 9.4], [24.55, 11.65], 0.15, Z, 4.65, 'int', [vano(9.9, 11.5, Z, 4.65)]),
    W('W2.27', [18.75, 9.4], [18.75, 11.65], 0.15, Z, 4.30, 'int'),
  ],

  columns: [
    ...[0, 6.25, 12.5, 18.75].map(x => column(x, 9.4, Z, ZT)),
    column(23.0, 9.4, Z, ZT), column(23.0, 0.9, Z, ZT), column(0.0, 0.9, Z, ZT), column(6.25, 0.9, Z, ZT), column(12.5, 0.9, Z, ZT), column(18.75, 0.9, Z, ZT),
  ],

  slabs: [
    slab([-4.8, 29.6, -3.0, 9.4], Z - 0.30, Z, 'floorBed', 'ceiling'),            // losa de dormitorios (techo del garaje)
    slab([12.3, 13.4, 9.4, 11.65], Z - 0.30, Z, 'floorBed', 'ceiling'),            // desembarco 2.1
    slab([18.75, 29.45, 9.4, 11.65], Z - 0.30, Z, 'floorBed', 'ceiling'),          // sobre E0.3/E0.4: distribuidor y base de E2.1/E2.2
    slab([29.45, 31.0, 1.6, 9.4], Z - 0.30, Z, 'grass', 'ceiling'),                // jardín del master
    slab([23.5, 29.5, -2.0, 1.6], Z - 0.30, Z, 'deckWood', 'ceiling'),             // balcón sur
  ],

  floors: [
    { box: [2.0, 9.0, 0.9, 2.3], z: Z + 0.01, mat: 'gravel' },                     // patio-jardinera sur
    { box: [18.8, 19.8, 2.6, 4.0], z: Z + 0.01, mat: 'gravel' },                   // jardinera baño master
    { box: [3.8, 18.6, 7.6, 9.4], z: Z + 0.005, mat: 'floorBed' },
  ],

  stairs: [
    stair('E2.1', [21.1, 22.6, 9.9, 11.5], Z, 4.30, '-x', 5),
    stair('E2.2', [24.6, 27.3, 9.9, 11.5], Z, 4.90, '+x', 9),
  ],
  ramps: [],

  rooms: [
    room('Desembarco escalera', [12.3, 13.4, 9.4, 11.65], Z, 2.0), room('Hall íntimo', [3.8, 18.6, 5.6, 9.4], Z, 45.8),
    room('Dormitorio 1', [0.3, 6.1, 2.3, 7.6], Z, 30.7), room('Baño dormitorio 1', [0.3, 2.0, 7.6, 8.8], Z, 3.1),
    room('Dormitorio 2', [6.1, 9.0, 2.3, 7.6], Z, 15.4), room('Baño dormitorio 2', [9.0, 10.9, 0.9, 4.2], Z, 6.1),
    room('Baño dormitorio 3', [9.0, 12.9, 4.2, 5.6], Z, 9.5), room('Dormitorio 3', [12.9, 18.6, 0.9, 5.6], Z, 25.3),
    room('Patio-jardinera sur', [2.0, 9.0, 0.9, 2.3], Z, 9.8), room('Pasillo master', [18.6, 22.85, 8.0, 9.4], Z, 5.7),
    room('Vestidor master', [19.0, 22.6, 5.6, 8.0], Z, 8.6), room('Baño master', [18.6, 22.6, 2.4, 5.6], Z, 12.8),
    room('Dormitorio master', [22.6, 29.45, 1.6, 9.4], Z, 45.2), room('Jardín del master', [29.45, 31.0, 1.6, 9.4], Z, 12),
    room('Balcón-jardinera sur', [23.5, 29.5, -2.0, 1.6], Z, 21.6), room('Distribuidor D1-E', [23.0, 24.55, 9.4, 11.65], Z, 3.5),
  ],

  furniture: [
    // Hall
    F('bench', 11.0, 8.5, Z, 2.4, 0.5, 0.45), F('shelf', 6.0, 9.2, Z, 2.0, 0.35, 0.9), F('floorLamp', 4.5, 8.9, Z, 0.4, 0.4, 1.7),
    F('plant', 17.9, 9.0, Z, 0.8, 0.8, 1.7), F('rug', 12.5, 7.0, Z, 6.0, 1.6, 0.01, 0, { color: 0xb8ada0 }),
    // Dormitorio 1
    F('bed', 3.1, 5.0, Z, 2.2, 1.6, 0.55, 0, { headAt: '-x' }), F('nightstand', 2.2, 3.7, Z, 0.45, 0.45, 0.5), F('nightstand', 2.2, 6.3, Z, 0.45, 0.45, 0.5),
    F('closet', 1.8, 4.9, Z, 0.4, 1.6, 2.3), F('closet', 0.7, 6.3, Z, 0.4, 2.2, 2.3), F('rug', 3.8, 5.0, Z, 3.0, 2.6, 0.01, 0, { color: 0xc9c2b4 }),
    F('painting', 5.0, 7.5, Z, 1.4, 0.05, 1.0, 0, { color: 0x3b556d }), F('armchair', 5.3, 3.2, Z, 0.8, 0.8, 0.8, 135),
    // Dormitorio 2
    F('bed', 7.25, 5.0, Z, 2.1, 1.6, 0.55, 0, { headAt: '-x' }), F('nightstand', 6.4, 6.3, Z, 0.4, 0.4, 0.5), F('closet', 8.7, 7.0, Z, 0.5, 1.1, 2.3),
    // Dormitorio 3
    F('bed', 16.25, 3.5, Z, 1.6, 2.2, 0.55, 0, { headAt: '+y' }), F('nightstand', 15.2, 4.5, Z, 0.45, 0.45, 0.5), F('nightstand', 17.3, 4.5, Z, 0.45, 0.45, 0.5),
    F('desk', 17.5, 1.5, Z, 1.4, 0.6, 0.75), F('chair', 17.5, 2.1, Z, 0.5, 0.5, 0.9, 90), F('closet', 14.05, 3.0, Z, 1.0, 4.0, 2.3),
    // Baños 1-3
    F('sink', 1.1, 8.3, Z, 0.5, 0.45, 0.85), F('toilet', 1.6, 8.3, Z, 0.4, 0.6, 0.75), F('shower', 0.7, 7.95, Z, 0.7, 0.6, 2.0),
    F('sink', 9.95, 3.7, Z, 0.5, 0.45, 0.85), F('toilet', 10.5, 2.6, Z, 0.4, 0.6, 0.75), F('shower', 9.9, 1.4, Z, 0.9, 0.9, 2.0),
    F('sink', 11.0, 4.9, Z, 0.6, 0.45, 0.85), F('toilet', 9.4, 4.9, Z, 0.4, 0.6, 0.75), F('shower', 12.4, 4.9, Z, 0.9, 0.9, 2.0),
    // Master
    F('bed', 26.4, 6.05, Z, 2.0, 2.2, 0.55, 0, { headAt: '-y' }), F('headboard', 26.3, 4.75, Z, 3.4, 0.2, 1.2),
    F('nightstand', 25.0, 5.3, Z, 0.5, 0.5, 0.5), F('nightstand', 27.8, 5.3, Z, 0.5, 0.5, 0.5),
    F('armchair', 25.0, 2.9, Z, 0.8, 0.8, 0.8, 0), F('armchair', 27.6, 2.9, Z, 0.8, 0.8, 0.8, 0), F('coffeeTable', 26.3, 2.9, Z, 0.7, 0.7, 0.4),
    F('rug', 26.4, 6.5, Z, 3.6, 3.4, 0.01, 0, { color: 0xbfb3a2 }), F('painting', 23.1, 7.0, Z, 0.05, 1.6, 1.1, 0, { color: 0x7a5a3a }),
    F('plant', 28.9, 8.9, Z, 0.8, 0.8, 1.7),
    // Baño master y vestidor
    F('bathtub', 20.6, 3.2, Z, 1.7, 0.8, 0.6), F('doubleSink', 21.5, 5.25, Z, 1.6, 0.5, 0.85), F('shower', 19.3, 5.0, Z, 1.0, 1.0, 2.0), F('toilet', 22.2, 2.8, Z, 0.4, 0.65, 0.75, 0),
    F('closet', 19.3, 6.8, Z, 0.6, 2.4, 2.4), F('closet', 22.3, 6.8, Z, 0.6, 2.4, 2.4), F('closet', 20.8, 5.95, Z, 2.4, 0.6, 2.4),
    // Patios y jardineras
    F('plant', 3.0, 1.6, Z, 0.9, 0.9, 1.4), F('plant', 5.5, 1.6, Z, 1.0, 1.0, 1.6), F('plant', 8.0, 1.6, Z, 0.8, 0.8, 1.3),
    F('plant', 19.3, 3.3, Z, 0.8, 0.8, 1.5), F('shrub', 30.2, 3.5, Z, 1.2, 1.2, 1.2), F('shrub', 30.2, 7.5, Z, 1.2, 1.2, 1.4),
    F('hedge', 26.5, -1.85, Z + 1.13, 5.8, 0.3, 0.5), F('hedge', 23.65, -0.2, Z + 1.13, 0.3, 3.4, 0.5), F('hedge', 29.35, -0.2, Z + 1.13, 0.3, 3.4, 0.5),
    F('hedge', 12.5, 9.33, 4.47, 11.5, 0.3, 0.45),                                   // jardineras colgantes del muro-estantería
  ],
};
