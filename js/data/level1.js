// Nivel N1 · +1.40 · Barra social, suite E-F, BBQ, deck (PLAN §3 y §11.2; revisado contra E4 en VERIFICACION.md bloque 3)
import { W, door, doorS, win, vano, glassDoor, slab, floor, stair, column, room, F } from './common.js';

const Z = 1.40, ZT = 7.10;
// Montantes de la mampara norte (cotas E4 desde x = 0.2: 4.20 | 0.10 | 1.19×4 | 2.32 | 1.20×2 | 2.32 | 1.15×3 | 2.09) y travesaño a +4.30
const MULL_N = [4.40, 5.59, 6.78, 7.97, 9.16, 11.48, 12.68, 13.88, 16.20, 17.35, 18.50, 19.65, 21.74];

export const level1 = {
  id: 1, name: 'N1 · Área social y piscina', z: Z,
  spawn: { x: 9.9, y: 13.2, yaw: 90 },

  walls: [
    // Mampara norte M1.1 en y 17.05 (E4: línea de vidrio 0.6 m al sur de las columnas del eje 5); correderas en los paños de 2.32 / 2.09
    W('W1.1', [-0.2, 17.05], [22.85, 17.05], 0.05, Z, ZT, 'vid', [
      glassDoor(10.32, 11.48, Z, 2.9),      // P1.4a corredera sala (paño abierto)
      glassDoor(13.88, 15.04, Z, 2.9),      // P1.4b corredera comedor
      glassDoor(19.65, 20.70, Z, 2.9),      // P1.5 corredera cocina
    ], { mullions: MULL_N, transoms: [4.30] }),
    // Fachada oeste del estudio: E4/E5 la dibujan como muro macizo de 0.38 (x −0.23..0.15); ventana (criterio) tras la reja de lamas
    W('W1.2', [-0.05, 11.4], [-0.05, 17.05], 0.30, Z, ZT, 'ext', [win(12.3, 16.0, Z + 0.9, Z + 2.7)]),
    W('W1.3', [-0.05, 9.22], [-0.05, 11.4], 0.30, Z, 3.2, 'ext'),
    // Antepecho macizo (x −0.05..1.8) y jardinera-baranda (1.8..6.15) entre el estudio y el pasillo de entrada / escalera E0.1
    W('W1.4a', [-0.05, 11.53], [1.8, 11.53], 0.33, Z, 3.2, 'ext'),
    W('W1.4b', [1.8, 11.68], [6.15, 11.68], 0.50, Z, 2.1, 'planter'),
    // Sin muro en y 11.65 entre B y D a +1.40 (E4: sólo líneas ocultas del muro-estantería de N2); la galería queda abierta a sala y comedor
    // Muro sur de la galería y de la caja de E1.1 (E4: muro en y 9.12..9.32 de B a D1)
    W('W1.7', [6.25, 9.22], [13.4, 9.22], 0.20, Z, 3.47, 'ext'),
    W('W1.8', [13.4, 9.22], [23.0, 9.22], 0.20, Z, 3.47, 'ext'),
    W('W1.10', [22.6, 9.4], [22.6, 11.65], 0.15, 0.40, 3.47, 'int'),
    // Baranda de vidrio de la cocina sobre la caja de escaleras E0.3/E2.1 (fila de montantes en E4); termina en 22.0 para la hoja de P1.7
    W('W1.26', [19.4, 11.5], [22.0, 11.5], 0.05, Z, Z + 1.0, 'vid', [], { mullions: [20.2, 21.0, 21.8], transoms: [] }),
    // Muro D1 (x 23.0): entre y 9.4 y 11.65 sólo hasta +3.47 (encima, W2.26a con el paso E2.1 ↔ distribuidor ↔ E2.2)
    W('W1.11a', [23.0, 9.4], [23.0, 11.65], 0.20, 0.40, 3.47, 'ext'),
    // P1.7 cocina ↔ pasillo en y 11.5..12.3 (E4: arco hacia la cocina, bisagra sur); no existe puerta en 15.6..16.4
    W('W1.11', [22.95, 11.65], [22.95, 16.1], 0.20, Z, 4.30, 'ext', [doorS(11.5, 12.3, Z, 1, 'a')]),
    W('W1.11b', [23.04, 16.1], [23.04, 17.95], 0.40, Z, 4.30, 'ext'),                 // E4: el muro engrosa a 0.4 junto al nicho
    // Nicho del pasillo (23.2..24.4 × 16.1..17.75) abierto al BBQ: puerta P1.15 en y 16.12
    W('W1.20', [23.0, 16.12], [24.5, 16.12], 0.22, Z, 4.30, 'int', [doorS(23.25, 24.1, Z, -1, 'a')]),
    // Suite E-F (E4): muro oeste x 24.5; baño al sur (9.1..11.22/11.65) con puerta en y 11.22; vestidor abierto al pasillo (11.65..13.49);
    // dormitorio desde y 14.18 con puerta en x 24.5 (14.84..15.45, bisagra norte, abre al este)
    W('W1.12a', [24.5, 9.1], [24.5, 11.22], 0.20, Z, 3.47, 'int'),
    W('W1.12c', [24.5, 11.22], [25.8, 11.22], 0.15, Z, 3.47, 'int', [doorS(24.6, 25.4, Z, -1, 'a')]),   // P1.9 baño (abre al sur, bisagra oeste)
    W('W1.12d', [25.8, 11.22], [25.8, 11.65], 0.15, Z, 3.47, 'int'),
    W('W1.15', [25.8, 11.65], [29.55, 11.65], 0.15, Z, 4.65, 'int'),
    W('W1.12', [24.5, 13.49], [24.5, 17.86], 0.20, Z, 4.65, 'int', [doorS(14.84, 15.45, Z, -1, 'b')]),  // P1.10 dormitorio
    W('W1.16', [24.5, 14.18], [29.55, 14.18], 0.18, Z, 4.65, 'int'),
    W('W1.18', [24.5, 9.1], [29.55, 9.1], 0.20, Z, 4.65, 'ext'),
    // Muro norte del dormitorio hacia el BBQ (E4: y 17.75..17.97) con dos hojas de 0.7 y pilastra central (26.86..27.17), abren al sur
    W('W1.13', [24.5, 17.86], [29.55, 17.86], 0.22, Z, 4.05, 'ext', [doorS(26.16, 26.86, Z, -1, 'b'), doorS(27.17, 27.87, Z, -1, 'a')]),
    // Fachada este (E4: x 29.48..29.70): ventanas de 0.73 en 10.19..10.92 (baño) y 12.56..13.28 (vestidor); puerta al patio 15.24..15.91
    W('W1.14', [29.55, 9.1], [29.55, 17.86], 0.20, Z, 4.65, 'ext', [win(10.2, 10.9, Z + 1.6, Z + 2.4), win(12.55, 13.3, Z + 0.9, Z + 2.4), doorS(15.24, 15.91, Z, -1, 'b')]),
    // Caja del baño de visitas (E4: 4.32..6.54 × 12.98..16.11, interior 2.80 m; puerta al norte 5.25..6.05, bisagra este, abre adentro)
    W('W1.19a', [4.42, 13.08], [6.44, 13.08], 0.20, Z, ZT, 'woodSlats'),
    W('W1.19b', [6.44, 13.08], [6.44, 16.01], 0.20, Z, ZT, 'woodSlats'),
    W('W1.19c', [4.42, 16.01], [6.44, 16.01], 0.20, Z, ZT, 'woodSlats', [doorS(5.25, 6.05, Z, -1, 'b')]),
    W('W1.19d', [4.42, 13.08], [4.42, 16.01], 0.20, Z, ZT, 'woodSlats'),
    // Murete bajo de la escalera exterior E3.1
    W('W1.21', [23.0, 23.25], [29.45, 23.25], 0.20, Z, 2.5, 'conc'),
    // Módulo de servicio MS (E4: muro este x −3.22..−2.97; tabiques en y 17.65, 19.66, 23.53, 25.38, 27.45, cierre 30.95; 3 puertas al este)
    W('W1.22a', [-3.1, 17.65], [-3.1, 30.95], 0.25, Z, 4.8, 'ext', [doorS(18.55, 19.35, Z, 1, 'b'), doorS(21.95, 22.75, Z, 1, 'b'), doorS(24.5, 25.3, Z, 1, 'b')]),
    W('W1.22b', [-5.55, 17.65], [-3.1, 17.65], 0.24, Z, 4.8, 'ext'),
    W('W1.22c', [-5.73, 19.66], [-3.1, 19.66], 0.22, Z, 4.8, 'int'),
    W('W1.22d', [-6.08, 23.53], [-3.1, 23.53], 0.20, Z, 4.8, 'int'),
    W('W1.22e', [-6.24, 25.38], [-3.1, 25.38], 0.20, Z, 4.8, 'int'),
    W('W1.22f', [-6.43, 27.45], [-3.1, 27.45], 0.22, Z, 4.8, 'int'),
    W('W1.22g', [-6.74, 30.95], [-3.1, 30.95], 0.18, Z, 4.8, 'ext'),
    // Contención del deck sobre el jardín frontal
    W('W1.25', [-4.8, 17.65], [-0.3, 17.65], 0.20, 0.0, Z, 'conc'),
  ],

  columns: [
    // E4: columnas de 0.36 en el eje 5 (fuera de la mampara) y en el eje 3 (y≈9.45), no en el eje 4
    ...[-0.04, 6.23, 12.5, 18.76, 23.0].map(x => column(x, 17.65, Z, ZT, 0.36)),
    ...[6.25, 12.5, 18.75].map(x => column(x, 9.45, Z, ZT, 0.36)),
    column(23.0, 23.25, Z, 4.30), column(29.45, 17.65, Z, 4.30), column(29.45, 23.25, Z, 4.30),
    column(24.5, 9.2, Z, 4.65), column(24.5, 17.75, Z, 4.65),
  ],

  slabs: [
    slab([-0.2, 23.0, 11.4, 17.05], Z - 0.25, Z, 'floorSocial', 'ceiling'),     // barra social (hasta la mampara)
    slab([-0.2, 23.0, 17.05, 17.65], Z - 0.25, Z, 'pavers', 'ceiling'),         // franja exterior bajo las columnas del eje 5
    slab([6.2, 19.4, 9.22, 11.65], Z - 0.25, Z, 'floorSocial', 'ceiling'),       // galería, base E1.1 y descanso alto de E0.3
    slab([23.0, 24.5, 11.65, 17.86], Z - 0.25, Z, 'floorSocial', 'ceiling'),    // pasillo D1-E y nicho (E0.4 llega en y 11.65)
    slab([24.5, 29.55, 9.0, 17.86], Z - 0.25, Z, 'floorBed', 'ceiling'),        // suite E-F
    // Deck y patios (adoquín espina de pez); jardín-gimnasio en −1.7..6.6 × 20.5..25.9 (césped del terreno)
    slab([-3.1, -1.7, 17.65, 30.95], Z - 0.25, Z, 'pavers', 'conc'),            // acera frente al MS
    slab([-1.7, 7.75, 17.65, 20.5], Z - 0.25, Z, 'pavers', 'conc'),
    slab([6.6, 7.75, 20.5, 26.6], Z - 0.25, Z, 'pavers', 'conc'),
    slab([7.75, 21.55, 17.65, 21.75], Z - 0.25, Z, 'pavers', 'conc'),
    slab([7.75, 21.55, 25.8, 26.6], Z - 0.25, Z, 'pavers', 'conc'),
    slab([21.55, 23.0, 17.65, 26.6], Z - 0.25, Z, 'pavers', 'conc'),
    slab([23.0, 29.45, 17.65, 23.25], Z - 0.25, Z, 'pavers', 'conc'),            // BBQ
    slab([23.0, 30.1, 23.25, 26.6], Z - 0.25, Z, 'pavers', 'conc'),
    slab([31.1, 33.0, 11.65, 19.3], Z - 0.25, Z, 'pavers', 'conc'),              // patio este (al este de la rampa); jardín este desde y 19.3
    slab([29.45, 31.1, 13.9, 19.3], Z - 0.25, Z, 'pavers', 'conc'),              // patio este (cabecera de la rampa)
    slab([29.45, 30.1, 19.3, 26.6], Z - 0.25, Z, 'pavers', 'conc'),              // franja entre el BBQ y el jardín este
    slab([-6.0, -3.1, 17.65, 30.95], Z - 0.25, Z, 'tileGrey', 'conc'),           // piso del MS
    slab([-6.8, -3.1, 17.65, 30.95], 4.8, 5.05, 'conc', 'ceiling'),              // techo del MS
  ],

  stairs: [
    stair('E1.1', [14.0, 18.0, 9.6, 11.5], Z, 3.47, '-x', 13, 'stair', { rail: '+y' }),   // E4: 12 huellas 14.0..18.0, 'S' al este, montantes en el borde norte
  ],
  ramps: [],

  rooms: [
    room('Estudio / recibo', [-0.05, 4.42, 11.65, 17.05], Z, 23.2),
    room('Baño de visitas', [4.42, 6.44, 13.08, 16.01], Z, 4.6), room('Bar', [6.44, 10.8, 11.65, 17.05], Z, 7.8),
    room('Sala', [10.8, 14.8, 11.65, 17.05], Z, 22.7), room('Galería', [6.25, 13.4, 9.22, 11.65], Z, 15),
    room('Comedor', [14.8, 18.75, 11.65, 17.05], Z, 22.3), room('Cocina', [18.75, 23.0, 11.65, 17.05], Z, 22.3),
    room('Pasillo D1-E', [23.0, 24.5, 9.4, 17.86], Z, 12.8), room('Suite · dormitorio de huéspedes', [24.5, 29.55, 14.18, 17.86], Z, 18.5),
    room('Suite · vestidor', [24.5, 29.55, 11.65, 14.18], Z, 12.7), room('Suite · baño', [24.5, 29.55, 9.1, 11.65], Z, 12.5),
    room('BBQ · terraza cubierta', [23.0, 29.45, 17.65, 23.25], Z, 36), room('Deck y piscina', [-0.3, 23.0, 17.65, 27.0], Z, 300),
    room('Jardín / gimnasio exterior', [-1.7, 6.6, 20.5, 26.0], Z, 46), room('Módulo de servicio', [-6.8, -3.1, 17.65, 30.95], Z, 44),
    room('Patio lateral este', [29.45, 33.0, 11.65, 17.65], Z, 21), room('Escalera principal', [13.4, 18.75, 9.22, 11.65], Z, 0),
  ],

  furniture: [
    // Estudio (E4: escritorio 0.8×1.6 en 0.68..1.49 × 13.66..15.24, diván 2.46..4.21 × 13.12..15.68, puf en (3.1, 12.75))
    F('desk', 1.08, 14.45, Z, 0.8, 1.6, 0.75), F('chair', 0.45, 14.45, Z, 0.5, 0.5, 0.9, 90),
    F('daybed', 3.33, 14.4, Z, 1.75, 2.56, 0.45), F('pouf', 3.1, 12.75, Z, 0.75, 0.75, 0.42),
    F('plant', 0.6, 16.5, Z, 0.7, 0.7, 1.7), F('rug', 2.2, 14.5, Z, 2.6, 3.4, 0.01, 0, { color: 0xb9b2a6 }),
    // Baño de visitas
    F('toilet', 4.85, 13.5, Z, 0.4, 0.65, 0.75, 180), F('sink', 6.15, 14.6, Z, 0.5, 0.45, 0.85, -90),
    // Bar (E4: mueble 6.54..7.0 × 13.0..16.1, barra 7.99..8.63 × 13.02..16.11, 4 taburetes al este)
    F('barCabinet', 6.77, 14.55, Z, 0.46, 3.1, 2.4), F('bar', 8.31, 14.57, Z, 0.64, 3.09, 1.05),
    ...[13.62, 14.3, 15.0, 15.68].map(y => F('stool', 8.87, y, Z, 0.4, 0.4, 0.75)),
    // Sala (E4: sofá en L al norte 11.02..13.81 × 15.1..16.28 y al este 13.8..14.99 × 13.02..16.28; dos butacas al sur; mesa orgánica)
    F('sofa', 12.41, 15.69, Z, 2.8, 1.18, 0.8, 0), F('sofa', 14.4, 14.65, Z, 1.2, 3.26, 0.8, -90),
    F('armchair', 11.6, 12.52, Z, 0.77, 0.76, 0.8, 180), F('armchair', 12.93, 12.52, Z, 0.8, 0.76, 0.8, 180),
    F('coffeeTable', 12.55, 14.1, Z, 1.25, 1.15, 0.35),
    F('rug', 12.7, 14.4, Z, 3.6, 3.6, 0.01, 0, { color: 0xcfc7b8 }), F('plant', 10.95, 16.6, Z, 0.8, 0.8, 1.9),
    // Comedor (E4: mesa 1.1×3.05 en 16.54..17.65 × 12.81..15.85 con 10 sillas)
    F('diningTable', 17.1, 14.33, Z, 1.1, 3.05, 0.75),
    ...[13.4, 14.1, 14.75, 15.4].flatMap(y => [F('chair', 16.25, y, Z, 0.45, 0.45, 0.9, 90), F('chair', 17.95, y, Z, 0.45, 0.45, 0.9, -90)]),
    F('chair', 17.1, 16.1, Z, 0.45, 0.45, 0.9, 0), F('chair', 17.1, 12.55, Z, 0.45, 0.45, 0.9, 180),
    F('pendant', 17.1, 14.33, Z, 2.4, 0.12, 0.06, 90, { hang: 3.6 }), F('sideboard', 16.3, 11.95, Z, 2.2, 0.45, 0.8),
    // Cocina (E4: isla 1.32×3.03 en 19.64..20.96 × 13.05..16.08 con 4 taburetes al oeste; mesón este 22.2..22.85: nevera al norte,
    // cocina en y 15.1, fregadero doble en 13.86, torre al sur 12.37..13.02)
    F('island', 20.3, 14.57, Z, 1.32, 3.03, 0.9), ...[13.76, 14.46, 15.17, 15.88].map(y => F('stool', 19.45, y, Z, 0.4, 0.4, 0.75)),
    F('counter', 22.52, 14.54, Z, 0.65, 3.08, 0.9), F('fridge', 22.52, 16.45, Z, 0.65, 0.73, 2.1), F('ovenTower', 22.52, 12.7, Z, 0.65, 0.65, 2.1),
    F('hood', 22.4, 15.1, Z, 0.5, 0.9, 0.4, 0, { hang: 1.6 }),
    // Suite E-F (E4 no dibuja mobiliario): cama contra el tabique sur del dormitorio; vestidor con closet corrido; baño con ventana al este
    F('bed', 27.0, 15.35, Z, 1.6, 2.0, 0.55, 0), F('nightstand', 25.95, 14.65, Z, 0.45, 0.45, 0.5), F('nightstand', 28.05, 14.65, Z, 0.45, 0.45, 0.5),
    F('closet', 27.65, 11.95, Z, 3.5, 0.6, 2.3, 0), F('bench', 27.0, 13.2, Z, 1.2, 0.45, 0.45),
    F('doubleSink', 27.4, 11.35, Z, 1.6, 0.55, 0.85, 0), F('toilet', 28.3, 9.45, Z, 0.4, 0.65, 0.75, 180),
    F('shower', 29.05, 9.6, Z, 0.9, 0.9, 2.0), F('bathtub', 25.6, 9.6, Z, 1.8, 0.8, 0.55),
    // BBQ (E4: dos mesas 0.95×1.75 con bancos en 24.55..25.5 × 19.1..22.75, barra 26.95..27.75 × 19.4..22.45 con 4 taburetes al oeste,
    // parrilla-mesón 28.75..29.45 × 19.4..22.5)
    F('diningTable', 25.03, 21.88, Z, 0.95, 1.75, 0.75), F('diningTable', 25.03, 20.0, Z, 0.95, 1.75, 0.75),
    ...[21.88, 20.0].flatMap(y => [F('bench', 24.35, y, Z, 0.35, 1.4, 0.45), F('bench', 25.7, y, Z, 0.35, 1.4, 0.45)]),
    F('bar', 27.35, 20.92, Z, 0.8, 3.05, 1.0), ...[19.99, 20.73, 21.4, 22.14].map(y => F('stool', 26.65, y, Z, 0.4, 0.4, 0.75)),
    F('grill', 29.1, 20.95, Z, 0.7, 3.1, 0.9),
    // Deck (E4: dos pares de tumbonas en x≈10.9/11.9 y 14.6/15.9 con mesita; sala exterior sofá 19.27..21.22 × 18.25..19.06, mesa, 2 butacas al este)
    ...[10.9, 11.9, 14.6, 15.9].map(x => F('lounger', x, 20.3, Z, 0.7, 1.9, 0.4)),
    F('roundTable', 11.4, 19.9, Z, 0.4, 0.4, 0.45), F('roundTable', 15.5, 19.9, Z, 0.4, 0.4, 0.45),
    F('outSofa', 20.25, 18.65, Z, 2.0, 0.8, 0.7), F('armchair', 21.85, 20.5, Z, 0.8, 0.75, 0.75, -90), F('armchair', 21.85, 19.25, Z, 0.8, 0.75, 0.75, -90),
    F('coffeeTable', 20.35, 20.1, Z, 1.35, 0.6, 0.35),
    // Jardín-gimnasio (E4: barras −0.42..2.4 × 25.2..26.6, domo Ø2.2 en (4.22, 23.0), banco −0.5..0.05 × 21.2..23.7, rack de pesas en (1.1, 23.2))
    F('gymBar', 1.0, 25.9, Z, 1.4, 2.8, 2.2, 90),                                  // barras (giradas 90: el tobogán del modelo sale hacia +x)
    F('bench', -0.22, 22.45, Z, 0.55, 2.5, 0.45), F('bench', 1.1, 23.2, Z, 1.7, 0.6, 0.5),   // banco y rack de pesas
    F('dome', 4.22, 23.0, Z, 2.2, 2.2, 1.6),
    F('palm', 23.5, 25.9, Z, 1, 1, 7), F('tree', 31.3, 25.8, Z, 1, 1, 6),
    F('plant', 29.9, 17.2, Z, 0.9, 0.9, 1.6),
  ],
};
