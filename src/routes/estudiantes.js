const express = require('express');
const router = express.Router();
const queries = require('../repositories/EstudianteRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos los estudiantes
router.get('/', isLoggedIn, async (request, response) => {
    const estudiantes = await queries.obtenerTodosLosEstudiantes();
    response.render('estudiantes/listado', { estudiantes }); // Mostramos el listado de estudiantes
});

// Endpoint que permite mostrar el formulario para agregar un nuevo estudiante
router.get('/agregar', isLoggedIn, (request, response) => {
    response.render('estudiantes/agregar');
});

// Endpoint para agregar un estudiante
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { idestudiante, nombre, apellido, email, idcarrera, usuario } = request.body;
    const nuevoEstudiante = { idestudiante, nombre, apellido, email, idcarrera, usuario };
    try {
        const resultado = await queries.insertarEstudiante(nuevoEstudiante);
        if (resultado) {
            request.flash('success', 'Registro insertado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al guardar el registro');
        }
    } catch (error) {
        console.error('Error al insertar el estudiante:', error);
        request.flash('error', 'Ocurrió un problema al guardar el registro');
    }
    response.redirect('/estudiantes');
});

// Endpoint que permite mostrar el formulario para editar un estudiante
router.get('/editar/:idestudiante', isLoggedIn, async (request, response) => {
    const { idestudiante } = request.params;
    const estudiante = await queries.obtenerEstudiantePorId(idestudiante);
    response.render('estudiantes/editar', { estudiante });
});

// Endpoint para actualizar un estudiante
router.post('/editar/:idestudiante', isLoggedIn, async (request, response) => {
    const { idestudiante } = request.params;
    const { nombre, apellido, email, idcarrera, usuario } = request.body;
    const estudianteActualizado = { nombre, apellido, email, idcarrera, usuario };
    try {
        const resultado = await queries.actualizarEstudiante(idestudiante, estudianteActualizado);
        if (resultado) {
            request.flash('success', 'Registro actualizado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al actualizar el registro');
        }
        response.redirect('/estudiantes');
    } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        request.flash('error', 'Ocurrió un problema al actualizar el registro');
        response.redirect('/estudiantes');
    }
});

// Endpoint para eliminar un estudiante
router.get('/eliminar/:idestudiante', isLoggedIn, async (request, response) => {
    const { idestudiante } = request.params;
    const resultado = await queries.eliminarEstudiante(idestudiante);
    if (resultado > 0) {
        request.flash('success', 'Eliminación correcta');
    } else {
        request.flash('error', 'Error al eliminar');
    }
    response.redirect('/estudiantes');
});

module.exports = router;