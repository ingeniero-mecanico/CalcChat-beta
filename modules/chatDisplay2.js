 
export function initChatTab() {
    document.getElementById('load-json-button').addEventListener('click', () => {    
        document.getElementById('json-input').click();
    });
    
    document.getElementById('json-input').addEventListener('change', handleJsonUpload);  
    
}

 
export function displayImage(base64String) {
    const chatContainer = document.getElementById('chat-box');
    const imgElement = document.createElement('img');
    imgElement.src = base64String;
    imgElement.alt = "Image";
    imgElement.style.maxWidth = "100%";
    imgElement.style.borderRadius = "10px";
    imgElement.style.margin = "10px 0";
    chatContainer.appendChild(imgElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;  
}

 
var arrayCalculationtokens = [];


   


 
function sendMessage() {
    const messageInput = document.getElementById('message-input');
    
     
    const messageText = parseFloat(messageInput.value);

    if (messageText.trim() === '') return;

    const chatBox = document.getElementById('chat-box');
    const newMessage = document.createElement('div');
    newMessage.classList.add('chat-bubble', 'sent');
    newMessage.textContent = messageText;

    chatBox.appendChild(newMessage);

     
    messageInput.value = '';

     
    chatBox.scrollTop = chatBox.scrollHeight;

     
    textToSpeech(messageText);
     
}

 
function textToSpeech(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';  
    utterance.voice = synth.getVoices().find(voice => voice.lang === 'es-ES');
    synth.speak(utterance);
}

 
async function appendToChat(tokens) {
     
    for( let i = 0; i < tokens.length; i++) {        
        if(tokens[i].type === 'TEXT') {
            appendText(tokens[i].value);
        }else if(tokens[i].type === 'IMAGE'){
            displayImage(tokens[i].value);
        }
        else {
            await appendCalculation(tokens[i]);
        }
    }
}

 
export function appendText(message) {
    

    const chatBox = document.getElementById('chat-box');
    const newMessage = document.createElement('div');
    newMessage.classList.add('chat-bubble', 'sent');
    newMessage.textContent = message;

    chatBox.appendChild(newMessage);

     
     

     
    chatBox.scrollTop = chatBox.scrollHeight;

     
    textToSpeech(message);
}

 
 
async function appendCalculation(token) {
     
    if(token.type === 'FIN') {
        const chatBox = document.getElementById('chat-box');
        const newMessage = document.createElement('div');
        newMessage.classList.add('chat-bubble', 'sent');        
        newMessage.textContent = arrayCalculationtokens.map(Element=>Element.value).join('');
        chatBox.appendChild(newMessage);
         

     
     

     
        chatBox.scrollTop = chatBox.scrollHeight;

     
         
        
        arrayCalculationtokens.push(token);
         
         
        const vm = new VM();
         
        vm.interpret(arrayCalculationtokens);
        appendText(vm.result);
        
      
    }else if(token.type === 'PARAMETER') {
         
         
               
        token.value = await waitForUserInput();
        token.type = 'NUMBER';
        arrayCalculationtokens.push(token);
         
         
        console.log(...arrayCalculationtokens)
     
    }else {
         
        arrayCalculationtokens.push(token);
    }
}

 
function  waitForUserInput() {
    return new Promise(resolve => {
        function handleUserInput() {
            const messageInput = document.getElementById('message-input');
            const messageText = messageInput.value;
            
            if (!isNaN(messageText) && messageText.trim() !== '') {
                resolve(messageText);
                document.getElementById('send-button').removeEventListener('click', handleUserInput);
            } else {
                textToSpeech('Please enter a valid number.');
            }
        }

        document.getElementById('send-button').addEventListener('click', handleUserInput);
    });
}
 

//////////////////////////////////////////////////////
 
 
 
function handleJsonUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonContent = JSON.parse(e.target.result);
                if (Array.isArray(jsonContent)) {
                    
                     
                    appendToChat(jsonContent);   
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

 
function addToChatBubble(content) {
    const chatBox = document.getElementById('chat-box');
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble received';
    bubble.textContent = content;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}


 
    

