const express = require('express');
const router = express.Router();
const queries = require('../repositories/ProfesorRepository');
const { isLoggedIn } = require('../lib/auth');

// Endpoint para mostrar todos los profesores
router.get('/', isLoggedIn, async (request, response) => {
    try {
        const profesores = await queries.obtenerTodosLosProfesores();
        response.render('profesores/listado', { profesores }); // Mostramos el listado de profesores
    } catch (error) {
        console.error('Error al obtener los profesores:', error);
        response.status(500).send('Error al obtener los profesores');
    }
});

// Endpoint que permite mostrar el formulario para agregar un nuevo profesor
router.get('/agregar', isLoggedIn, (request, response) => {
    response.render('profesores/agregar');
});

// Endpoint para agregar un profesor
router.post('/agregar', isLoggedIn, async (request, response) => {
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body;
    const nuevoProfesor = { nombre, apellido, fecha_nacimiento, profesion, genero, email };
    try {
        const resultado = await queries.insertarProfesor(nuevoProfesor);
        if (resultado) {
            request.flash('success', 'Registro insertado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al guardar el registro');
        }
    } catch (error) {
        console.error('Error al insertar el profesor:', error);
        request.flash('error', 'Ocurrió un problema al guardar el registro');
    }
    response.redirect('/profesores');
});

// Endpoint que permite mostrar el formulario para editar un profesor
router.get('/editar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    try {
        const profesor = await queries.obtenerProfesorPorId(idprofesor);
        response.render('profesores/editar', { profesor });
    } catch (error) {
        console.error('Error al obtener el profesor:', error);
        response.status(500).send('Error al obtener el profesor');
    }
});

// Endpoint para actualizar un profesor
router.post('/editar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    const { nombre, apellido, fecha_nacimiento, profesion, genero, email } = request.body;
    const profesorActualizado = { nombre, apellido, fecha_nacimiento, profesion, genero, email };
    try {
        const resultado = await queries.actualizarProfesor(idprofesor, profesorActualizado);
        if (resultado) {
            request.flash('success', 'Registro actualizado con éxito');
        } else {
            request.flash('error', 'Ocurrió un problema al actualizar el registro');
        }
        response.redirect('/profesores');
    } catch (error) {
        console.error('Error al actualizar el profesor:', error);
        request.flash('error', 'Ocurrió un problema al actualizar el registro');
        response.redirect('/profesores');
    }
});

// Endpoint para eliminar un profesor
router.get('/eliminar/:idprofesor', isLoggedIn, async (request, response) => {
    const { idprofesor } = request.params;
    try {
        const resultado = await queries.eliminarProfesor(idprofesor);
        if (resultado > 0) {
            request.flash('success', 'Eliminación correcta');
        } else {
            request.flash('error', 'Error al eliminar');
        }
        response.redirect('/profesores');
    } catch (error) {
        console.error('Error al eliminar el profesor:', error);
        request.flash('error', 'Ocurrió un problema al eliminar el profesor');
        response.redirect('/profesores');
    }
});

module.exports = router;
