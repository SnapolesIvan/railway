const BASE_URL = window.location.origin; // Usar origen actual para funcionar en Railway u otros entornos

// Mostrar todos los registros y generar botones Editar/Eliminar dinámicamente
async function consultarRegistro() {
  try {
    const response = await fetch(`${BASE_URL}/registro`);
    const data = await response.json();

    const container = document.getElementById('registros-container');
    container.innerHTML = '';

    if (data.length === 0) {
      container.innerHTML = '<p>No hay registros disponibles.</p>';
    } else {
      data.forEach(registro => {
        const div = document.createElement('div');
        div.className = 'registro-item';
        div.innerHTML = `<span>ID: ${registro.id} | Nombre: ${registro.nombre} | Valor: ${registro.valor}</span>`;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Editar';
        editBtn.onclick = () => editarRegistro(registro.id);
        div.appendChild(editBtn);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Eliminar';
        deleteBtn.onclick = () => eliminarRegistro(registro.id);
        div.appendChild(deleteBtn);

        container.appendChild(div);
      });
    }
  } catch (error) {
    console.error('Error al consultar:', error);
    alert('No se pudieron obtener los registros.');
  }
}

async function agregarRegistro() {
  const nombre = prompt('Introduce el nombre:');
  const valor = prompt('Introduce el valor:');
  if (!nombre || !valor) return alert('Todos los campos son obligatorios.');

  try {
    const response = await fetch(`${BASE_URL}/registro`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nombre, valor })
    });
    if (!response.ok) throw new Error(await response.text());
    alert('Registro agregado con éxito');
    consultarRegistro();
  } catch (error) {
    console.error('Error al agregar:', error);
    alert('No se pudo agregar el registro.');
  }
}

async function editarRegistroDesdeInput() {
  const id = document.getElementById('registro-id').value;
  if (!id) return alert('Ingresa un ID');
  editarRegistro(id);
}

async function eliminarRegistroDesdeInput() {
  const id = document.getElementById('registro-id').value;
  if (!id) return alert('Ingresa un ID');
  eliminarRegistro(id);
}

async function editarRegistro(id) {
  const nombre = prompt('Nuevo nombre:');
  const valor = prompt('Nuevo valor:');
  if (!nombre || !valor) return alert('Todos los campos son obligatorios.');

  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ nombre, valor })
    });
    if (!response.ok) throw new Error(await response.text());
    alert('Registro actualizado correctamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al editar:', error);
    alert('No se pudo editar el registro.');
  }
}

async function eliminarRegistro(id) {
  if (!confirm('¿Estás seguro de eliminar este registro?')) return;
  try {
    const response = await fetch(`${BASE_URL}/registro/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error(await response.text());
    alert('Registro eliminado correctamente');
    consultarRegistro();
  } catch (error) {
    console.error('Error al eliminar:', error);
    alert('No se pudo eliminar el registro.');
  }
}

window.onload = consultarRegistro;
