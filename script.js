class Calculadora{

    constructor( operandoAnteriorEl, operandoActualEl, operandoActualBinarioEl, operandoAnteriorBinarioEl ){
        this.base = 10;
        this.operandoAnteriorEl = operandoAnteriorEl;
        this.operandoActualEl = operandoActualEl;
        this.operandoActualBinarioEl = operandoActualBinarioEl;
        this.operandoAnteriorBinarioEl = operandoAnteriorBinarioEl;
        this.limpiar();
    }

    cambiarBase( nuevaBase ){
        const baseNum = Number.parseInt( nuevaBase );
        if( !isNaN(baseNum) ){
            this.base = baseNum;
            this.operandoActual = this.obtenerOpEnBase( this.operandoActualDecimal, this.base );
            this.operandoAnterior = this.obtenerOpEnBase( this.operandoAnteriorDecimal, this.base );
            return true;
        }
        return false;
    }

    obtenerOperandoActualEnBase10( operando ){
        if( this.base === 16 ){
            return Number.parseInt(`0x${operando}`);
        } else if( this.base === 8 ){
            return Number.parseInt( `0${operando}`, 8 );
        } else{
            return Number.parseInt( operando );
        }
    }

    operandoActualEnDecimal(){
        if( !this.operandoActual ){
            this.operandoActualDecimal = '';
        } else{
            this.operandoActualDecimal = this.obtenerOperandoActualEnBase10( this.operandoActual );
        }
    }

    operandoAnteriorEnDecimal(){
        if( !this.operandoAnterior ){
            this.operandoAnteriorDecimal = '';
        } else{
            this.operandoAnteriorDecimal = this.obtenerOperandoActualEnBase10( this.operandoAnterior );
        }
    }

    limpiar(){
        this.operacion = undefined;
        this.operandoActual = '';
        this.operandoAnterior = '';
        this.operandoBinario = '';
        this.operandoActualDecimal = '';
        this.operandoAnteriorDecimal = '';
    }

    borrar(){
        this.operandoActual = this.operandoActual.toString().slice( 0, -1 );
        this.operandoActualEnDecimal();
    }

    anyadirOperando(operando){
        this.operandoActual = this.operandoActual || '';
        const opAnt = this.operandoActual.toString();
        this.operandoActual = opAnt + operando;
        this.operandoActualEnDecimal();
        if( this.operandoActualDecimal > Number.MAX_SAFE_INTEGER ){
            this.operandoActual = opAnt;
            this.operandoActualEnDecimal();
        }
        this.operandoActual = this.obtenerOpEnBase( this.operandoActualDecimal, this.base );
    }

    operar(operador){
        if( this.operandoActual !== '' ){
            if( this.operandoAnterior !== '' ){
                this.realizarOperacion();
            }
            this.operacion = operador;
            this.operandoAnterior = this.operandoActual;
            this.operandoActual = '';
            this.operandoActualEnDecimal();
            this.operandoAnteriorEnDecimal();
            const operadoresUnicos = [ '<<', '>>', 'NOT' ];
            if( operadoresUnicos.includes(operador) ){
                this.realizarOperacion();
            }
        }
    }

    realizarOperacion(){
        const operandoAnteriorNum = this.operandoAnteriorDecimal;
        const operandoActualNum = this.operandoActualDecimal;
        if( this.operacion && !isNaN(operandoAnteriorNum) && !isNaN(operandoActualNum) ){
            switch(this.operacion){
                case '+':
                    this.operandoActualDecimal = operandoAnteriorNum + operandoActualNum;
                    break;
                case '-':
                    this.operandoActualDecimal = operandoAnteriorNum - operandoActualNum;
                    break;
                case '*':
                    this.operandoActualDecimal = operandoAnteriorNum * operandoActualNum;
                    break;
                case '/':
                case '÷':
                    this.operandoActualDecimal = operandoAnteriorNum / operandoActualNum;
                    break;
                case 'AND':
                    this.operandoActualDecimal = operandoAnteriorNum & operandoActualNum;
                    break;
                case 'OR':
                    this.operandoActualDecimal = operandoAnteriorNum | operandoActualNum;
                    break;
                case 'NOT':
                    this.operandoActualDecimal = ~operandoAnteriorNum;
                    break;
                case 'XOR':
                    this.operandoActualDecimal = operandoAnteriorNum ^ operandoActualNum;
                    break;
                case '>>':
                    this.operandoActualDecimal = operandoAnteriorNum>>1;
                    break;
                case '<<':
                    this.operandoActualDecimal = operandoAnteriorNum<<1;
                    break;
            }
            this.operandoActual = this.obtenerOpEnBase( this.operandoActualDecimal, this.base );
            this.operandoAnterior = '';
            this.operandoAnteriorEnDecimal();
        }
    }

    proxMult8( num ){
        let i;
        for( i = num; i%8 != 0; i++ );
        return i;
    }

    formatearBinario( binario ){
        const prox = this.proxMult8( binario.length );
        let binarioArr = binario.split("");
        let negativo = false;
        if( binarioArr && binarioArr[0] === '-' ){
            negativo = true;
            binarioArr = binarioArr.slice(1);
        }
        return (negativo ? "-" : "") + Array.from( binarioArr.reverse().concat( Array( prox-binarioArr.length ).fill(0) ).reduce( (acum, act, idx) => {
            if( idx > 0 && idx%8 == 0 ){
                return acum + " " + act;
            }
            return acum + "" + act;
        }, "" ) ).reverse().join("");
    }

    mostrarSalida(){
        if( this.operandoActual ){
            this.operandoActualEl.innerText = `${this.base === 16 ? '0x ' : ''}${this.operandoActual}`;
            //this.operandoActualBinarioEl.innerText = this.obtenerOpEnBase( this.operandoActualDecimal, 2 );
            this.operandoActualBinarioEl.innerText = this.formatearBinario( this.obtenerOpEnBase( this.operandoActualDecimal, 2 ) );
        } else{
            this.operandoActualEl.innerText = '';
            this.operandoActualBinarioEl.innerText = '';
        }
        if( this.operandoAnterior ){
            this.operandoAnteriorEl.innerText =  `${this.base === 16 ? '0x ' : ''}${this.operandoAnterior} ${ this.operacion ? this.operacion : '' }`;
            this.operandoAnteriorBinarioEl.innerText = this.formatearBinario( this.obtenerOpEnBase( this.operandoAnteriorDecimal, 2 ) );
        } else{
            this.operandoAnteriorEl.innerText = '';
            this.operandoAnteriorBinarioEl.innerText = '';
        }  
    }

    obtenerOpEnBase(op, base){
        return op.toString(base);
    }

}

