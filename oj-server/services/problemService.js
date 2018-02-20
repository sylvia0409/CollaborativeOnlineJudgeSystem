var problemModel = require('../models/problemModel');

var getProblems = function(){
    return new Promise((resolve, reject) => {
        problemModel.find({}, function(err, res) {
            if(err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

var getProblem = function(idNumber){
    return new Promise((resolve, reject) => {
        problemModel.findOne({id: idNumber}, function(err, res){
            if(err) {
                reject(err);
            } else {
                resolve(res);
            }
        })
    })
}

var addProblem = function(newProblem){
    return new Promise((resolve,reject) => {       
        problemModel.findOne({name: newProblem.name}, function(err, data){
            if(data) {
                reject('problem exist');                
            } else {
                problemModel.count({}, function(err, count){
                    newProblem.id = count + 1;
                    var mongoProblem = new problemModel(newProblem);
                    mongoProblem.save();
                    resolve(mongoProblem);
                })
                
            }
        })
    })
}

module.exports = {
    getProblems,
    getProblem,
    addProblem
}