 
var isDrawing = false, drawingEnabled = false;
var drawButton = null;
 
var base64Image = null;
const base64ImageReadyEvent = new Event('base64ImageReady');  
 
 
var canvas = null, context = null;
var width = 0, height = 0;
const plotGraphEvent = new Event('plotGraph');   
 
var limitsString = '';
var limitsArray = [];
 



export function initCanvas() {
    canvas = document.getElementById('graph-canvas');
    context = canvas.getContext('2d');
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    document.getElementById('plot-graph').addEventListener('click', triggerPlotGraphEvent);
    document.getElementById('clear-graph').addEventListener('click', clearCanvas);
    document.getElementById('save-canvas').addEventListener('click', saveCanvas);
    document.getElementById('load-image').addEventListener('click', () => {    
        document.getElementById('imageLoader').click();
    });
    
    document.getElementById('imageLoader').addEventListener('change', loadImage);  
    drawButton = document.getElementById('free-draw');
    drawButton.addEventListener('click', () => {
        drawingEnabled = !drawingEnabled;
        drawButton.textContent = drawingEnabled ? '🔓Draw' : 'Draw';
         
        context.strokeStyle = 'blue';  
        context.lineWidth = 2;         
        context.lineCap = 'round';     
         
        canvas.addEventListener('mousedown', (e) => {
            if (!drawingEnabled) return;
            isDrawing = true;
            const { offsetX, offsetY } = e;
            context.beginPath();
            context.moveTo(offsetX, offsetY);  
        });

        canvas.addEventListener('mousemove', (e) => {
            if (!isDrawing || !drawingEnabled) return;
            const { offsetX, offsetY } = e;
            context.lineTo(offsetX, offsetY);  
            context.stroke();
        });

        canvas.addEventListener('mouseup', () => {
            if (!drawingEnabled) return;
            isDrawing = false;
        });

        canvas.addEventListener('mouseleave', () => {
            if (!drawingEnabled) return;
            isDrawing = false;  
        });
    });

     
    document.getElementById("graph-input").addEventListener("input", function(event) {
        let inputField = event.target;
        let value = inputField.value;
        
         
        let parts = value.split(",");

         
        if (parts.length > 4) {
            inputField.value = parts.slice(0, 4).join(",");
            return;
        }

         
        if (value.endsWith(",")) {
            let lastNumber = parts[parts.length - 2];  

            if (lastNumber !== undefined && !/^-?\d+(\.\d+)?$/.test(lastNumber)) {
                 
                inputField.value = parts.slice(0, -1).join(",");
                
                 
                inputField.setSelectionRange(inputField.value.length, inputField.value.length);
                inputField.focus();
            }
        }
    });

     
    document.getElementById("graph-sendbutton").addEventListener("click", function() {
        let inputField = document.getElementById("graph-input");
        let value = inputField.value.trim();
        let parts = value.split(",");

         
        if (parts.length !== 4 || parts.includes("")) {
             
            return;
        }

         
        for (let i = 0; i < parts.length; i++) {
            if (!/^-?\d+(\.\d+)?$/.test(parts[i])) {
                 
                let startPos = value.indexOf(parts[i]);
                inputField.setSelectionRange(startPos, startPos + parts[i].length);
                inputField.focus();
                return;
            }
        }

        limitsString = value;  
        let Numbers = limitsString.split(',');
        limitsArray[0] = Math.min(parseFloat(Numbers[0]),parseFloat(Numbers[1]));
        limitsArray[1] = Math.max(parseFloat(Numbers[0]),parseFloat(Numbers[1]));
        limitsArray[2] = Math.min(parseFloat(Numbers[2]),parseFloat(Numbers[3]));
        limitsArray[3] = Math.max(parseFloat(Numbers[2]),parseFloat(Numbers[3]));
        document.dispatchEvent(plotGraphEvent);
         
    });

        
   
}



export function drawAxes(width, height, xMin, xMax, yMin, yMax, xScale, yScale) {
    const typeAxis = { typeX:0, typeY:0};

    if(context) {
        context.beginPath();
        context.strokeStyle = '#000';
        if(xMin <= 0 && xMax >= 0) {
             
            context.moveTo(Math.abs(xMin) * xScale, 0);
            context.lineTo(Math.abs(xMin) * xScale, height);
             
            typeAxis.typeY = 1;

        }else {
            typeAxis.typeY = 2;
             
        }
        if(yMin <= 0 && yMax >= 0) {
             
            context.moveTo(0, Math.abs(yMax) * yScale);
            context.lineTo(width, Math.abs(yMax) * yScale);
             
            typeAxis.typeX = 1;
        }else {
             
            typeAxis.typeX = 2;
        }
        context.stroke();
    }  
    return typeAxis;
}

