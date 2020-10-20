const searchBar = document.getElementById('search-bar');
const searchBtn = document.getElementById('search-btn');
const sobreMiBtn = document.getElementById('sobre-mi-btn');
const contenedorPeliculas = document.getElementById('contenedor-peliculas-pop');
const contenedorTerror = document.getElementById('contenedor-terror');
const contenedorOsito = document.getElementById('contenedor-osito');
const modal1 = document.getElementById('modal-1');
const modalVarios = document.getElementById('modal-varios');
const span = document.getElementsByClassName("cerrar");
const contenedorPeliculaSeleccionada = document.getElementById('contenedor-pelicula-seleccionada');
const contenedorVariasSeleccionadas = document.getElementById('contenedor-varias-seleccionadas');
const modalSobreMi = document.getElementById('modal-yo');

//REQUEST A API
const apiKey = "78a508a360777691fbb37d5cd688d697";
let listaPop;
let listaTop;

document.addEventListener("DOMContentLoaded", async() => {
    //REQUEST PELICULAS POPULARES
    try {
        await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=es-ES&page=1`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log("ERROR REQUEST PELIS POPULARES");
                }
            })
            .then(data => {
                listaPop = data;
            });
    } catch (error) {
        console.log(error);
    }

    cargarPelisPop(listaPop);

    //REQUEST PELICULAS TOP RATED
    try {
        await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}&language=es-ES&page=1`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    console.log('FALLÓ REQUEST');
                }
            })
            .then(data => {
                listaTop = data;
            });
    } catch (error) {
        console.log(error);
    }

    cargarPelisTop(listaTop);


    //SELECCIONAR PELICULAS
    const pelicula = document.getElementsByClassName('pelicula');
    for (let i = 0; i < pelicula.length; i++) {
        pelicula[i].addEventListener("click", async() => {
            listaPop.results.forEach(p => {
                if (p.id == pelicula[i].id) {
                    mostrarModal1(p);
                }
            })

            listaTop.results.forEach(p => {
                if (p.id == pelicula[i].id) {
                    mostrarModal1(p);
                }
            })

            if (pelicula[i].id == 38757) {
                try {
                    await fetch('https://api.themoviedb.org/3/movie/38757?api_key=78a508a360777691fbb37d5cd688d697&language=es-ES')
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                console.log('FALLÓ REQUEST');
                            }
                        })
                        .then(data => {
                            enredados = data;
                        });
                } catch (error) {
                    console.log(error);
                }
                mostrarModal1(enredados);
            }
        })
    }
})


//CARGAR PELICULAS
const cargarPelisPop = data => {
    const listaCompleta = data.results;
    let listaTerror = [];
    let listaOsito = [];

    //LISTA TERROR
    listaCompleta.forEach(p => {
        if (p.genre_ids.includes(27)) {
            listaTerror.push(p);
        }
    });
    listaTerror.slice(0, 5).forEach(p => {
        if (p.poster_path) {
            contenedorTerror.innerHTML += `
                <div class="pelicula" id="${p.id}">
                    <img src="https://image.tmdb.org/t/p/w500${p.poster_path}" alt="${p.title}">
                    <h3 class="titulo-pelicula">${p.title}</h3>
                </div>
            `;
        } else {
            contenedorTerror.innerHTML += `
                <div class="pelicula" id="${p.id}">
                    <img src="/" alt="${p.title}">
                    <h3 class="titulo-pelicula">${p.title}</h3>
                </div>
            `;
        }
    })

    //LISTA OSITO
    listaCompleta.forEach(p => {
        if (p.genre_ids.includes(12) || p.genre_ids.includes(18)) {
            listaOsito.push(p);
        }
    });
    listaOsito.slice(0, 4).forEach(p => {
        if (p.poster_path) {
            contenedorOsito.innerHTML += `
            <div class="pelicula" id="${p.id}">
                <img src="https://image.tmdb.org/t/p/w500${p.poster_path}" alt="${p.title}">
                <h3 class="titulo-pelicula">${p.title}</h3>
            </div>
        `;
        } else {
            contenedorOsito.innerHTML += `
            <div class="pelicula" id="${p.id}">
                <img src="/" alt="${p.title}">
                <h3 class="titulo-pelicula">${p.title}</h3>
            </div>
        `;
        }
    })
}


