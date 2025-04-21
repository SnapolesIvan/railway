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


