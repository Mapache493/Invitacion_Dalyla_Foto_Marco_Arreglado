// ========================================
// CONFIGURACIÓN DE LA INVITACIÓN
// ========================================

// Fecha: 31 de octubre de 2026.
// Hora: 8:30 PM.
// Zona horaria de Quintana Roo.

const fechaFiesta = new Date(
    "2026-10-31T20:30:00-05:00"
);

// WhatsApp del organizador.

const numeroWhatsApp = "529841375523";


// ========================================
// CUENTA REGRESIVA
// ========================================

function actualizarCuentaRegresiva() {

    const ahora = new Date().getTime();

    const distancia = fechaFiesta.getTime() - ahora;

    const diasElemento = document.getElementById("dias");
    const horasElemento = document.getElementById("horas");
    const minutosElemento = document.getElementById("minutos");
    const segundosElemento = document.getElementById("segundos");

    if (distancia <= 0) {

        diasElemento.textContent = "00";
        horasElemento.textContent = "00";
        minutosElemento.textContent = "00";
        segundosElemento.textContent = "00";

        document.getElementById(
            "mensajeCuenta"
        ).textContent = "¡Llegó el gran día!";

        return;
    }

    const dias = Math.floor(
        distancia / (1000 * 60 * 60 * 24)
    );

    const horas = Math.floor(
        (distancia % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutos = Math.floor(
        (distancia % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const segundos = Math.floor(
        (distancia % (1000 * 60)) / 1000
    );

    diasElemento.textContent =
        String(dias).padStart(2, "0");

    horasElemento.textContent =
        String(horas).padStart(2, "0");

    minutosElemento.textContent =
        String(minutos).padStart(2, "0");

    segundosElemento.textContent =
        String(segundos).padStart(2, "0");

}

actualizarCuentaRegresiva();

setInterval(actualizarCuentaRegresiva, 1000);


// ========================================
// REPRODUCTOR DE MÚSICA COMPLETO
// ========================================

const musicaFondo = document.getElementById("musicaFondo");
const botonMusica = document.getElementById("botonMusica");
const iconoMusica = document.getElementById("iconoMusica");
const botonAnterior = document.getElementById("botonAnterior");
const botonSiguiente = document.getElementById("botonSiguiente");
const botonAleatorio = document.getElementById("botonAleatorio");
const botonRepetir = document.getElementById("botonRepetir");
const barraMusica = document.getElementById("barraMusica");
const progresoMusica = document.getElementById("progresoMusica");
const puntoMusica = document.getElementById("puntoMusica");
const tiempoActual = document.getElementById("tiempoActual");
const duracionMusica = document.getElementById("duracionMusica");
const nombreCancion = document.getElementById("nombreCancion");

// Puedes agregar más canciones a esta lista.
const canciones = [
    {
        titulo: "Canción de los XV",
        artista: "Artista 1",
        archivo: "musica/WhatsApp_Audio_convertido.mp3"
    },

    {
        titulo: "Canción 2",
        artista: "Artista 2",
        archivo: "musica/alacranes musical - yo no debi amarte.mp3"
    },
    {
        titulo: "Canción 3",
        artista: "Artista 3",
        archivo: "musica/ariana_grande_side_to_side_ft_nicki_minaj_(vmusice.net).mp3"
    },
    {
        titulo: "Canción 4",
        artista: "Artista 4",
        archivo: "musica/becky g - shower.mp3"
    },
    {
        titulo: "Canción 5",
        artista: "Artista 5",
        archivo: "musica/Bailando.mp3"
    }
];

let indiceCancion = 0;
let modoAleatorio = false;
let repetirCancion = false;
musicaFondo.volume = 0.5;

function formatoTiempo(segundos) {
    if (!Number.isFinite(segundos)) return "0:00";
    const minutos = Math.floor(segundos / 60);
    const seg = Math.floor(segundos % 60).toString().padStart(2, "0");
    return `${minutos}:${seg}`;
}

function cargarCancion(indice, reproducir = false) {
    indiceCancion = (indice + canciones.length) % canciones.length;
    musicaFondo.src = canciones[indiceCancion].archivo;
    nombreCancion.textContent = canciones[indiceCancion].titulo;
    musicaFondo.load();
    if (reproducir) musicaFondo.play().catch(() => {});
}

function actualizarBotonMusica() {
    const reproduciendo = !musicaFondo.paused;
    iconoMusica.className = reproduciendo ? "bi bi-pause-fill" : "bi bi-play-fill";
    botonMusica.classList.toggle("reproduciendo", reproduciendo);
    botonMusica.setAttribute("aria-label", reproduciendo ? "Pausar música" : "Reproducir música");
}

function cambiarCancion(direccion) {
    if (modoAleatorio && canciones.length > 1) {
        let nuevo;
        do { nuevo = Math.floor(Math.random() * canciones.length); } while (nuevo === indiceCancion);
        cargarCancion(nuevo, true);
    } else {
        cargarCancion(indiceCancion + direccion, true);
    }
}

botonMusica.addEventListener("click", async () => {
    if (musicaFondo.paused) {
        try { await musicaFondo.play(); } catch (error) { console.warn("No se pudo reproducir la música:", error); }
    } else {
        musicaFondo.pause();
    }
});

botonAnterior.addEventListener("click", () => cambiarCancion(-1));
botonSiguiente.addEventListener("click", () => cambiarCancion(1));

botonAleatorio.addEventListener("click", () => {
    modoAleatorio = !modoAleatorio;
    botonAleatorio.classList.toggle("activo", modoAleatorio);
});

botonRepetir.addEventListener("click", () => {
    repetirCancion = !repetirCancion;
    botonRepetir.classList.toggle("activo", repetirCancion);
});

musicaFondo.addEventListener("play", actualizarBotonMusica);
musicaFondo.addEventListener("pause", actualizarBotonMusica);
musicaFondo.addEventListener("loadedmetadata", () => duracionMusica.textContent = formatoTiempo(musicaFondo.duration));

musicaFondo.addEventListener("timeupdate", () => {
    const porcentaje = musicaFondo.duration ? (musicaFondo.currentTime / musicaFondo.duration) * 100 : 0;
    progresoMusica.style.width = `${porcentaje}%`;
    puntoMusica.style.left = `${porcentaje}%`;
    tiempoActual.textContent = formatoTiempo(musicaFondo.currentTime);
});

barraMusica.addEventListener("click", (evento) => {
    if (!musicaFondo.duration) return;
    const rect = barraMusica.getBoundingClientRect();
    const porcentaje = Math.min(1, Math.max(0, (evento.clientX - rect.left) / rect.width));
    musicaFondo.currentTime = porcentaje * musicaFondo.duration;
});

musicaFondo.addEventListener("ended", () => {
    if (repetirCancion) {
        musicaFondo.currentTime = 0;
        musicaFondo.play();
    } else {
        cambiarCancion(1);
    }
});

actualizarBotonMusica();

// ========================================
// APERTURA DEL SOBRE
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const pantallaSobre = document.getElementById(
            "pantallaSobre"
        );

        const botonSobre = document.getElementById(
            "abrirSobre"
        );

        let sobreAbierto = false;

        // Bloquear desplazamiento inicialmente.

        document.body.style.overflow = "hidden";

        // Abrir sobre.

        botonSobre.addEventListener(
            "click",
            function () {

                if (sobreAbierto) {
                    return;
                }

                sobreAbierto = true;

                botonSobre.classList.add("abierto");

                // Intentar iniciar música al abrir.

                musicaFondo.play().catch(function (error) {

                    console.info(
                        "La música requiere activación manual.",
                        error
                    );

                });

                // Ocultar pantalla después de la animación.

                setTimeout(function () {

                    pantallaSobre.classList.add(
                        "ocultar"
                    );

                    document.body.style.overflow = "";

                }, 2300);

                // Retirar pantalla de bienvenida.

                setTimeout(function () {

                    pantallaSobre.remove();

                }, 3400);

            }
        );

    }
);


// ========================================
// GALERÍA DE FOTOGRAFÍAS
// ========================================

const imagenesGaleria = [
    "./img/galeria1.jpeg",
    "./img/galeria2.jpeg",
    "./img/galeria3.jpeg",
    "./img/galeria4.jpeg",
    "./img/dalyla.jpeg"
];

let indiceImagen = 0;

const imagenModal = document.getElementById(
    "imagenModal"
);

const modalGaleria = document.getElementById(
    "modalGaleria"
);


// Abrir fotografía seleccionada.

modalGaleria.addEventListener(
    "show.bs.modal",
    function (evento) {

        const boton = evento.relatedTarget;

        if (boton && boton.dataset.imagen) {

            indiceImagen = imagenesGaleria.indexOf(
                boton.dataset.imagen
            );

            if (indiceImagen < 0) {
                indiceImagen = 0;
            }

        } else {

            indiceImagen = 0;

        }

        mostrarImagen();

    }
);


// Mostrar fotografía.

function mostrarImagen() {

    imagenModal.src = imagenesGaleria[indiceImagen];

    imagenModal.alt =
        "Fotografía " +
        (indiceImagen + 1) +
        " de Dalyla";

}


// Fotografía anterior.

document.getElementById(
    "anteriorImagen"
).addEventListener(
    "click",
    function () {

        indiceImagen--;

        if (indiceImagen < 0) {

            indiceImagen = imagenesGaleria.length - 1;

        }

        mostrarImagen();

    }
);


// Fotografía siguiente.

document.getElementById(
    "siguienteImagen"
).addEventListener(
    "click",
    function () {

        indiceImagen++;

        if (indiceImagen >= imagenesGaleria.length) {

            indiceImagen = 0;

        }

        mostrarImagen();

    }
);


// ========================================
// CONFIRMACIÓN POR WHATSAPP
// ========================================

// El formulario se gestiona en js/asistencia.js para evitar envíos duplicados.


// ========================================
// ========================================
// CERRAR MENÚ EN DISPOSITIVOS MÓVILES
// ========================================

const enlacesMenu = document.querySelectorAll(
    ".navbar-nav .nav-link"
);

enlacesMenu.forEach(function (enlace) {

    enlace.addEventListener(
        "click",
        function () {

            const menu = document.getElementById(
                "menuPrincipal"
            );

            const instancia =
                bootstrap.Collapse.getInstance(menu);

            if (instancia) {

                instancia.hide();

            }

        }
    );

});

// ========================================
// MARIPOSAS Y PAJARITOS EN MOVIMIENTO
// ========================================
(function iniciarAnimalesVoladores() {
    const contenedor = document.getElementById('animalesVoladores');
    if (!contenedor || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Puedes modificar la cantidad o los tipos de animales aquí.
    const animales = [
        { tipo: 'mariposa', altura: 14, duracion: 19, retraso: -2, escala: .85 },
        { tipo: 'mariposa', altura: 42, duracion: 24, retraso: -11, escala: 1.1 },
        { tipo: 'mariposa', altura: 72, duracion: 22, retraso: -7, escala: .75 },
        { tipo: 'pajarito', altura: 26, duracion: 27, retraso: -16, escala: 1 },
        { tipo: 'mariposa', altura: 58, duracion: 30, retraso: -20, escala: .9 },
        { tipo: 'pajarito', altura: 81, duracion: 32, retraso: -9, escala: .8 }
    ];

    animales.forEach(animal => {
        const elemento = document.createElement('span');
        elemento.className = `animal-volador ${animal.tipo}`;
        elemento.style.setProperty('--altura', `${animal.altura}%`);
        elemento.style.setProperty('--duracion', `${animal.duracion}s`);
        elemento.style.setProperty('--retraso', `${animal.retraso}s`);
        elemento.style.setProperty('--escala', animal.escala);
        const alas = document.createElement('span');
        alas.className = 'aleteo';
        if (animal.tipo === 'pajarito') alas.textContent = '🕊';
        elemento.appendChild(alas);
        contenedor.appendChild(elemento);
    });
})();


// ========================================
// ENLACE PARA COMPARTIR FOTOS
// ========================================
// Sustituye la cadena vacía por el enlace de tu formulario de subida
// (Google Forms con subida de archivos, Dropbox File Request, etc.).
// No basta con enlazar una carpeta de solo lectura.
const urlParaSubirFotos = "";
const enlaceSubirFotos = document.getElementById("enlaceSubirFotos");
const mensajeSubirFotos = document.getElementById("mensajeSubirFotos");
if (enlaceSubirFotos) {
    if (urlParaSubirFotos.trim()) {
        enlaceSubirFotos.href = urlParaSubirFotos;
        enlaceSubirFotos.target = "_blank";
        enlaceSubirFotos.rel = "noopener noreferrer";
        if (mensajeSubirFotos) mensajeSubirFotos.textContent = "¡Gracias por compartir tus recuerdos!";
    } else {
        enlaceSubirFotos.addEventListener("click", function (evento) {
            evento.preventDefault();
            if (mensajeSubirFotos) mensajeSubirFotos.textContent = "Próximamente podrás subir aquí tus fotografías.";
        });
    }
}


// ========================================
// TRANSICIONES Y EFECTOS DEL VIDEO
// ========================================
(function iniciarEfectosVideo(){
    const secciones = document.querySelectorAll('.efecto-revelar');
    const reduceMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMovimiento || !('IntersectionObserver' in window)) {
        secciones.forEach(el => el.classList.add('efecto-visible'));
    } else {
        const observador = new IntersectionObserver((entradas, obs) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add('efecto-visible');
                    obs.unobserve(entrada.target);
                }
            });
        }, {threshold:0.08,rootMargin:'0px 0px 35px 0px'});
        secciones.forEach(el => observador.observe(el));
    }
    const barra = document.getElementById('progresoInvitacion');
    const arriba = document.getElementById('volverArriba');
    let pendiente = false;
    function actualizarScroll(){
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (barra) barra.style.width = (max > 0 ? Math.min(100,Math.max(0,window.scrollY/max*100)) : 100) + '%';
        if (arriba) arriba.classList.toggle('visible',window.scrollY > 500);
        pendiente = false;
    }
    window.addEventListener('scroll',()=>{if(!pendiente){pendiente=true;requestAnimationFrame(actualizarScroll)}},{passive:true});
    window.addEventListener('resize',actualizarScroll);
    if (arriba) arriba.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduceMovimiento?'instant':'smooth'}));
    actualizarScroll();
})();


// Botón de regreso desde la despedida.
document.getElementById('despedidaVolver')?.addEventListener('click', (event) => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
});
