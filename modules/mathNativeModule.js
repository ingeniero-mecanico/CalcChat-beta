 
export function absNative (argCount, args) {  
    return Math.abs(args[argCount-1]);  
}

export function acosNative(argCount, args) {     
    return Math.acos(args[argCount-1]);
}

export function acoshNative(argCount, args) {    
    return Math.acosh(args[argCount-1]);
}

export function asinNative(argCount, args) {     
    return Math.asin(args[argCount-1]); 
}

export function asinhNative(argCount, args) {     
    return Math.asinh(args[argCount-1]); 
}

export function atanNative(argCount, args) {     
    return Math.atan(args[argCount-1]);
}

export function atan2Native(argCount, args) {     
    return Math.atan2(args[argCount-2], args[argCount-1]);
}

export function atanhNative(argCount, args) {     
    return Math.atanh(args[argCount-1]);
}

export function cbrtNative(argCount, args) {     
    return Math.cbrt(args[argCount-1]);
}

export function ceilNative(argCount, args) {     
    return Math.ceil(args[argCount-1]); 
}

export function cosNative(argCount, args) {     
    return Math.round(Math.cos(args[argCount-1]) * 1e12) / 1e12;
}

export function coshNative(argCount, args) {     
    return Math.cosh(args[argCount-1]); 
}

export function expNative(argCount, args) {     
    return Math.exp(args[argCount-1]); 
}

export function expm1Native(argCount, args) {     
    return Math.expm1(args[argCount-1]); 
}

export function floorNative(argCount, args) {     
    return Math.floor(args[argCount-1]); 
}

export function hypot2Native(argCount, args) {     
    return Math.hypot(args[argCount-2], args[argCount-1]);
}

export function lnNative(argCount, args) {     
    return Math.log(args[argCount-1]);  
}

export function logNative(argCount, args) {     
    return Math.log10(args[argCount-1]);  
}

export function ln1pNative(argCount, args) {     
    return Math.log1p(args[argCount-1]);  
}

export function log2Native(argCount, args) {     
    return Math.log2(args[argCount-1]);  
}

export function max2Native(argCount, args) {     
               
    return Math.max(args[argCount-2], args[argCount-1]);  
}

export function min2Native(argCount, args) {     
    return Math.min(args[argCount-2], args[argCount-1]);  
}

export function powNative(argCount, args) {     
    return Math.pow(args[argCount-2], args[argCount-1]);  
}

export function randomNative(argCount, args) {     
    return Math.random();  
}

export function roundNative(argCount, args) {     
    return Math.round(args[argCount-1]);  
}

export function signNative(argCount, args) {     
    return Math.sign(args[argCount-1])
}

export function sinNative(argCount, args) {     
    
    return  Math.round(Math.sin(args[argCount-1]) * 1e12) / 1e12; 
}

export function sinhNative(argCount, args) {     
    return Math.sinh(args[argCount-1]); 
}

export function sqrtNative(argCount, args) {     
    return Math.sqrt(args[argCount-1]);
}

export function tanNative(argCount, args) {     
    return  Math.round(Math.tan(args[argCount-1]) * 1e12) / 1e12; 
}

export function tanhNative(argCount, args) {     
    return Math.tanh(args[argCount-1]); 
}

export function truncNative() {     
    return Math.trunc(args[argCount-1]); 
}

export function degToRadNative(argCount, args) {
    return args[argCount-1] * (Math.PI / 180);
}
  
export function radToDegNative(argCount, args) {
    return args[argCount-1] / (Math.PI / 180);
}

export function limitXY(xMin, xMax, yMin, yMax) {
    return `${xMin}/${xMax}/${yMin}/${yMax}`;
}



