const jsonFileLoadedEvent = new Event('jsonLoaded');  
var jsonContent = null;

 
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

 
export function  waitForUserInput() {
    return new Promise(resolve => {
        function handleUserInput() {
            const messageInput = document.getElementById('message-input');
            const messageText = messageInput.value;
            
            if (!isNaN(messageText) && messageText.trim() !== '') {
                resolve(messageText);
                document.getElementById('chat-send-button').removeEventListener('click', handleUserInput);
            } else {
                textToSpeech('Please enter a valid number.');
            }
        }

        document.getElementById('chat-send-button').addEventListener('click', handleUserInput);
    });
}


//////////////////////////////////////////////////////
 
 
 
function handleJsonUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                jsonContent = JSON.parse(e.target.result);
                if (Array.isArray(jsonContent)) {                    
                     
                    document.dispatchEvent(jsonFileLoadedEvent);     
                    
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

 
export function addToChatBubble(content, side) {
    if(side === 'received') {
        const messageInput = document.getElementById('message-input');
         
        messageInput.value = '';
    }
    const chatBox = document.getElementById('chat-box');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${side}`;
    bubble.textContent = content;
    chatBox.appendChild(bubble);
    chatBox.scrollTop = chatBox.scrollHeight;
}

export function getJsonArray() {
    return jsonContent;
}