//MOSTRAR PELICULAS
const cargarPelisTop = data => {
    data.results.slice(0, 5).forEach(peli => {
        if (peli.poster_path) {
            contenedorPeliculas.innerHTML += `
            <div class="pelicula" id="${peli.id}">
                <img src="https://image.tmdb.org/t/p/w500${peli.poster_path}" alt="${peli.title}">
                <h3 class="titulo-pelicula">${peli.title}</h3>
            </div>
        `;
        } else {
            contenedorPeliculas.innerHTML += `
            <div class="pelicula" id="${peli.id}">
                <img src="/" alt="${peli.title}">
                <h3 class="titulo-pelicula">${peli.title}</h3>
            </div>
        `;
        }
    });
}

//APARICIÓN INPUT BUSQUEDA
searchBar.style.visibility = 'hidden';

const inputBuscar = e => {
    e.preventDefault();
    if (searchBar.style.visibility == 'hidden') {
        searchBar.classList.remove('search-bar-fadeout');
        searchBar.classList.add('search-bar-fadein');
        searchBar.style.visibility = 'visible';
        searchBar.disabled = false;
        searchBar.focus();
    } else {
        searchBar.disabled = true;
        searchBar.classList.add('search-bar-fadeout');
        searchBar.classList.remove('search-bar-fadein');
        setTimeout(() => {
            searchBar.style.visibility = 'hidden';
        }, 350);
        searchBar.value = "";
    }
}

searchBtn.addEventListener('click', inputBuscar);

//BUSCAR
window.addEventListener('keydown', e => {
    let resultado = [];
    if (e.key == "Enter") {

        if (searchBar.value.length >= 1) {
            let search = searchBar.value.toLowerCase();

            listaPop.results.forEach(p => {
                if ((p.title).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(search)) {
                    resultado.push(p);
                }
            })

            listaTop.results.forEach(p => {
                if ((p.title).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").includes(search)) {
                    resultado.push(p);
                }
            })

            if (resultado.length == 1) {
                mostrarModal1(resultado[0]);
            } else if (resultado.length >= 1) {
                MostrarModalVarios(resultado);
            } else {
                alert('No se encontró la película');
            }
        }
    } else if (e.ctrlKey && e.key == "b") {
        inputBuscar(e);
    }
})

//MODALES

for (let i = 0; i < span.length; i++) {
    span[i].addEventListener('click', () => {
        modal1.style.display = "none";
        modalVarios.style.display = "none";
        modalSobreMi.style.display = "none";
    })
}

/* span.onclick = () => {
    modal1.style.display = "none";
}

spon.onclick = () => {
    modalVarios.style.display = "none";
} */

window.onclick = e => {
    if (e.target == modal1 || e.target == modalVarios || e.target == modalSobreMi) {
        modal1.style.display = "none";
        modalVarios.style.display = "none";
        modalSobreMi.style.display = "none";
    }
}

//MOSTRAR MODALES
const mostrarModal1 = peli => {
    modal1.style.display = "block";
    contenedorPeliculaSeleccionada.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${peli.poster_path}" alt="${peli.title}">
        <div class="info-pelicula-seleccionada">
                <h2 class="titulo-seleccionado" id="titulo-seleccionado">${peli.title}</h2>
                <p class="detalles">${peli.overview}</p>
            <p class="calificacion">Calificación promedio: ${peli.vote_average}</p>
        </div>
    `;
}

const MostrarModalVarios = pelis => {
    modalVarios.style.display = "block";
    pelis.forEach(peli => {
        contenedorVariasSeleccionadas.innerHTML += `
            <div class="pelicula" id="${peli.id}">
                <img src="https://image.tmdb.org/t/p/w500${peli.poster_path}" alt="${peli.title}">
                <h3 class="titulo-pelicula">${peli.title}</h3>
            </div>
        `;
    })

    const nuevasPeliculas = document.getElementsByClassName('pelicula');
    for (let i = 0; i < nuevasPeliculas.length; i++) {
        nuevasPeliculas[i].addEventListener("click", () => {
            listaPop.results.forEach(p => {
                if (p.id == nuevasPeliculas[i].id) {
                    modalVarios.style.display = "none";
                    mostrarModal1(p);
                }
            })

            listaTop.results.forEach(p => {
                if (p.id == nuevasPeliculas[i].id) {
                    modalVarios.style.display = "none";
                    mostrarModal1(p);
                }
            })
        })
    }
}

//SOBRE MI
sobreMiBtn.addEventListener('click', () => {
    modalSobreMi.style.display = "block";
})