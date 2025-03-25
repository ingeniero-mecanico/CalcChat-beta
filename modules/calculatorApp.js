import { initMainScreen, initBasickeyboard, getUserInput, setVariableButtonCaption, getNumberVariable, getGraphTab } from "./uiInterface.js";
import { appendToDisplay, calculate, clearDisplay, deleteLastEntry, initParseModule } from "./parseInput.js";
import { setDisplay, initializeDisplay, resetDisplay, getCalculatorChatInput, setCalculatorChatInput } from "./calculatorDisplay.js";
import { sharedArray, tokensJsonHistory, calculatorTokensArray, userFunctionTokensArray, userFunctionParameters, functionsParameterStringMap, resultStore, tokensJsonFile, variableStorage,storedVariableMap } from "./memory.js";
import { InterpretResult, SingleElementStorage } from "./commonConstant.js";
import { functionArrayProperties } from "./functionPoolModule.js";
import { VM } from "./VirtualMachine.js";
import { resetCompiler, Token, TokenType, CompleteFunctionObject } from "./compiler.js";
import { initializeEditDisplay, setEditDisplay, getFunctionName, InitEditTab, checkVariablesNames } from "./editDisplay.js";
import { loadFunctions } from "./functionsDisplay.js";
import { drawGraphPolar, drawGraphCartesian, initCanvas, getBase64Image, getLimitsArray } from "./graphDisplay.js";
import { initChatTab, getJsonArray, waitForUserInput, displayImage, addToChatBubble } from "./chatDisplay.js";
import { textToSpeech, isSingleWord } from "./utility.js";
import { FunctionManager } from "./localStore.js";
import { getVoiceInput, recordVoice, resetVoiceInputModule } from "./voiceInput.js";

 
var modeUse = 'simple', calculatorState = 'free';
 
var lastEvent = 'init';
 
const vm = new VM(undefined,undefined,resultStore);
 
var variableAlreadyAssign = -1;
 
var lastLengthJsonFile = 0;  
 
var calculatorGraphType = '';
const graphNameFunction = 'calculatorApp_graphFunction';
 
var currentFunction = new SingleElementStorage();
 
const jsonHistoryUpdateEvent = new Event('jsonHistoryUpdate');


document.addEventListener('DOMContentLoaded', () => {    
   initMainScreen();
   initBasickeyboard();
    
   FunctionManager.loadFunctionsFromStorage();

    
   vm.init(functionArrayProperties, functionsParameterStringMap, FunctionManager.getFunctions());
   initParseModule(calculatorTokensArray, functionsParameterStringMap);
   FunctionManager.resetFunctions();
});

 
document.addEventListener('inputChanged', () => {
   const userInput = getUserInput();
    
   if(userInput.type === 'CALCULATOR_FUNCTION') {
      processGraphCartesianCommand();
      userInput.type = 'BEGINFUNCTION';
      userInput.value = 'graphCartesian';
   }
   processCalculatorKeyInput(userInput);
   lastEvent = 'enterInput';
});

 
document.addEventListener('uicalculatorinit', () => {
   initializeDisplay();
   resetDisplay();
   lastEvent = 'init';
});

 
document.addEventListener('calculate', () => {
   if(calculatorGraphType === '') {
      processCalculateCommand();
   lastEvent = 'calculate';
   }else if(calculatorGraphType === 'graphCartesian'){
      graphCartesian();
   }   
});

document.addEventListener('clear', () => {
   processClearCommand();
   lastEvent = 'clear';
});

document.addEventListener('deleteLast', () => {
   processEraseCommand();
   lastEvent = 'deleteLast';
});

document.addEventListener('editTab', () => {   
   initializeEditDisplay();
   if(lastEvent === 'calculate') {
      const equate = calculatorTokensArray.join('');
      setEditDisplay('', equate,'','');
      InitEditTab();
   }else {
      setEditDisplay('','','','first validate his input(press =)' );
   }
   
});

document.addEventListener('makeFunction', () => {
   if(checkVariablesNames()) {
      processMakeFunctionCommand(userFunctionTokensArray, calculatorTokensArray, getFunctionName(), true);
       
      lastEvent = 'makeFunction';
   }
});

