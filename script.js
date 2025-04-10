// Consultar todos los registros
function consultarRegistros() {
  fetch('/registros')
    .then(response => response.json())
    .then(data => {
      console.log('Registros:', data);
      alert(JSON.stringify(data)); // Muestra los registros como alerta temporalmente
    })
    .catch(error => console.error('Error:', error));
}

// Consultar un registro individual
function consultarIndividual() {
  const id = prompt('Introduce el ID del registro:');
  fetch(`/registros/${id}`)
    .then(response => response.json())
    .then(data => {
      console.log('Registro:', data);
      alert(JSON.stringify(data));
    })
    .catch(error => console.error('Error:', error));
}

// Agregar un registro
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

// Actualizar un registro
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

// Eliminar un registro
function eliminarRegistro() {
  const id = prompt('Introduce el ID del registro:');
  fetch(`/registros/${id}`, { method: 'DELETE' })
    .then(() => alert('Registro eliminado'))
    .catch(error => console.error('Error:', error));
}
