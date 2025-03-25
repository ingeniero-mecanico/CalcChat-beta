class KeyToken {     
    constructor(type = 'NUMBER', value = ''){
        this.type = type;    
        this.value = value;  
    }
    get tokenType() {
        return this.type;
    }
    set tokenType(type) {
        this.type = type;
    }
    get tokenValue(){
        return this.value;
    }
    set tokenValue(value) {
        this.value = value;
    }
    toString() {
        return this.value;
    }
}
class parameterFuctionNode {     
     
    constructor(name = '', father = null, parameters = false, parametersArray = null, parametersLeftArray = null ) {
        this.name = name;    
        this.father = father;    
        this.parameters = parameters;    
        this.parametersArray = parametersArray;  
        this.parametersLeftArray = parametersLeftArray;  
    }
   
}

export function initCalculatorUi () {
        display = document.getElementById('input-display');  
        resultDisplay = document.getElementById('result-display');   
        messageDisplay = document.getElementById('message-display');     
};

const numberRegex = /^[-+]?(\d+(\.\d*)?|\.\d+)([eE][-+]?\d+)?$/;  
const states = {     
    BEGINMAIN: 'BEGINMAIN',  
    ENDMAIN: 'ENDMAIN',
    CERO:'CERO',
    NUMBER: 'NUMBER',
    OPERATION: 'OPERATION',
    BEGINBLOCK: 'BEGINBLOCK',
    ENDBLOCK: 'ENDBLOCK',
    BEGINFUNCTION: 'BEGINFUNCTION',
    ENDFUNCTION: 'ENDFUNCTION',
    POINT: 'POINT',
    NEGATIVE:'NEGATIVE',
    EXPONENT10: 'EXPONENT10',
    EXPONENTIATION: 'EXPONENTIATION',
    NUMBERMODE: 'NUMBERMODE',
    COMMA: 'COMMA',
  };

   
  const transitions = {
    
    [states.BEGINMAIN]: [states.NUMBER, states.CERO, states.NEGATIVE, states.BEGINBLOCK, states.BEGINFUNCTION],
    
    
    [states.ENDMAIN]: [states.NUMBER, states.ENDBLOCK, states.ENDFUNCTION, states.NUMBERMODE],
     
    
    [states.NUMBER]: [states.NUMBER, states.POINT, states.CERO, states.EXPONENT10,states.OPERATION, states.EXPONENTIATION, states.ENDBLOCK,states.ENDFUNCTION, states.ENDMAIN, states.COMMA],
   
    
    [states.CERO]: [states.NUMBER, states.CERO, states.POINT, states.OPERATION, states.EXPONENTIATION, states.EXPONENT10, states.ENDBLOCK,states.ENDFUNCTION, states.ENDMAIN, states.COMMA],
   
    
    [states.OPERATION]: [states.NEGATIVE, states.NUMBER, states.CERO, states.BEGINBLOCK,states.BEGINFUNCTION],
    
    
    [states.BEGINBLOCK]: [states.NEGATIVE, states.NUMBER, states.CERO, states.BEGINBLOCK, states.BEGINFUNCTION],

    [states.COMMA]: [states.NEGATIVE, states.NUMBER, states.CERO, states.BEGINBLOCK, states.BEGINFUNCTION],
    
    
    [states.POINT]: [states.NUMBER, states.CERO],
    
    
    [states.NEGATIVE]: [states.NUMBER, states.CERO, states.BEGINBLOCK, states.BEGINFUNCTION],
    
    
    [states.EXPONENT10]: [states.NUMBER, states.NEGATIVE],
    
   
    [states.ENDBLOCK]: [states.ENDBLOCK, states.ENDFUNCTION, states.EXPONENTIATION, states.OPERATION, states.ENDMAIN, states.COMMA],
    
    
    [states.BEGINFUNCTION]: [states.NEGATIVE, states.NUMBER, states.CERO, states.BEGINBLOCK, states.BEGINFUNCTION],
    
    
    [states.ENDFUNCTION]: [states.ENDBLOCK, states.ENDFUNCTION, states.OPERATION, states.EXPONENTIATION, states.ENDMAIN, states.COMMA],

    [states.EXPONENTIATION]: [states.NUMBER, states.CERO, states.BEGINBLOCK],

    [states.NUMBERMODE]: [states.OPERATION, states.ENDBLOCK, states.ENDFUNCTION, states.ENDMAIN, states.EXPONENTIATION],
  };

 
