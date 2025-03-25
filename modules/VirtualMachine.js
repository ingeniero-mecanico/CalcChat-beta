import { InterpretResult, OpCode } from "./commonConstant.js";
import { compile, ObjFunction } from "./compiler.js";
import * as mathNative from "./mathNativeModule.js";
 

 
const STACK_MAX = 256;

 
class NativeFunction {
    constructor(scriptFunction = Function(), name = '', arity = 0) {     
         this.scriptFunction = scriptFunction;  
         this.name = name;  
         this.arity = arity;  
    } 
 }

  
class CallFrame {
    constructor() {
        this.objfunction = null;  
        this.ip = 0;  
        this.slots = null;   
        this.slotBase = 0;   
    }
}


 
export class VM {
    constructor(frames = [], stack =  [], arrayResults = [], epsilon = 0.00001){
        this.frames = frames;    
        this.frameCount = 0;  
        this.stack = stack;  
        this.stackTop = 0;  
        this.globals = new Map();  
        this.epsilon = epsilon;  
        this.result = '';  
        this.arrayResults = arrayResults;
    }

     
    reset() {
        this.frames.length = 0;
        this.frameCount = 0;
        this.stack.length = 0;
        this.stackTop = 0;
        this.result = '';
         
    }
    
     
    push(value) {
        this.stack[this.stackTop] = value;
        this.stackTop++;
    }
     
    pop() {
        this.stackTop--;
        return this.stack[this.stackTop];
    }

     
    valuesEqual(a,b) {        
        if (Math.abs(a - b) < this.epsilon){
            return 1;
        }else {
            return 0;
        }
    }

     
    valueGreater(a, b) {        
        if(this.valuesEqual(a,b) !== 1) {
            if(a > b) {
                return 1;
            }
        }
        return 0;
    }

     
    valueLess(a, b) {        
        if(this.valuesEqual(a,b)!== 1) {
            if(a < b) {
                return 1;
            }
        }
        return 0;
    }

     
    interpret(source) {
         
        const oFunction = compile(source);  
         
        if(oFunction === null) return InterpretResult.INTERPRET_COMPILE_ERROR;  
        this.push(oFunction.name);   
        
        this.callValue(oFunction, 0);    
        return this.run();   
    }

     
    peek(distance = 0) {
        return this.stack[this.stackTop-1-distance];
    }

     
    callValue(callee, argCount) {        
        
        if(callee  instanceof ObjFunction) {            
            return this.call(callee, argCount);

        }else if(callee instanceof NativeFunction){
            if(callee.arity === argCount) {
                const result = callee.scriptFunction(argCount, this.stack.slice(this.stackTop-argCount, this.stackTop));
                this.stackTop -= argCount + 1;
                this.push(result);                
                return true;
            }
            
        } else {
             
        }
        return false;
    }

     
    call(objfunction, argCount) {
        if(argCount !== objfunction.arity) {  
             
            return false;
        }
        if(this.frames.length === STACK_MAX) {  
             
            return false;
        }
        const frame = this.frames[this.frameCount++] = new CallFrame();  
        frame.objfunction = objfunction;     
        frame.ip = 0;  
        frame.slots = this.stack;  
        frame.slotBase = this.stack.length - argCount - 1;   
         
        return true;
    }

     
    defineNative(name, nativeFn, arity) {
        const native = new NativeFunction(nativeFn, name, arity);  
        this.globals.set(name, native);  
    }

     
    printValue(value) {
        this.result = value;
         
    }

    storeInArrayResults(value) {
        this.arrayResults.push(value);
    }

     
     
    init(arrayProperties, mapOfFunctionParameters, userFunctions){        
        
        const items = 4;
        for ( let index = 0; index < arrayProperties.length; index += items){
            this.defineNative(arrayProperties[index], mathNative[arrayProperties[index + 1]], arrayProperties[index + 2]);

             
             
          
           if(arrayProperties[index] !== arrayProperties[index + 1]) {  
                if(arrayProperties[index +3] === '') {
                    mapOfFunctionParameters.set(arrayProperties[index], '' );
                }else {
                    mapOfFunctionParameters.set(arrayProperties[index], arrayProperties[index + 3].split(','));
                }                
            }           
        }
        if(userFunctions.length > 0) {
            userFunctions.forEach(f => {
                mapOfFunctionParameters.set(f.funcionObj.name, f.parametersArray);
                this.globals.set(f.funcionObj.name, new ObjFunction(f.funcionObj.arity, f.funcionObj.chunk,f.funcionObj.name));
                 
            });
        }
         
        this.globals.set('𝑿',1);
         
    }
    
    
     
