// Nivel N2 · +3.47 · Dormitorios (lámina E5, releída en Fase B2: fachada sur en y 1.95, hall en 7.95..9.4 y 5.75..7.95,
// dormitorio 2 con baño y vestidor, dormitorio 3 con baño-lucernario, master de 23.6 a 30.2 con vestidor y balcón-jardinera)
import { W, door, doorS, win, vano, glassDoor, slab, stair, column, room, F } from './common.js';

const Z = 3.47, ZT = 7.10, YS = 1.95; // cota de piso, techo y fachada sur del bloque

export const level2 = {
  id: 2, name: 'N2 · Dormitorios', z: Z,
  spawn: { x: 10.0, y: 8.6, yaw: 0 },

  walls: [
    // Muro-estantería hacia la doble altura: antepecho-jardinera + celosía; hueco de paso del desembarco (E5: 12.6..13.85)
    W('W2.1a', [6.25, 9.4], [18.75, 9.4], 0.30, Z, 4.47, 'planter', [vano(12.6, 13.85, Z, 4.47)]),
    W('W2.1b', [6.25, 9.4], [18.75, 9.4], 0.15, 4.47, ZT, 'celosia', [vano(12.6, 13.85, 4.47, 5.6)]),
    W('W1.5b', [6.25, 11.65], [18.75, 11.65], 0.15, Z, ZT, 'celosia'),
    W('W2.29', [12.6, 9.6], [12.6, 11.65], 0.05, Z, Z + 1.05, 'vid', [], { mullions: [10.6], transoms: [] }),
    W('W2.2a', [-0.2, 9.4], [6.25, 9.4], 0.20, Z, ZT, 'int'),
    W('W2.2b', [18.75, 9.4], [23.0, 9.4], 0.20, Z, ZT, 'int'),
    // Fachadas del bloque
    W('W2.3', [-0.2, YS], [-0.2, 9.4], 0.20, Z, ZT, 'ext'),
    W('W2.4a', [-0.2, YS], [2.15, YS], 0.20, Z, ZT, 'ext'),
    W('W2.4b', [2.15, YS], [8.9, YS], 0.20, Z, 4.5, 'ext'),                        // antepecho del patio-jardinera
    W('W2.4c', [8.9, YS], [21.76, YS], 0.20, Z, ZT, 'ext', [win(14.3, 18.3, 5.3, 6.5)]),
    W('W2.5', [2.15, 3.3], [8.9, 3.3], 0.05, Z, 6.9, 'vid', [glassDoor(3.0, 3.9, Z, 2.4), glassDoor(7.3, 8.2, Z, 2.4)], { mullions: [3.9, 6.1, 7.3], transoms: [] }),
    W('W2.6a', [2.15, YS], [2.15, 3.3], 0.20, Z, ZT, 'ext'),
    W('W2.6b', [8.9, YS], [8.9, 3.3], 0.20, Z, ZT, 'ext'),
    // Dormitorios 1 y 2, baño 1 (0..4.2 × 7.95..9.4, entra desde el dormitorio 1)
    W('W2.7', [-0.2, 7.95], [10.05, 7.95], 0.15, Z, ZT, 'int', [doorS(3.4, 4.12, Z, 1, 'b'), doorS(5.2, 6.0, Z, -1, 'b')]),
    W('W2.8', [6.08, 3.3], [6.08, 7.95], 0.15, Z, ZT, 'int'),
    W('W2.10', [4.2, 7.95], [4.2, 9.4], 0.15, Z, ZT, 'int'),
    // Dormitorio 2: baño (10.1..12 × 3.3..5.75 + WC 10.1..12 × 1.95..3.3) y vestidor (12..14 × 1.95..5.75)
    W('W2.11', [10.05, 3.3], [10.05, 7.95], 0.15, Z, ZT, 'int', [doorS(3.55, 4.2, Z, 1, 'b'), doorS(6.95, 7.75, Z, 1, 'b')]),
    W('W2.12a', [8.9, 3.3], [12.0, 3.3], 0.15, Z, ZT, 'int', [doorS(10.2, 10.9, Z, -1, 'a')]),
    W('W2.12b', [12.0, YS], [12.0, 5.75], 0.15, Z, ZT, 'int', [vano(4.3, 5.17, Z, 2.3)]),
    W('W2.13', [10.05, 5.75], [18.55, 5.75], 0.15, Z, ZT, 'int', [doorS(17.6, 18.4, Z, -1, 'b')]),
    W('W2.14', [14.0, YS], [14.0, 5.75], 0.15, Z, ZT, 'int'),
    // Dormitorio 3 (14..18.55 × 1.95..5.75): vidrio a la jardinera-lucernario y paso a su baño/closet
    W('W2.15a', [18.55, YS], [18.55, 4.3], 0.05, Z, ZT, 'vid'),
    W('W2.15b', [18.55, 5.2], [18.55, 8.0], 0.15, Z, ZT, 'int'),
    W('W2.15c', [18.55, 8.9], [18.55, 9.4], 0.15, Z, ZT, 'int'),
    // Baño del dormitorio 3 (lavabos 18.55..21.7 × 4.03..5.95; WC-ducha 20.1..21.7 × 1.95..4.03 con lucernario) y su closet (18.7..20.9 × 5.95..7.95)
    W('W2.16', [18.55, 8.0], [23.6, 8.0], 0.15, Z, ZT, 'int'),
    W('W2.17a', [18.55, 5.95], [19.4, 5.95], 0.15, Z, ZT, 'int'),
    W('W2.17b', [20.2, 5.95], [21.76, 5.95], 0.15, Z, ZT, 'int'),
    W('W2.17c', [21.0, 5.95], [21.0, 7.95], 0.15, Z, ZT, 'int'),
    W('W2.17d', [21.7, 4.03], [21.7, 5.95], 0.15, Z, ZT, 'int'),
    W('W2.20a', [18.55, 4.03], [21.76, 4.03], 0.15, Z, ZT, 'int', [doorS(20.2, 20.84, Z, -1, 'a')]),
    W('W2.20c', [20.1, YS], [20.1, 4.03], 0.05, Z, ZT, 'vid'),                      // vidrio del baño a la jardinera
    // Master: vestidor (21..23.5 × 6..7.95 + 21.76..23.5 × 4.03..6) y antebaño (21.76..23.6 × 2.45..4.03) abierto al dormitorio
    W('W2.18', [23.6, 4.03], [23.6, 9.4], 0.15, Z, ZT, 'int'),
    W('W2.20b', [21.76, 4.03], [23.6, 4.03], 0.15, Z, ZT, 'int', [doorS(21.94, 22.63, Z, 1, 'a')]),
    W('W2.31', [21.76, 2.45], [21.76, 4.03], 0.20, Z, ZT, 'ext'),
    W('W2.21', [23.0, 9.4], [30.3, 9.4], 0.20, Z, ZT, 'ext', [doorS(23.05, 23.7, Z, -1, 'b')]),
    W('W2.22', [30.2, 2.0], [30.2, 9.4], 0.05, Z, ZT, 'vid', [glassDoor(5.2, 6.2, Z, 2.4)], { mullions: [3.4, 5.2, 6.2, 7.8], transoms: [] }),
    W('W2.23a', [31.6, 2.0], [31.6, 9.4], 0.20, Z, ZT, 'ext'),
    W('W2.23b', [30.2, 9.4], [31.6, 9.4], 0.20, Z, ZT, 'ext'),
    W('W2.23c', [30.2, 2.0], [31.6, 2.0], 0.20, Z, 5.0, 'ext'),
    W('W2.24a', [21.76, 2.45], [24.9, 2.45], 0.20, Z, 5.0, 'ext', [doorS(24.0, 24.9, Z, -1, 'b', 2.3)]),
    W('W2.24', [24.9, 2.0], [30.3, 2.0], 0.20, Z, 5.0, 'ext', [win(25.6, 29.0, Z + 0.9, Z + 2.4)]),
    W('W2.24c', [24.9, 2.0], [24.9, 2.45], 0.20, Z, 5.0, 'ext'),
    // Balcón-jardinera en U (22.6..30.3 × -1.6..2.45): cierre perimetral 1.2 m + jardineras interiores
    W('W2.25a', [22.6, 2.45], [22.6, -1.6], 0.20, Z, 4.7, 'ext'),
    W('W2.25b', [22.6, -1.6], [30.3, -1.6], 0.20, Z, 4.7, 'ext'),
    W('W2.25c', [30.3, -1.6], [30.3, 2.0], 0.20, Z, 4.7, 'ext'),
    W('W2.25d', [24.9, 1.55], [30.1, 1.55], 0.50, Z, 4.3, 'planter'),
    W('W2.25e', [29.85, -1.4], [29.85, 1.3], 0.60, Z, 4.3, 'planter'),
    W('W2.25f', [22.8, -1.25], [30.1, -1.25], 0.50, Z, 4.3, 'planter'),
    W('W2.25g', [23.1, -1.0], [23.1, 0.3], 0.80, Z, 4.3, 'planter'),
    // Distribuidor D1-E y caja de E2.1
    W('W2.26a', [23.0, 9.4], [23.0, 11.65], 0.15, Z, 4.65, 'int', [vano(9.6, 11.2, Z, 4.65)]),
    W('W2.26b', [24.55, 9.4], [24.55, 11.65], 0.15, Z, 4.65, 'int', [vano(9.6, 11.2, Z, 4.65)]),
    W('W2.30', [24.9, 11.2], [26.0, 11.2], 0.05, 4.1, 5.15, 'vid'),
    W('W2.27', [18.75, 9.4], [18.75, 11.65], 0.15, Z, 4.30, 'int'),
  ],

  columns: [
    ...[0, 6.25, 12.5, 18.75].map(x => column(x, 9.4, Z, ZT)),
    column(23.0, 9.4, Z, ZT), ...[0, 6.25, 12.5, 18.75, 23.0].map(x => column(x, YS, Z, ZT)),
  ],

  slabs: [
    slab([-4.8, 30.3, -3.0, 9.4], Z - 0.30, Z, 'floorBed', 'ceiling'),            // losa de dormitorios (techo del garaje)
    slab([12.6, 14.0, 9.4, 11.65], Z - 0.30, Z, 'floorBed', 'ceiling'),            // desembarco de E1.1
    slab([21.2, 23.0, 9.4, 11.65], Z - 0.30, Z, 'floorBed', 'ceiling'),            // descanso bajo de E2.1
    slab([23.0, 24.55, 9.4, 11.65], Z - 0.15, Z, 'floorBed', 'ceiling'),           // distribuidor: losa fina (2.07 m libres sobre E0.4)
    slab([24.55, 29.45, 9.4, 11.65], Z - 0.30, Z, 'floorBed', 'ceiling'),          // techo de la antesala de la suite
    slab([24.9, 26.0, 9.6, 11.2], 3.86, 4.106, 'floorBed', 'ceiling'),             // descanso intermedio de E2.2
    slab([30.2, 31.6, 2.0, 9.4], Z - 0.30, Z, 'grass', 'ceiling'),                 // jardín del master
    slab([22.6, 30.3, -1.6, 2.45], Z - 0.30, Z, 'deckWood', 'ceiling'),            // balcón sur
  ],

  floors: [
    { box: [2.15, 8.9, YS, 3.3], z: Z + 0.01, mat: 'gravel' },                     // patio-jardinera sur
    { box: [18.6, 20.1, YS, 4.03], z: Z + 0.01, mat: 'gravel' },                   // jardinera-lucernario del baño 3
    { box: [4.2, 18.55, 7.95, 9.4], z: Z + 0.005, mat: 'floorBed' },
    { box: [10.05, 18.55, 5.75, 7.95], z: Z + 0.005, mat: 'floorBed' },
  ],

  stairs: [
    stair('E2.1', [19.4, 21.2, 9.6, 11.5], Z, 4.30, '-x', 5),
    stair('E2.2a', [23.3, 24.9, 9.6, 11.2], Z, 4.106, '+x', 4, 'stair', { rail: '+y' }),
    stair('E2.2b', [26.0, 28.3, 9.6, 11.2], 4.106, 4.90, '+x', 5, 'stair', { rail: '+y' }),
  ],
  ramps: [],

  rooms: [
    room('Desembarco escalera', [12.6, 14.0, 9.4, 11.65], Z, 2.0), room('Hall íntimo', [4.2, 18.55, 7.95, 9.4], Z, 45.8),
    room('Hall íntimo', [10.05, 18.55, 5.75, 7.95], Z, 45.8),
    room('Dormitorio 1', [-0.2, 6.08, 3.3, 7.95], Z, 29), room('Baño dormitorio 1', [-0.2, 4.2, 7.95, 9.4], Z, 6.2),
    room('Dormitorio 2', [6.08, 10.05, 3.3, 7.95], Z, 18.4), room('Baño dormitorio 2', [10.05, 12.0, YS, 5.75], Z, 7.2),
    room('Vestidor dormitorio 2', [12.0, 14.0, YS, 5.75], Z, 7.6), room('Dormitorio 3', [14.0, 18.55, YS, 5.75], Z, 17.3),
    room('Baño dormitorio 3', [18.55, 21.76, YS, 5.95], Z, 8.5), room('Closet dormitorio 3', [18.55, 21.0, 5.95, 7.95], Z, 4.9),
    room('Patio-jardinera sur', [2.15, 8.9, YS, 3.3], Z, 9.1), room('Pasillo master', [18.55, 23.6, 8.0, 9.4], Z, 7.1),
    room('Vestidor master', [21.0, 23.6, 4.03, 7.95], Z, 8.9), room('Antebaño master', [21.76, 23.6, 2.45, 4.03], Z, 2.9),
    room('Dormitorio master', [23.6, 30.2, 2.0, 9.4], Z, 48.8), room('Jardín del master', [30.2, 31.6, 2.0, 9.4], Z, 10.4),
    room('Balcón-jardinera sur', [22.6, 30.3, -1.6, 2.45], Z, 28), room('Distribuidor D1-E', [23.0, 24.55, 9.4, 11.65], Z, 3.5),
  ],

  furniture: [
    // Hall
    F('bench', 14.0, 6.6, Z, 2.4, 0.5, 0.45), F('shelf', 7.0, 9.15, Z, 2.0, 0.35, 0.9), F('floorLamp', 4.6, 9.0, Z, 0.4, 0.4, 1.7),
    F('plant', 18.1, 9.0, Z, 0.8, 0.8, 1.7), F('rug', 14.3, 6.85, Z, 6.0, 1.6, 0.01, 0, { color: 0xb8ada0 }),
    // Dormitorio 1 (cama 2.15..4.35 × 4.3..6.1, cabecera-closet al oeste, ropero en la pared oeste)
    F('bed', 3.25, 5.2, Z, 2.2, 1.8, 0.55, 0, { headAt: '-x' }), F('nightstand', 2.45, 6.45, Z, 0.4, 0.5, 0.5), F('nightstand', 2.45, 3.95, Z, 0.4, 0.5, 0.5),
    F('closet', 1.85, 5.95, Z, 0.6, 1.7, 2.3), F('closet', 0.1, 6.4, Z, 0.4, 2.8, 2.3), F('rug', 4.0, 5.2, Z, 2.8, 2.6, 0.01, 0, { color: 0xc9c2b4 }),
    F('painting', 5.2, 7.85, Z, 1.4, 0.05, 1.0, 0, { color: 0x3b556d }), F('armchair', 5.3, 3.9, Z, 0.8, 0.8, 0.8, 135),
    F('shower', 0.5, 8.6, Z, 0.9, 0.9, 2.0), F('sink', 1.7, 8.55, Z, 0.6, 0.45, 0.85, 180), F('toilet', 2.8, 8.6, Z, 0.4, 0.6, 0.75, 180),
    F('closet', 2.0, 9.17, Z, 3.9, 0.25, 2.3),
    // Dormitorio 2 (cama 6.4..8.6 × 4.3..6.1) con baño y vestidor
    F('bed', 7.5, 5.2, Z, 2.2, 1.8, 0.55, 0, { headAt: '-x' }), F('nightstand', 6.6, 6.45, Z, 0.4, 0.5, 0.5), F('nightstand', 6.6, 3.95, Z, 0.4, 0.5, 0.5),
    F('rug', 8.3, 5.2, Z, 2.2, 2.6, 0.01, 0, { color: 0xc4bcae }), F('painting', 9.95, 5.4, Z, 0.05, 1.3, 1.0, 0, { color: 0x6d5a48 }),
    F('sink', 11.0, 5.45, Z, 0.9, 0.45, 0.85, 180), F('toilet', 10.6, 2.4, Z, 0.4, 0.6, 0.75, 0), F('shower', 11.5, 2.6, Z, 0.9, 1.1, 2.0),
    F('closet', 13.7, 3.85, Z, 0.5, 3.7, 2.3), F('closet', 12.3, 3.0, Z, 0.5, 2.0, 2.3), F('closet', 13.0, 5.4, Z, 1.9, 0.5, 2.3),
    // Dormitorio 3 (cama 15.4..17.05 × 2.0..4.0, cabecera al sur) con baño-lucernario y closet
    F('bed', 16.2, 3.05, Z, 1.65, 2.1, 0.55, 0, { headAt: '-y' }), F('nightstand', 15.05, 2.4, Z, 0.45, 0.45, 0.5), F('nightstand', 17.4, 2.4, Z, 0.45, 0.45, 0.5),
    F('rug', 16.2, 4.3, Z, 2.6, 1.6, 0.01, 0, { color: 0xbfb6a8 }), F('painting', 14.1, 4.0, Z, 0.05, 1.2, 0.9, 0, { color: 0x4f5b45 }),
    F('doubleSink', 20.6, 5.65, Z, 1.4, 0.5, 0.85, 0), F('shower', 20.6, 2.55, Z, 0.9, 1.0, 2.0), F('toilet', 21.35, 3.5, Z, 0.4, 0.6, 0.75, 90),
    F('closet', 18.9, 7.0, Z, 0.45, 1.95, 2.3), F('closet', 20.65, 7.0, Z, 0.45, 1.95, 2.3),
    // Master: vestidor, antebaño, cama con murete-cabecera y baño detrás del murete
    F('closet', 22.25, 7.7, Z, 2.5, 0.5, 2.3), F('closet', 23.27, 5.85, Z, 0.5, 3.1, 2.3),
    F('shower', 22.3, 3.2, Z, 1.0, 1.0, 2.0), F('toilet', 23.2, 2.9, Z, 0.4, 0.6, 0.75, 90),
    F('bed', 27.45, 5.8, Z, 2.1, 2.2, 0.55, 0, { headAt: '-y' }), F('headboard', 27.3, 4.57, Z, 4.5, 0.2, 1.3), F('headboard', 24.96, 4.25, Z, 0.2, 0.65, 1.3),
    F('nightstand', 26.05, 4.95, Z, 0.55, 0.5, 0.5), F('nightstand', 28.85, 4.95, Z, 0.55, 0.5, 0.5),
    F('bathtub', 28.3, 3.0, Z, 1.7, 0.8, 0.6), F('doubleSink', 26.6, 4.2, Z, 1.6, 0.5, 0.85, 180),
    F('armchair', 24.6, 8.5, Z, 0.8, 0.8, 0.8, -45), F('rug', 27.45, 7.3, Z, 3.6, 2.4, 0.01, 0, { color: 0xbfb3a2 }),
    F('painting', 23.7, 7.0, Z, 0.05, 1.6, 1.1, 0, { color: 0x7a5a3a }), F('plant', 29.7, 8.9, Z, 0.8, 0.8, 1.7),
    // Patios y jardineras
    F('plant', 3.0, 2.65, Z, 0.9, 0.9, 1.4), F('plant', 5.5, 2.65, Z, 1.0, 1.0, 1.6), F('plant', 8.0, 2.65, Z, 0.8, 0.8, 1.3),
    F('plant', 19.3, 3.0, Z, 0.8, 0.8, 1.5), F('shrub', 30.9, 3.5, Z, 1.2, 1.2, 1.2), F('shrub', 30.9, 7.5, Z, 1.2, 1.2, 1.4),
    F('hedge', 27.5, 1.55, Z + 0.83, 5.0, 0.3, 0.5), F('hedge', 29.85, -0.05, Z + 0.83, 0.3, 2.5, 0.5), F('hedge', 26.4, -1.25, Z + 0.83, 6.6, 0.3, 0.5),
    F('hedge', 9.5, 9.33, 4.47, 6.2, 0.3, 0.45), F('hedge', 16.1, 9.33, 4.47, 4.4, 0.3, 0.45),   // jardineras colgantes del muro-estantería
  ],
};