const lastKeyToken = new KeyToken();     
 
 
let isPointMode = false,  
 
 
deleteFlag = false,  
 
 
isExponentMode = false,  
 
 
isNegativeMode = false,  
 
isNumberMode = false,  
 
parentCount = 0,     

 

 
redFlag = false,     
 
currentNumberString = '',    
 
 
stateStack = [],     
 
arrayTokens = [],    
 
arrayBlockType = [],     
 
parametersMap = new Map(),   
 
 
endFunctionMap = new Map(),  
 
 
currentFunction = null;  
 
parametersMap.set('Maximo2Numbers', ['First Number','Second Number']);  
parametersMap.set('Minimo2Numbers', ['First Number','Second Number']);
parametersMap.set('abs', null);   
parametersMap.set('sin', null);
parametersMap.set('cos', null);
 
 
let previousState = 'BEGINMAIN';     
 
stateStack.push(previousState);
 
var display  ,  
resultDisplay  ,   
messageDisplay  ;     

 
export function appendToDisplay(value , type ) {  
    if(redFlag) {    
        redFlag = false;
        messageDisplay.value = '';  
    }

    if(type === 'NUMBER' && transitions[previousState].includes(type)){  
        if(  currentNumberString === '0') {  
            redFlag = true;  
            messageDisplay.value = "there's a cero on the left";     
            return;  
        }
        
        isNumberMode = true;     
        if(lastKeyToken.tokenType === 'NEGATIVE' && isExponentMode === false) {  
            currentNumberString += lastKeyToken.tokenValue;  
            arrayTokens.pop();   
            stateStack.pop();    
            display.value = arrayTokens.join('');    
                    
        }
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        deleteFlag = false;  
         
       
        currentNumberString += value;    
        resultDisplay.value = currentNumberString;   

    }else if(type === 'CERO' && transitions[previousState].includes(type)){  
        if(  currentNumberString === '0') {  
            redFlag = true;  
            messageDisplay.value = "there's a cero on the left";  
            return;  
        } 
        
        isNumberMode = true;     
        if(lastKeyToken.tokenType === 'NEGATIVE' && isExponentMode === false) {  
            currentNumberString += lastKeyToken.tokenValue;  
            arrayTokens.pop();   
            stateStack.pop();    
            display.value = arrayTokens.join('');    
        }
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
       
        previousState = type;     
        deleteFlag = false;  
        currentNumberString += value;    
        resultDisplay.value = currentNumberString;  

    }else if(type === 'POINT' && transitions[previousState].includes(type) && !isPointMode ){    
         
        if(isExponentMode) {     
            redFlag = true;  
            messageDisplay.value = "it's not possible write down a decimal point after an exponent";     
            return;  
        }     
        isPointMode = true;  
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        deleteFlag = false;  
        currentNumberString += value;    
        resultDisplay.value = currentNumberString;   

    }else if(type === 'EXPONENT10' && transitions[previousState].includes(type) && !isExponentMode ){     
         
        if(lastKeyToken.tokenValue === '0'&& isPointMode){   
            redFlag = true;  
            messageDisplay.value = "Exponent only after a number different of cero in a float number";   
            return;  
        }
        if(  currentNumberString === '0') {    
            redFlag = true;  
            messageDisplay.value = "there's a cero on the left";      
            return;  
        }
        isExponentMode = true;  
        isNegativeMode = false;  
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        deleteFlag = false;  
        currentNumberString += value;    
        resultDisplay.value = currentNumberString;   

    }else if(type === 'NEGATIVE' && transitions[previousState].includes(type) && !isNegativeMode){    
         
        isNegativeMode = true;   
        if(isNumberMode) {   
            currentNumberString += value;    
            resultDisplay.value = currentNumberString;  
        } else {
            arrayTokens.push(new KeyToken('NEGATIVE',value));    
            stateStack.push(states.NEGATIVE);    
            display.value = arrayTokens.join('');    
        }
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;        
        previousState = type;    
        deleteFlag = false;  
        
    }else if(type === 'OPERATION' && transitions[previousState].includes(type)){     
        if(isNumberMode  ) {    
            if(numberRegex.test(currentNumberString)) {  
                arrayTokens.push(new KeyToken('NUMBER', currentNumberString))    
                stateStack.push(states.NUMBERMODE);  
                 
                resetNumberMode();
                resultDisplay.value = '';
            } else {     
                redFlag = true;  
                messageDisplay.value = "the number doesn't have the correct format";     
                return;  
            }
        }
        
        
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        arrayTokens.push(new KeyToken('OPERATION',value));   
        stateStack.push(states.OPERATION);   
        previousState = type;    
        deleteFlag = false;  
        display.value = arrayTokens.join('');    

    }else if(type === 'BEGINBLOCK' && transitions[previousState].includes(type)){    
        if(isExponentMode  ) {   
            redFlag = true;  
            messageDisplay.value ='Exponent of 10 must be a number';     
            return;  
        }
       
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        arrayTokens.push(new KeyToken('LEFTPARENT', value));     
        stateStack.push(states.BEGINBLOCK);  
        previousState = type;    
        deleteFlag = false;  
        isNegativeMode = false;  
        arrayBlockType.push(0);  
        parentCount++;   
        display.value = arrayTokens.join('');    

    }else if(type === 'ENDBLOCK' && transitions[previousState].includes(type)){  
         
        if(parentCount <= 0) {
            redFlag = true;  
            messageDisplay.value ='Error, it can close a block if it is not already open';   
            return;  
        }
        if(isNumberMode) {   
            if(numberRegex.test(currentNumberString)) {  
                arrayTokens.push(new KeyToken('NUMBER', currentNumberString));   
                stateStack.push(states.NUMBERMODE);  
                 
                resetNumberMode();
                resultDisplay.value = '';                
                messageDisplay.value = '';               
            } else {     
                redFlag = true;  
                messageDisplay.value = "the number doesn't have the correct format";    
                return;  
            }
        }
        if(arrayBlockType[arrayBlockType.length - 1] === 1){     
             
            if(currentFunction.parametersLeftArray > 1) {   
                redFlag = true;  
                messageDisplay.value = 'Error, there is a parameter missing';    
                return;  
            }else {
                 
                endFunctionMap.set(arrayTokens.length ,currentFunction.name);    
                
               
                currentFunction = currentFunction.father;    
            }
            messageDisplay.value = '';   
        }       
        
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;    
        arrayTokens.push(new KeyToken('RIGHTPARENT', value));    

        if(arrayBlockType.length === 0) {    
            redFlag = true;  
            messageDisplay.value = 'Error, check the code';    
            return;  
        }

        if(arrayBlockType.pop() === 1) {     
            stateStack.push(states.ENDFUNCTION);    
            previousState = states.ENDFUNCTION
        }else {  
            stateStack.push(states.ENDBLOCK);    
            previousState = states.ENDBLOCK
        }      
         
        deleteFlag = false;  
        parentCount--;   
        display.value = arrayTokens.join('');    

    }else if(type === 'BEGINFUNCTION' && transitions[previousState].includes(type)){     
        if(isExponentMode  ) {   
            redFlag = true;  
            messageDisplay.value = "Exponent of 10 must be a number";    
            return;  
        }        
             
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        arrayTokens.push(new KeyToken('FUNCTION', value));   
        arrayTokens.push(new KeyToken('LEFTPARENT', '('));   
        stateStack.push(states.BEGINFUNCTION);   
        display.value = arrayTokens.join('');    
        previousState = type;    
        deleteFlag = false;  
        arrayBlockType.push(1);  
        parentCount++;    
        const parametersFunction = parametersMap.get(value);     

        if(parametersFunction === null){     
            if(currentFunction === null) {   
                currentFunction = new parameterFuctionNode(value);   
            }else {  
                currentFunction = new parameterFuctionNode(value, currentFunction);  
            }
        }else if(parametersFunction === undefined) {  
                 
                redFlag = true;  
                messageDisplay.value = 'there is an error, this function is not register in virtual machine';   
        }else {  
            if(currentFunction === null) {   
                currentFunction = new parameterFuctionNode(value, null, true, parametersFunction, parametersFunction.slice());   
            }else {  
                currentFunction = new parameterFuctionNode(value, currentFunction, true, parametersFunction, parametersFunction.slice());  
            }
            messageDisplay.value = `ingrese el valor de ${currentFunction.parametersLeftArray[0]}`;  
        }
    }else if(type === 'EXPONENTIATION' && transitions[previousState].includes(type)) {    
         
        if(isNumberMode) {  
            
                if(numberRegex.test(currentNumberString)) {  
                    arrayTokens.push(new KeyToken('LEFTPARENT','('));    
                    arrayTokens.push(new KeyToken('NUMBER', currentNumberString));   
                    arrayTokens.push(new KeyToken('RIGHTPARENT', ')'));  
                    arrayTokens.push(new KeyToken('CARET', '^'));    
                    arrayTokens.push(new KeyToken('LEFTPARENT','('));    
                    stateStack.push(states.BEGINBLOCK);  
                    stateStack.push(states.NUMBERMODE);  
                    stateStack.push(states.ENDBLOCK);    
                    stateStack.push(states.EXPONENTIATION);  
                    stateStack.push(states.BEGINBLOCK);  
                    arrayBlockType.push(0);  
                    display.value = arrayTokens.join('');    
                    lastKeyToken.tokenType = 'BEGINBLOCK';   
                    lastKeyToken.tokenValue = '(';
                    previousState = states.BEGINBLOCK;   
                    deleteFlag = false;  
                     
                    resetNumberMode();
                    resultDisplay.value = '';
                    parentCount++;   
                } else {     
                    redFlag = true;  
                    messageDisplay.value = "the number doesn't have the correct format";     
                    return;  
                }
        }else if (stateStack[stateStack.length - 1] === states.NUMBERMODE) {     
             
                arrayTokens.push(new KeyToken('CARET', '^'));    
                arrayTokens.push(new KeyToken('LEFTPARENT','('));    
                stateStack.push(states.EXPONENTIATION);  
                stateStack.push(states.BEGINBLOCK);  
                display.value = arrayTokens.join('');    
                previousState = states.BEGINBLOCK;   
                deleteFlag = false;  
                arrayBlockType.push(0);  
                lastKeyToken.tokenType = 'BEGINBLOCK';   
                lastKeyToken.tokenValue = '(';                
                 
                
                resultDisplay.value = '';    
                parentCount++;   
        }else if (stateStack[stateStack.length - 1] === states.ENDFUNCTION || stateStack[stateStack.length - 1] === states.ENDBLOCK ){      
           
                arrayTokens.push(new KeyToken('CARET', '^'));    
                arrayTokens.push(new KeyToken('LEFTPARENT','('));    
                stateStack.push(states.EXPONENTIATION);   
                stateStack.push(states.BEGINBLOCK);  
                previousState = states.BEGINBLOCK;   
                deleteFlag = false;  
                arrayBlockType.push(0);  
                display.value = arrayTokens.join('');    
                lastKeyToken.tokenType = 'BEGINBLOCK';   
                lastKeyToken.tokenValue = '(';                
                parentCount++;   
        }else {  
                redFlag = true;  
                messageDisplay.value = 'there is an error in exponentiation';    
        }           
        
     
     
    }else if(type === 'COMMA' && transitions[previousState].includes(type) && (currentFunction && currentFunction.parametersLeftArray && currentFunction.parametersLeftArray.length > 1)) {
         
        if(isNumberMode  ) {    
            if(numberRegex.test(currentNumberString)) {  
                arrayTokens.push(new KeyToken('NUMBER', currentNumberString))    
                stateStack.push(states.NUMBERMODE);  
                 
                resetNumberMode();
                resultDisplay.value = '';
            } else {
                redFlag = true;  
                messageDisplay.value = "the number doesn't have the correct format";     
                return;  
            }
        }
        
         
        arrayTokens.push(new KeyToken('COMMA', ','));    
        stateStack.push(states.COMMA);   
        display.value = arrayTokens.join('');    
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        deleteFlag = false;  
         
        currentFunction.parametersLeftArray = currentFunction.parametersLeftArray.slice(1);  
         
        messageDisplay.value =  `ingrese el valor de ${currentFunction.parametersLeftArray[0]}`;     
    }else {  
        redFlag = true;  
        messageDisplay.value = "invalid input";   
        return;  
    }  
        
}

