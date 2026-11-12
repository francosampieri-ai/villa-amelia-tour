// Convenciones compartidas por los archivos de datos (coordenadas del plano, en metros).
// x: eje A→F (este del proyecto), y: eje 1→6 (norte del proyecto), z: cota (+0.00 = piso garaje).
// El motor (builder.js) convierte a Three.js: x→x, z→y, y→-z.

export const AX = { A: 0.0, B: 6.25, C: 12.5, D: 18.75, D1: 23.0, E: 24.55, F: 29.45 };
export const AY = { 1: 0.0, 2: 4.10, 3: 9.40, 4: 11.65, 5: 17.65, 6: 23.25 };

// Espesores adoptados (PLAN §1.5)
export const T = { ext: 0.20, int: 0.15, vid: 0.05, ant: 0.15, col: 0.30 };

export const DOOR_H = 2.10;

/** Muro por su eje. mat: 'ext' | 'int' | 'vid' | 'ant' | 'wood' | 'lamas' | 'dark' | 'conc' */
export function W(id, a, b, t, z0, z1, mat, openings = [], extra = {}) {
  return { id, a, b, t, z0, z1, mat, openings, ...extra };
}

/** Puerta: hueco desde el piso (z0) hasta z0 + h. a..b en coordenada absoluta del eje dominante. */
export function door(a, b, floor, h = DOOR_H, leaf = true) {
  return { kind: 'door', a, b, z0: floor, z1: floor + h, leaf };
}
/** Puerta con sentido de apertura: swing +1 abre hacia la izquierda del sentido a→b del muro, -1 hacia la derecha;
 *  hinge 'a' = bisagra en el extremo de menor cota, 'b' = en el de mayor cota. */
export function doorS(a, b, floor, swing = 1, hinge = 'a', h = DOOR_H) {
  return { kind: 'door', a, b, z0: floor, z1: floor + h, leaf: true, swing, hinge };
}
/** Vano abierto sin carpintería. */
export function vano(a, b, z0, z1) {
  return { kind: 'void', a, b, z0, z1 };
}
/** Ventana con vidrio. */
export function win(a, b, z0, z1) {
  return { kind: 'window', a, b, z0, z1 };
}
/** Hoja de vidrio (puerta corredera / batiente de vidrio abierta: hueco libre con marco). */
export function glassDoor(a, b, floor, h = DOOR_H) {
  return { kind: 'glassdoor', a, b, z0: floor, z1: floor + h };
}

/** Losa: caja en planta, z0..z1. top/bottom = material de acabado. */
export function slab(box, z0, z1, top = 'conc', bottom = 'ceiling') {
  return { box, z0, z1, top, bottom };
}
/** Acabado de piso (capa fina sobre la losa). */
export function floor(box, z, mat) {
  return { box, z, mat };
}
/** Escalera: caja en planta, de z0 a z1, dir de subida ('+x','-x','+y','-y'), n peldaños. */
export function stair(id, box, z0, z1, dir, steps, mat = 'stair', extra = {}) {
  return { id, box, z0, z1, dir, steps, mat, ...extra };
}
export function column(x, y, z0, z1, s = T.col) {
  return { x, y, z0, z1, s };
}
export function room(name, box, z, area) {
  return { name, box, z, area };
}
/** Mueble: tipo, centro (x,y), cota de piso z, dimensiones w (x) × d (y) × h, giro en grados (antihorario en planta). */
export function F(type, x, y, z, w, d, h, rot = 0, opts = {}) {
  return { type, x, y, z, w, d, h, rot, ...opts };
}
