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

db1.AddPair([1,0,0,1,0,0,0,0,0], [0,0]); // 0 and 0 means that nor horizontal or vertical line was found
db1.AddPair([0,1,0,0,1,0,0,0,0], [0,0]); // 0 and 0 means that nor horizontal or vertical line was found
db1.AddPair([0,0,1,0,0,1,0,0,0], [0,0]); // 0 and 0 means that nor horizontal or vertical line was found
db1.AddPair([1,1,0,0,0,0,0,0,0], [0,0]); // 0 and 0 means that nor horizontal or vertical line was found
db1.AddPair([0,0,0,1,1,0,0,0,0], [0,0]); // 0 and 0 means that nor horizontal or vertical line was found
db1.AddPair([0,0,0,0,0,0,1,1,0], [0,0]); // 0 and 0 means that nor horizontal or vertical line was found
var gen1: Generation = new Generation(9, 2, 3, 10, RoundMethod.ZeroAndOne, RoundMethod.Tanh, RoundMethod.ZeroAndOne, 50, 0.001, db1);

// SQUARE OF A NUMBER
var db2: LearningDB = new LearningDB(2, 1);
let difference2 = 10;
for (let i = -difference2; i <= difference2; i++) {
    let num = i / difference2;
    db2.AddPair([num, num < 0 ? 1 : 0], [num * num]);
    // Input 1 - number, square we want to get
    // Input 2 - Is or not positive
}
var gen2: Generation = new Generation(2,1,5,20,RoundMethod.DontRound, RoundMethod.DontRound,RoundMethod.Tanh, 50, 0.001, db2);

// Returns SQRT(input) - 0.5
var db3: LearningDB = new LearningDB(1, 1);
let difference3 = 10;
for (let i = 0; i <= difference3; i++) {
    let num = i / difference3;
    db3.AddPair([num], [Math.sqrt(num) - 0.5]);
}
var gen3: Generation = new Generation(1,1,10,30,RoundMethod.DontRound, RoundMethod.Tanh,RoundMethod.ZeroAndOne, 50, 0.001, db3);