export function drawGraphCartesian(arrayOfPoints, xMin, xMax, yMin, yMax) {
     
    

     
    context.clearRect(0, 0, width, height);

     
    let xScale = Math.floor(width / Math.abs(xMax - xMin));
    let yScale = Math.floor(height / Math.abs(yMax - yMin));
    xScale = (xScale > 10) ? xScale : 10;
    yScale = (yScale > 10) ? yScale : 10;
    let typeAxis = null,
    newNumberGap = 0,
    newAdditional = 0;

    

     
     
    if(xScale > yScale) {
        xScale = yScale;
        newNumberGap = width / xScale;
        newAdditional = (newNumberGap - (xMax - xMin)) /2;       
        xMin = Math.floor(xMin - newAdditional);        
        xMax = Math.floor(xMax + newAdditional);
        
    }else {
        yScale = xScale;
        newNumberGap = height / yScale;
        newAdditional = (newNumberGap - (yMax - yMin)) /2;
        yMin = Math.floor(yMin - newAdditional);
        yMax = Math.floor(yMax + newAdditional);        
    }
    

     
    drawMesh(width, height,xScale, yScale, xMin, xMax, yMin, yMax);
    typeAxis = drawAxes(width, height, xMin, xMax, yMin, yMax, xScale, yScale);
    drawLabels(xScale, yScale, xMin, xMax, yMin, yMax, typeAxis.typeX, typeAxis.typeY);
    plotEquationCartesian(arrayOfPoints, xScale, yScale, xMin, xMax, yMin, yMax);
    
}




function drawMesh(width, height, xScale, yScale, xMin, xMax, yMin, yMax) {
    context.beginPath();
    context.strokeStyle = 'rgba(0, 0, 0, 0.6)';  

     
    for (let x = xMin; x <= xMax; x++) {        
        context.moveTo(Math.abs(x - xMin) * xScale, 0);
        context.lineTo(Math.abs(x - xMin) * xScale, height);
    }

     
    for (let y = yMin; y <= yMax; y++) {
        context.moveTo(0, Math.abs(y - yMin) * yScale);
        context.lineTo(width, Math.abs(y - yMin) * yScale);
    }

    context.stroke();
}



function drawLabels(xScale, yScale, xMin, xMax, yMin, yMax, typeX, typeY) {
    context.fillStyle = '#000';
    context.font = '10px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

     
    if(typeY === 1) {
        for (let y = yMin; y <= yMax; y++) {
            if (y !== 0) {
                context.fillText(y, Math.abs(xMin) * xScale + 10, Math.abs(yMax - y) * yScale);
            }
        }    
    }else {
        for (let y = yMin; y <= yMax; y++) {
            if (y !== 0) {
                context.fillText(y, 10, Math.abs(yMax - y) * yScale);
            }
        }    
    }
    
     
    if(typeX === 1) {
        for (let x = xMin; x <= xMax; x++) {
            if (x !== 0) {
                context.fillText(x, Math.abs(xMin - x) * xScale, Math.abs(yMax) * yScale + 10);
            }
        }
    }else {
        for (let x = xMin; x <= xMax; x++) {
            if (x !== 0) {
                context.fillText(x, Math.abs(xMin - x) * xScale, 10);
            }
        }
    }
    
}

function plotEquationCartesian(points, xScale, yScale, xMin, xMax, yMin, yMax) {
     
    
     
    context.strokeStyle = '#ff0';
    const numberOfPoints = points.length;
    let x = 0,
    y = 0;

    for (let index = 0; index < numberOfPoints; index = index + 2) {
        
        x = Math.min(Math.abs(xMin - points[index]), Math.abs(points[index] - xMin)) * xScale;
         
        if(points[index+1] > yMin && points[index+1] < yMax) {
            y = Math.max(Math.abs(yMax - points[index+1]), Math.abs(points[index+1] - yMax) * yScale);
             
            context.fillRect(x,y,5,5);
             
        }
    }
    
}


//////////////////////////////////////////////////////////////////////

