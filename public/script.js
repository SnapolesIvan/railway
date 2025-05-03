const BASE_URL = 'https://entorno-web.up.railway.app';

// Consultar registros
async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();

    const registrosContainer = document.getElementById('registros-container');
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
    console.error('Error al consultar:', error.message);
    alert('No se pudieron obtener los registros.');
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
      body: JSON.stringify({ nombre, valor })
    });

    if (!response.ok) {
      const resultText = await response.text();
      throw new Error(`Error al agregar: ${response.status} - ${resultText}`);
    }

    alert('Registro agregado con éxito');
    consultarRegistro();
  } catch (error) {
    console.error('Error al agregar registro:', error.message);
    alert('No se pudo agregar el registro.');
  }
}

// Editar registro
async function editarRegistro() {
  const id = prompt('Introduce el ID del registro a editar:');
  const nombre = prompt('Nuevo nombre:');
  const valor =

