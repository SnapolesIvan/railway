const BASE_URL = 'https://entorno-web.up.railway.app'; // URL del backend

// **Función para consultar registros**
async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    if (!response.ok) throw new Error(`Error al consultar registros: ${response.status}`);

    const data = await response.json();
    const registrosContainer = document.getElementById('registros-container');

    if (!registrosContainer) {
      console.error('Elemento "registros-container" no encontrado en el DOM');
      return;
    }

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
    console.error('Error al consultar registros:', error.message);
    alert('No se pudieron consultar los registros. Verifica la conexión con el servidor.');
  }
}

// **Función para agregar un nuevo registro**
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
      body: JSON.stringify({ nombre, valor }),
    });

    if (!response.ok) {
      const errorMessage = await response.text(); // Captura el mensaje de error del backend
      throw new Error(`Error al agregar el registro: ${response.status} - ${errorMessage}`);
    }

    alert('Registro agregado exitosamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al agregar registro:', error.message);
    alert('No se pudo agregar el registro. Verifica la conexión con el servidor.');
  }
}
