const STATUS_ENVIADO = "enviado";
const STATUS_AUTORIZADO = "autorizado";
const STATUS_RECHAZADO = "rechazado";

function datosProspectoValidos(p) {
    if(!p.nombre || p.nombre.length == 0 
        || !p.apellidoPaterno || p.apellidoPaterno.length == 0 
        || !p.calle || p.calle.length == 0
        || !p.numero || p.numero.length == 0 
        || ! p.colonia || p.colonia.length == 0 
        || !p.codigoPostal || p.codigoPostal.length < 4
        || !p.telefono || p.telefono.length < 10 
        || !p.rfc || p.rfc.length < 12){
            return false;
        } else {
            return true;
        }
}

exports.crearProspecto = (prospecto) => {
    if(!datosProspectoValidos(prospecto)) {
        return new Promise((resolve, reject) => {
            resolve({id: -1, mensaje: "Datos de prospecto incompletos"});
        });
    }
    
    var mysqlHelp = require("./mysql");
    var connection = mysqlHelp.getConnection();
    
    let cmd = `insert into prospectos (
            nombre, 
            apellidoPaterno, 
            apellidoMaterno,
            calle,
            numero,
            colonia,
            codigoPostal,
            telefono,
            rfc,
            status)
        values (
            ?, 
            ?, 
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ? 
        )`;

    return new Promise((resolve, reject) => {
        connection.query(cmd, [
            prospecto.nombre, 
            prospecto.apellidoPaterno, 
            prospecto.apellidoMaterno,
            prospecto.calle,
            prospecto.numero,
            prospecto.colonia,
            prospecto.codigoPostal,
            prospecto.telefono,
            prospecto.rfc,
            STATUS_ENVIADO
        ], 
        (err, rows, fields) => {
            if (err) reject(err);
            
            prospecto.id = rows.insertId;
            prospecto.status = STATUS_ENVIADO;
            resolve(prospecto);
        });
    
        connection.end();
    })
}

function getProspecto(id) {
    var mysqlHelp = require("./mysql");
    var connection = mysqlHelp.getConnection();
    
    let cmd = `select * from prospectos
    where id = ?`;

    return new Promise((resolve, reject) => {
        connection.query(cmd, [ id ], 
        (err, rows, fields) => {
            if (err) reject(err);
            
            if(rows.length > 0) {
                let cmdArchivos = "select * from prospectosDocumentos where idProspecto = ?";
                connection.query(cmd, [id], 
                    (err, rowsDocumentos, fields) => {
                        var prospecto = {
                            id: rows[0].id,
                            nombre: rows[0].nombre,
                            apellidoPaterno: rows[0].apellidoPaterno,
                            apellidoMaterno: rows[0].apellidoMaterno,
                            calle: rows[0].calle,
                            numero: rows[0].numero,
                            colonia: rows[0].colonia,
                            codigoPostal: rows[0].codigoPostal,
                            telefono: rows[0].telefono,
                            rfc: rows[0].rfc, 
                            status: rows[0].status,
                        };

                        prospecto.documentos = [];
                        if(rowsDocumentos && rowsDocumentos.length > 0) {
                            prospecto.documentos=rowsDocumentos;
                        }

                        resolve(prospecto);
                    });
            } else {
                resolve({ error: true, mensaje: "Prospecto inexistente" });
            }
        });
    
        connection.end();
    })   
}

exports.getProspecto = getProspecto;

exports.getProspectos = () => {
    var mysqlHelp = require("./mysql");
    var connection = mysqlHelp.getConnection();
    
    let cmd = `select * from prospectos`;

    return new Promise((resolve, reject) => {
        connection.query(cmd, 
        (err, rows, fields) => {
            if (err) reject(err);
            
            if(rows) {
                var prospectos = rows.map(row => {
                    return {
                        id: row.id,
                        nombre: row.nombre,
                        apellidoPaterno: row.apellidoPaterno,
                        apellidoMaterno: row.apellidoMaterno,
                        calle: row.calle,
                        numero: row.numero,
                        colonia: row.colonia,
                        codigoPostal: row.codigoPostal,
                        telefono: row.telefono,
                        rfc: row.rfc, 
                        status: row.status,
                    };

                })
                resolve(rows);
            }
        });
    
        connection.end();
    })   
}

exports.autorizar = (datosProspecto) => {
    var mysqlHelp = require("./mysql");
    var connection = mysqlHelp.getConnection();
    
    // validar si existe:
    return getProspecto(datosProspecto.id).then(prospecto => {
        if(prospecto) {
            if(prospecto.status != STATUS_ENVIADO) {
                return new Promise((resolve, reject) => {
                    resolve({id: -1, mensaje: "Prospecto tiene status " + prospecto.status});
                });
            } else {
                return new Promise((resolve, reject) => {
                    let cmdUpdate = `update prospectos set 
                            status = ?
                        where id = ?`;
                    
                    connection.query(cmdUpdate, [ STATUS_AUTORIZADO, datosProspecto.id ], 
                    (err, rows, fields) => {
                        if (err) reject(err);
                        
                        prospecto.status = STATUS_AUTORIZADO;
                        resolve(prospecto);
                    });
                
                    connection.end();
                });
            }
        } else {
            return new Promise((resolve, reject) => {
                resolve({id: -1, mensaje: "Prospecto inexistente"});
            });
        }
    }, err => {
        throw err
    });
    
}

exports.rechazar = (datosProspecto) => {
    var mysqlHelp = require("./mysql");
    var connection = mysqlHelp.getConnection();
    
    return getProspecto(datosProspecto.id).then(prospecto => {
        if(prospecto) {
            if(prospecto.status != STATUS_ENVIADO) {
                return new Promise((resolve, reject) => {
                    resolve({id: -1, mensaje: "Prospecto tiene status " + prospecto.status});
                });
            } else {
                return new Promise((resolve, reject) => {
                    let cmdUpdate =  `update prospectos set 
                        status = ?,
                        observaciones = ?
                    where id = ?`;
                    
                    connection.query(cmdUpdate, [ 
                        STATUS_RECHAZADO, 
                        datosProspecto.observaciones,
                        datosProspecto.id, 
                    ], 
                    (err, rows, fields) => {
                        if (err) reject(err);
                        
                        prospecto.status = STATUS_RECHAZADO;
                        prospecto.observaciones = datosProspecto.observaciones;
                        resolve(prospecto);
                    });
                
                    connection.end();
                });
            }
        } else {
            return new Promise((resolve, reject) => {
                resolve({id: -1, mensaje: "Prospecto inexistente"});
            });
        }
    }, err => {
        throw err
    });
}