document.addEventListener('searchFunction', () => {   
   const calculatorChatInput = getCalculatorChatInput();
   if(calculatorChatInput !== '') {
      if (calculatorChatInput.startsWith('//')) {
         
         const textToken = { type: 'TEXT', value: calculatorChatInput.slice(2).trim() };  
         tokensJsonFile.push(textToken);
          
     } else {
          
         if(vm.globals.has(calculatorChatInput)) {
            processCalculatorKeyInput({value:calculatorChatInput, type: 'BEGINFUNCTION'});
         }
         else{
            setDisplay(undefined,undefined, 'I could not find this function in virtual machine');      
         }         
     }  
   lastEvent = 'searchFunction';
   }   
});

document.addEventListener('functionTab', () => {
   loadFunctions(functionArrayProperties);
   lastEvent = 'functionTab';
});

document.addEventListener('graphTab', () => {
   initCanvas();
    
   lastEvent = 'graphTab';
});

document.addEventListener('functionNameClick', (event) => {
    
   const possibleFunctionString = event.detail.functionName;
   if(functionsParameterStringMap.has(possibleFunctionString)) {
      processCalculatorKeyInput({value:possibleFunctionString, type: 'BEGINFUNCTION'});
   }
   else{
      setDisplay(undefined,undefined, 'I could not find this function in virtual machine');      
   }
   lastEvent = 'functionNameClick';
    
});

document.addEventListener('plotGraph', (event) => {
   if(calculatorGraphType === 'graphCartesian') {
      const limits = getLimitsArray();
      makeArrayToPlot(graphNameFunction, limits[0],limits[1], 0.1);
       
      drawGraphCartesian(resultStore,limits[0],limits[1],limits[2],limits[3]);
   }else {
      drawGraphPolar(3, resultStore);
   }
   
    
   
   lastEvent = 'ploGraph';
});

document.addEventListener('chatTab', (event) => {
   initChatTab();  
   lastEvent = 'chatTab';
});

document.addEventListener('jsonLoaded', (event) => {
   appendToChat(getJsonArray());  
   lastEvent = 'jsonLoaded';
});

document.addEventListener('record', (event) => {
   processClearCommand();
   recordCalculationsCommand();
   lastEvent = 'record';
});

document.addEventListener('voice', (event) => {
   recordVoiceCommand();
   lastEvent = 'voice';
});

document.addEventListener('transcriptVoiceReady', (event) => {
   savedVoiceTokenCommand();
   lastEvent = 'transcriptVoiceReady';
});

document.addEventListener('saveVariable', (event) => {
   saveVariableToMemory();
   lastEvent = 'saveVariable';
});

document.addEventListener('getStoreVariable', (event) => {
    
   if(calculatorState === 'finish' && (variableAlreadyAssign !== getNumberVariable())) {
      setMemoryVariable();  
       
   }else {  
      getVariableFromMemory();    
      variableAlreadyAssign =-1;  
   }
   
})

document.addEventListener('base64ImageReady', (event) => {
   saveImageTokenCommand();
   lastEvent = 'base64ImageReady';
})

function processCalculatorKeyInput(input) {
   if(calculatorState === 'finish') {
      processClearCommand();
       
       
   }
   if (input.type === 'BEGINFUNCTION' ) {
       
      if (functionsParameterStringMap.has(input.value)) {
         const userInputValidated = appendToDisplay(input.value, input.type);   
         setDisplay(userInputValidated.display, userInputValidated.resultDisplay, userInputValidated.messageDisplay);
         if(userInputValidated.messageDisplay === ''){
            return true;
         }else {
            return false;
         }
         
      }else {
         setDisplay(undefined,undefined, 'I could not find this function in virtual machine');
         return false;
      }
   }else {
      const userInputValidated = appendToDisplay(input.value, input.type);   
      setDisplay(userInputValidated.display, userInputValidated.resultDisplay, userInputValidated.messageDisplay);
      if(userInputValidated.messageDisplay === ''){
         return true;
      }else {
         return false;
      }
   }
   
}

