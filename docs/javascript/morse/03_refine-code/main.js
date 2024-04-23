const inputText = document.querySelector('#js_morse_input');
const outputText2Num = document.querySelector('#js_morse_output__num');
const outputText2Code = document.querySelector('#js_morse_output__code');
const btnSubmit = document.querySelector('#js_morse_submit');

const selWave = document.querySelector('#js_wave');
const inputDuration = document.querySelector('#js_duration');

btnSubmit.addEventListener('click', ()=> {
  const txt = inputText.value;
  outputText2Num.textContent = textToMorseNumText(txt);
  outputText2Code.textContent = textToMorseText(txt);
  generateMorseSound(txt, selWave.value, parseInt(inputDuration.value));
})
