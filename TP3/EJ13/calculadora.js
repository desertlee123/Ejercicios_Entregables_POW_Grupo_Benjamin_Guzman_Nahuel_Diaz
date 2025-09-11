const operation_display = document.getElementById("operation_display");
let operation_stack = []
let parsed_operation = []
const pesos = {
    "-": 1,
    "+": 1,
    "×": 2,
    "÷": 2,
    "%": 3,
    "¬": 3
}

function concatenar(a) {
    operation_display.innerText += a;
    mostrar_resultado();
}

function borrar_ultimo(){
    const text = operation_display.innerText;
    operation_display.innerText = text.substring(0, text.length-1);
    mostrar_resultado();
}

function borrar_todo(){
    operation_display.innerText = "";
    document.getElementById("resultado_display").innerText = "";
}

function igualar(){
    if (!document.getElementById("resultado_display").innerText.split(" ").includes("Error")){
        operation_display.innerText = document.getElementById("resultado_display").innerText;
    }
}

function parcer() {
    var number = "";
    var operator = "";
    var status = "nuevo";
    var decimal_status = "entero";
    let input = operation_display.innerText;
    var output_stack = [];
    var output_stack = [];
    var output_stack = [];
    var operators_stack = [];

    for (let i = 0; i < input.length; i++) {
        switch (status) {
            case "nuevo":
                if (isNaN(input[i])) {
                    status = "operador";
                } else {
                    status = "numero";
                }
                i--; // Re-evaluate the same character
                break;

            case "numero":
                switch (decimal_status) {
                    case "entero":
                        if (!isNaN(input[i])) {
                            number += input[i];
                        } else if (input[i] === ".") {
                            number += input[i];
                            decimal_status = "decimal";
                        } else {
                            output_stack.push(parseFloat(number));
                            number = "";
                            status = "nuevo";
                            i--; // Re-evaluate the same character
                        }
                        break;

                    case "decimal":
                        if (!isNaN(input[i])) {
                            number += input[i];
                        } else {
                            output_stack.push(parseFloat(number));
                            number = "";
                            decimal_status = "entero";
                            status = "nuevo";
                            i--; // Re-evaluate the same character
                        }
                        break;
                }
                break;

            case "operador":
                if (isNaN(input[i])) {
                    operator += input[i];
                    if (operator in pesos) {
                        while (operators_stack.length !== 0 && pesos[operator] <= pesos[operators_stack[operators_stack.length - 1]]) {
                            output_stack.push(operators_stack.pop());
                        }
                        operators_stack.push(operator);
                        operator = "";
                        status = "nuevo";
                    }
                } else {
                    operator = "";
                    status = "nuevo";
                    i--; // Re-evaluate the same character
                }
                break;
        }
    }

    // Push a un numero que aya quedado sin padar por ejemplo 2+5 <-- el 5 no se pasaria si no fuera por esto
    if (number) {
        output_stack.push(parseFloat(number));
    }

    while (operators_stack.length !== 0) {
        output_stack.push(operators_stack.pop());
    }
    
    return output_stack;
}

function evaluador(operacion){
    console.log(operacion);
    stack = [];
    errores = false;
    resultado = "";

    for (let i = 0; i < operacion.length && !errores; i++){
        console.log(stack);
        if (isNaN(operacion[i])){
            switch(operacion[i]){
                case "-":
                    n2 = stack.pop();
                    n1 = stack.pop();
                    stack.push(n1-n2);
                    break;
                case "+":
                    n2 = stack.pop();
                    n1 = stack.pop(); 
                    stack.push(n1 + n2);
                    break;
                case "×":
                    n2 = stack.pop();
                    n1 = stack.pop();
                    stack.push(n1 * n2);
                    break;
                case "÷":
                    n2 = stack.pop();
                    n1 = stack.pop();
                    if (n2 === 0){
                        errores = true;
                        resultado = "Error al dividir por 0";
                    }else{
                        stack.push(n1 / n2);
                    }
                    break;
                case "%":
                    n1 = stack.pop();
                    stack.push(n1 * 0.01);
                    break;
                case "¬":
                    n1 = stack.pop();
                    stack.push(n1 * -1);
                    break;
            }
        }
        else{
            stack.push(operacion[i]);
        }
    }
    if (!errores){
        resultado = ""+stack.pop();
    }

    return resultado; 
}

function mostrar_resultado(){
    const resultado = evaluador(parcer());
    if(!isNaN(resultado)){
        if(resultado[0] === "-"){
            document.getElementById("resultado_display").innerText = resultado.replace("-", "¬");
        } else {
            document.getElementById("resultado_display").innerText = resultado;
        }
    }else if (resultado.split(" ").includes("Error")){
        document.getElementById("resultado_display").innerText = resultado;
    }
}



