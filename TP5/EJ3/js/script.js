const emailInput = document.getElementById('email');
const nombreInput = document.getElementById('nombre-input');
const apellidoInput = document.getElementById('apellido-input');
const avatarInput = document.getElementById('avatar-input');
const form = document.getElementById('form');
const btnEliminar = document.getElementById('btn-eliminar');
const modal = document.getElementById('modal');
const formEdit = document.getElementById('edit-form');
const editIdInput = document.getElementById('edit-id');
const editEmailInput = document.getElementById('edit-email');
const editNombreInput = document.getElementById('edit-nombre');
const editApellidoInput = document.getElementById('edit-apellido');
const editAvatarInput = document.getElementById('edit-avatar');
const closeModalBtn = document.getElementById('close-modal');
const editSubmit = document.getElementById('edit-submit');
const noResultsRow = document.getElementById('no-results-row');
const searchInput = document.getElementById('search-input');
const userFilter = document.getElementById('user-filter');
const selectSort = document.getElementById('sort');
const selectPageSize = document.getElementById('page-size');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageInfo = document.getElementById('page-info');

const URL = "https://reqres.in/api/users";
let usuariosLocal = [];
let usuariosFiltrados = [];
let paginaActual = 1;
let tamañoPagina = 6;

const opciones = {
  method: 'GET',
  headers: {
    'x-api-key': 'reqres-free-v1'
  }
};

const rellenarFiltroUsuarios = (usuarios) => {
  while (userFilter.options.length > 1) {
    userFilter.remove(1);
  }
  const userIds = [...new Set(usuarios.map(usuario => usuario.id))];
  userIds.forEach(id => {
    const option = document.createElement('option');
    option.value = id;
    option.textContent = `Filtrar por userId ${id}`;
    userFilter.appendChild(option);
  });
}

const obtenerUsuarios = () => {
  fetch(URL, opciones)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta de la red');
      }
      return response.json();
    })
    .then(response => {
      usuariosLocal = response.data;
      selectPageSize.value = tamañoPagina;
      aplicarFiltros();
      rellenarFiltroUsuarios(usuariosLocal);
    })
    .catch(error => {
      console.error('Hubo un problema con la petición Fetch:', error);
    });
};

const renderizarUsuarios = (usuarios) => {
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = '';
  if (usuarios.length > 0) {
    usuarios.forEach(usuario => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${usuario.id}</td>
        <td>${usuario.email}</td>
        <td>${usuario.first_name}</td>
        <td>${usuario.last_name}</td>
        <td><img width="70" src="${usuario.avatar}" alt="Avatar"></td>
        <td>
          <button data-id=${usuario.id} class="button-edit">Editar</button>
          <button data-id=${usuario.id} id="btn-eliminar" class="button-delete">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
    noResultsRow.style.display = 'none';
  } else {
    tbody.appendChild(noResultsRow);
    noResultsRow.style.display = 'table-row';
  }

  document.querySelectorAll('.button-delete').forEach(boton => {
    boton.addEventListener('click', (e) => {
      eliminarUsuario(e.target.dataset.id);
    });
  });

  document.querySelectorAll('.button-edit').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const usuario = usuariosLocal.find(u => u.id == e.target.dataset.id);
      if (usuario) {
        modal.style.display = 'flex';
        editIdInput.value = usuario.id;
        editEmailInput.value = usuario.email;
        editNombreInput.value = usuario.first_name;
        editApellidoInput.value = usuario.last_name;
        editAvatarInput.value = usuario.avatar;
      }
    });
  });
}

const actualizarPaginacion = (totalItems) => {
  const totalPaginas = Math.ceil(totalItems / tamañoPagina);
  pageInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  prevBtn.disabled = paginaActual === 1;
  nextBtn.disabled = paginaActual === totalPaginas || totalPaginas === 0;
}