const operandoAnteriorEl = document.querySelector( '[data-operando-anterior]' );
const operandoActualEl = document.querySelector( '[data-operando-actual]' );
const operandoActualBinarioEl = document.querySelector( '[data-operando-actual-binario]' );
const operandoAnteriorBinarioEl = document.querySelector( '[data-operando-anterior-binario]' );
const operandosEls = document.querySelectorAll( '[data-operando]' );
const operandosHexaEls = document.querySelectorAll( '[data-operando-hexadecimal]' );
const operandosDecimalesEls = document.querySelectorAll( '[data-operando-decimal]' );
const operadoresEls = document.querySelectorAll( '[data-operacion]' );
const limpiarEl = document.querySelector( '[data-limpiar]' );
const borrarEl = document.querySelector( '[data-borrar]' );
const calcularEl = document.querySelector( '[data-calcular]' );
const basesEls = document.querySelectorAll( '[data-base]' );

const calculadora = new Calculadora( operandoAnteriorEl, operandoActualEl, operandoActualBinarioEl, operandoAnteriorBinarioEl );

operandosEls.forEach( (btn) => {
    btn.addEventListener( 'click', () => {
        calculadora.anyadirOperando(btn.innerText);
        calculadora.mostrarSalida();
    });
});

operadoresEls.forEach( (btn) => {
    btn.addEventListener( 'click', () => {
        calculadora.operar( btn.innerText );
        calculadora.mostrarSalida();
    });
});

limpiarEl.addEventListener( 'click', () => {
    calculadora.limpiar();
    calculadora.mostrarSalida();
});

borrarEl.addEventListener( 'click', () => {
    calculadora.borrar();
    calculadora.mostrarSalida();
});

calcularEl.addEventListener( 'click', () => {
    calculadora.realizarOperacion();
    calculadora.mostrarSalida();
});

basesEls.forEach( (btn) => {
    btn.addEventListener( 'click', () => {
        const base = btn.getAttribute( 'data-base' );
        const res = calculadora.cambiarBase( base );
        if( res ){
            calculadora.mostrarSalida();
            basesEls.forEach( btnBase => {
                btnBase.classList.remove('seleccionado');
            });
            btn.classList.add( 'seleccionado' );
            operandosHexaEls.forEach( btnHexa => {
                if( base !== '16' ){
                    btnHexa.classList.add( 'deshabilitado' );
                } else{
                    btnHexa.classList.remove( 'deshabilitado' );
                }
            });
            operandosDecimalesEls.forEach( btnDecimal => {
                if( base !== '16' && base !== '10' ){
                    btnDecimal.classList.add( 'deshabilitado' );
                } else{
                    btnDecimal.classList.remove( 'deshabilitado' );
                }
            });
        }
    });
});

const operadores = [ '+', '-', '*', '/' ];
const hexaKeys = [ 'a', 'b', 'c', 'd', 'e', 'f' ];
window.addEventListener( 'keyup', (e) => {
    console.log(e);
    if( e.key === 'Enter' ){
        calculadora.realizarOperacion();
        calculadora.mostrarSalida();
    } else if( e.key === 'Backspace' && e.ctrlKey ){
        calculadora.limpiar();
        calculadora.mostrarSalida();
    } 
    else if( e.key === 'Backspace' ){
        calculadora.borrar();
        calculadora.mostrarSalida();
    } else if( operadores.includes(e.key) ){
        calculadora.operar( e.key );
        calculadora.mostrarSalida();
    } else if( !isNaN(e.key) ){
        if( ( calculadora.base == 8 && e.key != '8' && e.key != '9' ) || calculadora.base != 8 ){
            calculadora.anyadirOperando(e.key);
            calculadora.mostrarSalida();
        }
    } else if( calculadora.base == 16 && hexaKeys.includes(e.key.toLowerCase()) ){
        calculadora.anyadirOperando(e.key);
        calculadora.mostrarSalida();
    }
});