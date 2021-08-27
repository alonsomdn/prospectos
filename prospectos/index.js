var express = require('express');
var cors = require('cors');

var prospectoService = require('./data/prospecto');

var app = express();
app.use(cors());
app.use(express.json());

app.get('/prospectos', (req, res) => {
    prospectoService.getProspectos().then(prospectos => {
        res.send(prospectos);
    }, err => {
        throw err;
    });
});

app.get('/prospectos/:idProspecto', (req, res) => {
    prospectoService.getProspecto(req.params.idProspecto).then(prospecto => {
        if(prospecto && prospecto.id > 0) {
            res.send(prospecto);
        } else {
            res.status(400).send({ error: true, mensaje: "Prospecto inexistente" });
        }
    }, err => {
        throw err;
    });
});

app.post('/prospectos', (req, res) => {
    var data = req.body;

    prospectoService.crearProspecto(data).then(nuevoProspecto => {
        if(nuevoProspecto.id < 0) {
            res.status(400).send({ error: true, mensaje: nuevoProspecto.mensaje})
        } else {
            res.send(nuevoProspecto);
        }
    }, err => {
        throw err;
    });
});

app.put('/prospectos/autorizar', (req, res) => {
    var data = req.body;
    prospectoService.autorizar(data).then(prospecto => {
        if(prospecto && prospecto.id > 0) {
            res.send(prospecto);
        } else {
            res.status(400).send({ error: true, mensaje: prospecto.mensaje });
        }
    }, err => {
        throw err;
    });
});

app.put('/prospectos/rechazar', (req, res) => {
    var data = req.body;
    prospectoService.rechazar(data).then(prospecto => {
        if(prospecto && prospecto.id > 0) {
            res.send(prospecto);
        } else {
            res.status(400).send({ error: true, mensaje: prospecto.mensaje });
        }
    }, err => {
        throw err;
    });
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    
    console.log("Example app listening at http://%s:%s", host, port)
 });
