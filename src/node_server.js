// configures
var public_dir = process.argv[2] || 'public';
var api_only = process.argv[3] == 'api-only';
var main_port = 8080;

// imports
var express = require('express');
var mysql = require('mysql');


function app_server(public_dir, port) {
    var app = express();
    app.use('/', express.static(public_dir));
    console.log(public_dir);

    var server = app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    });
}



function check_mysql(conn) {
    conn.query('CREATE TABLE IF NOT EXISTS todos (id INT PRIMARY KEY AUTO_INCREMENT, text TEXT, completed BOOL)',
        function (err) {
            if (err) { throw err; }
        }
    )
}

function api_router(conn) {
    check_mysql(conn);
    var router = express.Router();
    router.route('/todos')
        .post(function (req, res) {
            var todoj = ''
            req.on('data', function (data) {
                todoj += data
            })
            req.on('end', function () {
                var todo = JSON.parse(todoj)
                var todo_text = todo.text

                conn.query(
                    'INSERT INTO todos (text, completed) VALUES (?, ?)', [todo_text, false],
                    function (err, result) {
                        if (err) { throw err; }
                        var inserted_id = result.insertId
                        res.json(inserted_id);
                    })
            })
        })
        .get(function (req, res) {
            conn.query('SELECT id, text, completed FROM todos', function (err, results, fields) {
                if (err) { throw err; }
                res.json(results)
            })
        });
    router.route('/todos/:id')
        .get(function (req, res) {
            var todo_id = req.params.id

            conn.query('SELECT id, text, completed FROM todos WHERE id=?', [todo_id],
                function (err, result) {
                    if (err) { throw err; }
                    res.json(result[0] || null)
                })
        })
        .put(function (req, res) {
            var todo_id = req.params.id
            var todoj = ''
            req.on('data', function (data) {
                todoj += data
            })
            req.on('end', function () {
                var todo = JSON.parse(todoj)
                todo.id = todo_id

                conn.query('SELECT id, text, completed FROM todos WHERE id=?', [todo_id],
                    function (err, result) {
                        if (err) { throw err; }
                        var todo_o = result[0] || null
                        conn.query('UPDATE todos SET text=?, completed=? WHERE id=?', [todo.text, todo.completed, todo_id],
                            function (err, result) {
                                if (err) { throw err; }
                                res.json(todo_o);
                            })
                    })
            })
        })
        .delete(function (req, res) {
            var todo_id = req.params.id

            conn.query('SELECT id, text, completed FROM todos WHERE id=?', [todo_id],
                function (err, result) {
                    if (err) { throw err; }
                    var todo_o = result[0] || null
                    conn.query('DELETE FROM todos WHERE id=?', [todo_id],
                        function (err, result) {
                            if (err) { throw err; }
                            res.json(todo_o);
                        })
                })
        });
    return router;
}

function api_server_f(port) {
    var conn = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'node_test'
    });

    conn.connect();

    var api_app = express();
    var cors = require('cors');
    api_app.use(cors());
    var router = api_router(conn);
    api_app.use('/', router);

    var server = api_app.listen(port, function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('Api listening at http://%s:%s', host, port);
    });
}





(function () {
    if (!api_only) { app_server(public_dir, main_port); }
    api_server_f(main_port + 1);
})()