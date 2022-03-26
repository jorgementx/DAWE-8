var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Middleware para el parseo de req.body
app.use(bodyParser.urlencoded( {extended: false}));
app.use(bodyParser.json());

var multer  = require('multer');

var storage = multer.diskStorage({

    // definir restricciones para que los ficheros subidos se guarden en la carpeta public/imgs/
	// tamaño máximo de los ficheros: 2MB
	// sólo se admiten ficheros jpg o png
    // el nombre del fichero que se guarda debe coincidir con el que se envíab

    destination: function (req, file, cb) {
        cb(null, 'public/imgs/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({
    storage: storage,
    limits: {fileSize: 2097152},
    fileFilter: ( req, file, cb ) => {
        var filetypes = /jpeg|jpg|png/;
        var mimetype = filetypes.test(file.mimetype);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (!mimetype || !extname) {
            var error = new Error();
            error.code = "INVALID_FILE_FORMAT";
            return cb(error, false);
        }
        
        return cb(null, true);
    }
});

var pedido = upload.array('fileselect');

app.post('/pedido/add', (req, res) => {
    console.log("ENTRA EN POST");

    pedido(req, res, (err) => {

    // en caso de error, devolver un objeto JSON
    // { sucess:false, error: err  }  

        if (err) {
            if (err.code == 'LIMIT_FILE_SIZE') {
                console.log("HAS INTRODUCIDO UN FICHERO DE MÁS DE 2MB");
                err.message = 'HAS INTRODUCIDO UN FICHERO DE MÁS DE 2MB';
            } else if (err.code == 'INVALID_FILE_FORMAT') {
                console.log("HAS INTRODUCIDO UN FICHERO QUE NO ES .JPG O .PNG");
                err.message = 'HAS INTRODUCIDO UN FICHERO QUE NO ES .JPG O .PNG';
            }

            res.send({
                success: false,
                error: err
            });
        } else {

    // en caso de éxito, devolver un objeto JSON que contenga: success:true, la ruta a los ficheros
    // subidos y los valores recibidos en cada campo del formulario POST

            var helbideJson = helbideJsonSortu(req.files);

            res.send({
                success: true,
                files: helbideJson,
                nombre: req.body.nombre,
                telefono: req.body.telefono,
                email: req.body.email,
                libros: req.body.libros,
                cantidad: req.body.number
            });
        }
    })
});

function helbideJsonSortu(files) {
    var fitxZerr = new Array();

    for (var i = 0; i < files.length; i++) {
        fitxZerr.push(files[i].path);
    }

    return JSON.parse(JSON.stringify(fitxZerr));
}


app.listen(3001, function() {
    console.log("Servidor lanzado en el puerto 3001");
});
