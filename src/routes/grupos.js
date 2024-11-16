const express = require('express');
const router = express.Router();
const queries = require('../repositories/GrupoRepository');
const { isLoggedIn } = require('../lib/auth');
// Endpoint para mostrar todos los grupos
router.get('/', isLoggedIn, async (request, response) => {
    try {
        const grupos = await queries.obtenerTodosLosGrupos();
        response.render('grupos/listado', { grupos }); // Mostramos el listado de grupos
    } catch (error) {
        console.error('Error al obtener los grupos:', error);
        request.flash('error', 'Error al obtener los grupos');
        response.redirect('/');
    }
});

// Endpoint que permite mostrar el formulario para agregar un nuevo grupo
router.get('/agregar', isLoggedIn, (request, response) => {
    response.render('grupos/agregar');
});

// Endpoint para agregar un grupo
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { num_grupo, anio, ciclo, idmateria, idprofesor } = request.body;
    const nuevoGrupo = { num_grupo, anio, ciclo, idmateria, idprofesor };
    try {
        const resultado = await queries.insertarGrupo(nuevoGrupo);
        if (resultado) {
            request.flash('success', 'Grupo insertado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al guardar el grupo');
        }
    } catch (error) {
        console.error('Error al insertar el grupo:', error);
        request.flash('error', 'Ocurrió un problema al guardar el grupo');
    }
    response.redirect('/grupos');
});

// Endpoint que permite mostrar el formulario para editar un grupo
router.get('/editar/:idgrupo', isLoggedIn, async (request, response) => {
    const { idgrupo } = request.params;
    try {
        const grupo = await queries.obtenerGrupoPorId(idgrupo);
        response.render('grupos/editar', { grupo });
    } catch (error) {
        console.error('Error al obtener el grupo:', error);
        request.flash('error', 'Error al obtener el grupo');
        response.redirect('/grupos');
    }
});

// Endpoint para actualizar un grupo
router.post('/editar/:idgrupo', isLoggedIn, async (request, response) => {
    const { idgrupo } = request.params;
    const { num_grupo, anio, ciclo, idmateria, idprofesor } = request.body;
    const grupoActualizado = { num_grupo, anio, ciclo, idmateria, idprofesor };
    try {
        const resultado = await queries.actualizarGrupo(idgrupo, grupoActualizado);
        if (resultado) {
            request.flash('success', 'Grupo actualizado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al actualizar el grupo');
        }
        response.redirect('/grupos');
    } catch (error) {
        console.error('Error al actualizar el grupo:', error);
        request.flash('error', 'Ocurrió un problema al actualizar el grupo');
        response.redirect('/grupos');
    }
});

// Endpoint para eliminar un grupo
router.get('/eliminar/:idgrupo', isLoggedIn, async (request, response) => {
    const { idgrupo } = request.params;
    try {
        const resultado = await queries.eliminarGrupo(idgrupo);
        if (resultado) {
            request.flash('success', 'Grupo eliminado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al eliminar el grupo');
        }
        response.redirect('/grupos');
    } catch (error) {
        console.error('Error al eliminar el grupo:', error);
        request.flash('error', 'Error al eliminar el grupo');
        response.redirect('/grupos');
    }
});


// Enpoint que permite navegar a la pantalla para asignar un grupo
router.get('/asignargrupo/:idgrupo', isLoggedIn, async (request, reponse) => {
    const { idgrupo } = request.params;
    // Consultamos el listado de estudiantes disponible
    const lstEstudiantes = await estudiantesQuery.obtenerTodosLosEstudiantes();
    reponse.render('grupos/asignargrupo', { lstEstudiantes, idgrupo });
});
// Endpoint que permite asignar un grupo
router.post('/asignargrupo', isLoggedIn, async (request, response) => {
    const data = request.body;
    let resultado = null;
    const result = processDataFromForm(data);
    for (const tmp of result.grupo_estudiantes) {
        //const asignacion = [tmp.idgrupo, tmp.idestudiante];
        //const { idgrupo, idestudiante } = tmp;
        //const asignacionObj = {idgrupo, idestudiante};
        resultado = await queries.asignarGrupo(tmp);
    }
    if (resultado) {
        request.flash('success', 'Asignacion de grupo realizada con exito');
    } else {
        request.flash('error', 'Ocurrio un problema al realizar asignacion');
    }
        response.redirect('/grupos');
});
// Función para procesar los datos del formulario
function processDataFromForm(data) {
    const result = {
        grupo_estudiantes: []
    };
    for (const key in data) {
        if (key.startsWith('grupo_estudiantes[')) {
            const match = key.match(/\[(\d+)\]\[(\w+)\]/);
            if (match) {
                const index = parseInt(match[1]);
                const property = match[2];
                if (!result.grupo_estudiantes[index]) {
                    result.grupo_estudiantes[index] = {};
                }
                result.grupo_estudiantes[index][property] = data[key];
            }
        }
        else{
            result[key] = data[key];
        }
    }
    return result;
} 

module.exports = router;