function processCalculateCommand() {   
   const calculateCommandValidated = calculate();
   let literalOperationsString = '';
  
   if ( calculatorTokensArray.length > 0 && calculateCommandValidated.messageDisplay === ''){      
      sharedArray.push({type: 'PRINT', value: 'PRINT'});
       
      calculatorTokensArray.forEach(element => {         
      sharedArray.push(element);
      });
      sharedArray.push( {type: ';', value: ';'});
      sharedArray.push({type: 'FIN', value:'FIN'});
      console.log(sharedArray.join('/'));    
      const notHadError = vm.interpret(sharedArray);
      if(notHadError === InterpretResult.INTERPRET_OK) {
         calculateCommandValidated.resultDisplay = vm.result;
         setDisplay(calculateCommandValidated.display, calculateCommandValidated.resultDisplay, calculateCommandValidated.messageDisplay);
         const literalOperationsArray = calculatorTokensArray.map(token => token.value);            
         literalOperationsString = literalOperationsArray.join('');       
         if(modeUse === 'record') {
            storedVariableMap.forEach((value, key) => {
               calculatorTokensArray[key] = value;
             });            
            lastLengthJsonFile = tokensJsonFile.push({type:'TEXT', value: literalOperationsString}) - 1;
            tokensJsonFile.push(...sharedArray);
         }
          
         calculatorState = 'finish';
          
          
         tokensJsonHistory.push({type:'TEXT', value: literalOperationsString});
         tokensJsonHistory.push({type:'TEXT', value: vm.result});
         document.dispatchEvent(jsonHistoryUpdateEvent);
      }
      else {
         setDisplay(undefined, undefined, 'there is a compilation error');
      }
   }else {
      setDisplay(calculateCommandValidated.display, calculateCommandValidated.resultDisplay, calculateCommandValidated.messageDisplay);
   }  

}

function processEraseCommand() {
   const deleteLastEntryValidated =  deleteLastEntry();
   setDisplay(deleteLastEntryValidated.display, deleteLastEntryValidated.resultDisplay, deleteLastEntryValidated.resultDisplay);
}

function processClearCommand() {
   sharedArray.length = 0;
   calculatorTokensArray.length = 0;
   storedVariableMap.clear();
    
   vm.reset();
   resetCompiler();
   const clearDisplayValidated = clearDisplay();
   setDisplay(clearDisplayValidated.display, clearDisplayValidated.resultDisplay, clearDisplayValidated.resultDisplay);
   initParseModule(calculatorTokensArray, functionsParameterStringMap);
   calculatorState = 'free';   
   lastEvent = 'init';   
   variableAlreadyAssign =-1;  
}

