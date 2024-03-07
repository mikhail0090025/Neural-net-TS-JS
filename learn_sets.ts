// IN THIS FILE ARE GENERATIONS AND DATABASES FOR TESTING

// FIND HORIZONTAL AND VERTICAL LINES ON 3x3 POLE
var db1: LearningDB = new LearningDB(9, 2);
db1.AddPair([1,1,1,0,0,0,0,0,0], [1,0]); // 1 and 0 means that horizontal line was found
db1.AddPair([0,0,0,1,1,1,0,0,0], [1,0]); // 1 and 0 means that horizontal line was found
db1.AddPair([0,0,0,0,0,0,1,1,1], [1,0]); // 1 and 0 means that horizontal line was found
db1.AddPair([1,0,0,1,0,0,1,0,0], [0,1]); // 0 and 1 means that vertical line was found
db1.AddPair([0,1,0,0,1,0,0,1,0], [0,1]); // 0 and 1 means that vertical line was found
db1.AddPair([0,0,1,0,0,1,0,0,1], [0,1]); // 0 and 1 means that vertical line was found
db1.AddPair([1,1,1,0,0,1,0,0,1], [1,1]); // 1 and 1 means that both horizontal and vertical line was found
db1.AddPair([1,1,1,0,1,0,0,1,0], [1,1]); // 1 and 1 means that both horizontal and vertical line was found
db1.AddPair([0,1,0,1,1,1,0,1,0], [1,1]); // 1 and 1 means that both horizontal and vertical line was found
var gen1: Generation = new Generation(9, 2, 3, 10, RoundMethod.ZeroAndOne, RoundMethod.Tanh, RoundMethod.ZeroAndOne, 50, 0.001, db1);

// SQUARE OF A NUMBER
var db2: LearningDB = new LearningDB(2, 1);
let difference = 1000;
for (let i = -difference; i <= difference; i++) {
    let num = i / difference;
    db2.AddPair([num, num < 0 ? 1 : 0], [num * num]);
    // Input 1 - number, square we want to get
    // Input 2 - Is or not positive
}
var gen2: Generation = new Generation(2,1,5,20,RoundMethod.DontRound, RoundMethod.DontRound,RoundMethod.Tanh, 50, 0.001, db2);