export function clearDisplay() {
    resetModule();   
    display.value = '';  
    resultDisplay.value = '';
    messageDisplay.value = '';   
    
}

function resetModule() {     
    resetNumberMode();   
    endFunctionMap.clear();  
    currentFunction = null; 
    deleteFlag = false;
    redFlag = false;
    parentCount = 0;
    stateStack.length = 0;   
    arrayBlockType.length = 0;   
    arrayTokens.length = 0;  
    lastKeyToken.tokenType = 'BEGINBLOCK';
    lastKeyToken.tokenValue = '(';
    previousState = states.BEGINMAIN; 
    stateStack.push(previousState);  

}

export function calculate() {   
    if(parentCount > 0) {    
        redFlag = true;  
        messageDisplay.value = "Error, there is an opened block";    
        return;  
    }
    if(transitions[previousState].includes(states.ENDMAIN)) {    
        if(isNumberMode) {   
            if(numberRegex.test(currentNumberString)) {
                arrayTokens.push(new KeyToken('NUMBER', currentNumberString));
                stateStack.push(states.NUMBERMODE);            
                resetNumberMode();   
                resultDisplay.value = '';    
                parentCount = 0;     
            } else {
                redFlag = true;  
                messageDisplay.value = "the number doesn't have the correct format";     
                return;  
            }
        }
        deleteFlag = false;  
        display.value = arrayTokens.join('');    
         
        arrayTokens.length = 0;
    }    
    
}