function processMakeFunctionCommand(arrayInput, calculatorTokens, functionName, registerRequired) {  
   
       
      let parametersNewFunction = [];
            
      arrayInput.push(new Token(TokenType.TOKEN_FUN, 'fun'));
      arrayInput.push(new Token(TokenType.TOKEN_IDENTIFIER, functionName));
       
       
      arrayInput.push(new Token(TokenType.TOKEN_LEFT_PAREN,'('));
      calculatorTokens.forEach((token, index) => {
         console.log(token.toString())
         if(token.type === 'VARIABLE') {
             
              token.type = TokenType.TOKEN_IDENTIFIER;
              if(!parametersNewFunction.includes(token.value)){
                
               parametersNewFunction.push(token.value);
               arrayParameters.push(new Token(token.type, token.value));
               arrayInput.push(new Token(token.type, token.value));
               arrayInput.push(new Token(TokenType.TOKEN_COMA,','));               
            }
         }
      });
      
      if(parametersNewFunction.length > 0) {
          arrayInput.pop();
      }        
      arrayInput.push(new Token(TokenType.TOKEN_RIGHT_PAREN,')'));        
      arrayInput.push(new Token(TokenType.TOKEN_LEFT_BRACE,'{'));
      arrayInput.push(new Token(TokenType.TOKEN_RETURN,'return'));
      calculatorTokens.forEach((token, index) => {            
          arrayInput.push(new Token(token.type, token.value)); 
      });
      arrayInput.push(new Token(TokenType.TOKEN_SEMICOLON,';'));
      arrayInput.push(new Token(TokenType.TOKEN_RIGHT_BRACE,'}'));

       
      arrayInput.push(new Token(TokenType.TOKEN_EOF,'FIN'));
       
      console.log(arrayInput.map(e => e.value));
      
      resetCompiler();

      registerFunction(parametersNewFunction, functionName, registerRequired);

      calculatorTokens.length = 0;      
}

 
function registerFunction(parameters, name, registerIsRequired = true) {
   
   var parametersTemplateString = '';
   
   const notHadError = vm.interpret(userFunctionTokensArray);
      if(notHadError === InterpretResult.INTERPRET_OK) {  
         if(registerIsRequired) {
            setEditDisplay(name, '', calculatorTokensArray.join(''), name + ' store in virtual machine');
         
            parameters.forEach((parameter, index) => {
               if(index !== parameters.length - 1) {
                  parametersTemplateString += `${parameter},`;
               }else {
                  parametersTemplateString += `${parameter}`;
               }             
            });
            
            const parameterFunArray = parametersTemplateString.split(",");  
             
            registerInFunctionParametersMap(parameterFunArray, name);   
            FunctionManager.loadFunctionsFromStorage();   
            FunctionManager.addFunction(new CompleteFunctionObject(vm.globals.get(name), parameterFunArray));   
            FunctionManager.resetFunctions();  
         }       
         
      }else {
         if(registerIsRequired){  
            setEditDisplay(name, '', calculatorTokensArray.join(''), 'there was an error');
         } else{   
            setDisplay(undefined,undefined,'there was an error in equation');
         }
      }
}

 
function registerInFunctionParametersMap(parameterArray, name) {   
   
   functionsParameterStringMap.set(name, parameterArray);
    
}

function makeArrayToPlot(equationToPlot, xMin, xMax, increment) {  
   
   sharedArray.length = 0;  
   
   
   sharedArray.push(new Token('var', 'var'));
   sharedArray.push(new Token('IDENTIFIER','variableXPlot'));
   sharedArray.push(new Token(':=', ':='));
   sharedArray.push(new Token('NUMBER', xMin));
   sharedArray.push(new Token(';', ';'));
   sharedArray.push(new Token('while', 'while'));
   sharedArray.push(new Token('(', '('));
   sharedArray.push(new Token('IDENTIFIER','variableXPlot'));
   sharedArray.push(new Token('<=', '<='));
   sharedArray.push(new Token('NUMBER', xMax));
   sharedArray.push(new Token(')', ')'));
   sharedArray.push(new Token('{', '{'));
   sharedArray.push(new Token('STORE','STORE'));
   sharedArray.push(new Token('IDENTIFIER', equationToPlot));
   sharedArray.push(new Token('(', '('));
   sharedArray.push(new Token('IDENTIFIER', 'variableXPlot'));
   sharedArray.push(new Token(')', ')'));
   sharedArray.push(new Token(';', ';'));
   sharedArray.push(new Token('IDENTIFIER', 'variableXPlot'));
   sharedArray.push(new Token(':=', ':='));
   sharedArray.push(new Token('IDENTIFIER', 'variableXPlot'));
   sharedArray.push(new Token('+', '+'));
   sharedArray.push(new Token('NUMBER', increment));
   sharedArray.push(new Token(';', ';'));
   sharedArray.push(new Token('}', '}'));
    
    
   sharedArray.push(new Token('FIN', 'FIN'));
   
   console.log(sharedArray.map(e => e.value).join(''));
   
   resetCompiler();
   vm.reset();
   vm.arrayResults.length = 0;
   const notHadError = vm.interpret(sharedArray);
   if(notHadError === InterpretResult.INTERPRET_OK) {
      
      console.log(resultStore.join('/'));
   }else {
       
   }

}


 
 
async function appendToChat(jsonTokens) {
   sharedArray.length = 0;  
    
   for( let i = 0; i < jsonTokens.length; i++) {        
       if(jsonTokens[i].type === 'TEXT') {
           addToChatBubble(jsonTokens[i].value, 'sent');
           await textToSpeech(jsonTokens[i].value);
       }else if(jsonTokens[i].type === 'IMAGE'){
           displayImage(jsonTokens[i].value);
       }else if(jsonTokens[i].type === 'VOICE'){
            await textToSpeech(jsonTokens[i].value);
       }
       else {
           await appendCalculation(jsonTokens[i]);
       }
   }
}

 

 
 
