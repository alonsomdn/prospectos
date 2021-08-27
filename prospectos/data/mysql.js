exports.getConnection = function() {
    var mysql = require('mysql');
    var connection = mysql.createConnection({
        host : 'localhost',
        user : 'user_prospectos',
        password : '1234',
        database: 'prospectos'
    });
    
    connection.connect();
    return connection;
}