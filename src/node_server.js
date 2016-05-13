// configures
var public_dir = process.argv[2] || 'public';
var main_port = 8080;

// imports
var express = require('express');
var db = require('node-mysql');


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


function api_router_f(conn, cb) {
    var router = express.Router();
    router.route('/todos')
        .post(function (req, res) {
            var text = req.body.text
            var completed = false
            res.json({ id: undefined, message: 'not implmented!' });
        })
        .get(function (req, res) {
            res.json([{ id: 0, text: 'conn', completed: false }, { id: 1, text: 'get', completed: false },])
        });
    router.route('/todos/:id')
        .get(function (req, res) {
            var todo_id = req.params.id
            res.json({ id: 0, text: 'not implmented', completed: false })
        })
        .put(function (req, res) {
            var todo_id = req.params.id
            var text = req.body.text
            var completed = req.body.completed
            res.json({ message: 'not implmented!' });
        })
        .delete(function (req, res) {
            var todo_id = req.params.id
            res.json({ message: 'not implmented!' });
        });
    cb(router);
}

function api_server_f(port) {
    var conn = new db.DB({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'node_test'
    });

    conn.connect(function (conn, cb_) {
        function cb(router) {
            var api_app = express();
            var cors = require('cors');
            api_app.use(cors());
            api_app.use('/', router);

            var server = api_app.listen(port, function () {
                var host = server.address().address;
                var port = server.address().port;

                console.log('Api listening at http://%s:%s', host, port);
            });
        }
        api_router_f(conn, cb);
    }, function () {
    });
}





(function () {
    app_server(public_dir, main_port);
    api_server_f(main_port + 1);
})()