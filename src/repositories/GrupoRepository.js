const pool = require('../config/databaseController');

module.exports = {
    obtenerTodosLosGrupos: async () => {
        try {
            const result = await pool.query('SELECT * FROM grupos');
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar la lista de grupos: ', error);
            throw error;
        }
    },

    obtenerGrupoPorId: async (idgrupo) => {
        try {
            const [result] = await pool.query('SELECT * FROM grupos WHERE idgrupo = ?', [idgrupo]);
            return result;
        } catch (error) {
            console.error('Ocurrió un problema al consultar el grupo: ', error);
            throw error;
        }
    },

    eliminarGrupo: async (idgrupo) => {
        try {
            const result = await pool.query('DELETE FROM grupos WHERE idgrupo = ?', [idgrupo]);
            return result.affectedRows > 0; // Devuelve true si se eliminó un registro
        } catch (error) {
            console.error('Error al eliminar el grupo', error);
            throw error;
        }
    },

    insertarGrupo: async (grupo) => {
        try {
            const result = await pool.query('INSERT INTO grupos SET ?', [grupo]);
            return result.affectedRows > 0; // Devuelve true si se insertó un registro
        } catch (error) {
            console.error('Error al insertar el grupo', error);
            throw error;
        }
    },

    actualizarGrupo: async (idgrupo, grupo) => {
        try {
            const result = await pool.query('UPDATE grupos SET ? WHERE idgrupo = ?', [grupo, idgrupo]);
            return result.affectedRows > 0; // Devuelve true si se actualizó un registro
        } catch (error) {
            console.error('Error al actualizar el grupo', error);
            throw error;
        }
    },

    // Asignar grupo

    asignarGrupo: async(asignacion) => {
        try {
            const result = await pool.query("INSERT INTO grupo_estudiantes SET ? ", asignacion);
            console.log('resultado: ', result)
            return result;
        } catch (error) {
            console.log('Ocurrio un problema al asignar el grupo', error);
        }
    }
};

