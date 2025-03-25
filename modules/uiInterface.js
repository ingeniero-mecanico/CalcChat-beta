import {userFunctionTokensArray} from "./memory.js"
let scrollAmount = 0,
tabActive = '',
keyboardActive = 0,
numberVariable = 0;

function carouselScrollUp(event) {
    const carouselItems = document.querySelector(".carousel-items");
     
    scrollAmount -= 50;  
    if (scrollAmount < 0) scrollAmount = 0;  
    carouselItems.style.transform = `translateY(-${scrollAmount}px)`;
}

function carouselScrollDown(event) {
    const carouselItems = document.querySelector(".carousel-items");
    const carouselContainer = document.querySelector(".carousel-container");
    const maxScroll = carouselItems.scrollHeight - carouselContainer.clientHeight;  
    scrollAmount += 50;  
    if (scrollAmount > maxScroll) scrollAmount = maxScroll;  
    carouselItems.style.transform = `translateY(-${scrollAmount}px)`;
}



 
const toggleButton = document.getElementById('togglePanel');
const panel1 = document.getElementById('calcu-chat');
const panel2 = document.getElementById('chat-panel');

toggleButton.addEventListener('click', () => {
  if (panel1.style.display === 'none') {
    panel1.style.display = 'grid';
    panel2.style.display = 'none';   
  } else {
    panel1.style.display = 'none';
    panel2.style.display = 'grid';
  }
});



export function initMainScreen() {
    document.querySelectorAll('.tab-button').forEach(button => {        
        button.addEventListener('click', (event) => {            
            const value = event.target.dataset.value;            
            showTab(value);
        });
    });    
    showTab('calculator');
}


 

function showTab(tab) {    
     
        document.querySelectorAll('.tab-button').forEach(button => {        
        button.classList.remove('active');
    });

     
    document.getElementById(tab + '-tab').classList.add('active');
    tabActive = tab

     
    const template = document.getElementById(tab + '-template');
    const contentContainer = document.getElementById('tab-content');

     
    contentContainer.innerHTML = '';

     
    if (template) {
        const clone = template.content.cloneNode(true);
        contentContainer.appendChild(clone);
    }
    if (tab === 'functions') {
        document.dispatchEvent(functionTabEvent);
         
    }else if(tab === 'calculator') {
         
        document.querySelectorAll('.basic-key').forEach(button => {            
            button.addEventListener('click', (event) => {                
                const value = event.target.getAttribute('data-value').split(' ');                
                setUserInput(value[keyboardActive], value[keyboardActive + 1]);                
            });
        });

        document.querySelectorAll('.xvariable').forEach(button => {
            button.addEventListener('click', (event) => {
                if(event.target.textContent !== '') {
                    const value = parseInt(event.target.getAttribute('data-value'), 10);                          
                    setNumberVariable(value);
                }                
            })
        });

         
        document.getElementById('nextkeyboard').addEventListener('click', changeKeyboard);        
         
        document.getElementById('calculatorchat-send-button').addEventListener('click',triggerSearchFunction );
        document.getElementById('record').addEventListener('click', triggerRecordEvent);
        document.getElementById('voice').addEventListener('click', triggerVoiceEvent);
        document.getElementById('clear').addEventListener('click', triggerClearEvent);
        document.getElementById('variable').addEventListener('click', triggerSaveVariableEvent);
        document.getElementById('carouselUp').addEventListener('click', carouselScrollUp);
        document.getElementById('carouselDown').addEventListener('click', carouselScrollDown);
        document.getElementById('equal').addEventListener('click', triggerCalculate);
        document.getElementById('erase').addEventListener('click', triggerDeleteLastEvent);
        document.getElementById('negative').addEventListener('click', (event) => {
            const value = event.target.getAttribute('data-value').split(' ');                
            setUserInput(value[0], value[1]);
        });
        document.dispatchEvent(calculatorInitEvent);       
    }else if(tab === 'edit') {
        document.dispatchEvent(editInitEvent);
    }else if(tab === 'graph') {
         
        document.dispatchEvent (graphTabEvent);        
    }else if(tab === 'chat') {
        document.dispatchEvent(chatTabEvent);
         
    }
     
}


export function initBasickeyboard() {
     
    document.addEventListener('keydown', handleKeyboardInput);
    
}

