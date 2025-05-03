const BASE_URL = 'https://entorno-web.up.railway.app';

// Consultar registros
async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    if (!response.ok) throw new Error(`Error al consultar registros: ${response.status}`);

    const data = await response.json();
    const registrosContainer = document.getElementById('registros-container');

    if (!registrosContainer) {
      console.error('Elemento "registros-container" no encontrado');
      return;
    }

    registrosContainer.innerHTML = '';

    if (data.length === 0) {
      registrosContainer.innerHTML = '<p>No hay registros disponibles.</p>';
    } else {
      data.forEach(registro => {
        const item = document.createElement('div');
        item.innerHTML = `<strong>ID:</strong> ${registro.id}, <strong>Nombre:</strong> ${registro.nombre}, <strong>Valor:</strong> ${registro.valor}`;
        registrosContainer.appendChild(item);
      });
    }
  } catch (error) {
    console.error('Error al consultar registros:', error.message);
    alert('Error al obtener los registros.');
  }
}

// Agregar registro
async function agregarRegistro() {
  const nombre = prompt('Introduce el nombre del registro:');
  const valor = prompt('Introduce el valor del registro:');

  if (!nombre || !valor) {
    alert('Ambos campos son obligatorios');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, valor }),
    });

    const result = await response.text();

    if (!response.ok) throw new Error(`Error al agregar: ${response.status} - ${result}`);

    alert('Registro agregado con éxito');
    consultarRegistro(); // Recarga los registros
  } catch (error) {
    console.error('Error al agregar registro:', error.message);
    alert('No se pudo agregar el registro.');
  }
}
