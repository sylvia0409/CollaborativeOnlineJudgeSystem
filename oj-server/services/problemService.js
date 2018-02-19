var problems = [
    {
        id: 1,
        name: "two sum",
        desc: "101010",
        difficulty: "easy"
      },
      {
        id: 2,
        name: "two sum2",
        desc: "1010102",
        difficulty: "hard"
      },
      {
        id: 3,
        name: "happy",
        desc: "new year",
        difficulty: "medium"
      },
      {
        id: 4,
        name: "welcome",
        desc: "hahahaha",
        difficulty: "super"
      }
]
var getProblems = function(){
    return new Promise((resolve, reject) => {
        resolve(problems);
    })
}

var getProblem = function(id){
    return new Promise((resolve, reject) => {
        resolve(problems.find(problem => problem.id === id));
    })
}

module.exports = {
    getProblems
}