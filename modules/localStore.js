 
export const FunctionManager = {
    functions: [],

     
    addFunction(completeFunction) {
        this.functions.push(completeFunction);
        this.saveFunctionsToStorage();
    },

     
    saveFunctionsToStorage() {
        const serializedFunctions = JSON.stringify(this.functions);
        localStorage.setItem('userFunctions', serializedFunctions);
         
    },

     
    loadFunctionsFromStorage() {
        const serializedFunctions = localStorage.getItem('userFunctions');
        if (serializedFunctions) {
            try {
                const parsedFunctions = JSON.parse(serializedFunctions);
                this.functions = parsedFunctions
                 
            } catch (error) {
                console.error('Error loading functions:', error.message);
                this.functions = [];
            }
        } else {
             
        }
    },

     
    getFunctions() {
        return this.functions;
    },

     
    resetFunctions() {
        this.functions.length = 0;
    },

    saveRecordToFile(tokens) {
    const jsonContent = JSON.stringify(tokens, null, 2);  
    const blob = new Blob([jsonContent], { type: 'application/json' });  
    const url = URL.createObjectURL(blob);  

     
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calculator_tokens.json';  
    document.body.appendChild(a);
    a.click();  
    document.body.removeChild(a);  
    }
};



