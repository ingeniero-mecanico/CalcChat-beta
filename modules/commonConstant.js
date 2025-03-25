 
export const InterpretResult = Object.freeze({ 
    INTERPRET_OK:0,
    INTERPRET_COMPILE_ERROR:1,
    INTERPRET_RUNTIME_ERROR:2,
});

 
export const OpCode = Object.freeze({ 
    OP_CONSTANT: 0,
    OP_VARIABLE: 1,
    OP_NIL:2,
    OP_TRUE:3,
    OP_FALSE:4,
    OP_EQUAL:5,
    OP_GREATER:6,
    OP_LESS:7,
    OP_ADD:8,
    OP_SUBTRACT:9,
    OP_MULTIPLY:10,
    OP_DIVIDE:11,
    OP_NOT:12,
    OP_NEGATE:13,
    OP_DEFINE_GLOBAL:14,
    OP_GET_GLOBAL:15,
    OP_SET_GLOBAL:16,
    OP_GET_LOCAL:17,
    OP_SET_LOCAL:18,
    OP_PRINT:19,
    OP_POP:20,
    OP_JUMP_IF_FALSE:21,
    OP_JUMP: 22,
    OP_LOOP:23,
    OP_CALL:24,
    OP_RETURN:25,
    OP_POW:26,
    OP_STORE:27,
    OP_DELETE_LAST:28
});

export class KeyToken {     
    constructor(type = 'NUMBER', value = ''){
        this.type = type;    
        this.value = value;  
    }
    get tokenType() {
        return this.type;
    }
    set tokenType(type) {
        this.type = type;
    }
    get tokenValue(){
        return this.value;
    }
    set tokenValue(value) {
        this.value = value;
    }
    toString() {
        return this.value;
    }
}

export class SingleElementStorage {
    constructor() {
        this.value = null;  
    }

    push(element) {
        this.value = element;  
    }

    get() {
        return this.value;  
    }
}