function handleKeyboardInput(event) {
    const key = event.key;    

    if(document.activeElement.id !== "calculatorchat-message-input" && document.activeElement.id !== "chat-panel-input"  && tabActive === 'calculator') {
         
        if (/[0-9]/.test(key)) {
             
            setUserInput(key, 'NUMBER');                 
            
        }else if(['+', '-', '*', '/'].includes(key)) {
            if(key !== '/'){
                setUserInput(key, 'OPERATION');
            }else {
                setUserInput('÷', 'OPERATION');
            }
                   
            
        }else if(['(',')','^','√',',', '.'].includes(key)) {
            
             
            switch(key) {
                case '(' :
                    setUserInput(key, 'BEGINBLOCK');
                    break;
                case ')' :
                    setUserInput(key, 'ENDBLOCK');
                    break;
                case '^' :
                    setUserInput(key, 'EXPONENTIATION');
                    break;
                case '√' :
                    setUserInput(key, 'ROOT');
                    break;           
                case ',' :
                    setUserInput(key, 'COMMA');
                    break;
                case '.' :
                    setUserInput(key, 'POINT');
            }
             
             
        }

         
        else if (tabActive === 'calculator' && (key === 'Enter' || key === '=')) {   
                event.preventDefault();
                triggerCalculate();
        }

         
        else if (tabActive === 'calculator' && key === 'Backspace') {
            triggerDeleteLastEvent();
            event.preventDefault();
            
        }
         
        else if (tabActive === 'calculator' && key === 'Delete') {
            triggerClearEvent();
            event.preventDefault();
            
        }
    }
    
}

 

const userInput = {
    value:'',
    type: '',
};



const changeUserInputEvent = new Event('inputChanged');
const calculatorInitEvent = new Event('uicalculatorinit');
const calculateEvent = new Event('calculate');
const deleteLastEvent = new Event('deleteLast');
const clearEvent = new Event('clear');
const editInitEvent = new Event('editTab');  

const searchFunctionEvent = new Event('searchFunction');
const functionTabEvent = new Event('functionTab'); 
const graphTabEvent = new Event('graphTab');     

const chatTabEvent = new Event('chatTab');  
const recordEvent = new Event('record');    
const voiceEvent = new Event('voice');   
const saveVariableEvent = new Event('saveVariable');  
const getStoreVariableEvent = new Event('getStoreVariable');     

 
export function getUserInput() {
    return userInput;
}

 
function setUserInput(value, type) {  
    userInput.value = value;
    userInput.type = type;
     
    document.dispatchEvent(changeUserInputEvent);
}

 
function triggerCalculate() {
    document.dispatchEvent(calculateEvent);
}

 
function triggerDeleteLastEvent() {
    document.dispatchEvent(deleteLastEvent);
}

 
function triggerClearEvent() {
    document.dispatchEvent(clearEvent);
}


function triggerSearchFunction() {
    document.dispatchEvent(searchFunctionEvent);
}



function triggerRecordEvent() {
     
     
    const svgElement = document.getElementById('recordsvg');   
     
     
    const newColor = svgElement.getAttribute('fill') === '#5f6368' ? '#4285F4' : '#5f6368';
    svgElement.setAttribute('fill', newColor);
    document.dispatchEvent(recordEvent);     
}

function triggerVoiceEvent() {
     
     
    const svgElement = document.getElementById('voicesvg');   
     
    const newColor = svgElement.getAttribute('fill') === '#5f6368' ? '#4285F4' : '#5f6368';
    svgElement.setAttribute('fill', newColor);
    document.dispatchEvent(voiceEvent);  
}

function triggerSaveVariableEvent() {
    document.dispatchEvent(saveVariableEvent);   
}


function changeKeyboard() {
    const image1 = document.getElementById('next');
    const image2 = document.getElementById('previous');
     
    image1.classList.toggle('visible');
    image1.classList.toggle('hidden');
    image2.classList.toggle('visible');
    image2.classList.toggle('hidden');
    keyboardActive === 0 ? keyboardActive = 2 : keyboardActive = 0;
    const targetButtons = document.querySelectorAll('.basic-key');    
    
     
    targetButtons.forEach((button, index) => {       
        const value = button.getAttribute('data-value').split(' '); 
        button.textContent = value[keyboardActive];  
        
    });
        
}

export function setVariableButtonCaption(dataValueString, mode) {
    const specificButton = document.querySelector(`.xvariable[data-value="${dataValueString}"]`);
    if (specificButton) {
        if(mode === 'paint') {
            specificButton.textContent = `X${dataValueString}`;
            specificButton.style.backgroundColor = 'lightblue';
        }else {
            specificButton.textContent = '';
            specificButton.style.backgroundColor = '#fff';
        }
    } else {
        console.error(`Button with data-value="${dataValueString}" not found.`);
    }
}

export function getNumberVariable() {
    return numberVariable;
}

 
function setNumberVariable(number) {    
    numberVariable = number
     
    document.dispatchEvent(getStoreVariableEvent);
}

export function getGraphTab() {
    const graphTabButton = document.getElementById('graph-tab');
    return graphTabButton;
}