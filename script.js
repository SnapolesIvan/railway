// Función para mostrar todos los registros en la página web
function consultarRegistros() {
  fetch('/registros')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al obtener registros');
      }
      return response.json();
    })
    .then(data => {
      const registrosContainer = document.getElementById('registros-container'); // Div para mostrar los registros
      registrosContainer.innerHTML = ''; // Limpiar el contenido previo

      if (data.length === 0) {
        registrosContainer.innerHTML = '<p>No hay registros disponibles.</p>';
      } else {
        const lista = document.createElement('ul'); // Crear una lista para los registros
        data.forEach(registro => {
          const item = document.createElement('li');
          item.textContent = `ID: ${registro.id}, Nombre: ${registro.nombre}, Valor: ${registro.valor}`;
          lista.appendChild(item);
        });
        registrosContainer.appendChild(lista);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      const registrosContainer = document.getElementById('registros-container');
      registrosContainer.innerHTML = '<p>Error al cargar los registros.</p>';
    });
}

// Funciones adicionales que puedes implementar
function consultarIndividual() {
  const id = prompt('Introduce el ID del registro:');
  fetch(`/registros/${id}`)
    .then(response => response.json())
    .then(data => alert(JSON.stringify(data)))
    .catch(error => console.error('Error:', error));
}

function agregarRegistro() {
  const nombre = prompt('Introduce el nombre:');
  const valor = prompt('Introduce el valor:');
  fetch('/registros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, valor })
  })
    .then(() => alert('Registro agregado'))
    .catch(error => console.error('Error:', error));
}

function editarRegistro() {
  const id = prompt('Introduce el ID del registro:');
  const nombre = prompt('Introduce el nuevo nombre:');
  const valor = prompt('Introduce el nuevo valor:');
  fetch(`/registros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, valor })
  })
    .then(() => alert('Registro actualizado'))
    .catch(error => console.error('Error:', error));
}

function eliminarRegistro() {
  const id = prompt('Introduce el ID del registro:');
  fetch(`/registros/${id}`, { method: 'DELETE' })
    .then(() => alert('Registro eliminado'))
    .catch(error => console.error('Error:', error));
}
