const express = require('express');
const path = require('path');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const flash = require('connect-flash'); // Nos permite manejar mensajes en la sesion los cuales se guardan en memoria
// y se borran luego de ser mostrados
const session = require('express-session'); // Permite manejar sesiones, por ejemplo, para almacenar datos en la
// memoria del servidor, tambien se puede almacenar en la base de datos.
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport'); // necesario para autenticacion del usuari
const app = express();
require('dotenv').config()
const { database } = require('./config/keys');

require('./lib/passportConfig'); // permite que passport se entere de la autenticacion que estoy creando

// Configuraciones
app.set('port', process.env.PORT || 4500);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: process.env.SESSION_KEY, // Esta es la clave secreta de la sesion
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database) // Se indica donde se debe guardar la sesion
}));
app.use(flash());
app.use(morgan('dev')); // Configurando el middleware morgan para visualizar que está llegando al servidor
app.use(express.urlencoded({ extended: false })); // Sirve para poder aceptar datos desde formularios

app.use(passport.initialize()); // Para iniciar passport
app.use(passport.session()); // aca se le indica donde se deben guardar los dato

// ==== VARIABLES GLOBALES =====
app.use((request, response, next) => {
    // Haciendo global el uso de flash
    app.locals.success = request.flash('success');
    app.locals.error = request.flash('error');
    app.locals.user = request.user; // manejo global del usuari
    next(); // permite continuar con la ejecución del código
});

// Configuración de rutas
app.use(require('./routes')); // Node automáticamente busca el index.js del módulo
app.use(require('./routes/authentication'));
app.use('/estudiantes', require('./routes/estudiantes')); // Configuración de ruta para estudiantes
app.use('/carreras', require('./routes/carreras')); // Configuración de ruta para carreras
app.use('/materias', require('./routes/materias')); // Configuración de ruta para materias
app.use('/profesores', require('./routes/profesores')); // Configuración de ruta para profesores
app.use('/grupos', require('./routes/grupos')); // Configuración de ruta para grupos

// Archivos públicos (acá se coloca todo el código al cual el navegador puede acceder)
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log('Servidor iniciado en el puerto: ', app.get('port'));
});