async function appendCalculation(token) {
     
    if(token.type === 'FIN') {             
        
        sharedArray.push(token);
         
         resetCompiler();
         vm.reset();
        
          
         const notHadError = vm.interpret(sharedArray);
         if(notHadError === InterpretResult.INTERPRET_OK) {            
            addToChatBubble(vm.result, 'sent');
            await textToSpeech(vm.result);
            sharedArray.length = 0;  
         }     
        
      
    }else if(token.type === 'PARAMETER') {
         
         
               
        token.value = await waitForUserInput();
        token.type = 'NUMBER';
        sharedArray.push(token);
         
         

        addToChatBubble(token.value, 'received');
        await textToSpeech(token.value);
        
     
    }else {        
        sharedArray.push(token);
    }
}

function recordCalculationsCommand() {
   if(modeUse === 'record') {
      saveRecordToFile();
      modeUse = 'simple';
   }else {
      modeUse = 'record';
      const indexToClean = variableStorage.length / 2;
      if(indexToClean <= 10 ){
        for(let i = 0; i < indexToClean; i++) {
         setVariableButtonCaption(i, 'clean');
        } 
      }
       
   }
}

function saveRecordToFile() {
   FunctionManager.saveRecordToFile(tokensJsonFile);
}

function recordVoiceCommand() {
   resetVoiceInputModule();
   recordVoice();   
}

function savedVoiceTokenCommand() {
   const voiceToken = getVoiceInput();
    
   if(voiceToken && modeUse === 'simple' && voiceToken.value !== '' &&  isSingleWord(voiceToken.value)) {      
      setCalculatorChatInput(voiceToken.value);          
   }
}

function saveVariableToMemory() {
      
   const indexString = `${variableStorage.length / 2}`;
    
   if(calculatorState === 'finish') {
      variableStorage.push(`Variable${indexString}`);
      variableStorage.push(vm.result);
      setVariableButtonCaption(indexString, 'paint');
      setDisplay(undefined,`Variable${indexString} = ${vm.result}`, undefined);
      variableAlreadyAssign = getNumberVariable();  
      if(modeUse === 'record') {
         sharedArray.length = 0;
         sharedArray.push(new Token('var', 'var'));
         sharedArray.push(new Token('IDENTIFIER',`Variable${indexString}`));
         sharedArray.push(new Token(';', ';'));
         sharedArray.push({type: 'PRINT', value: 'PRINT'}); 
         sharedArray.push(new Token('IDENTIFIER',`Variable${indexString}`));
         sharedArray.push(new Token('=', '='));
         calculatorTokensArray.forEach(element => {
            sharedArray.push(element);
            });         
         sharedArray.push( {type: ';', value: ';'});
         sharedArray.push({type: 'FIN', value:'FIN'});
         tokensJsonFile.length = lastLengthJsonFile;
         const literalOperationsArray = calculatorTokensArray.map(token => token.value);  
         tokensJsonFile.push({type:'TEXT', value: `Variable${indexString} = ${literalOperationsArray.join('')}`});   
         tokensJsonFile.push(...sharedArray);       
      }      
   }else {
      variableAlreadyAssign = -1;  
   }
   
}

function getVariableFromMemory() {
   const index = getNumberVariable() * 2;
   const variableValue = variableStorage[index+1];
    
   const isOkInput = processCalculatorKeyInput({value: variableValue, type: 'NUMBERMODE'});
    
   if(modeUse === 'record' && isOkInput) {      
      storedVariableMap.set(calculatorTokensArray.length - 1, {type: 'IDENTIFIER', value: variableStorage[index]});     
   }

}

