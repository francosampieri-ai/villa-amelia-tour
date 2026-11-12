// Sitio: lote, cerco perimetral, terreno, piscina, calle (PLAN §1.4, §3.1 1.14-1.17, §11.2 W1.23-W1.24)
import { W, slab, F } from './common.js';

// Vértices del lote (coordenadas del modelo)
export const LOT = [[-3.68, -3.15], [-6.77, 31.24], [33.56, 26.89], [32.55, -3.23]];

// Terreno a +1.40 (césped) en la parte norte y este del lote, con hueco para la piscina.
// Excluye la huella del garaje/pasillo (-4.85..31.4 × -3.23..11.65) y el jardín frontal (a +0.00).
export const TERRAIN = {
  z: 1.39, mat: 'grass',
  polygon: [[-5.55, 17.65], [-6.77, 31.24], [33.56, 26.89], [32.55, -3.23], [31.1, -3.0], [31.1, 13.9], [29.45, 13.9], [29.45, 11.65], [-0.3, 11.65], [-0.3, 17.65]],
  holes: [[[7.75, 21.75], [21.55, 21.75], [21.55, 25.8], [7.75, 25.8]]],
};

// E4: borde 7.77..21.56 × 21.76..25.8, agua 8.13..21.15 × 22.09..25.46
export const POOL = {
  rim: [7.75, 21.55, 21.75, 25.8],   // borde exterior del vaso
  water: [8.1, 21.2, 22.1, 25.45],   // lámina de agua
  zBottom: 0.0, zWater: 1.25, zRim: 1.40,
};

export const site = {
  walls: [
    // Cerco perimetral: norte (seto + muro) y este (muro ciego color tierra)
    W('WL.N', [-6.77, 31.24], [33.56, 26.89], 0.20, 1.40, 3.9, 'earth'),
    W('WL.E', [33.56, 26.89], [32.55, -3.23], 0.20, 1.40, 3.9, 'earth'),
    W('WL.E0', [32.55, -3.23], [32.5, -3.0], 0.20, 0.0, 3.0, 'earth'),
    // Lindero oeste norte del acceso: reja de lamas frente al jardín frontal y muro ciego del MS hacia la calle
    W('WL.W1', [-4.85, 11.65], [-5.39, 17.65], 0.15, 0.0, 2.8, 'lamas'),
    W('WL.W2', [-5.55, 17.65], [-6.77, 31.24], 0.20, 1.40, 4.8, 'earth'),
    // Jardín frontal: cierre norte bajo el deck ya está en W1.25 (level1)
  ],
  slabs: [
    // Acera y calle al oeste
    slab([-9.0, -3.6, -6.0, 34.0], -0.35, -0.2, 'sidewalk', 'conc'),
    slab([-22.0, -9.0, -8.0, 36.0], -0.4, -0.35, 'asphalt', 'conc'),
    slab([-10.6, -9.0, -6.0, 34.0], -0.35, -0.2, 'grass', 'conc'),
    // Terreno exterior al lote (vecinos) a +1.40 / 0.0
    slab([-40.0, 70.0, -40.0, -3.3], -0.4, 0.0, 'grassDry', 'conc'),
    slab([33.6, 70.0, -3.3, 60.0], -0.4, 1.4, 'grassDry', 'conc'),
    slab([-22.0, 70.0, 31.3, 60.0], -0.4, 1.4, 'grassDry', 'conc'),
    slab([-22.0, -6.8, 26.9, 31.3], -0.4, -0.35, 'asphalt', 'conc'),
    // Jardín frontal (+0.00) ya tiene losa en level0
  ],
  furniture: [
    F('pole', -7.5, 23.0, -0.2, 0.2, 0.2, 7.0), F('pole', -7.0, 8.0, -0.2, 0.2, 0.2, 7.0),
    F('tree', -9.8, 14.0, -0.35, 1, 1, 6), F('tree', -9.8, 30.0, -0.35, 1, 1, 5),
    F('tree', 40.0, 10.0, 1.4, 1, 1, 7), F('tree', 36.0, 35.0, 1.4, 1, 1, 8), F('tree', 10.0, 36.0, 1.4, 1, 1, 7), F('tree', 24.0, 34.0, 1.4, 1, 1, 6),
    F('tree', 18.0, -12.0, 0.0, 1, 1, 7), F('tree', 2.0, -10.0, 0.0, 1, 1, 6),
    F('hedge', 13.4, 29.0, 1.4, 38.0, 0.8, 1.6, -6.15),
    F('shrub', 31.0, 22.0, 1.4, 1.4, 1.4, 1.3), F('shrub', 31.8, 14.5, 1.4, 1.2, 1.2, 1.1),
  ],
};
