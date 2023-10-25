const digits = '0123456789';
const operators = '+-*/';

const calculatorFrame = document.querySelector('.calculator-frame');
const previousInput = document.querySelector('#previousInput');
const newInput = document.querySelector('#newInput');

/*  This calculator will do one operation at a time and each operation consists of an operator and 2 numbers
    Initialize opNum1 to 0 and rest of them to 'nothing'
    Also, opNum1 and opNum2 are stored as strings so that the calculator can work with longer inputs
*/
let opNum1 = '0', opNum2 = null, operator = null;

// Keep track of whether or not a decimal sign have been used
let decimalMode = false;
let foundNewAnswer = false;

// Set all buttons to be not selectable by TAB key
const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.setAttribute('tabindex', '-1');
});

calculatorFrame.addEventListener('click', event => {
    const target = event.target;

    // Clear
    if (target.id === 'clear') {
        previousInput.textContent = '';
        newInput.textContent = 0;
        resetVariables();

    // Delete
    } else if (target.id === 'delete') {
        if (newInput.textContent.charAt(newInput.textContent.length - 1) === '.') {
            decimalMode = false;
        }

        // It may sometimes have real text in it e.g. when doing division by 0
        if (isNaN(newInput.textContent)) {
            newInput.textContent = '0';
            decimalMode = false;
            return;
        }

        if (operator === null) {
            if (String(opNum1).length > 1) {
                opNum1 = String(opNum1).slice(0, String(opNum1).length - 1);
            } else {
                opNum1 = '0';
            }
            newInput.textContent = opNum1;
        } else {
            if (String(opNum2).length > 1) {
                opNum2 = String(opNum2).slice(0, String(opNum2).length - 1);
            } else {
                opNum2 = '0';
            }
            newInput.textContent = opNum2;
        }

    // Decimals
    } else if (target.id === 'decimalPoint') {
        if (decimalMode === false) {
            if (operator === null) {
                opNum1 += '.';
                newInput.textContent = opNum1;
            } else {
                if (opNum2 === null) {
                    opNum2 = '';
                }
                opNum2 += '.';
                newInput.textContent = opNum2;
            }

            decimalMode = true;
        }

    // Equal
    } else if (target.id === 'equal') {
        if (opNum1 === null || operator === null || opNum2 === null) {
            return;
        }

        const result = executeOperation(opNum1, operator, opNum2);
        updateUpperDisplay(opNum1, operator, opNum2);
        newInput.textContent = result;
        foundNewAnswer = true;
        resetVariables();

        opNum1 = String(result);
        if (!Number.isInteger(result)) {
            decimalMode = true;
        }

    // Numbers
    } else if (target.classList.contains('number') && digits.includes(target.value)) {
        const digit = target.value;

        // User has clicked a number after he found an answer, which means he is inputting a new number, without using previous answer
        if (foundNewAnswer === true) {
            opNum1 = '0';
            decimalMode = false;
            foundNewAnswer = false;
        }

        if (decimalMode === false) {
            // Clearly, user is currently inputting into the first operand
            if (operator === null) {
                if (opNum1 == 0) {
                    opNum1 = '';
                }
                opNum1 = opNum1 === null ? digit : String(opNum1) + digit;
            } else {
                if (opNum2 == 0) {
                    opNum2 = '';
                }
                // Both the first operand and the operator is set
                opNum2 = opNum2 === null ? digit : String(opNum2) + digit;
            }

        } else {
            if (operator === null) {
                opNum1 = addDecimal(opNum1, digit);
            } else {
                opNum2 = addDecimal(opNum2, digit);
            }
        }

        newInput.textContent = operator === null ? opNum1 : opNum2;

    // Operators
    } else if (target.classList.contains('operator') && operators.includes(target.value)) {
        if (opNum1 === null) {
            return;
        }
        foundNewAnswer = false;
        const previousOperator = operator;
        operator = target.value;

        if (previousOperator !== null && opNum2 !== null) {
            const result = executeOperation(opNum1, previousOperator, opNum2);
            opNum1 = isNaN(result) ? '0' : String(result);
        }

        updateUpperDisplay(opNum1, operator);

        // If the user has clicked on the operator, he has finished typing his input for number
        decimalMode = false;
        opNum2 = null;
    }
});

// Keyboard Support
document.body.addEventListener('keyup', event => {
    event.preventDefault();
    const key = event.key;
    let button = null;

    if (digits.includes(key)) {
        button = calculatorFrame.querySelector(`.number[value="${key}"]`);
    } else if (operators.includes(key)) {
        button = calculatorFrame.querySelector(`.operator[value="${key}"]`);
    } else if (key === '=' || event.key === 'Enter') {
        button = calculatorFrame.querySelector('#equal');
    } else if (key === '.') {
        button = calculatorFrame.querySelector('#decimalPoint');
    } else if (key === 'Escape') {
        button = calculatorFrame.querySelector('#clear');
    } else if (key === 'Backspace' || key === 'Delete') {
        button = calculatorFrame.querySelector('#delete');
    }

    if (button) {
        button.click();
    }
});

function updateUpperDisplay(num1, operator, num2 = null) {
    switch(operator) {
        case '*':
            operator = 'x';
            break;
        case '/':
            operator = '÷';
            break;
        default:
            break;
    }
    previousInput.textContent = `${convertTo3DecimalPlaces(Number(num1))} ${operator}`;
    if (num2) {
        previousInput.textContent += ` ${convertTo3DecimalPlaces(Number(num2))} =`;
    }
}

// Adds digits after decimal point
function addDecimal(number, digit) {
    number = String(number);
    if (!number.includes('.')) {
        number += '.';
    }
    number += digit;
    return number;
}

function resetVariables() {
    opNum1 = '0';
    operator = null;
    opNum2 = null;
    decimalMode = false;
}

// Check for numbers and operator
function executeOperation(num1, operator, num2) {
    if (isNaN(num1) || isNaN(num2) || !operators.includes(operator)) {
        return 0;
    }

    switch(operator) {
        case '+':
            return add(num1, num2);

        case '-':
            return subtract(num1, num2);

        case '*':
            return multiply(num1, num2);

        case '/':
            return divide(num1, num2);
    }
}

function add(num1, num2) {
    const sum = num1 + num2;
    return Number.isInteger(sum) ? sum : convertTo3DecimalPlaces(sum);
}

function subtract(num1, num2) {
    const difference = num1 - num2;
    return Number.isInteger(difference) ? difference : convertTo3DecimalPlaces(difference);
}

function multiply(num1, num2) {
    const product = num1 * num2;
    return Number.isInteger(product) ? product : convertTo3DecimalPlaces(product);
}

function divide(num1, num2) {
    // Handle division by 0
    if (num2 == 0) {
        return 'lmao no';
    }

    const quotient = num1 / num2;
    return Number.isInteger(quotient) || quotient === 1 / 0 ? quotient : convertTo3DecimalPlaces(quotient);
}

function convertTo3DecimalPlaces(num) {
    return Math.round(num * 1000) / 1000;
}
