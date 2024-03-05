// UI
const BtnNewGeneration: HTMLButtonElement | null = document.getElementById("btn_new_generation") as HTMLButtonElement | null;
const InputsCount: HTMLInputElement | null = document.getElementById("inputs_count") as HTMLInputElement | null;
const NeuralsCount: HTMLInputElement | null = document.getElementById("neurals_count") as HTMLInputElement | null;
const OutputsCount: HTMLInputElement | null = document.getElementById("outputs_count") as HTMLInputElement | null;
const LayersCount: HTMLInputElement | null = document.getElementById("layers_count") as HTMLInputElement | null;
const Size: HTMLInputElement | null = document.getElementById("size_") as HTMLInputElement | null;
let generation : Generation;
let learning_db : LearningDB;
if(BtnNewGeneration && InputsCount && NeuralsCount && OutputsCount && LayersCount && Size){
    BtnNewGeneration.onclick = function () {
        generation = new Generation(parseInt(InputsCount.value, 10), parseInt(NeuralsCount.value, 10), parseInt(OutputsCount.value, 10), parseInt(LayersCount.value, 10), parseInt(Size.value, 10), RoundMethod.Tanh, RoundMethod.ZeroAndOne, RoundMethod.Tanh);
        generation.PrintGenerationInfo();
        learning_db = new LearningDB(parseInt(InputsCount.value, 10), parseInt(OutputsCount.value, 10));
    }
}
else throw new Error("Neccessary items on page were not found");