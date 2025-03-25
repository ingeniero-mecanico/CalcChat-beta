var display = null,
resultDisplay = null,
messageDisplay = null,
calculatorChatInput = null;

var displayString = '',
resultDisplayString = '',
messageDisplayString = '',
calculatorChatInputString = '';


export function initializeDisplay() {    
    display = document.getElementById('input-display');  
    resultDisplay = document.getElementById('result-display');   
    messageDisplay = document.getElementById('message-display');     
    calculatorChatInput = document.getElementById('calculatorchat-message-input');   
}

export function setDisplay(output1, output2, output3) {
    if(output1 !== undefined) {
        display.value = displayString = output1;
    }
    if(output2 !== undefined) {
        resultDisplay.value = resultDisplayString = output2;        
    }
    if(output3 !== undefined) {
        messageDisplay.value = messageDisplayString = output3;
    }
       
    
}

export function resetDisplay() {
    display.value = displayString;
    resultDisplay.value = resultDisplayString;
    messageDisplay.value = messageDisplayString;
}

export function getCalculatorChatInput() {
     
    calculatorChatInputString = calculatorChatInput.value;
    calculatorChatInput.value = '';
    return calculatorChatInputString.trim();
}

export function setCalculatorChatInput(textInput) {
    calculatorChatInput.value = calculatorChatInputString = textInput;
}
