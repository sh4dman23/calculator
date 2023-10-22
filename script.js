const operators = ['+', '-', '*', '/'];

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
    const quotient = num1 / num2;
    return Number.isInteger(quotient) || quotient === 1 / 0 ? quotient : convertTo3DecimalPlaces(quotient);
}

function convertTo3DecimalPlaces(num) {
    return Math.floor(num * 1000) / 1000;
}

console.log(
    executeOperation('23', '+', '6.9999'),
    executeOperation('a', '+', 'b'),
    executeOperation('2 ', '+', '-2'),
    executeOperation('2', '*', '4096'),
    executeOperation('5', '/', '2'),
    executeOperation('5', '/', '0')
);