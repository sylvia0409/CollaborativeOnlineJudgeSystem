var express = require('express');
var router = express.Router();
var problemService = require('../services/problemService');

router.get('/problems', function(req,res){
    problemService.getProblems()
    .then(problems => res.json(problems));
})

router.get('problems/:id', function(req,res){
    var id = req.params.id;
    problemService.getProblem(id)
    .then(problem => res.json(problem));
})

module.exports = router;