function setMemoryVariable() {
   variableAlreadyAssign = getNumberVariable();
   const index = getNumberVariable() * 2;
    
   variableStorage[index+1] = parseFloat(vm.result);
   setDisplay(undefined,`Variable${index} = ${variableStorage[index+1]}`, undefined); 
   if(modeUse === 'record') {
      sharedArray.length = 0;      
      sharedArray.push({type: 'PRINT', value: 'PRINT'}); 
      sharedArray.push(new Token('IDENTIFIER',`Variable${index}`));
      sharedArray.push(new Token('=', '='));
      calculatorTokensArray.forEach(element => {
         sharedArray.push(element);
         });         
      sharedArray.push( {type: ';', value: ';'});
      sharedArray.push({type: 'FIN', value:'FIN'});
      tokensJsonFile.length = lastLengthJsonFile;
      const literalOperationsArray = calculatorTokensArray.map(token => token.value);  
      tokensJsonFile.push({type:'TEXT', value: `Variable${index} = ${literalOperationsArray.join('')}`});   
      tokensJsonFile.push(...sharedArray);       
   }       
}

 function saveImageTokenCommand() {
   if(modeUse === 'record') {
      tokensJsonFile.push({type: 'IMAGE', value: getBase64Image()});
   }
 }

  
 function processGraphCartesianCommand( ) {
    
   processClearCommand();
    
   registerInFunctionParametersMap(['equation'], 'graphCartesian');
    
   calculatorGraphType = 'graphCartesian';
    

    

    

    
   
 }

 function graphCartesian() {
    
    
    
   
    
   const valuesArray = calculatorTokensArray.map((elem) => elem.value);
   const startIndex = valuesArray.indexOf('(') + 1;
   const equationToMakeFunctionArray = calculatorTokensArray.slice(startIndex, calculatorTokensArray.length-1);
    

   
   const calculateCommandValidated = calculate();
   
   if ( calculatorTokensArray.length > 0 && calculateCommandValidated.messageDisplay === ''){ 
      
       
       
       
      
       
      
       
      
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       
       

      console.log(equationToMakeFunctionArray.map(e => e.value + '/' + e.type));

      processMakeEquationCommand(userFunctionTokensArray, equationToMakeFunctionArray, graphNameFunction, false);
      /*const resultXmin = interpretExpression(xMinArray);
      const resultXmax = interpretExpression(xMaxArray);
      const resultYmin = interpretExpression(yMinArray);
      const resultYmax = interpretExpression(yMaxArray);

      if( resultXmin.isNumber || resultXmax.isNumber || resultYmin.isNumber || resultYmax.isNumber){
         setDisplay(undefined, undefined, 'there is an error in limits');
         return;
      }
      xMin = Math.min(resultXmin.value,resultXmax.value);
      xMax = Math.min(resultXmin.value,resultXmax.value);
      yMin = Math.min(resultYmin.value,resultYmax.value);
      yMax = Math.max(resultYmin.value,resultYmax.value);*/
       
      userFunctionTokensArray.length = 0;
       
       
       
      getGraphTab().click();
      initCanvas();
      
   }else {
      setDisplay(calculateCommandValidated.display, calculateCommandValidated.resultDisplay, calculateCommandValidated.messageDisplay);
   }
   
 }

 function findAllOccurrences(arr, search) {
   let indices = [];
   for (let i = 0; i < arr.length; i++) {
       if (arr[i] === search) indices.push(i);
   }
   return indices;
}

function interpretExpression(expressionArray) {
   expressionArray.push( {type: ';', value: ';'});
   expressionArray.push({type:'FIN', value: 'FIN'});
    
   const notHadError = vm.interpret(expressionArray);   
   if(notHadError !== InterpretResult.INTERPRET_OK) {
      return {isNumber: false, value:0};
   }
   const value = parseFloat(vm.result);
   resetCompiler();
   vm.reset();
   return { isNumber: isFinite(value), value: value};
}

