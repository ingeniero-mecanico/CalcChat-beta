import { tokensJsonHistory, tokensJsonFile, sharedArray} from "./memory.js";
import { isRecording, makeCalculation } from "./calculatorApp.js";
import { textToSpeech} from "./utility.js";
import {getVoiceInput } from "./voiceInput.js";

 
var jsonContentChatPanel = [];   
var indexNumberLastUpdate = -1;

document.getElementById('chat-panel-send-button').addEventListener('click', () => {    
    const voiceValue = document.getElementById('chat-panel-input').value;    
    if (voiceValue.trim() !== "") {       
        tokensJsonHistory.push({type:'TEXT', value: voiceValue});
        appendToChatPanel({type:'TEXT', value: voiceValue});
        if(isRecording()) {
            tokensJsonFile.push({type:'VOICE', value: voiceValue});
        }
    }       
});

document.getElementById('panel-load-json-button').addEventListener('click', () => {    
    const fileInput = document.getElementById('panel-json-input');
    fileInput.value = "";  
    fileInput.click();
});

document.getElementById('panel-json-input').addEventListener('change', handleJsonUpload);  

 
document.addEventListener('jsonHistoryUpdate', () => {    
    updateChatPanel();
});

 
document.addEventListener("paste", async (event) => {
    event.preventDefault();

    const clipboardItems = event.clipboardData.items;
    for (let item of clipboardItems) {
        if (item.type.startsWith("image/")) {
             
            const blob = item.getAsFile();
            const base64Image = await convertImageToBase64(blob);

             
            const imageToken = { type: "IMAGE", value: base64Image };
            tokensJsonHistory.push(imageToken);  
             
            if(isRecording()) tokensJsonFile.push(imageToken);
             
            appendToChatPanel(imageToken);
        } else if (item.type === "text/plain") {
             
            const clipboardText = await navigator.clipboard.readText();
            if (clipboardText.trim() !== "") {
                const textToken = {type: 'TEXT', value: clipboardText};
                tokensJsonHistory.push(textToken); 
                 
                if(isRecording()) tokensJsonFile.push(textToken);
                appendToChatPanel({type: 'TEXT', value: clipboardText});
            }
        }
    }
});

 
document.addEventListener('transcriptVoiceReady', (event) => {    
    savedVoiceTokenCommand();
 });

 
function convertImageToBase64(blob) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}


 
function displayImage(base64String) {
    const chatContainer = document.getElementById('chat-panel-box');
    const imgElement = document.createElement('img');
    imgElement.src = base64String;
    imgElement.alt = "Image";
    imgElement.style.maxWidth = "100%";
    imgElement.style.borderRadius = "10px";
    imgElement.style.margin = "10px 0";
    chatContainer.appendChild(imgElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;  
}

 
function  waitForUserInput() {
    return new Promise(resolve => {
        function handleUserInput() {
            const messageInput = document.getElementById('chat-panel-input');
            const messageText = messageInput.value;
            
            if (!isNaN(messageText) && messageText.trim() !== '') {
                resolve(messageText);
                document.getElementById('chat-panel-send-button').removeEventListener('click', handleUserInput);
            } else {
                textToSpeech('Please enter a valid number.');
            }
        }

        document.getElementById('chat-panel-send-button').addEventListener('click', handleUserInput);
    });
}


//////////////////////////////////////////////////////
 
 
 
function handleJsonUpload(event) {
    clearChat();
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                jsonContentChatPanel = JSON.parse(e.target.result);
                if (Array.isArray(jsonContentChatPanel)) {                    
                     
                     
                    appendToChat(jsonContentChatPanel);
                } else {
                    console.error('Invalid JSON format: Expected an array.');
                }
            } catch (error) {
                console.error('Error parsing JSON:', error.message);
            }
        };
        reader.readAsText(file);
    }
}

 
function addToChatBubble(content, side) {
    if(side === 'received') {
        const messageInput = document.getElementById('chat-panel-input');
         
        messageInput.value = '';
    }
    const chatBox = document.getElementById('chat-panel-box');
    const bubble = document.createElement('div');
    bubble.className = `chat-panel-bubble ${side}`;
    bubble.textContent = content;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}

/*function getJsonPanelFile() {
    return jsonContentChatPanel;
}*/

function updateChatPanel() {
    var lastIndex = tokensJsonHistory.length - 1;
    for(let i = indexNumberLastUpdate + 1; i <= lastIndex; i = i+1  ){
        appendToChatPanel(tokensJsonHistory[i]);
    }
    indexNumberLastUpdate = lastIndex
     
}

async function appendToChatPanel(jsonToken) {
   
    
           
    if(jsonToken.type === 'TEXT') {
        addToChatBubble(jsonToken.value, 'sent');
         
    }else if(jsonToken.type === 'IMAGE'){
        displayImage(jsonToken.value);
    }else if(jsonToken.type === 'VOICE'){
         
    }
    else {
         
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
         
         const resultCalculation = makeCalculation(sharedArray);       
         
         if(resultCalculation.type === 'OK') {            
            addToChatBubble(resultCalculation.value, 'sent');
            await textToSpeech(resultCalculation.value);
            sharedArray.length = 0;  
         }else {
            addToChatBubble('there is an error in calculation', 'sent');
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

function clearChat() {
     
    const chatHistory = document.getElementById('chat-panel-box');
    chatHistory.innerHTML = "";

     
    tokensJsonHistory.length = 0;
     
    indexNumberLastUpdate = -1;
     
    jsonContentChatPanel.length = 0;
     
}

function savedVoiceTokenCommand() {
    const voiceToken = getVoiceInput();
       if(voiceToken && isRecording()) {          
            displayTextArea(voiceToken.value);    
        }
}

 
function displayTextArea(voiceString) {
    document.getElementById('chat-panel-input').value = voiceString;
}