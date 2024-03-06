enum RoundMethod {
    DontRound = 0,
    Tanh = 1,
    ZeroAndOne = 2
}
interface ICloneable{
    Clone(): ICloneable;
}
class Node_{
    public Value: number;
    public Rounded: boolean;
    constructor() {
        this.Value = 0;
        this.Rounded = false;
    }

    public SetValue(val:number){
        this.Value = val;
        this.Rounded = false;
    }
    public ChangeValue(val:number){
        this.Value += val;
        this.Rounded = false;
    }
    public Round(method: RoundMethod){
        if(this.Rounded) return;
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
    }
}
class LayerNN{
    public Size: number;
    public layer: Node_[];
    public nextLayer: LayerNN;
    public Sinnapses: number[][];
    constructor(size: number) {
        this.Size = size;
        this.layer = [];
        for (let i = 0; i < size; i++) {
            this.layer.push(new Node_());
        }
    }

    // This method uses after creation, in order to attach next layer to this layer
    public SetNextLayer(next_layer: LayerNN){
        this.nextLayer = next_layer;
        this.Sinnapses = [];
        for (let i = 0; i < this.Size; i++) {
            this.Sinnapses.push([]);
            for (let j = 0; j < this.nextLayer.Size; j++) {
                this.Sinnapses[i].push((Math.random() * 2) - 1);
            }
        }
    }

    public Round(method: RoundMethod){
        this.layer.forEach((node) => {node.Round(method);});
    }
    
    public Reset(){
        this.layer.forEach((node) => {node.SetValue(0);});
    }

    public CalcNextLayer(round_method: RoundMethod){
        if(!this.nextLayer) throw new Error("Next layer is not defined!");
        this.Round(round_method);
        this.nextLayer.Reset();
        for (let i = 0; i < this.Size; i++) {
            for (let j = 0; j < this.nextLayer.Size; j++) {
                this.nextLayer.layer[j].ChangeValue(this.layer[i].Value * this.Sinnapses[i][j]);
            }
        }
    }
    public CopySinnapses(sinnapses_ : number[][]){
        if(sinnapses_.length != this.Sinnapses.length) throw new Error("Size of matrixes are not equal");
        if(sinnapses_[0].length != this.Sinnapses[0].length) throw new Error("Size of matrixes are not equal");
        for (let i = 0; i < this.Size; i++) {
            for (let j = 0; j < this.nextLayer.Size; j++) {
                this.Sinnapses[i][j] = sinnapses_[i][j];
            }
        }
    }

    public OffsetSinnapses(offset:number){
        for (let i = 0; i < this.Size; i++) {
            for (let j = 0; j < this.nextLayer.Size; j++) {
                this.Sinnapses[i][j] = this.Sinnapses[i][j] + (((Math.random() * 2) - 1) * offset);
            }
        }
    }
}
class NeuralNet{
    public Inputs: LayerNN;
    public Hidden: LayerNN[];
    public Outputs: LayerNN;

    public InputsCount:number;
    public OutputsCount:number;
    public LayersCount:number;
    public NeuralsCount:number;

    public InputsRound: RoundMethod;
    public OutputsRound: RoundMethod;
    public NeuralsRound: RoundMethod;

    constructor(inputsCount: number, outputsCount: number, layersCount: number, neuralsCount: number,
        inputsRound: RoundMethod, outputsRound: RoundMethod, neuralsRound: RoundMethod) {
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
        for (let i = 0; i < layersCount; i++) {
            this.Hidden.push(new LayerNN(neuralsCount));
        }
        this.Outputs = new LayerNN(this.OutputsCount);

        // Attaching layers
        this.Inputs.SetNextLayer(this.Hidden[0]);
        for (let i = 0; i < layersCount; i++) {
            if(i == layersCount - 1) this.Hidden[i].SetNextLayer(this.Outputs);
            else this.Hidden[i].SetNextLayer(this.Hidden[i + 1]);
        }
    }

    public GetInputs(numbers: number[]): void{
        if(numbers.length != this.InputsCount) throw new Error("Numbers count is not equal to inputs count in this neural net!");
        for (let i = 0; i < this.Inputs.layer.length; i++) {
            this.Inputs.layer[i].SetValue(numbers[i]);
        }
        this.Inputs.Round(this.InputsRound);
    }

