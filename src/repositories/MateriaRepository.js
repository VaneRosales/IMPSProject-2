const pool = require('../config/databaseController');

module.exports = {
    obtenerTodasLasMaterias: async () => {
        try {
            const result = await pool.query('SELECT * FROM materias');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de materias: ', error);
            throw error;
        }
    },

    obtenerMateriaPorId: async (idmateria) => {
        try {
            const [result] = await pool.query('SELECT * FROM materias WHERE idmateria = ?', [idmateria]);
            return result[0]; // Asegúrate de devolver el primer elemento del array
        } catch (error) {
            console.error('Ocurrió un problema al consultar la materia: ', error);
            throw error;
        }
    },

    eliminarMateria: async (idmateria) => {
        try {
            const result = await pool.query('DELETE FROM materias WHERE idmateria = ?', [idmateria]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar la materia', error);
            throw error;
        }
    },

    insertarMateria: async (materia) => {
        try {
            const result = await pool.query('INSERT INTO materias SET ?', [materia]);
            return result.affectedRows > 0; // Asegúrate de devolver un valor booleano
        } catch (error) {
            console.error('Error al insertar la materia', error);
            throw error;
        }
    },

    actualizarMateria: async (idmateria, materia) => {
        try {
            const result = await pool.query('UPDATE materias SET ? WHERE idmateria = ?', [materia, idmateria]);
            return result.affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar la materia', error);
            throw error;
        }
    }
};
