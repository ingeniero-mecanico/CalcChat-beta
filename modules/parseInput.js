import { KeyToken } from "./commonConstant.js";

class parameterFuctionNode {     
     
    constructor(name = '', father = null, parameters = false, parametersArray = null, parametersLeftArray = null ) {
        this.name = name;    
        this.father = father;    
        this.parameters = parameters;    
        this.parametersArray = parametersArray;  
        this.parametersLeftArray = parametersLeftArray;  
    }
    
}



const outputDisplay = {
    display: '',     
    resultDisplay: '',   
    messageDisplay: '',   
     
};

const variablesAvailable = ['𝑿'];
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
    VARIABLE: 'VARIABLE'
  };

   
  const transitions = {
    
    [states.BEGINMAIN]: [states.NUMBER, states.CERO, states.NEGATIVE, states.BEGINBLOCK, states.BEGINFUNCTION, states.NUMBERMODE, states.VARIABLE],
    
    
    [states.ENDMAIN]: [states.NUMBER, states.ENDBLOCK, states.ENDFUNCTION, states.NUMBERMODE, states.VARIABLE],
     
    
    [states.NUMBER]: [states.NUMBER, states.POINT, states.CERO, states.EXPONENT10,states.OPERATION, states.EXPONENTIATION, states.ENDBLOCK,states.ENDFUNCTION, states.ENDMAIN, states.COMMA],
   
    
    [states.CERO]: [states.NUMBER, states.CERO, states.POINT, states.OPERATION, states.EXPONENTIATION, states.EXPONENT10, states.ENDBLOCK,states.ENDFUNCTION, states.ENDMAIN, states.COMMA],
   
    
    [states.OPERATION]: [states.NEGATIVE, states.NUMBER, states.CERO, states.BEGINBLOCK,states.BEGINFUNCTION, states.NUMBERMODE, states.VARIABLE],
    
    
    [states.BEGINBLOCK]: [states.NEGATIVE, states.NUMBER, states.CERO, states.BEGINBLOCK, states.BEGINFUNCTION, states.NUMBERMODE, states.VARIABLE],

    [states.COMMA]: [states.NEGATIVE, states.NUMBER, states.CERO, states.BEGINBLOCK, states.BEGINFUNCTION, states.NUMBERMODE, states.VARIABLE],
    
    
    [states.POINT]: [states.NUMBER, states.CERO],
    
    
    [states.NEGATIVE]: [states.NUMBER, states.CERO, states.BEGINBLOCK, states.BEGINFUNCTION, states.NUMBERMODE, states.VARIABLE],
    
    
    [states.EXPONENT10]: [states.NUMBER, states.NEGATIVE],
    
   
    [states.ENDBLOCK]: [states.ENDBLOCK, states.ENDFUNCTION, states.EXPONENTIATION, states.OPERATION, states.ENDMAIN, states.COMMA],
    
    
    [states.BEGINFUNCTION]: [states.NEGATIVE, states.NUMBER, states.CERO, states.BEGINBLOCK, states.BEGINFUNCTION, states.NUMBERMODE, states.VARIABLE],
    
    
    [states.ENDFUNCTION]: [states.ENDBLOCK, states.ENDFUNCTION, states.OPERATION, states.EXPONENTIATION, states.ENDMAIN, states.COMMA],

    [states.EXPONENTIATION]: [states.NUMBER, states.CERO, states.BEGINBLOCK, states.NUMBERMODE, states.VARIABLE],

    [states.NUMBERMODE]: [states.OPERATION, states.ENDBLOCK, states.ENDFUNCTION, states.ENDMAIN, states.EXPONENTIATION, states.COMMA],
    [states.VARIABLE]: [states.OPERATION, states.ENDBLOCK, states.ENDFUNCTION, states.ENDMAIN, states.EXPONENTIATION, states.COMMA]
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
 



 
 
let previousState = 'BEGINMAIN';     
 
stateStack.push(previousState);

 
export function initParseModule(tokens, mapOfNativeFunctions){   
    arrayTokens = tokens;
    parametersMap = mapOfNativeFunctions;
}

 
export function appendToDisplay(value , type ) {  
    if(redFlag) {    
        redFlag = false;
        outputDisplay.messageDisplay = '';  
    }

    if(type === 'NUMBER' && transitions[previousState].includes(type)){  
        if(  currentNumberString === '0') {  
            redFlag = true;  
            outputDisplay.messageDisplay = "there's a cero on the left";     
            return outputDisplay;  
        }
        
        isNumberMode = true;     
        if(lastKeyToken.tokenType === 'NEGATIVE' && isExponentMode === false) {  
            currentNumberString += lastKeyToken.tokenValue;  
            arrayTokens.pop();   
            stateStack.pop();    
            outputDisplay.display = arrayTokens.join('');    
                    
        }
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        deleteFlag = false;  
         
       
        currentNumberString += value;    
        outputDisplay.resultDisplay = currentNumberString;   

    }else if(type === 'CERO' && transitions[previousState].includes(type)){  
        if(  currentNumberString === '0') {  
            redFlag = true;  
            outputDisplay.messageDisplay = "there's a cero on the left";  
            return outputDisplay;  
        } 
        
        isNumberMode = true;     
        if(lastKeyToken.tokenType === 'NEGATIVE' && isExponentMode === false) {  
            currentNumberString += lastKeyToken.tokenValue;  
            arrayTokens.pop();   
            stateStack.pop();    
            outputDisplay.display = arrayTokens.join('');    
        }
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        
        previousState = type;     
        deleteFlag = false;  
        currentNumberString += value;    
        outputDisplay.resultDisplay = currentNumberString;  

    }else if(type === 'NUMBERMODE' && transitions[previousState].includes(type)) {
        if(numberRegex.test(value)) {  
            arrayTokens.push(new KeyToken('NUMBER', value))    
            stateStack.push(states.NUMBERMODE);  
            outputDisplay.resultDisplay = '';
        } else {     
            redFlag = true;  
            outputDisplay.messageDisplay = "the number doesn't have the correct format";     
            return outputDisplay;  
        }
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        isNegativeMode = false;  
        deleteFlag = false;  
        outputDisplay.display = arrayTokens.join('');   
    }else if(type === 'VARIABLE' && transitions[previousState].includes(type)) {
        if(variablesAvailable.includes(value)) {  
            arrayTokens.push(new KeyToken('IDENTIFIER', value))    
            stateStack.push(states.NUMBERMODE);  
            outputDisplay.resultDisplay = '';
        } else {     
            redFlag = true;  
            outputDisplay.messageDisplay = "the variable did not included as valid in parser";     
            return outputDisplay;  
        }
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        isNegativeMode = false;  
        deleteFlag = false;  
        outputDisplay.display = arrayTokens.join('');   
    }else if(type === 'POINT' && transitions[previousState].includes(type) && !isPointMode ){    
         
        if(isExponentMode) {     
            redFlag = true;  
            outputDisplay.messageDisplay = "it's not possible write down a decimal point after an exponent";     
            return outputDisplay;  
        }     
        isPointMode = true;  
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        deleteFlag = false;  
        currentNumberString += value;    
        outputDisplay.resultDisplay = currentNumberString;   

    }else if(type === 'EXPONENT10' && transitions[previousState].includes(type) && !isExponentMode ){     
         
        if(lastKeyToken.tokenValue === '0'&& isPointMode){   
            redFlag = true;  
            outputDisplay.messageDisplay = "Exponent only after a number different of cero in a float number";   
            return outputDisplay;  
        }
        if(  currentNumberString === '0') {    
            redFlag = true;  
            outputDisplay.messageDisplay = "there's a cero on the left";      
            return outputDisplay;  
        }
        isExponentMode = true;  
        isNegativeMode = false;  
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        deleteFlag = false;  
        currentNumberString += value;    
        outputDisplay.resultDisplay = currentNumberString;   

    }else if(type === 'NEGATIVE' && transitions[previousState].includes(type) && !isNegativeMode){    
         
        isNegativeMode = true;   
        if(isNumberMode) {   
            currentNumberString += value;    
            outputDisplay.resultDisplay = currentNumberString;  
        } else {
            arrayTokens.push(new KeyToken(value,value));    
            stateStack.push(states.NEGATIVE);    
            outputDisplay.display = arrayTokens.join('');    
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
                outputDisplay.resultDisplay = '';
            } else {     
                redFlag = true;  
                outputDisplay.messageDisplay = "the number doesn't have the correct format";     
                return outputDisplay;  
            }
        }
        
        
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        arrayTokens.push(new KeyToken(value,value));   
        stateStack.push(states.OPERATION);   
        previousState = type;    
        deleteFlag = false;  
        outputDisplay.display = arrayTokens.join('');    

    }else if(type === 'BEGINBLOCK' && transitions[previousState].includes(type)){    
        if(isExponentMode  ) {   
            redFlag = true;  
            outputDisplay.messageDisplay ='Exponent of 10 must be a number';     
            return outputDisplay;  
        }
       
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        arrayTokens.push(new KeyToken(value, value));     
        stateStack.push(states.BEGINBLOCK);  
        previousState = type;    
        deleteFlag = false;  
        isNegativeMode = false;  
        arrayBlockType.push(0);  
        parentCount++;   
        outputDisplay.display = arrayTokens.join('');    

    }else if(type === 'ENDBLOCK' && transitions[previousState].includes(type) && (!currentFunction || ( currentFunction && !currentFunction.parametersLeftArray) || ( currentFunction && currentFunction.parametersLeftArray && currentFunction.parametersLeftArray.length === 1))){  
         
        if(parentCount <= 0) {
             
            redFlag = true;  
            outputDisplay.messageDisplay ='Error, it can close a block if it is not already open';   
            return outputDisplay;  
        }
        if(isNumberMode) {   
            if(numberRegex.test(currentNumberString)) {  
                arrayTokens.push(new KeyToken('NUMBER', currentNumberString));   
                stateStack.push(states.NUMBERMODE);  
                 
                resetNumberMode();
                outputDisplay.resultDisplay = '';                
                outputDisplay.messageDisplay = '';               
            } else {     
                redFlag = true;  
                outputDisplay.messageDisplay = "the number doesn't have the correct format";    
                return outputDisplay;  
            }
        }
        if(arrayBlockType[arrayBlockType.length - 1] === 1){     
             
            if(currentFunction.parametersLeftArray > 1) {   
                redFlag = true;  
                outputDisplay.messageDisplay = 'Error, there is a parameter missing';    
                return outputDisplay;  
            }else {
                 
                endFunctionMap.set(arrayTokens.length ,currentFunction.name);    
                
               
                currentFunction = currentFunction.father;    
            }
            outputDisplay.messageDisplay = '';   
        }       
        
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;    
        arrayTokens.push(new KeyToken(value, value));    

        if(arrayBlockType.length === 0) {    
            redFlag = true;  
            outputDisplay.messageDisplay = 'Error, check the code';    
            return outputDisplay;  
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
        outputDisplay.display = arrayTokens.join('');    

    }else if(type === 'BEGINFUNCTION' && transitions[previousState].includes(type)){     
        if(isExponentMode  ) {   
            redFlag = true;  
            outputDisplay.messageDisplay = "Exponent of 10 must be a number";    
            return outputDisplay;  
        }
        
             
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        arrayTokens.push(new KeyToken('IDENTIFIER', value));   
        arrayTokens.push(new KeyToken('(', '('));  
        stateStack.push(states.BEGINFUNCTION);   
        outputDisplay.display = arrayTokens.join('');    
        previousState = type;    
        deleteFlag = false;  
        arrayBlockType.push(1);  
        parentCount++;    
         
        const parametersFunction = parametersMap.get(value);     

        if(parametersFunction === ''){     
            if(currentFunction === null) {   
                currentFunction = new parameterFuctionNode(value);   
            }else {  
                currentFunction = new parameterFuctionNode(value, currentFunction);  
            }
        }else if(parametersFunction === undefined) {  
                 
                redFlag = true;  
                outputDisplay.messageDisplay = 'there is an error, this function is not register in virtual machine';   
                 
        }else {  
            if(currentFunction === null) {   
                currentFunction = new parameterFuctionNode(value, null, true, parametersFunction, parametersFunction.slice());   
            }else {  
                currentFunction = new parameterFuctionNode(value, currentFunction, true, parametersFunction, parametersFunction.slice());  
            }
            outputDisplay.messageDisplay = `ingrese el valor de ${currentFunction.parametersLeftArray[0]}`;  
        }
    }else if(type === 'EXPONENTIATION' && transitions[previousState].includes(type)) {    
         
        if(isNumberMode) {  
            
                if(numberRegex.test(currentNumberString)) {  
                    arrayTokens.push(new KeyToken('(','('));    
                    arrayTokens.push(new KeyToken('NUMBER', currentNumberString));   
                    arrayTokens.push(new KeyToken(')', ')'));  
                    arrayTokens.push(new KeyToken('^', '^'));    
                    arrayTokens.push(new KeyToken('(','('));    
                    stateStack.push(states.BEGINBLOCK);  
                    stateStack.push(states.NUMBERMODE);  
                    stateStack.push(states.ENDBLOCK);    
                    stateStack.push(states.EXPONENTIATION);  
                    stateStack.push(states.BEGINBLOCK);  
                    arrayBlockType.push(0);  
                    outputDisplay.display = arrayTokens.join('');    
                    lastKeyToken.tokenType = 'BEGINBLOCK';   
                    lastKeyToken.tokenValue = '(';
                    previousState = states.BEGINBLOCK;   
                    deleteFlag = false;  
                     
                    resetNumberMode();
                    outputDisplay.resultDisplay = '';
                    parentCount++;   
                } else {     
                    redFlag = true;  
                    outputDisplay.messageDisplay = "the number doesn't have the correct format";     
                    return outputDisplay;  
                }
        }else if (stateStack[stateStack.length - 1] === states.NUMBERMODE) {     
             
                arrayTokens.push(new KeyToken('^', '^'));    
                arrayTokens.push(new KeyToken('(','('));    
                stateStack.push(states.EXPONENTIATION);  
                stateStack.push(states.BEGINBLOCK);  
                outputDisplay.display = arrayTokens.join('');    
                previousState = states.BEGINBLOCK;   
                deleteFlag = false;  
                arrayBlockType.push(0);  
                lastKeyToken.tokenType = 'BEGINBLOCK';   
                lastKeyToken.tokenValue = '(';                
                
                outputDisplay.resultDisplay = '';    
                parentCount++;   
        }else if (stateStack[stateStack.length - 1] === states.ENDFUNCTION || stateStack[stateStack.length - 1] === states.ENDBLOCK ){      
           
                arrayTokens.push(new KeyToken('^', '^'));    
                arrayTokens.push(new KeyToken('(','('));    
                stateStack.push(states.EXPONENTIATION);   
                stateStack.push(states.BEGINBLOCK);  
                previousState = states.BEGINBLOCK;   
                deleteFlag = false;  
                arrayBlockType.push(0);  
                outputDisplay.display = arrayTokens.join('');    
                lastKeyToken.tokenType = 'BEGINBLOCK';   
                lastKeyToken.tokenValue = '(';                
                parentCount++;   
        }else {  
                redFlag = true;  
                outputDisplay.messageDisplay = 'there is an error in exponentiation';    
        }           
        
     
     
    }else if(type === 'COMMA' && transitions[previousState].includes(type) && (currentFunction && currentFunction.parametersLeftArray && currentFunction.parametersLeftArray.length > 1)) {
         
        if(isNumberMode  ) {    
            if(numberRegex.test(currentNumberString)) {  
                arrayTokens.push(new KeyToken('NUMBER', currentNumberString))    
                stateStack.push(states.NUMBERMODE);  
                 
                resetNumberMode();
                outputDisplay.resultDisplay = '';
            } else {
                redFlag = true;  
                outputDisplay.messageDisplay = "the number doesn't have the correct format";     
                return outputDisplay;  
            }
        }
       
         
        arrayTokens.push(new KeyToken(',', ','));    
        stateStack.push(states.COMMA);   
        outputDisplay.display = arrayTokens.join('');    
        lastKeyToken.tokenType = type;   
        lastKeyToken.tokenValue = value;
        previousState = type;    
        deleteFlag = false;  
         
        currentFunction.parametersLeftArray = currentFunction.parametersLeftArray.slice(1);  
         
        outputDisplay.messageDisplay =  `ingrese el valor de ${currentFunction.parametersLeftArray[0]}`;     
    }else {  
        redFlag = true;  
        outputDisplay.messageDisplay = "invalid input";   
        return outputDisplay;  
    }
    /*console.log(lastKeyToken,isPointMode,deleteFlag,isExponentMode,isNegativeMode,isNumberMode,parentCount,redFlag,currentNumberString,
        stateStack,arrayTokens,arrayBlockType,parametersMap,endFunctionMap,currentFunction,previousState);*/
    return outputDisplay;
}

export function clearDisplay() {
    resetParseModule();   
    outputDisplay.display = '';  
    outputDisplay.resultDisplay = '';
    outputDisplay.messageDisplay = '';
    return outputDisplay; 
}

function resetParseModule() {     
    resetNumberMode();   
    endFunctionMap.clear();  
    currentFunction = null; 
    deleteFlag = false;
    redFlag = false;
    parentCount = 0;
    stateStack.length = 0;   
    arrayBlockType.length = 0;   
     
    lastKeyToken.tokenType = 'BEGINBLOCK';
    lastKeyToken.tokenValue = '(';
    previousState = states.BEGINMAIN; 
    stateStack.push(previousState);  

}

export function calculate() {   
    if(parentCount > 0) {    
        redFlag = true;  
        outputDisplay.messageDisplay = "Error, there is an opened block";    
        return outputDisplay;  
    }    
    
    if(transitions[previousState].includes(states.ENDMAIN) && (!currentFunction || ( currentFunction && !currentFunction.parametersLeftArray) || ( currentFunction && currentFunction.parametersLeftArray && currentFunction.parametersLeftArray.length === 0))) {    
        if(isNumberMode) {   
            if(numberRegex.test(currentNumberString)) {
                arrayTokens.push(new KeyToken('NUMBER', currentNumberString));
                stateStack.push(states.NUMBERMODE);            
                resetNumberMode();   
                outputDisplay.resultDisplay = '';    
                 
            } else {
                redFlag = true;  
                outputDisplay.messageDisplay = "the number doesn't have the correct format";     
                return outputDisplay;  
            }
        }
        deleteFlag = false;  
        outputDisplay.display = arrayTokens.join('');    
         
        return outputDisplay;
    }else {
        redFlag = true;
        outputDisplay.messageDisplay = "invalid input";
        return outputDisplay;
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
        outputDisplay.messageDisplay = 'there is no input to erase';     
        return outputDisplay;  
    }
    if(isNumberMode) {   
         
         
        resetNumberMode();
        outputDisplay.resultDisplay = '';
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
        outputDisplay.display = arrayTokens.join('');    
        lastKeyToken.tokenType = previousState;  
        lastKeyToken.tokenValue = arrayTokens[arrayTokens.length - 1].tokenValue;    
    
    }else if(stateStack[stateStack.length - 1] === states.NUMBERMODE) {  
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];  
        outputDisplay.display = arrayTokens.join('');    
         
        resetNumberMode();  
        outputDisplay.resultDisplay = '';        
         
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
        outputDisplay.display = arrayTokens.join('');    
        arrayBlockType.pop();    
        parentCount--;   
        outputDisplay.messageDisplay = '';   
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
        outputDisplay.display = arrayTokens.join('');    
        parentCount++;   
        arrayBlockType.push(1);  
        const functionName = endFunctionMap.get(arrayTokens.length);    
        const functionParametersFromMap = undefined;
        if (functionName) {
            functionParametersFromMap = parametersMap.get(functionName);   
            
        }else {  
            redFlag = true;  
            outputDisplay.messageDisplay = 'there is no function in this place';     
            return outputDisplay;  
        }
         
         
        
        if(functionParametersFromMap === null){  
            if(currentFunction === null) {   
                currentFunction = new parameterFuctionNode(functionName);    
            }else {  
                currentFunction = new parameterFuctionNode(functionName, currentFunction);   
            }
        }else if(functionParametersFromMap === undefined) {  
                redFlag = true;  
                outputDisplay.messageDisplay = 'there is an error';  
                return outputDisplay;  
        }else {  
            if(currentFunction === null) {   
                 
                currentFunction = new parameterFuctionNode(functionName, null, true, functionParametersFromMap, functionParametersFromMap.slice(-1));  
            }else {  
                 
                currentFunction = new parameterFuctionNode(functionName, currentFunction, true, functionParametersFromMap, functionParametersFromMap.slice(-1));
            }            
            outputDisplay.messageDisplay =   `ingrese el valor de ${currentFunction.parametersLeftArray[0]}`;    
        }
        endFunctionMap.delete(arrayTokens.length);   

    }else if(stateStack[stateStack.length - 1] === states.ENDBLOCK) {    
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        outputDisplay.display = arrayTokens.join('');    
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
        outputDisplay.display = arrayTokens.join('');    

    }else if(stateStack[stateStack.length - 1] === states.NEGATIVE) {    
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        outputDisplay.display = arrayTokens.join('');    
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
            outputDisplay.messageDisplay = 'Theres is an error, we are not inside a fuction';    
            return outputDisplay;  
        }
         
        currentFunction.parametersLeftArray = currentFunction.parametersArray.slice(currentFunction.parametersArray.length - currentFunction.parametersLeftArray.length - 1);
        stateStack.pop();    
        arrayTokens.pop();   
        previousState = stateStack[stateStack.length - 1];   
        outputDisplay.display = arrayTokens.join('');    
        outputDisplay.messageDisplay =   `ingrese el valor de ${currentFunction.parametersLeftArray[0]}`;    
        
    }else if(stateStack[stateStack.length - 1] === states.EXPONENTIATION) {  
         
        redFlag = true;  
        outputDisplay.messageDisplay = 'we could not be here, Exponentiation';   
    }else {
        redFlag = true;  
        outputDisplay.messageDisplay = 'we could not be here, what state we are';   
        deleteFlag = false;  
    }
    return outputDisplay;    
    
}
