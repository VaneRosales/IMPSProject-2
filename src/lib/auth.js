module.exports = {
// Verifica si exite sesion
isLoggedIn(req, res, next) {
if(req.isAuthenticated()){ // Metodo de passport devuelve un boolean, el cual indica si existe usuario autenticado
return next();
} 
return res.redirect('/signin'); // Caso contrario redireccionar a la pantalla de logueo
},
// Verifica si no exite sesion
isNotLoggedIn(req, res, next){
if(!req.isAuthenticated()){ // Metodo de passport devuelve un boolean
return next();
} 
return res.redirect('/');
}
}
