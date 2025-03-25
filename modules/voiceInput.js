 
const userLanguage = navigator.language || 'en-US';  
 

var isRecording = false;  
const voiceInput = {
    value:'',
    type: 'VOICE',
};
var recognition, completeTranscript = '', transcriptVoiceReadyEvent = new Event('transcriptVoiceReady');  

 
export function recordVoice() {
    if (isRecording) {
         
        recognition.stop();
        isRecording = false;
         
          
         
    } else {
         
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = userLanguage;  
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;  

        recognition.start();
        isRecording = true;
         
         

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            completeTranscript = completeTranscript + transcript;
             

            
        };

        recognition.onerror = (event) => {
            console.error('Error during speech recognition:', event.error);
        };

        recognition.onend = () => {
             
            if (isRecording) {
                 
                 
                 
                recognition.start();  
            }else {
                voiceInput.value = completeTranscript; 
                document.dispatchEvent(transcriptVoiceReadyEvent);
                 
            }
            
        };
    }

}

export function getVoiceInput() {
    return voiceInput;
}

export function resetVoiceInputModule() {
    completeTranscript = '';
}