const agregarUsuario = (email, first_name, last_name, avatar) => {
  const datosUsuario = {
    email: email,
    first_name: first_name,
    last_name: last_name,
    avatar: avatar,
  };

  const opciones = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'reqres-free-v1'
    },
    body: JSON.stringify(datosUsuario)
  };

  fetch(URL, opciones)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al crear el usuario: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      usuariosLocal.push({
        id: data.id,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        avatar: data.avatar
      });
      aplicarFiltros();
      rellenarFiltroUsuarios(usuariosLocal);
    })
    .catch(error => {
      console.error('Error:', error);
    });
};

const eliminarUsuario = (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
  usuariosLocal = usuariosLocal.filter(usuario => usuario.id != id);
  const totalPaginas = Math.ceil(usuariosLocal.length / tamañoPagina);
  if (paginaActual > totalPaginas && totalPaginas > 0) {
    paginaActual = totalPaginas;
  } else if (totalPaginas === 0) {
    paginaActual = 1;
  }
  aplicarFiltros();
  rellenarFiltroUsuarios(usuariosLocal);
};

const editarUsuario = (id, nuevosDatos) => {
  const indice = usuariosLocal.findIndex(usuario => usuario.id == id);
  if (indice !== -1) {
    usuariosLocal[indice] = { id, ...nuevosDatos };
  }
  aplicarFiltros();
}

const aplicarFiltros = () => {
  let tempUsuarios = [...usuariosLocal];
  usuariosFiltrados = tempUsuarios;

  // Aplico filtro de búsqueda por nombre
  const terminoBusqueda = searchInput.value.toLowerCase();
  if (terminoBusqueda) {
    usuariosFiltrados = usuariosFiltrados.filter(usuario =>
      usuario.first_name.toLowerCase().includes(terminoBusqueda) ||
      usuario.last_name.toLowerCase().includes(terminoBusqueda)
    );
  }

  // Aplico filtro por userId
  const userIdSeleccionado = userFilter.value;
  if (userIdSeleccionado) {
    usuariosFiltrados = usuariosFiltrados.filter(usuario => usuario.id == userIdSeleccionado);
  }

  // Aplico ordenamiento
  const ordenSeleccionado = selectSort.value;
  if (ordenSeleccionado === 'id_desc') {
    usuariosFiltrados.sort((usuarioA, usuarioB) => usuarioB.id - usuarioA.id);
  } else {
    usuariosFiltrados.sort((usuarioA, usuarioB) => usuarioA.id - usuarioB.id);
  }

  // Aplico paginación
  const indexInicio = (paginaActual - 1) * tamañoPagina;
  const indexFinal = indexInicio + tamañoPagina;
  const usuariosPagina = usuariosFiltrados.slice(indexInicio, indexFinal);

  renderizarUsuarios(usuariosPagina);
  actualizarPaginacion(usuariosFiltrados.length);
}

searchInput.addEventListener('input', () => {
  paginaActual = 1;
  aplicarFiltros();
});

userFilter.addEventListener('change', () => {
  paginaActual = 1;
  aplicarFiltros();
});

selectSort.addEventListener('change', () => {
  paginaActual = 1;
  aplicarFiltros();
});

selectPageSize.addEventListener('change', (e) => {
  tamañoPagina = parseInt(e.target.value);
  paginaActual = 1;
  aplicarFiltros();
});

prevBtn.addEventListener('click', () => {
  if (paginaActual > 1) {
    paginaActual--;
    aplicarFiltros();
  }
});

nextBtn.addEventListener('click', () => {
  const totalPaginas = Math.ceil(usuariosFiltrados.length / tamañoPagina);
  if (paginaActual < totalPaginas) {
    paginaActual++;
    aplicarFiltros();
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  agregarUsuario(emailInput.value, nombreInput.value, apellidoInput.value, avatarInput.value);
  form.reset();
});

closeModalBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

formEdit.addEventListener('submit', (event) => {
  event.preventDefault();
  const id = editIdInput.value;
  const nuevosDatos = {
    email: editEmailInput.value,
    first_name: editNombreInput.value,
    last_name: editApellidoInput.value,
    avatar: editAvatarInput.value,
  };
  editarUsuario(id, nuevosDatos);
  modal.style.display = 'none';
});

obtenerUsuarios();
