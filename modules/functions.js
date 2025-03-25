

 
function showTab(tab) {
    if (tab === 'functions') {
        loadFunctions();  
    }
     
}

const functionsData = [
    {"name": "sin", "description": "Sine function"},
    {"name": "cos", "description": "Cosine function"},
    {"name": "tan", "description": "Tangent function"},
    {"name": "log", "description": "Logarithm function"},
    {"name": "sqrt", "description": "Square root function"}
];

function loadFunctions() {
    const functionsContainer = document.querySelector(".functions-container");

     
    functionsContainer.innerHTML = '';

     
    functionsData.forEach(func => {
         
        const functionDiv = document.createElement('div');
        functionDiv.classList.add('function-item');

         
        functionDiv.innerHTML = `<h3>${func.name}</h3><p>${func.description}</p>`;

         
        functionsContainer.appendChild(functionDiv);
    });
}

