 
const userLanguage = navigator.language || 'en-US';  


 
export function textToSpeech(text) {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = userLanguage;

        let speechStarted = false;

         
        utterance.onstart = () => {
            speechStarted = true;
             
        };

         
        utterance.onend = () => {
             
            resolve();  
        };

         
        utterance.onerror = (event) => {
            console.error('Speech synthesis error:');            
            resolve();  
        };

         
        try {
            synth.speak(utterance);
        } catch (error) {
            console.error('Speech synthesis failed to start:', error);            
            resolve();  
        }

         
        setTimeout(() => {
            if (!speechStarted) {
                console.warn('Speech did not start. Falling back to default behavior.');                
                resolve();  
            }
        }, 2000);  
    });
}

export function isSingleWord(str) {
    return /^[^\s]+$/.test(str);   
}