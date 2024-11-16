const express = require('express');
const router = express.Router();
const queries = require('../repositories/MateriaRepository');
const { isLoggedIn } = require('../lib/auth');
// Endpoint para mostrar todas las materias
router.get('/', isLoggedIn, async (request, response) => {
    try {
        const materias = await queries.obtenerTodasLasMaterias();
        response.render('materias/listado', { materias }); // Mostramos el listado de materias
    } catch (error) {
        console.error('Error al obtener las materias:', error);
        response.status(500).send('Error al obtener las materias');
    }
});

// Endpoint que permite mostrar el formulario para agregar una nueva materia
router.get('/agregar', isLoggedIn, (request, response) => {
    response.render('materias/agregar');
});

// Endpoint para agregar una materia
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { materia } = request.body;
    const nuevaMateria = { materia };
    try {
        const resultado = await queries.insertarMateria(nuevaMateria);
        if (resultado) {
            request.flash('success', 'Registro insertado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al guardar el registro');
        }
    } catch (error) {
        console.error('Error al insertar la materia:', error);
        request.flash('error', 'Ocurrió un problema al guardar el registro');
    }
    response.redirect('/materias');
});

// Endpoint que permite mostrar el formulario para editar una materia
router.get('/editar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    try {
        const materia = await queries.obtenerMateriaPorId(idmateria);
        response.render('materias/editar', { materia });
    } catch (error) {
        console.error('Error al obtener la materia:', error);
        response.status(500).send('Error al obtener la materia');
    }
});

// Endpoint para actualizar una materia
router.post('/editar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    const { materia } = request.body;
    const materiaActualizada = { materia };
    try {
        const resultado = await queries.actualizarMateria(idmateria, materiaActualizada);
        if (resultado) {
            request.flash('success', 'Registro actualizado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al actualizar el registro');
        }
        response.redirect('/materias');
    } catch (error) {
        console.error('Error al actualizar la materia:', error);
        request.flash('error', 'Ocurrió un problema al actualizar el registro');
        response.redirect('/materias');
    }
});

// Endpoint para eliminar una materia
router.get('/eliminar/:idmateria', isLoggedIn, async (request, response) => {
    const { idmateria } = request.params;
    try {
        const resultado = await queries.eliminarMateria(idmateria);
        if (resultado) {
            request.flash('success', 'Eliminación correcta');
        } else {
            request.flash('error', 'Error al eliminar');
        }
        response.redirect('/materias');
    } catch (error) {
        console.error('Error al eliminar la materia:', error);
        request.flash('error', 'Ocurrió un problema al eliminar la materia');
        response.redirect('/materias');
    }
});

module.exports = router;
