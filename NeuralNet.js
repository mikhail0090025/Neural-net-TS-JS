var RoundMethod;
(function (RoundMethod) {
    RoundMethod[RoundMethod["DontRound"] = 0] = "DontRound";
    RoundMethod[RoundMethod["Tanh"] = 1] = "Tanh";
    RoundMethod[RoundMethod["ZeroAndOne"] = 2] = "ZeroAndOne";
})(RoundMethod || (RoundMethod = {}));
var Node_ = /** @class */ (function () {
    function Node_() {
        this.Value = 0;
        this.Rounded = false;
    }
    Node_.prototype.SetValue = function (val) {
        this.Value = val;
        this.Rounded = false;
    };
    Node_.prototype.ChangeValue = function (val) {
        this.Value += val;
        this.Rounded = false;
    };
    Node_.prototype.Round = function (method) {
        if (this.Rounded)
            return;
        switch (method) {
            case RoundMethod.DontRound:
                break;
            case RoundMethod.Tanh:
                this.Value = Math.tanh(this.Value);
                break;
            case RoundMethod.ZeroAndOne:
                this.Value = this.Value > 0 ? 1 : 0;
                break;
            default:
                throw new Error("Unknown round type");
        }
        this.Rounded = true;
    };
    return Node_;
}());
var LayerNN = /** @class */ (function () {
    function LayerNN(size) {
        this.Size = size;
        this.layer = [];
        for (var i = 0; i < size; i++) {
            this.layer.push(new Node_());
        }
    }
    // This method uses after creation, in order to attach next layer to this layer
    LayerNN.prototype.SetNextLayer = function (next_layer) {
        this.nextLayer = next_layer;
        this.Sinnapses = [];
        for (var i = 0; i < this.Size; i++) {
            this.Sinnapses.push([]);
            for (var j = 0; j < this.nextLayer.Size; j++) {
                this.Sinnapses[i].push((Math.random() * 2) - 1);
            }
        }
    };
    LayerNN.prototype.Round = function (method) {
        this.layer.forEach(function (node) { node.Round(method); });
    };
    LayerNN.prototype.Reset = function () {
        this.layer.forEach(function (node) { node.SetValue(0); });
    };
    LayerNN.prototype.CalcNextLayer = function (round_method) {
        if (!this.nextLayer)
            throw new Error("Next layer is not defined!");
        this.Round(round_method);
        this.nextLayer.Reset();
        for (var i = 0; i < this.Size; i++) {
            for (var j = 0; j < this.nextLayer.Size; j++) {
                this.nextLayer.layer[j].ChangeValue(this.layer[i].Value * this.Sinnapses[i][j]);
            }
        }
    };
    LayerNN.prototype.CopySinnapses = function (sinnapses_) {
        if (sinnapses_.length != this.Sinnapses.length)
            throw new Error("Size of matrixes are not equal");
        if (sinnapses_[0].length != this.Sinnapses[0].length)
            throw new Error("Size of matrixes are not equal");
        for (var i = 0; i < this.Size; i++) {
            for (var j = 0; j < this.nextLayer.Size; j++) {
                this.Sinnapses[i][j] = sinnapses_[i][j];
            }
        }
    };
    LayerNN.prototype.OffsetSinnapses = function (offset) {
        for (var i = 0; i < this.Size; i++) {
            for (var j = 0; j < this.nextLayer.Size; j++) {
                this.Sinnapses[i][j] = this.Sinnapses[i][j] + (((Math.random() * 2) - 1) * offset);
            }
        }
    };
    return LayerNN;
}());
var NeuralNet = /** @class */ (function () {
    function NeuralNet(inputsCount, outputsCount, layersCount, neuralsCount, inputsRound, outputsRound, neuralsRound) {
        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
        this.LayersCount = layersCount;
        this.NeuralsCount = neuralsCount;
        this.InputsRound = inputsRound;
        this.OutputsRound = outputsRound;
        this.NeuralsRound = neuralsRound;
        // Layers creation
        this.Inputs = new LayerNN(this.InputsCount);
        this.Hidden = [];
        for (var i = 0; i < layersCount; i++) {
            this.Hidden.push(new LayerNN(neuralsCount));
        }
        this.Outputs = new LayerNN(this.OutputsCount);
        // Attaching layers
        this.Inputs.SetNextLayer(this.Hidden[0]);
        for (var i = 0; i < layersCount; i++) {
            if (i == layersCount - 1)
                this.Hidden[i].SetNextLayer(this.Outputs);
            else
                this.Hidden[i].SetNextLayer(this.Hidden[i + 1]);
        }
    }
    NeuralNet.prototype.GetInputs = function (numbers) {
        if (numbers.length != this.InputsCount)
            throw new Error("Numbers count is not equal to inputs count in this neural net!");
        for (var i = 0; i < this.Inputs.layer.length; i++) {
            this.Inputs.layer[i].SetValue(numbers[i]);
        }
        this.Inputs.Round(this.InputsRound);
    };
    NeuralNet.prototype.Calc = function () {
        this.Inputs.CalcNextLayer(this.InputsRound);
        for (var i = 0; i < this.LayersCount; i++) {
            this.Hidden[i].CalcNextLayer(this.NeuralsRound);
        }
        this.Outputs.Round(this.OutputsRound);
    };
    NeuralNet.prototype.GetResult = function () {
        this.Calc();
        var result = [];
        for (var i = 0; i < this.Outputs.layer.length; i++) {
            result.push(this.Outputs.layer[i].Value);
        }
        return result;
    };
    NeuralNet.prototype.CopySinnapses = function (example) {
        if (example.InputsCount != this.InputsCount)
            throw new Error("Neural nets are not appropriate!");
        if (example.NeuralsCount != this.NeuralsCount)
            throw new Error("Neural nets are not appropriate!");
        if (example.LayersCount != this.LayersCount)
            throw new Error("Neural nets are not appropriate!");
        if (example.OutputsCount != this.OutputsCount)
            throw new Error("Neural nets are not appropriate!");
        this.Inputs.CopySinnapses(example.Inputs.Sinnapses);
        for (var i = 0; i < this.Hidden.length; i++) {
            this.Hidden[i].CopySinnapses(example.Hidden[i].Sinnapses);
        }
    };
    NeuralNet.prototype.OffsetSinnapses = function (offset) {
        this.Inputs.OffsetSinnapses(offset);
        for (var i = 0; i < this.Hidden.length; i++) {
            this.Hidden[i].OffsetSinnapses(offset);
        }
    };
    return NeuralNet;
}());
var Generation = /** @class */ (function () {
    function Generation(inputsCount, outputsCount, layersCount, neuralsCount, inputsRound, outputsRound, neuralsRound, size, learningFactor, db) {
        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
        this.LayersCount = layersCount;
        this.NeuralsCount = neuralsCount;
        this.InputsRound = inputsRound;
        this.OutputsRound = outputsRound;
        this.NeuralsRound = neuralsRound;
        this.Size = size;
        this.LearningFactor = learningFactor;
        this.DB = db;
        this.CurrentError = 0;
        this.GenerationsPassed = 0;
        this.Generation_ = [];
        for (var i = 0; i < size; i++) {
            this.Generation_.push(new NeuralNet(this.InputsCount, this.OutputsCount, this.LayersCount, this.NeuralsCount, this.InputsRound, this.OutputsRound, this.NeuralsRound));
        }
    }
    // Index of best neural net
    Generation.prototype.FindBest = function () {
        if (this.DB.Size() == 0)
            throw new Error("Database is empty");
        var scores = [];
        for (var i = 0; i < this.Generation_.length; i++) {
            var error = 0;
            for (var j = 0; j < this.DB.Size(); j++) {
                this.Generation_[i].GetInputs(this.DB.LearnInputs[j]);
                var res = this.Generation_[i].GetResult();
                for (var k = 0; k < res.length; k++) {
                    error += Math.pow(res[k] - this.DB.LearnOutputs[j][k], 2);
                }
            }
            scores.push(error);
        }
        this.CurrentError = Math.min.apply(Math, scores);
        return scores.indexOf(Math.min.apply(Math, scores));
    };
    Generation.prototype.PassOneGeneration = function () {
        if (this.DB.Size() == 0) {
            alert("Learn DB is empty");
            return;
        }
        var best_index = this.FindBest();
        for (var i = 0; i < this.Generation_.length; i++) {
            if (best_index == i)
                continue;
            this.Generation_[i].CopySinnapses(this.Generation_[best_index]);
            this.Generation_[i].OffsetSinnapses(this.LearningFactor);
        }
        this.GenerationsPassed++;
        console.log("Generation passed! Current error of neural net: " + this.CurrentError);
    };
    return Generation;
}());
var LearningDB = /** @class */ (function () {
    function LearningDB(inputsCount, outputsCount) {
        this.LearnInputs = [];
        this.LearnOutputs = [];
        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
    }
    LearningDB.prototype.AddPair = function (inputs, outputs) {
        if (inputs.length != this.InputsCount || outputs.length != this.OutputsCount)
            throw new Error("Inputs or outputs are not appropriate for this DB!");
        this.LearnInputs.push(inputs);
        this.LearnOutputs.push(outputs);
    };
    LearningDB.prototype.Size = function () {
        return this.LearnInputs.length;
    };
    return LearningDB;
}());
