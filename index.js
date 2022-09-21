const express = require('express');
const hbs = require('hbs');
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

app.get('/', (req, res) => {
    res.render('index', {
        titulo: 'Bienvenido a la app'
    })
});

// let sql = 'SELECT * FROM ipf6voifd90b45u3.foro'  // CONEXION A HEROKU !!!
let sql = 'SELECT * FROM foro'    // CONEXION LOCAL !!!
app.get('/formulario', (req, res) => {

    //const sql2 = `DELETE FROM foro WHERE id='` + req.params.id + `'`
    conexion.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.render('formulario', {
            titulo: 'Bienvenido al Foro',
            results: result,
        });
    });
});


app.get('/formulario/:idForo', (req, res) => {
    const sql = `DELETE FROM ipf6voifd90b45u3.foro WHERE id=' `+ req.params.idForo +`'`  //CONEXION A HEROKU

    //const sql = `DELETE FROM grupo.foro WHERE id=' `+ req.params.idForo +`'`    //CONEXION LOCAL
    conexion.query(sql, (err, result, fields) => {
        if (err) throw err;
    });
    res.redirect('/formulario');
});







app.get('/programa', (req, res) => {
    res.render('programa', {
        titulo: 'Bienvenido al Programa de la UTN'
    })
});



app.post('/formulario', (req, res) => {

    const { nombre, email, mensaje } = req.body;

    if (nombre == "" || email == "" || mensaje == "") {
        let validacion = 'Rellene los campos correctamente';
        res.render('formulario', {
            titulo: 'Bienvenido al Foro',
            validacion
        });
    } else {
        let datos = {
            nombre: nombre,
            email: email,
            mensaje: mensaje
        };

        //let sql = 'INSERT INTO ipf6voifd90b45u3.foro SET ?';   //CONEXION A HEROKU !!! 
        let sql = 'INSERT INTO foro SET ?';  // CONEXION LOCAL !!!

        conexion.query(sql, datos, (err, results) => {
            let envioDatos = 'Datos Enviados Con Éxito'
            if (err) throw err;
            res.render('formulario', {
                titulo: 'Bienvenido al Foro',
                envioDatos
            });
        });
    };
});








app.listen(PORT, () => {
    console.log('conectado');
});


