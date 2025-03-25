import { calculatorTokensArray as tokens } from "./memory.js";
var equationDisplay = null,
editFunctionDisplay = null,
nameFunctionDisplay = null,
editMessageDisplay = null;
var nameFunctionString = '';
const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
const reservedKeywords = new Set([
    "break", "case", "catch", "class", "const", "continue", "debugger", "default", "delete", "do", "else", "enum", "export", "extends",
    "false", "finally", "for", "function", "if", "import", "in", "instanceof", "new", "null", "return", "super", "switch", "this",
    "throw", "true", "try", "typeof", "var", "void", "while", "with", "yield", "let", "static", "implements", "package", "private",
    "protected", "public", "interface"
]);

function isValidVariableName(name) {    
    return variableNameRegex.test(name) && !reservedKeywords.has(name);
}

const makeFunctionEvent = new Event('makeFunction');  



export function initializeEditDisplay() {    
    nameFunctionDisplay = document.getElementById('equationInput');  
    equationDisplay = document.getElementById('editUserInput');   
    editFunctionDisplay = document.getElementById('editResultDisplay');  
    editMessageDisplay = document.getElementById('editMessageDisplay');     
     
    document.getElementById('applyChanges').addEventListener('click', trigerMakeFunction);
    nameFunctionDisplay.addEventListener("input", function () {        
        if (!variableNameRegex.test(nameFunctionDisplay.value)) {
            nameFunctionDisplay.value = nameFunctionString;  
        }
        else{
            nameFunctionString = nameFunctionDisplay.value;
        }
    });
}

export function setEditDisplay(output1, output2, output3, output4) {    
    nameFunctionDisplay.value = output1;
    equationDisplay.value = output2;    
    editFunctionDisplay.value = output3;
    editMessageDisplay.value = output4;
}

export function getFunctionName(){
    nameFunctionString = nameFunctionDisplay.value;
    return nameFunctionString;
}

export function InitEditTab() {
     
    const backUpTokens = JSON.parse(JSON.stringify(tokens));
     
    const tokensList = document.getElementById('tokensList');
    tokens.forEach((token, index) => {
        const tokenItem = document.createElement('div');
        tokenItem.className = 'token-item';

        const tokenValue = document.createElement('div');
        tokenValue.className = 'token-value';
        tokenValue.textContent = token.value;
        tokenValue.contentEditable =  token.type === 'NUMBER';
        tokenValue.addEventListener('input', function() {
            if (token.type === 'VARIABLE') {
                 
                token.value = tokenValue.textContent;                
            }else {
                tokenValue.textContent = backUpTokens[index].value;  
                token.value = backUpTokens[index].value;
            }
        });

        tokenItem.appendChild(tokenValue);

        if (token.type === 'NUMBER') {
            const tokenSelect = document.createElement('select');
            const optionNumber = document.createElement('option');
            optionNumber.value = 'NUMBER';
            optionNumber.textContent = 'TYPE_NUMBER';
            if (token.type === 'NUMBER') optionNumber.selected = true;

            const optionVariable = document.createElement('option');
            optionVariable.value = 'VARIABLE';
            optionVariable.textContent = 'TYPE_VARIABLE';

            tokenSelect.appendChild(optionNumber);
            tokenSelect.appendChild(optionVariable);

            tokenSelect.addEventListener('change', function() {
                token.type = tokenSelect.value;
                if (tokenSelect.value === 'VARIABLE') {
                    token.value = 'variable';
                    tokenValue.textContent = 'variable';
                    tokenValue.contentEditable = true;
                    tokenValue.focus();
                    selectText(tokenValue);
                } else {                    
                    tokenValue.textContent = backUpTokens[index].value;
                    tokenValue.contentEditable = false;
                    token.value = backUpTokens[index].value;
                                       
                }
            });

            tokenItem.appendChild(tokenSelect);
        }

        tokensList.appendChild(tokenItem);
    });    

    function selectText(element) {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
    
}

function trigerMakeFunction() {    
    document.dispatchEvent(makeFunctionEvent);
}

export function checkVariablesNames(){
    let error = false;
    if(getFunctionName() === ''){
        setEditDisplay('', '', '', 'you have to put a correct name for the function');
        error = false;
    }
    console.log('tokens: ', tokens)
    tokens.forEach((token, index) => {
        if(token.type === 'VARIABLE') {            
            if(token.value === '') {
                token.value = 'variable';
            }else {
                if(!isValidVariableName(token.value)){
                    setEditDisplay(getFunctionName(), '', '', 'incorrect format of variable name');
                    error = true;
                }                
            }
        }        
    });
    return !error;

}