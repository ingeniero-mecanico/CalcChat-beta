import { OpCode } from "./commonConstant.js";

 
export class Token {
    constructor(type, value){
        this.type = type;    
        this.value = value;  
         
    }
}

 
class Parser {
    constructor(previous = new Token(TokenType.TOKEN_EOF,'FIN'), current = new Token(TokenType.TOKEN_EOF, 'FIN')) {
        this.previous = previous;    
        this.current = current;      
    }
    
}

 
class Chunk {
    constructor(code = [], arrayNumberTable = []){
        this.code = code;    
        this.arrayNumberTable = arrayNumberTable;    
         
    }
       
}

 
export class CompleteFunctionObject {
    constructor(funcionObj = new ObjFunction(), parametersArray = []){
        this.funcionObj = funcionObj;
        this.parametersArray = parametersArray;
    }
}

 
export class ObjFunction {
    constructor(arity = 0, chunk = new Chunk(), name = '') {
        this.arity = arity;  
        this.chunk = chunk;  
        this.name = name;    
    }
}

 
class ParseRule {
    constructor(prefix, infix, precedence) {
        this.prefix = prefix;    
        this.infix = infix;  
        this.precedence = precedence;    
    }
}

 
const FunctionType = Object.freeze({     
    TYPE_FUNCTION:0,     
    TYPE_SCRIPT:1,  
});

 
const Precedence = Object.freeze({   
    PREC_NONE:0,     
    PREC_ASSIGNMENT:1,  
    PREC_OR:2,  
    PREC_AND:3,  
    PREC_EQUALITY:4,  
    PREC_COMPARISON:5,  
    PREC_TERM:6,  
    PREC_FACTOR:7,  
    PREC_EXPONENT:8, 
    PREC_UNARY:9,  
    PREC_CALL:10,  
    PREC_PRIMARY:11,
});

 
export const TokenType = Object.freeze({    
    TOKEN_LEFT_PAREN: '(',   
    TOKEN_RIGHT_PAREN: ')',
    TOKEN_LEFT_BRACE: '{',
    TOKEN_RIGHT_BRACE: '}',
    TOKEN_MINUS:'-',
    TOKEN_PLUS: '+',
    TOKEN_SLASH:'÷',
    TOKEN_STAR: '*',
    TOKEN_NUMBER:'NUMBER',
    TOKEN_IDENTIFIER: 'IDENTIFIER',
    TOKEN_VARIABLE: 'VARIABLE',
    TOKEN_LOCAL:'LOCAL',
    TOKEN_NIL: 'NIL',
    TOKEN_TRUE: 'TRUE',
    TOKEN_FALSE: 'FALSE',
    TOKEN_AND: 'and',
    TOKEN_OR: 'or',
    TOKEN_BANG: '!',
    TOKEN_EQUAL: '=',
    TOKEN_STORE_EQUAL: ':=',
    TOKEN_BANG_EQUAL:'!=',
    TOKEN_EQUAL_EQUAL:'==',    
    TOKEN_GREATER: '>',
    TOKEN_GREATER_EQUAL:'>=',
    TOKEN_LESS: '<',
    TOKEN_LESS_EQUAL:'<=',
    TOKEN_PRINT: 'PRINT',
    TOKEN_STORE: 'STORE',
    TOKEN_DELETE_LAST: 'DELETE',
    TOKEN_SEMICOLON: ';',
    TOKEN_VAR: 'var',
    TOKEN_FUN: 'fun',
    TOKEN_IF: 'if',
    TOKEN_ELSE: 'else',
    TOKEN_WHILE: 'while',
    TOKEN_COMA: ',',
    TOKEN_CARET: '^',
    TOKEN_RETURN: 'return',
    TOKEN_EOF:'FIN',
});

 
class Compiler {
    constructor(){
        this.enclosing = null;  
        this.locals = [];  
        this.scope = 0;  
        this.localCount = 0;  
        this.function = null;  
        this.type = 0;  
    }
}

export function resetCompiler() {
    currentIndex = -1;
    current = null;
    parser = new Parser();
}
let currentIndex = -1,   
current = null,  
parser = new Parser(),   
 
