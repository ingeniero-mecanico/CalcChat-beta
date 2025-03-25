
var chunkSize = 4;


export function loadFunctions(functionsData) {
    
    const functionsContainer = document.querySelector(".functions-container");

     
    functionsContainer.innerHTML = '';

     
     

    for (let index = 0; index < functionsData.length; index += chunkSize) {
         
        
             
            const functionDiv = document.createElement('div');
            functionDiv.classList.add('function-item');

             
            const functionAnchor = document.createElement('a');
            
            functionAnchor.textContent = functionsData[index];
             
            
             
            functionDiv.addEventListener('click', (event) => {
                event.preventDefault();  
                 
               
                const customEvent = new CustomEvent('functionNameClick', {
                    detail: {
                        functionName: functionAnchor.textContent
                    }
                });
                document.dispatchEvent(customEvent);
            });

             
            const descriptionParagraph = document.createElement('p');
            descriptionParagraph.textContent = functionsData[index + 3];

             
            functionDiv.appendChild(functionAnchor);
            functionDiv.appendChild(descriptionParagraph);

             
            functionsContainer.appendChild(functionDiv);
    }
}
