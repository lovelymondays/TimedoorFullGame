function calculator(){
    var firstNumber = parseInt(document.getElementById("number1").value);
    var secondNumber = parseInt(document.getElementById("number2").value);

    var operator = document.getElementById("op").value;
    var result = document.getElementById("result");

    var total;

    if (isNaN(firstNumber) || isNaN(secondNumber)){
        alert('Fill the form with number!')
    }else{
        if(operator === "+"){
            total = firstNumber + secondNumber;
        }else if(operator === "-"){
            total = firstNumber - secondNumber;
        }
        else if(operator === "x"){
            total = firstNumber * secondNumber;
        }
        else if(operator === "/"){
            total = firstNumber / secondNumber;
        }
    }
    result.value = total;

}