    protected Calc(){
        this.Inputs.CalcNextLayer(this.InputsRound);
        for (let i = 0; i < this.LayersCount; i++) {
            this.Hidden[i].CalcNextLayer(this.NeuralsRound);
        }
        this.Outputs.Round(this.OutputsRound);
    }

    public GetResult() : number[]{
        this.Calc();
        var result: number[] = [];
        for (let i = 0; i < this.Outputs.layer.length; i++) {
            result.push(this.Outputs.layer[i].Value);
        }
        return result;
    }

    public CopySinnapses(example:NeuralNet){
        if(example.InputsCount != this.InputsCount) throw new Error("Neural nets are not appropriate!");
        if(example.NeuralsCount != this.NeuralsCount) throw new Error("Neural nets are not appropriate!");
        if(example.LayersCount != this.LayersCount) throw new Error("Neural nets are not appropriate!");
        if(example.OutputsCount != this.OutputsCount) throw new Error("Neural nets are not appropriate!");

        this.Inputs.CopySinnapses(example.Inputs.Sinnapses);
        for (let i = 0; i < this.Hidden.length; i++) {
            this.Hidden[i].CopySinnapses(example.Hidden[i].Sinnapses);
        }
    }

    public OffsetSinnapses(offset:number){
        this.Inputs.OffsetSinnapses(offset);
        for (let i = 0; i < this.Hidden.length; i++) {
            this.Hidden[i].OffsetSinnapses(offset);
        }
    }
}
class Generation{

    // Neural nets parameters
    public InputsCount:number;
    public OutputsCount:number;
    public LayersCount:number;
    public NeuralsCount:number;

    public InputsRound: RoundMethod;
    public OutputsRound: RoundMethod;
    public NeuralsRound: RoundMethod;

    // Population parameters
    public Size:number;
    public LearningFactor:number;
    public DB:LearningDB;
    public CurrentError:number;
    public GenerationsPassed:number;

    public Generation_: NeuralNet[];

    constructor(inputsCount: number, outputsCount: number, layersCount: number, neuralsCount: number,
        inputsRound: RoundMethod, outputsRound: RoundMethod, neuralsRound: RoundMethod,
        size: number, learningFactor: number, db: LearningDB) {
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
        for (let i = 0; i < size; i++) {
            this.Generation_.push(new NeuralNet(this.InputsCount, this.OutputsCount, this.LayersCount, this.NeuralsCount, this.InputsRound, this.OutputsRound, this.NeuralsRound));
        }
    }

    // Index of best neural net
    public FindBest():number{
        if(this.DB.Size() == 0) throw new Error("Database is empty");
        var scores:number[] = [];
        for (let i = 0; i < this.Generation_.length; i++) {
            let error = 0;
            for (let j = 0; j < this.DB.Size(); j++) {
                this.Generation_[i].GetInputs(this.DB.LearnInputs[j]);
                var res = this.Generation_[i].GetResult();
                for (let k = 0; k < res.length; k++) {
                    error += Math.pow(res[k] - this.DB.LearnOutputs[j][k], 2);
                }
            }
            scores.push(error);
        }
        this.CurrentError = Math.min(...scores);
        return scores.indexOf(Math.min(...scores));
    }

    public PassOneGeneration(){
        if(this.DB.Size() == 0){
            alert("Learn DB is empty");
            return;
        }
        var best_index = this.FindBest();
        for (let i = 0; i < this.Generation_.length; i++) {
            if(best_index == i) continue;
            this.Generation_[i].CopySinnapses(this.Generation_[best_index]);
            this.Generation_[i].OffsetSinnapses(this.LearningFactor);
        }
        this.GenerationsPassed++;
        console.log("Generation passed! Current error of neural net: " + this.CurrentError);
    }
}
class LearningDB{
    // Learn data for neural net population
    public LearnInputs:number[][];
    public LearnOutputs:number[][];

    public InputsCount:number;
    public OutputsCount:number;

    constructor(inputsCount: number, outputsCount: number) {
        this.LearnInputs = [];
        this.LearnOutputs = [];

        this.InputsCount = inputsCount;
        this.OutputsCount = outputsCount;
    }

    public AddPair(inputs: number[], outputs: number[]){
        if(inputs.length != this.InputsCount || outputs.length != this.OutputsCount) throw new Error("Inputs or outputs are not appropriate for this DB!");
        this.LearnInputs.push(inputs);
        this.LearnOutputs.push(outputs);
    }

    public Size():number {
        return this.LearnInputs.length;
    }
}