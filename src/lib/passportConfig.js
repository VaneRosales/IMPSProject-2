/* Permite tener una configuracion de inicio de sesion lo mas profesional posible 
*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../config/databaseController');
const helpers = require('./helpers');
passport.use('local.signin', new LocalStrategy({ // Este es para el login
usernameField: 'user_name',
passwordField: 'user_password',
passReqToCallback: true
}, async(req, user_name, user_password, done) => {
const rows = await pool.query('SELECT * FROM user_login WHERE user_name = ?', 
[user_name]);
if (rows.length > 0){
const user = rows[0];
const validPassword = await helpers.matchPassword(user_password, user.user_password);
if(validPassword){
done(null, user, req.flash('success', 'Bienvenido' + 
user.user_name));
} else {
done(null, false, req.flash('error', 'Contraseña incorrecta'));
}
} else {
return done(null, false, req.flash('error', 'El nombre de usuario no existe'

));
}
}));
passport.use('local.signup', new LocalStrategy({ // Este es para el registro
usernameField: 'user_name',
passwordField: 'user_password',
passReqToCallback: true
}, async (req, user_name, user_password, done) => {
const { user_email } = req.body;
const newUser = {
user_name,
user_email,
user_password
};
newUser.user_password = await helpers.encryptPassword(user_password);
const result = await pool.query('INSERT INTO user_login SET ? ', [newUser]);
newUser.id = result.insertId;
return done(null, newUser); // Para que continue con el resto, se devuelve el nuevo usuario para que lo guarde en una sesion
}));
passport.serializeUser((user, done) => {
// Guardar usuario dentro de la sesión
done(null, user.id);
});
passport.deserializeUser( async(id,done) => {
const filas = await pool.query('SELECT * FROM user_login WHERE id = ?', [id]);
done(null, filas[0]);
});