export function drawGraphPolar(rMax, points) {
    const rMaxDiagonal = 1.4142* rMax
     
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(centerX, centerY);

     
    const rScale = maxRadius / rMax;

     
    context.clearRect(0, 0, width, height);

    drawPolarCoordinateSystem(width, height, rMaxDiagonal, maxRadius, rScale, centerX, centerY);

     
    drawPolarLabels(rMax, rScale, centerX, centerY, maxRadius);

     
    plotEquationPolar(points, centerX, centerY, rMax, rScale);
}

function drawPolarCoordinateSystem(width, height, rMaxDiagonal, maxRadius, rScale, centerX, centerY, angleStep = Math.PI/12) {
    
     
     
    context.strokeStyle = '#ccc';  
    context.lineWidth = 1;
    for (let r = 0; r <= rMaxDiagonal; r++) {
        const radius = r * rScale;
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
    }

     
    for (let angle = 0; angle < 2 * Math.PI; angle += angleStep) {
        const xEnd = centerX + Math.cos(angle) * maxRadius;
        const yEnd = centerY - Math.sin(angle) * maxRadius;
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(xEnd, yEnd);
        context.stroke();
    }

     
    context.strokeStyle = '#000';  
    context.lineWidth = 2;
     
    context.beginPath();
    context.moveTo(0, centerY);
    context.lineTo(width, centerY);
    context.stroke();
     
    context.beginPath();
    context.moveTo(centerX, 0);
    context.lineTo(centerX, height);
    context.stroke();
    
}

function drawPolarLabels(rMax, rScale, centerX, centerY, maxRadius) {
     
      
     context.fillStyle = '#000';  
     context.font = '12px Arial';
     context.textAlign = 'center';
     context.textBaseline = 'middle';
 
      
     for (let r = 1; r <= rMax; r++) {
         const radius = r * rScale;
         context.fillText(r, centerX + radius + 10, centerY);
     }
 
      
     const angleLabels = [
         '0', 'π/6', 'π/3', 'π/2', '2π/3', '5π/6', 'π',
         '7π/6', '4π/3', '3π/2', '5π/3', '11π/6'
     ];
     for (let i = 0; i < angleLabels.length; i++) {
         const angle = i * (Math.PI / 6);
         const xLabel = centerX + Math.cos(angle) * (maxRadius + 20);
         const yLabel = centerY - Math.sin(angle) * (maxRadius + 20);
         context.fillText(angleLabels[i], xLabel, yLabel);
     }
}

function plotEquationPolar(points, centerX, centerY, rMax, rScale) {
     
    context.fillStyle = '#f00';  
    
    const numberOfPoints = points.length;
    let x = 0,
    y = 0;

    for (let index = 0; index < numberOfPoints; index = index + 2) {
        if(points[index+1] < rMax && points[index+1] > -rMax) {
            x = centerX + points[index+1] * Math.cos(points[index]) * rScale;
            y = centerY - points[index+1] * Math.sin(points[index]) * rScale;
             
        
            context.fillRect(x,y,5,5);;  
        
        }    
        
    }
    
}

function triggerPlotGraphEvent(event) {
    document.dispatchEvent(plotGraphEvent);
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function loadImage(event){
    const file = event.target.files[0];  
            if (file) {
                const img = new Image();  
                img.onload = () => {
                     
                     
                     
                     
                    const imgAspect = img.width / img.height;
                     
                    let drawWidth, drawHeight, offsetX, offsetY;
                     

                    if (imgAspect * canvas.height > canvas.width) {
                         
                        drawWidth = canvas.width;
                         
                        drawHeight = drawWidth / imgAspect;
                         
                        offsetX = 0;
                         
                        offsetY = (canvas.height - drawHeight) / 2;
                    } else {
                         
                        drawHeight = canvas.height;
                         
                        drawWidth = canvas.height * imgAspect;
                         
                        offsetX = (canvas.width - drawWidth) / 2;
                         
                        offsetY = 0;
                    }

                     
                    context.clearRect(0, 0, canvas.width, canvas.height);

                     
                    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                };

                 
                img.src = URL.createObjectURL(file);
            }
}

function saveCanvas() {
     
    base64Image = canvas.toDataURL('image/png');

     
     
    if(base64Image) {
        document.dispatchEvent(base64ImageReadyEvent);
    }
    
    

}

export function getBase64Image() {
    return base64Image;
}

 
export function getLimitsArray() {
    return limitsArray;
}