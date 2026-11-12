// Pantalla de bienvenida (gancho para el prompt 7/7). Por ahora sólo oculta el indicador de carga.
export function showWelcome({ onStart } = {}) {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.add('hide');
  if (onStart) onStart();
  return Promise.resolve();
}
