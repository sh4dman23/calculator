const digits = '0123456789';
const operators = '+-*/';

const calculatorFrame = document.querySelector('.calculator-frame');
const previousInput = document.querySelector('#previousInput');
const newInput = document.querySelector('#newInput');

// This calculator will do one operation at a time and each operation consists of an operator and 2 numbers
// Initialize opNum1 to 0 and rest of them to 'nothing'
let opNum1 = 0, opNum2 = null, operator = null;

// Keep track of whether or not a decimal sign have been used
let decimalMode = false;

calculatorFrame.addEventListener('click', event => {
    const target = event.target;

    // Clear
    if (target.id === 'clear') {
        previousInput.textContent = '';
        newInput.textContent = 0;
        resetVariables();

    // Delete
    } else if (target.id === 'delete') {
        if (newInput.textContent.charAt(newInput.length - 1) === '.' && decimalMode === true) {
            decimalMode = false;
        }

        // It may sometimes have real text in it e.g. when doing division by 0
        if (isNaN(newInput.textContent)) {
            newInput.textContent = 0;
            return;
        }

        if (operator === null) {
            if (String(opNum1).length > 0) {
                opNum1 = Number(String(opNum1).slice(0, String(opNum1).length - 1));
            } else {
                opNum1 = 0;
            }
            newInput.textContent = opNum1;
        } else {
            if (String(opNum2).length > 0) {
                opNum2 = Number(String(opNum2).slice(0, String(opNum2).length - 1));
            } else {
                opNum2 = 0;
            }
            newInput.textContent = opNum2;
        }

    // Decimals
    } else if (target.id === 'decimalPoint') {
        newInput.textContent = decimalMode === false ? newInput.textContent + '.' : newInput.textContent;
        decimalMode = true;

    // Equal
    } else if (target.id === 'equal') {
        if (opNum1 === null || operator === null || opNum2 === null) {
            return;
        }

        const result = executeOperation(opNum1, operator, opNum2);
        previousInput.textContent = `${opNum1} ${operator} ${opNum2} =`;
        newInput.textContent = result;
        resetVariables();

        opNum1 = isNaN(result) ? 0 : result;
        if (!Number.isInteger(result)) {
            decimalMode = true;
        }

    // Numbers
    } else if (target.classList.contains('number') && digits.includes(target.value)) {
        const digit = Number(target.value);

        if (decimalMode === false) {
            // Clearly, user is currently inputting into the first operand
            if (operator === null) {
                opNum1 = opNum1 === null ? digit : opNum1 * 10 + digit;
            } else {
                // Both the first operand and the operator is set
                opNum2 = opNum2 === null ? digit : opNum2 * 10 + digit;
            }
        } else {
            if (operator === null) {
                opNum1 = addDecimal(opNum1, digit);
            } else {
                opNum2 = addDecimal(opNum2, digit);
            }
        }

        newInput.textContent = operator === null ? opNum1 : opNum2;
    } else if (target.classList.contains('operator') && operators.includes(target.value)) {
        if (opNum1 === null) {
            return;
        }
        const previousOperator = operator;
        operator = target.value;

        if (previousOperator !== null && opNum2 !== null) {
            const result = executeOperation(opNum1, previousOperator, opNum2);
            opNum1 = isNaN(result) ? 0 : result;
        }

        previousInput.textContent = `${opNum1} ${operator}`;

        // If the user has clicked on the operator, he has finished typing his input for number
        decimalMode = false;
        opNum2 = 0;
    }
});

// Adds digits after decimal point
function addDecimal(number, digit) {
    digit = Number(digit);
    if (Number.isInteger(number)) {
        number += digit / 10;
    } else {
        number = Number(String(number) + digit);
    }
    return number;
}

function resetVariables() {
    opNum1 = 0;
    operator = null;
    opNum2 = null;
    decimalMode = false;
}

// Check for numbers and operator
function executeOperation(num1, operator, num2) {
    if (isNaN(num1) || isNaN(num2) || !operators.includes(operator)) {
        return NaN;
    }

    [num1, num2] = [Number(num1), Number(num2)];

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
    if (num2 === 0) {
        return 'lmao no';
    }

    const quotient = num1 / num2;
    return Number.isInteger(quotient) || quotient === 1 / 0 ? quotient : convertTo3DecimalPlaces(quotient);
}

function convertTo3DecimalPlaces(num) {
    return Math.floor(num * 1000) / 1000;
}
