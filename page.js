// UI
var BtnNewGeneration = document.getElementById("btn_new_generation");
var InputsCount = document.getElementById("inputs_count");
var NeuralsCount = document.getElementById("neurals_count");
var OutputsCount = document.getElementById("outputs_count");
var LayersCount = document.getElementById("layers_count");
var Size = document.getElementById("size_");
var generation;
var learning_db;
var GenerationCreated = false;
if (document.getElementById("LearnDBblock"))
    document.getElementById("LearnDBblock").style.display = "none";
if (BtnNewGeneration && InputsCount && NeuralsCount && OutputsCount && LayersCount && Size) {
    BtnNewGeneration.onclick = function () {
        learning_db = new LearningDB(parseInt(InputsCount.value, 10), parseInt(OutputsCount.value, 10));
        generation = new Generation(parseInt(InputsCount.value, 10), parseInt(OutputsCount.value, 10), parseInt(LayersCount.value, 10), parseInt(NeuralsCount.value, 10), RoundMethod.Tanh, RoundMethod.Tanh, RoundMethod.ZeroAndOne, parseInt(Size.value, 10), 0.01, learning_db);
        GenerationCreated = true;
        if (document.getElementById("new_generation"))
            document.getElementById("new_generation").style.display = "none";
        if (document.getElementById("LearnDBblock"))
            document.getElementById("LearnDBblock").style.display = "block";
    };
}
else
    throw new Error("Neccessary items on page were not found");
