const BASE_URL = 'https://entorno-web.up.railway.app'; // URL del backend

async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    if (!response.ok) throw new Error('Error al consultar registros');
    const data = await response.json();

    const registrosContainer = document.getElementById('registros-container');
    registrosContainer.innerHTML = '';

    if (data.length === 0) {
      registrosContainer.innerHTML = '<p>No hay registros disponibles.</p>';
    } else {
      data.forEach(registro => {
        const item = document.createElement('div');
        item.innerHTML = `ID: ${registro.id}, Nombre: ${registro.nombre}, Valor: ${registro.valor}`;
        registrosContainer.appendChild(item);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
    alert('No se pudieron consultar los registros');
  }
}

async function agregarRegistro() {
  const nombre = prompt('Introduce el nombre del registro:');
  const valor = prompt('Introduce el valor del registro:');

  if (!nombre || !valor) {
    alert('Debes proporcionar ambos campos');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) throw new Error('Error al agregar el registro');
    alert('Registro agregado exitosamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error:', error.message);
    alert('No se pudo agregar el registro');
  }
}
