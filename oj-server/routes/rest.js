var express = require('express');
var router = express.Router();
var problemService = require('../services/problemService');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var nodeRestClient = require('node-rest-client').Client;
var restClient = new nodeRestClient();

EXECUTOR_SERVER_URL = 'http://localhost:5000/build_and_run';

//register remote methods
restClient.registerMethod('build_and_run', EXECUTOR_SERVER_URL, 'POST');

router.get('/problems', function(req,res){
    problemService.getProblems()
    .then(problems => res.json(problems));
})

router.get('/problems/:id', function(req,res){
    var id = req.params.id;
    problemService.getProblem(+id)
    .then(problem => res.json(problem));
})

router.post('/problems', jsonParser, function(req,res){
    problemService.addProblem(req.body)
    .then(problem => res.json(problem),
          error => res.status(400).send(error));
})

router.post('/build_and_run', jsonParser, function(req,res){
    const code = req.body.userCode;
    const lang = req.body.lang;
    restClient.methods.build_and_run(
        {
            data: {
                code: code,
                lang: lang
            },
            headers: {
                'Content-type': 'application/json'
            }
        },
        (data, res) => {
            const text = `Build Output: ${data['build']}
            Execute Output: ${data['run']}`;
            data['text'] = text;
            res.json(data);
        }
    )
})


module.exports = router;