function resetNumberMode() {  
    isNumberMode = false;
    isExponentMode = false;
    isNegativeMode = false;
    isPointMode = false;
    currentNumberString = '';
} 

export function deleteLastEntry() {     
    if(arrayTokens.length >= 1 || isNumberMode) {    
        deleteFlag = true;   
    }else {  
        redFlag = true;  
        messageDisplay.value = 'there is no input to erase';     
        return;  
    }
    if(isNumberMode) {   
         
         
        resetNumberMode();
        resultDisplay.value = '';
        previousState = stateStack[stateStack.length - 1];   
        switch (previousState) {     

            case states.BEGINMAIN :  
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = '(';   
                break;           
            default:
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = arrayTokens[arrayTokens.length - 1].tokenValue;    
                break;
                
        }
        
    }else if(stateStack[stateStack.length - 1] === states.OPERATION) {   
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        display.value = arrayTokens.join('');    
        lastKeyToken.tokenType = previousState;  
        lastKeyToken.tokenValue = arrayTokens[arrayTokens.length - 1].tokenValue;    
    
    }else if(stateStack[stateStack.length - 1] === states.NUMBERMODE) {  
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];  
        display.value = arrayTokens.join('');    
         
        resetNumberMode();  
        resultDisplay.value = '';        
         
        switch (previousState) {     
            case states.BEGINMAIN :  
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = '(';   
                break;
            default:
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = arrayTokens[arrayTokens.length - 1].tokenValue;    
                break;            
        }        
    }else if(stateStack[stateStack.length - 1] === states.BEGINFUNCTION) {   
        stateStack.pop();    
        arrayTokens.pop();   
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        display.value = arrayTokens.join('');    
        arrayBlockType.pop();    
        parentCount--;   
        messageDisplay.value = '';   
        switch (previousState) {     
            case states.BEGINMAIN :   
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = '(';   
                break;
            default:
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = arrayTokens[arrayTokens.length - 1].tokenValue;    
                break;            
        }
    }else if(stateStack[stateStack.length - 1] === states.ENDFUNCTION) {     
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        display.value = arrayTokens.join('');    
        parentCount++;   
        arrayBlockType.push(1);  
        const functionName = endFunctionMap.get(arrayTokens.length);    
        const functionParametersFromMap = undefined;
        if (functionName) {
            functionParametersFromMap = parametersMap.get(functionName);   
            
        }else {  
            redFlag = true;  
            messageDisplay.value = 'there is no function in this place';     
            return;  
        }
         
         
        
        if(functionParametersFromMap === null){  
            if(currentFunction === null) {   
                currentFunction = new parameterFuctionNode(functionName);    
            }else {  
                currentFunction = new parameterFuctionNode(functionName, currentFunction);   
            }
        }else if(functionParametersFromMap === undefined) {  
                redFlag = true;  
                messageDisplay.value = 'there is an error';  
                return;  
        }else {  
            if(currentFunction === null) {   
                 
                currentFunction = new parameterFuctionNode(functionName, null, true, functionParametersFromMap, functionParametersFromMap.slice(-1));  
            }else {  
                 
                currentFunction = new parameterFuctionNode(functionName, currentFunction, true, functionParametersFromMap, functionParametersFromMap.slice(-1));
            }            
            messageDisplay.value =   `ingrese el valor de ${currentFunction.parametersLeftArray[0]}`;    
        }
        endFunctionMap.delete(arrayTokens.length);   

    }else if(stateStack[stateStack.length - 1] === states.ENDBLOCK) {    
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        display.value = arrayTokens.join('');    
        parentCount++;   
        arrayBlockType.push(0);  

    }else if(stateStack[stateStack.length - 1] === states.BEGINBLOCK) {  
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        arrayBlockType.pop();    
        parentCount--;   
        switch (previousState) {
            case states.BEGINMAIN :
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = '(';
                break;
            case states.EXPONENTIATION :
                stateStack.pop();    
                arrayTokens.pop();   
                previousState = stateStack[stateStack.length - 1];   
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = arrayTokens[arrayTokens.length - 1].tokenValue;    
                break;
            default:
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = arrayTokens[arrayTokens.length - 1].tokenValue;    
                break;            
        }
        display.value = arrayTokens.join('');    

    }else if(stateStack[stateStack.length - 1] === states.NEGATIVE) {    
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        display.value = arrayTokens.join('');    
        switch (previousState) {
            case states.BEGINMAIN : 
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = '(';
                break;
            default:
                lastKeyToken.tokenType = previousState;  
                lastKeyToken.tokenValue = arrayTokens[arrayTokens.length - 1].tokenValue;    
                break;          
        }
    }else if(stateStack[stateStack.length - 1] === states.COMMA) {   
        if(currentFunction === null ){   
            redFlag = true;
            messageDisplay.value = 'Theres is an error, we are not inside a fuction';    
            return;  
        }
         
        currentFunction.parametersLeftArray = currentFunction.parametersArray.slice(currentFunction.parametersArray.length - currentFunction.parametersLeftArray.length - 1);
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        display.value = arrayTokens.join('');    
        messageDisplay.value =   `ingrese el valor de ${currentFunction.parametersLeftArray[0]}`;    
        
    }else if(stateStack[stateStack.length - 1] === states.EXPONENTIATION) {  
         
        redFlag = true;  
        messageDisplay.value = 'we could not be here, Exponentiation';   
    }else {
        redFlag = true;  
        messageDisplay.value = 'we could not be here, what state we are';   
        deleteFlag = false;  
    }

    
     
}



 
 