// Esperar a que cargue todo el HTML
document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 🔹 1. FUNCIONALIDAD: UNIRSE A LA COMUNIDAD
    // ==========================================
    const formularioRegistro = document.getElementById('formularioComunidad');

    formularioRegistro.addEventListener('submit', function(e) {
        e.preventDefault(); // No recargar página

        // OBTENER DATOS DEL REGISTRO
        const nombre = document.getElementById('nombre').value.trim();
        const correo = document.getElementById('correo').value.trim();
        const contrasena = document.getElementById('contrasena').value;
        const banda = document.getElementById('banda').value;
        const comentario = document.getElementById('comentario').value.trim();

        // 🛑 VALIDACIONES
        if (!nombre || !correo || !contrasena || !banda || !comentario) {
            alert('❌ ¡Oye! Debes llenar TODOS los campos para unirte 🤘');
            return;
        }

        const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!expresionCorreo.test(correo)) {
            alert('⚠️ El correo electrónico no es válido. Ej: ejemplo@dominio.com');
            return;
        }

        if (contrasena.length < 6) {
            alert('🔒 La contraseña debe tener al menos 6 caracteres');
            return;
        }

        // ✅ GUARDAR USUARIO (¡AQUÍ ESTÁ LA CLAVE!)
        // Guardamos todo lo que escribió para que luego pueda iniciar sesión
        const datosUsuario = {
            nombre: nombre,
            correo: correo,
            contrasena: contrasena, // ⚠️ La guardamos SÓLO para comparar (es tarea)
            bandaFavorita: banda,
            comentario: comentario
        };

        // Guardamos con el correo como "clave única"
        localStorage.setItem('usuario_' + correo, JSON.stringify(datosUsuario));

        alert('✅ ¡Registro exitoso, ' + nombre + '! 🤘\nAhora ya puedes ir a INICIAR SESIÓN con tus datos.');

        // Limpiar formulario
        formularioRegistro.reset();
    });


    // ==========================================
    // 🔹 2. FUNCIONALIDAD: INICIAR SESIÓN
    // ==========================================
    const formularioLogin = document.getElementById('formularioLogin');
    const menuIniciar = document.getElementById('menuIniciarSesion');
    const menuCuenta = document.getElementById('menuCuenta');

    // Revisar si ya había sesión activa al cargar la página
    if (localStorage.getItem('sesionActiva') === 'true') {
        menuIniciar.style.display = 'none';
        menuCuenta.style.display = 'block';
    }

    formularioLogin.addEventListener('submit', function(e) {
        e.preventDefault();

        // DATOS QUE ESCRIBE PARA ENTRAR
        const nombreIngresado = document.getElementById('login_nombre').value.trim();
        const correoIngresado = document.getElementById('login_correo').value.trim();
        const contrasenaIngresada = document.getElementById('login_contrasena').value;

        // 🛑 VALIDACIÓN BÁSICA
        if (!nombreIngresado || !correoIngresado || !contrasenaIngresada) {
            alert('❌ Completa todos los campos para entrar');
            return;
        }

        // 🔎 BUSCAMOS SI EXISTE ESE USUARIO (el que se registró antes)
        const datosGuardados = localStorage.getItem('usuario_' + correoIngresado);

        if (!datosGuardados) {
            alert('❌ ¡Este correo no está registrado! Primero únete a la comunidad 🤘');
            return;
        }

        // 📥 Convertimos de texto a objeto para leerlo
        const usuario = JSON.parse(datosGuardados);

        // ⚖️ COMPARAMOS SI COINCIDEN LOS DATOS
        if (usuario.nombre === nombreIngresado && usuario.contrasena === contrasenaIngresada) {
            
            // ✅ TODO CORRECTO: ENTRAMOS
            alert('✅ ¡Bienvenido de nuevo, ' + usuario.nombre + '! 🤘\nYa estás dentro de Metalcore Nation.');

            // CAMBIAR MENÚ
            menuIniciar.style.display = 'none';
            menuCuenta.style.display = 'block';

            // GUARDAMOS SESIÓN ACTIVA
            localStorage.setItem('sesionActiva', 'true');
            localStorage.setItem('usuarioActual', usuario.nombre);

            // Limpiar formulario
            formularioLogin.reset();

        } else {
            // ❌ ALGO ESTÁ MAL
            alert('❌ ¡Datos incorrectos! Revisa tu Nombre o Contraseña e inténtalo de nuevo.');
        }
    });

    
});

// CÓDIGO PARA MI CUENTA
let misBandas = [];

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes("micuenta.html")) {

        if (localStorage.getItem('sesionActiva') !== 'true') {
            alert("⚠️ Debes iniciar sesión primero");
            window.location.href = "index.html";
            return;
        }

        const nombre = localStorage.getItem('usuarioActual');
        const elementoNombre = document.getElementById('nombreUsuario');
        if (elementoNombre) elementoNombre.textContent = nombre;

        misBandas = JSON.parse(localStorage.getItem('misBandas_' + nombre)) || [];
        mostrarBandasEnPantalla();

        const btnCerrar = document.getElementById('btnCerrar');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', function() {
                localStorage.removeItem('sesionActiva');
                localStorage.removeItem('usuarioActual');
                window.location.href = "index.html";
            });
        }
    }
});

function agregarBanda(nombreBanda) {
    const usuarioActual = localStorage.getItem('usuarioActual');
    if (!usuarioActual) return;

    if (!misBandas.includes(nombreBanda)) {
        misBandas.push(nombreBanda);
        localStorage.setItem('misBandas_' + usuarioActual, JSON.stringify(misBandas));
        mostrarBandasEnPantalla();
        alert("✅ Agregaste " + nombreBanda + " a tus favoritas 🤘");
    } else {
        alert("⚠️ Esa banda ya está en tu lista");
    }
}

function mostrarBandasEnPantalla() {
    const contenedor = document.getElementById('listaBandas');
    if (!contenedor) return;

    if (misBandas.length === 0) {
        contenedor.textContent = "Aún no has agregado ninguna banda.";
    } else {

        contenedor.innerHTML = misBandas.map(banda => "• " + banda + "<br>").join("");
    }
}

        // 🔒 CÓDIGO PARA VERIFICAR INICIO DE SESIÓN
        document.addEventListener('DOMContentLoaded', function() {
            // Revisamos si hay sesión activa
            const sesionActiva = localStorage.getItem('sesionActiva');
            
            if (sesionActiva === 'true') {
                // Si está logueado: mostramos la tienda
                document.getElementById('mensajeAcceso').style.display = 'none';
                document.getElementById('contenidoTienda').style.display = 'block';
            } else {
                // Si NO está logueado: mostramos el mensaje de acceso
                document.getElementById('mensajeAcceso').style.display = 'block';
                document.getElementById('contenidoTienda').style.display = 'none';
            }
        });

// Cerrar sesión correctamente
function cerrarSesion() {
    // Borra lo guardado para que cierre la sesión
    localStorage.removeItem('sesionActiva');
    localStorage.removeItem('usuarioActual');
    
    // Redirige al inicio. Como index.html está al mismo nivel
    window.location.href = "index.html";
}