    run() {
        let a,b, instruction, frame = this.frames[this.frameCount - 1];  
         
         
        for (;;) {   
            
            switch (instruction = frame.objfunction.chunk.code[frame.ip++]) {    
                case OpCode.OP_CONSTANT:     
                    const constant = frame.objfunction.chunk.arrayNumberTable[frame.objfunction.chunk.code[frame.ip++]];                    
                    this.push(constant);     
                    break;
                
                case OpCode.OP_GET_LOCAL:    
                    const slot = frame.objfunction.chunk.code[frame.ip++];   
                    this.push(frame.slots[frame.slotBase + slot]);   
                    break;
                case OpCode.OP_SET_LOCAL:    
                 
                    const slot1 = frame.objfunction.chunk.code[frame.ip++];  
                    frame.slots[frame.slotBase +slot1] = this.peek(0);   
                    break;
                case OpCode.OP_DEFINE_GLOBAL:    
                    const name = frame.objfunction.chunk.arrayNumberTable[frame.objfunction.chunk.code[frame.ip++]]; 
                    this.globals.set(name, this.peek(0));    
                     
                    this.pop();
                    break;
                case OpCode.OP_GET_GLOBAL:   
                    const name1 = frame.objfunction.chunk.arrayNumberTable[frame.objfunction.chunk.code[frame.ip++]]; 
                    const value = this.globals.get(name1);   
                    if(value !== undefined) {    
                        this.push(value);
                    }                    
                    break;
                case OpCode.OP_SET_GLOBAL:   
                    const name2 = frame.objfunction.chunk.arrayNumberTable[frame.objfunction.chunk.code[frame.ip++]]; 
                    this.globals.set(name2, this.peek(0));   
                    break;
                case OpCode.OP_NIL:  
                    this.push(0);
                    break;
                case OpCode.OP_TRUE:     
                    this.push(1);
                    break;
                case OpCode.OP_FALSE:    
                    this.push(0);
                    break;
                case OpCode.OP_EQUAL:    
                    b = this.pop();
                    a = this.pop();
                    this.push(this.valuesEqual(a,b));
                    break;
                case OpCode.OP_GREATER:  
                    b = this.pop();
                    a = this.pop();
                    this.push(this.valueGreater(a,b)); 
                    break;                  
                case OpCode.OP_LESS:     
                    b = this.pop();
                    a = this.pop();
                    this.push(this.valueLess(a,b));
                    break;  
                case OpCode.OP_ADD:  
                    b = this.pop();
                    a = this.pop();
                    this.push(a + b);
                    break;
                case OpCode.OP_SUBTRACT:     
                    b = this.pop();
                    a = this.pop();
                    this.push(a - b);
                    break;
                case OpCode.OP_MULTIPLY:     
                    b = this.pop();
                    a = this.pop();
                    this.push(a * b);
                    break;
                case OpCode.OP_DIVIDE:   
                    b = this.pop();
                    a = this.pop();
                    if(b !== 0){     
                    this.push(a / b);}
                    break;
                case OpCode.OP_POW:  
                    b = this.pop();
                    a = this.pop();
                    this.push(a ** b);
                    break;
                case OpCode.OP_NOT:  
                    let boolValue = this.pop();
                    if(boolValue === 1) {
                        boolValue = 0;
                    } else {
                        boolValue = 1;
                    } 
                    this.push(boolValue);
                    break;
                case OpCode.OP_NEGATE:   
                    this.push(-this.pop());
                    break;
                case OpCode.OP_POP:  
                    this.pop();
                    break;
                case OpCode.OP_JUMP_IF_FALSE:    
                     
                    const offset = frame.objfunction.chunk.code[frame.ip++];                    
                    if(this.peek(0) === 0) {
                        frame.ip += offset;
                    }
                    break;
                case OpCode.OP_JUMP:     
                    const offset1 = frame.objfunction.chunk.code[frame.ip++];
                    frame.ip += offset1;
                    break;
                case OpCode.OP_LOOP:     
                    const offset2 = frame.objfunction.chunk.code[frame.ip++];
                    frame.ip -= offset2;
                    break;
                case OpCode.OP_CALL:     
                    const argCount = frame.objfunction.chunk.code[frame.ip++];   
                     
                    if(!this.callValue(this.peek(argCount), argCount)) {     
                         
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;  
                    }
                    frame = this.frames[this.frameCount - 1];    
                    break;
                case OpCode.OP_PRINT:    
                    this.printValue(this.pop());
                    break;
                case OpCode.OP_STORE:    
                    this.storeInArrayResults(this.peek(0));
                    break;
                case OpCode.OP_DELETE_LAST:  
                    this.arrayResults.pop();                   
                    break;
                case OpCode.OP_RETURN:   
                    const result = this.pop();
                    this.frameCount--;
                    if(this.frameCount === 0) {
                        this.pop();  
                        return InterpretResult.INTERPRET_OK;
                    }
                    this.stackTop = frame.slotBase; 
                    this.push(result);  

                    frame = this.frames[this.frameCount - 1];    
                    break;                                  
            }
        }
    }
}