rules = new Map(),   
arrayTokens = [];  

 
rules.set(TokenType.TOKEN_IDENTIFIER, new ParseRule(variable, null,Precedence.PREC_NONE));
/*rules.set(TokenType.TOKEN_VARIABLE, new ParseRule(globalVariable, null, Precedence.PREC_PRIMARY));
rules.set(TokenType.TOKEN_LOCAL, new ParseRule(parameters, null, Precedence.PREC_PRIMARY));*/
rules.set(TokenType.TOKEN_CARET, new ParseRule(null, binaryExponent, Precedence.PREC_EXPONENT));
rules.set(TokenType.TOKEN_AND, new ParseRule(null, and, Precedence.PREC_AND));
rules.set(TokenType.TOKEN_OR, new ParseRule(null, or, Precedence.PREC_OR));
rules.set(TokenType.TOKEN_NUMBER, new ParseRule(number, null, Precedence.PREC_PRIMARY));
rules.set(TokenType.TOKEN_LEFT_PAREN, new ParseRule(grouping, call, Precedence.PREC_CALL));
rules.set(TokenType.TOKEN_RIGHT_PAREN, new ParseRule(null, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_MINUS, new ParseRule(unary, binary, Precedence.PREC_TERM));
rules.set(TokenType.TOKEN_PLUS, new ParseRule(null, binary, Precedence.PREC_TERM));
rules.set(TokenType.TOKEN_SLASH, new ParseRule(null, binary, Precedence.PREC_FACTOR));
rules.set(TokenType.TOKEN_STAR, new ParseRule(null, binary, Precedence.PREC_FACTOR));
rules.set(TokenType.TOKEN_EOF, new ParseRule(null, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_FALSE, new ParseRule(literal, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_TRUE, new ParseRule(literal, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_NIL, new ParseRule(literal, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_BANG, new ParseRule(unary, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_EQUAL, new ParseRule(null, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_STORE_EQUAL, new ParseRule(null, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_BANG_EQUAL, new ParseRule(null, binary, Precedence.PREC_EQUALITY));
rules.set(TokenType.TOKEN_EQUAL_EQUAL, new ParseRule(null, binary, Precedence.PREC_EQUALITY));
rules.set(TokenType.TOKEN_GREATER, new ParseRule(null, binary, Precedence.PREC_COMPARISON));
rules.set(TokenType.TOKEN_GREATER_EQUAL, new ParseRule(null, binary, Precedence.PREC_COMPARISON));
rules.set(TokenType.TOKEN_LESS, new ParseRule(null, binary, Precedence.PREC_COMPARISON));
rules.set(TokenType.TOKEN_LESS_EQUAL, new ParseRule(null, binary, Precedence.PREC_COMPARISON));
rules.set(TokenType.TOKEN_COMA, new ParseRule(null, null, Precedence.PREC_NONE));
rules.set(TokenType.TOKEN_SEMICOLON, new ParseRule(null,null,Precedence.PREC_NONE));

 

 
function getRule(type) {     
    return rules.get(type);  
}

 
function scanToken() {
    return arrayTokens[++currentIndex];  
}

 
function currentChunk() {
    return current.function.chunk;   
}

 
function consume(tokenType) {    
    if (parser.current.type === tokenType) {
        advance();       
    }
}

 
function advance() {
    parser.previous = parser.current;    
    parser.current = scanToken();    
}

 
function check(type) {   
     
    return parser.current.type === type;     
}

 
 
function match(type) {   
    if(!check(type)) return false;   
    advance();   
    return true;     
}

 
function identifierEqual(name1, name2) {     
    return name1 === name2;  
}

 
function expression() { 
    parsePrecedence(Precedence.PREC_ASSIGNMENT);     
}

 
function parsePrecedence(precedence) {   
    advance();   
    let prefixRule = getRule(parser.previous.type).prefix;   
    prefixRule();    
    while(precedence <= getRule(parser.current.type).precedence) {   
        advance();   
        let infixRule = getRule(parser.previous.type).infix;  
        infixRule();     
    }
}

 
function declaration() {
    if(match(TokenType.TOKEN_FUN)){
        funDeclaration();
    }else if(match(TokenType.TOKEN_VAR)) {
        varDeclaration();    
    }else {
        statement();     
    }    
}

 
function funDeclaration(){
    const global = parseVariable();  
    compileFunction(FunctionType.TYPE_FUNCTION);     
    defineVariable(global);  
}

 
function defineVariable(global) {    
    if(current.scope > 0){
        return;  
    }
    emitBytes(OpCode.OP_DEFINE_GLOBAL, global);  
}

 
 
function parseVariable() {
    consume(TokenType.TOKEN_IDENTIFIER);
    declareVariable();   
    if (current.scope > 0) return 0;     

    return identifierConstant(parser.previous.value);    
}

 
 
function declareVariable() {
    if(current.scope === 0) return;  
    const name = parser.previous.value;  
     
    for(let i = current.localCount-1; i > 0; i--) {  
        if(identifierEqual(name, current.locals[i])) {
            return;  
        }
    }
    addLocal(name);  
}

 
function addLocal(name) {    
    if(current.localCount < 255) {   
        current.locals[current.localCount++] = name;  
    }    
}

 
function identifierConstant(name){   
    return makeConstant(name);   
}

 
function makeConstant(value) {   
    const index = addConstant(value);    
    return index;    
}

 
function addConstant(value) {    
    currentChunk().arrayNumberTable.push(value);
    return currentChunk().arrayNumberTable.length - 1;   
}

 
function varDeclaration() {     
    const global = parseVariable();      
    if(match(TokenType.TOKEN_EQUAL)) {
        expression();    
    }else if(match(TokenType.TOKEN_STORE_EQUAL)) {   
        expression();
        emitByte(OpCode.OP_STORE);
    }else {
        emitByte(OpCode.OP_NIL);     
    }
    consume(TokenType.TOKEN_SEMICOLON);
    defineVariable(global);  
}

 
function statement() {
    if(match(TokenType.TOKEN_STORE)) {
        storeStatement();
    }else if(match(TokenType.TOKEN_PRINT)) {
        printStatement();
    }else if(match(TokenType.TOKEN_DELETE_LAST)) {
        deleteLastStatement();  
    }else if(match(TokenType.TOKEN_IF)) {
        ifStatement();
    }else if(match(TokenType.TOKEN_RETURN)) {
        returnStatement();
    }else if(match(TokenType.TOKEN_WHILE)){
        whileStatement();          
    }else if(match(TokenType.TOKEN_LEFT_BRACE)){
        beginScope();
        block();
        endScope();
    }else {
        expressionStatement();
    }
}

function deleteLastStatement() {
    consume(TokenType.TOKEN_SEMICOLON);
    emitByte(OpCode.OP_DELETE_LAST);
}
 
function printStatement() {
    expression();    
    consume(TokenType.TOKEN_SEMICOLON);  
    emitByte(OpCode.OP_PRINT);   
}

function storeStatement() {
    expression();
    consume(TokenType.TOKEN_SEMICOLON);  
    emitByte(OpCode.OP_STORE);   
    emitByte(OpCode.OP_POP);
}

 
function ifStatement() {
    consume(TokenType.TOKEN_LEFT_PAREN);     
    expression();    
    consume(TokenType.TOKEN_RIGHT_PAREN);    
    const thenJump = emitJump(OpCode.OP_JUMP_IF_FALSE);  
    emitByte(OpCode.OP_POP);     
    statement();     
    const elseJump = emitJump(OpCode.OP_JUMP);   
    patchJump(thenJump);     
    emitByte(OpCode.OP_POP);     

    if(match(TokenType.TOKEN_ELSE)) {    
        statement();         
    }
    patchJump(elseJump);     
}

 
 
function emitJump(intruction) {  
    emitByte(intruction);    
    emitByte(50);    
    return currentChunk().code.length-1;     
}

 
 
function patchJump(offset) {     
    const jump = currentChunk().code.length-offset-1;
    currentChunk().code[offset] = jump;
}

 
function returnStatement() {
    if(current.type === FunctionType.TYPE_SCRIPT) {
         
    }
    if(match(TokenType.TOKEN_SEMICOLON)) {   
        emitReturn();        
    }else {
        expression();    
        consume(TokenType.TOKEN_SEMICOLON);  
        emitByte(OpCode.OP_RETURN);  
    }
}

 
function whileStatement() {
    const loopStart = currentChunk().code.length;
    consume(TokenType.TOKEN_LEFT_PAREN);
    expression();
    consume(TokenType.TOKEN_RIGHT_PAREN);

    const exitJump = emitJump(OpCode.OP_JUMP_IF_FALSE);

    emitByte(OpCode.OP_POP);
    statement();
    emitLoop(loopStart);

    patchJump(exitJump);
    emitByte(OpCode.OP_POP);
}

 
function emitLoop(loopStart) {   
    emitByte(OpCode.OP_LOOP);

    const offset = currentChunk().code.length - loopStart +1;
    emitByte(offset);
}

 
function block() {
    while(!check(TokenType.TOKEN_RIGHT_BRACE) && !check(TokenType.TOKEN_EOF)) {
        declaration();
    }
    consume(TokenType.TOKEN_RIGHT_BRACE);
}

 
 
function expressionStatement() {
    expression();
    consume(TokenType.TOKEN_SEMICOLON);
    emitByte(OpCode.OP_POP);
}

 
function initCompiler(compiler, type) {
    compiler.type = type;
    compiler.enclosing = current;
    compiler.function = new ObjFunction();
    current = compiler;
    if(type !== FunctionType.TYPE_SCRIPT) {
        current.function.name = parser.previous.value;
    }else {
        current.function.name = 'main';
    }

    current.locals[current.localCount++] = '';
}

 
 
function endCompiler() {
    emitReturn();
    const objfunction = current.function;
    current = current.enclosing;
    return objfunction;  
}

 
function writeCode(byte){    
    currentChunk().code.push(byte);    
}

 
function emitByte(byte) {    
    writeCode(byte)
}

 
function emitBytes(byte1, byte2) {   
    emitByte(byte1);
    emitByte(byte2);
}

 
function emitReturn() {
    emitByte(OpCode.OP_NIL);
    emitByte(OpCode.OP_RETURN);
}

 
function variable() {
    namedVariable(parser.previous.value);
}

 
 
function namedVariable(name) {   
    let getOp, setOp;
    let arg = resolveLocal(current, name);  
    if(arg != -1) {
        getOp = OpCode.OP_GET_LOCAL;
        setOp = OpCode.OP_SET_LOCAL;
    }else {
        arg = identifierConstant(name);
        getOp = OpCode.OP_GET_GLOBAL;
        setOp = OpCode.OP_SET_GLOBAL;

    }

    if(match(TokenType.TOKEN_EQUAL)) {
        expression();
        emitBytes(setOp, arg);
    }else if(match(TokenType.TOKEN_STORE_EQUAL)){    
        expression();
        emitBytes(setOp, arg);
        emitByte(OpCode.OP_STORE);    
    }else {
        emitBytes(getOp, arg);
    }
   
}

 
function resolveLocal(compiler, name) {  
     
    for(let i = compiler.localCount-1; i >= 0; i--) {
        if ( name === compiler.locals[i] ) {
            return i;    
        }
    }
    return -1;   
}

 
 
 
function compileFunction(type) {     
    initCompiler(new Compiler(),type);
    beginScope();

    consume(TokenType.TOKEN_LEFT_PAREN);
    if(!check(TokenType.TOKEN_RIGHT_PAREN)) {
        do {
            current.function.arity++;
            if(current.function.arity > 255) {
                 
            }
            let paramConstant = parseVariable();
            defineVariable(paramConstant);
        } while (match(TokenType.TOKEN_COMA));
    }
    consume(TokenType.TOKEN_RIGHT_PAREN);

    consume(TokenType.TOKEN_LEFT_BRACE);
    block();

    const objfunction = endCompiler();
    emitBytes(OpCode.OP_CONSTANT, makeConstant(objfunction));  

}

 
function beginScope() {
    current.scope++;
}

 
 
function endScope() {
    current.scope--;     
    if(current.scope === 0) {    
        while (current.localCount > 1 ){  
            emitByte(OpCode.OP_POP);     
            current.localCount--;    
        }
    }
}

 
function and(){
    const endJump = emitJump(OpCode.OP_JUMP_IF_FALSE);
    emitByte(OpCode.OP_POP);
    parsePrecedence(Precedence.PREC_AND);
    patchJump(endJump);
}

 
function or() {
    const elseJump = emitJump(OpCode.OP_JUMP_IF_FALSE);
    const endJump = emitJump(OpCode.OP_JUMP);

    patchJump(elseJump);
    emitByte(OpCode.OP_POP);

    parsePrecedence(Precedence.PREC_OR);
    patchJump(endJump);
}

 
 
export function compile(tokens) {    
    initCompiler(new Compiler(), FunctionType.TYPE_SCRIPT);
    arrayTokens = tokens;    
    advance();
    while (!match(TokenType.TOKEN_EOF)) {
        declaration();
    }    
    return endCompiler();    
}

 
function emitConstant(value) {   
    emitBytes(OpCode.OP_CONSTANT, makeConstant(value));
}


 
function number() {
    const value = parseFloat(parser.previous.value);
    emitConstant(value);
}

 
function call() {
    const argCount = argumentList();
    emitBytes(OpCode.OP_CALL, argCount);
}

 
function argumentList() {
    let argCount = 0;
    if(!check(TokenType.TOKEN_RIGHT_PAREN)) {
        do {
            expression();
            if(argCount === 255) {
                 
            }
            argCount++;
        } while(match(TokenType.TOKEN_COMA));
    }
    consume(TokenType.TOKEN_RIGHT_PAREN);
    return argCount;     
}

 
function literal() {
    switch(parser.previous.type) {
        case TokenType.TOKEN_FALSE:
            emitByte(OpCode.OP_FALSE);
            break;
        case TokenType.TOKEN_NIL:
            emitByte(OpCode.OP_NIL);
            break;
        case TokenType.TOKEN_TRUE:
            emitByte(OpCode.OP_TRUE);
            break;
        default:
            return;  
    }
}

 


 




function grouping() {
    expression();
    consume(TokenType.TOKEN_RIGHT_PAREN);
}

 
function unary() {
    const operatorType = parser.previous.type;
    parsePrecedence(Precedence.PREC_UNARY);
    switch(operatorType) {
        case TokenType.TOKEN_BANG:
            emitByte(OpCode.OP_NOT);
            break;
        case TokenType.TOKEN_MINUS:
            emitByte(OpCode.OP_NEGATE);
            break;
        default:
            return;  
    }
    
}

 
function binary() {
    const operatorType = parser.previous.type;
    const rule = getRule(operatorType);
    parsePrecedence(rule.precedence + 1);

    switch(operatorType) {
        case TokenType.TOKEN_BANG_EQUAL:
            emitBytes(OpCode.OP_EQUAL, OpCode.OP_NOT);
            break;
        case TokenType.TOKEN_EQUAL_EQUAL:
            emitByte(OpCode.OP_EQUAL);
            break;
        case TokenType.TOKEN_GREATER:
            emitByte(OpCode.OP_GREATER);
            break;
        case TokenType.TOKEN_GREATER_EQUAL:
            emitBytes(OpCode.OP_LESS, OpCode.OP_NOT);
            break;
        case TokenType.TOKEN_LESS:
            emitByte(OpCode.OP_LESS);
            break;
        case TokenType.TOKEN_LESS_EQUAL:
            emitBytes(OpCode.OP_GREATER, OpCode.OP_NOT);
            break;
        case TokenType.TOKEN_PLUS:
            emitByte(OpCode.OP_ADD);
            break;
        case TokenType.TOKEN_MINUS:
            emitByte(OpCode.OP_SUBTRACT);
            break;
        case TokenType.TOKEN_STAR:
            emitByte(OpCode.OP_MULTIPLY);
            break;
        case TokenType.TOKEN_SLASH:
            emitByte(OpCode.OP_DIVIDE);
            break;
        default:
            return;  
    }

}

 
function binaryExponent(){
    const operatorType = parser.previous.type;
    const rule = getRule(operatorType);
    parsePrecedence(rule.precedence);
    emitByte(OpCode.OP_POW);
}