function processMakeEquationCommand(arrayInput, calculatorTokens, functionName, registerRequired) {  
   
    
   let parametersNewFunction = [];
         
   arrayInput.push(new Token(TokenType.TOKEN_FUN, 'fun'));
   arrayInput.push(new Token(TokenType.TOKEN_IDENTIFIER, functionName));
    
    
   arrayInput.push(new Token(TokenType.TOKEN_LEFT_PAREN,'('));
   calculatorTokens.forEach((token, index) => {
      console.log(token.toString())
      if(token.value === '𝑿') {
          
           token.value = 'X';
           if(!parametersNewFunction.includes(token.value)){
             
            parametersNewFunction.push(token.value);
             
            arrayInput.push(new Token(token.type, token.value));
            arrayInput.push(new Token(TokenType.TOKEN_COMA,','));               
         }
      }
   });
   
   if(parametersNewFunction.length > 0) {
       arrayInput.pop();
   }        
   arrayInput.push(new Token(TokenType.TOKEN_RIGHT_PAREN,')'));        
   arrayInput.push(new Token(TokenType.TOKEN_LEFT_BRACE,'{'));
   arrayInput.push(new Token(TokenType.TOKEN_RETURN,'return'));
   calculatorTokens.forEach((token, index) => {            
       arrayInput.push(new Token(token.type, token.value)); 
   });
   arrayInput.push(new Token(TokenType.TOKEN_SEMICOLON,';'));
   arrayInput.push(new Token(TokenType.TOKEN_RIGHT_BRACE,'}'));

    
   arrayInput.push(new Token(TokenType.TOKEN_EOF,'FIN'));
    
    
   
   resetCompiler();

   registerFunction(parametersNewFunction, functionName, registerRequired);

   calculatorTokens.length = 0;      
}

function reduceForAddition(equation, xMin, xMax, increment) {  
   
   sharedArray.length = 0;  
   
   
   sharedArray.push(new Token('var', 'var'));
   sharedArray.push(new Token('IDENTIFIER','variableXPlot'));
   sharedArray.push(new Token('=', '='));
   sharedArray.push(new Token('NUMBER', xMin));
   sharedArray.push(new Token(';', ';'));
   sharedArray.push(new Token('var', 'var'));
   sharedArray.push(new Token('IDENTIFIER','sum'));
   sharedArray.push(new Token('=', '='));
   sharedArray.push(new Token('NUMBER', '0'));
   sharedArray.push(new Token(';', ';'));
   sharedArray.push(new Token('while', 'while'));
   sharedArray.push(new Token('(', '('));
   sharedArray.push(new Token('IDENTIFIER','variableXPlot'));
   sharedArray.push(new Token('<=', '<='));
   sharedArray.push(new Token('NUMBER', xMax));
   sharedArray.push(new Token(')', ')'));
   sharedArray.push(new Token('{', '{'));
    
   sharedArray.push(new Token('IDENTIFIER','sum'));
   sharedArray.push(new Token('=', '='));
   sharedArray.push(new Token('IDENTIFIER', equationToPlot));
   sharedArray.push(new Token('(', '('));
   sharedArray.push(new Token('IDENTIFIER', 'variableXPlot'));
   sharedArray.push(new Token(')', ')'));
   sharedArray.push(new Token(';', ';'));
   sharedArray.push(new Token('IDENTIFIER', 'variableXPlot'));
   sharedArray.push(new Token(':=', ':='));
   sharedArray.push(new Token('IDENTIFIER', 'variableXPlot'));
   sharedArray.push(new Token('+', '+'));
   sharedArray.push(new Token('NUMBER', increment));
   sharedArray.push(new Token(';', ';'));
   sharedArray.push(new Token('}', '}'));
   sharedArray.push(new Token('PRINT', 'PRINT'));
   sharedArray.push(new Token('IDENTIFIER','sum'));   
   sharedArray.push(new Token(';', ';'));
   sharedArray.push(new Token('FIN', 'FIN'));
   
   console.log(sharedArray.map(e => e.value).join(''));
   
   resetCompiler();
   vm.reset();   
   const notHadError = vm.interpret(sharedArray);
   if(notHadError === InterpretResult.INTERPRET_OK) {
      
       
   }else {
       
   }

}

export function isRecording() {
   return modeUse === 'record';
}

export function makeCalculation(arrayOfTokens) {
   resetCompiler();
   vm.reset();  
    
   const notHadError = vm.interpret(arrayOfTokens);
   try {
      if(notHadError === InterpretResult.INTERPRET_OK) {
         return {type: 'OK', value: vm.result};
      }else {
         return {type: 'ERROR', value: notHadError};
      }
   }catch {
      return {type: 'ERROR', value: 0};
   }
   
}