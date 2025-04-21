function consultarRegistros() {
  fetch('/registros')
    .then(response => {
      if (!response.ok) throw new Error('Error al obtener los registros');
      return response.json();
    })
    .then(data => {
      const registrosContainer = document.getElementById('registros-container');
      registrosContainer.innerHTML = '';

      if (data.length === 0) {
        registrosContainer.innerHTML = '<p>No hay registros disponibles.</p>';
      } else {
        const lista = document.createElement('ul');
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
      alert('No se pudieron cargar los registros');
    });
}

function agregarRegistro() {
  const nombre = prompt('Introduce el nombre:');
  const valor = prompt('Introduce el valor:');
  fetch('/registros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, valor }),
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al agregar el registro');
      alert('Registro agregado con éxito');
      consultarRegistros();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al agregar el registro');
    });
}

function editarRegistro() {
  const id = prompt('Introduce el ID del registro:');
  const nombre = prompt('Introduce el nuevo nombre:');
  const valor = prompt('Introduce el nuevo valor:');
  fetch(`/registros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, valor }),
  })
    .then(response => {
      if (!response.ok) throw new Error('Error al actualizar el registro');
      alert('Registro actualizado con éxito');
      consultarRegistros();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al actualizar el registro');
    });
}

function eliminarRegistro() {
  const id = prompt('Introduce el ID del registro:');
  fetch(`/registros/${id}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) throw new Error('Error al eliminar el registro');
      alert('Registro eliminado con éxito');
      consultarRegistros();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error al eliminar el registro');
    });
}


