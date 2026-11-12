// Recorrido guiado (PLAN §10). En este paso sólo se dejan los datos y la API; la animación llega en el prompt 6/7.
// Posición = (x, y, zOjo) en coordenadas del plano; yaw = ángulo en planta (grados, antihorario; 90 = +Y / norte).

export const WAYPOINTS = [
  { n: 1, name: 'Calle, frente a la reja peatonal', pos: [-7.5, 10.4, 1.85], yaw: 0, label: 'Villa Amelia · fachada oeste' },
  { n: 2, name: 'Pasillo de entrada', pos: [-2.5, 10.5, 1.85], yaw: 0, label: '18.7 m² · entrada protegida' },
  { n: 3, name: 'Vestíbulo', pos: [5.6, 10.6, 3.0], yaw: 90, label: 'Umbral a la barra social' },
  { n: 4, name: 'Estudio', pos: [2.3, 14.5, 3.0], yaw: 270, label: '23 m² · despacho entre la calle y la piscina' },
  { n: 5, name: 'Bar y baño de visitas', pos: [8.9, 12.6, 3.0], yaw: 90, label: 'Bar de 2.7 m bajo la doble altura' },
  { n: 6, name: 'Sala', pos: [12.8, 12.6, 3.0], yaw: 90, label: '22.7 m² · 5.7 m de altura' },
  { n: 7, name: 'Comedor', pos: [16.2, 12.5, 3.0], yaw: 90, label: '22.3 m² · mesa para 8 frente al jardín' },
  { n: 8, name: 'Cocina', pos: [20.0, 16.6, 3.0], yaw: 270, label: '22.3 m² · isla de 3 m' },
  { n: 9, name: 'Salida al deck', pos: [13.6, 18.4, 3.0], yaw: 90, label: 'Deck y piscina 13.4 × 3.4' },
  { n: 10, name: 'Deck junto a la piscina', pos: [14.6, 21.0, 3.0], yaw: 270, label: 'Fachada de vidrio completa' },
  { n: 11, name: 'Jardín-gimnasio', pos: [5.0, 24.5, 3.0], yaw: 0, label: '60 m² de césped, gimnasio y domo' },
  { n: 12, name: 'BBQ', pos: [26.0, 19.0, 3.0], yaw: 90, label: '36 m² · parrilla, barra, terraza cubierta' },
  { n: 13, name: 'Suite de huéspedes', pos: [27.0, 16.5, 3.0], yaw: 270, label: '22.8 m² + baño + antesala' },
  { n: 14, name: 'Escalera principal', pos: [17.5, 10.6, 3.0], yaw: 180, label: '13 peldaños' },
  { n: 15, name: 'Hall íntimo', pos: [10.0, 8.5, 5.1], yaw: 90, label: '45.8 m² bajo el lucernario' },
  { n: 16, name: 'Dormitorio 1', pos: [3.5, 5.5, 5.1], yaw: 270, label: '30.7 m² · patio-jardinera privado' },
  { n: 17, name: 'Dormitorio 3', pos: [15.5, 3.5, 5.1], yaw: 270, label: '25.3 m² con vestidor' },
  { n: 18, name: 'Master', pos: [26.0, 8.0, 5.1], yaw: 270, label: '45.2 m² · jardín privado y balcón' },
  { n: 19, name: 'Baño master', pos: [20.5, 4.0, 5.1], yaw: 180, label: 'Bañera exenta y jardinera cenital' },
  { n: 20, name: 'Estar familiar', pos: [20.5, 14.5, 5.9], yaw: 180, label: '22.3 m² · palco sobre la sala' },
  { n: 21, name: 'Terraza 2', pos: [26.0, 20.5, 5.9], yaw: 90, label: '36 m² sobre la piscina' },
  { n: 22, name: 'Terraza 3', pos: [27.0, 13.5, 6.5], yaw: 270, label: '40 m² · azotea con pérgola' },
  { n: 23, name: 'Garaje', pos: [10.0, 4.0, 1.6], yaw: 180, label: '335 m² · 4 autos' },
  { n: 24, name: 'Módulo de servicio', pos: [24.0, 6.0, 2.0], yaw: 0, label: 'Lavandería y dormitorios de servicio' },
];

/** Esqueleto del tour guiado: se conecta a FirstPerson en el prompt 6/7. */
export class GuidedTour {
  constructor(fp) { this.fp = fp; this.index = 0; this.playing = false; }
  goto(i) {
    const w = WAYPOINTS[i]; if (!w) return;
    this.index = i; this.fp.setPose(w.pos[0], w.pos[1], w.pos[2] - 1.6, w.yaw);
  }
  start() { this.playing = true; this.goto(0); }
  stop() { this.playing = false; }
  update(/* dt */) { /* interpolación entre paradas: pendiente */ }
}
