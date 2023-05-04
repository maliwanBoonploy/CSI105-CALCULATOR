//Declare Variable ประกาศตัวแปร
var numBtn = document.querySelectorAll('[btn]');
var optBtn = document.querySelectorAll('[opt]');
var equalBtn = document.querySelector('[equal]');
var deleteBtn = document.querySelector('[delete]');
var clearBtn = document.querySelector('[clear]');
var currentScreenText = document.querySelector('[current-operand]');
var historyScreenText = document.querySelector('[history]');
var ArrayLinearList = /** @class */ (function () {
    function ArrayLinearList() {
        this.size = 0;
        this.element = [];
    }
    ArrayLinearList.prototype.isEmpty = function () {
        return (this.size == 0);
    };
    ArrayLinearList.prototype.sizeList = function () {
        return this.size;
    };
    ArrayLinearList.prototype.getData = function (index) {
        if (index >= 0 && index <= this.size) {
            return this.element[index];
        }
        else {
            return index + 'index out of bounds';
        }
    };
    ArrayLinearList.prototype.indexOf = function (elm) {
        for (var i = 0; i < this.size; i++)
            if (elm == this.element[i])
                return i;
        return -1;
    };
    ArrayLinearList.prototype.removeData = function (index) {
        if (index >= 0 && index < this.size) {
            var dataRemove = void 0;
            dataRemove = this.element[index];
            for (var i = index + 1; i < this.size; i++) {
                this.element[i - 1] = this.element[i];
            }
            this.element[this.size - 1] = " ";
            this.size--;
            return dataRemove;
        }
        else {
            return index + " error index out of bounds";
        }
    };
    ArrayLinearList.prototype.addData = function (index, elm) {
        if (index >= 0 && index < this.size) {
            for (var i = this.size; i >= index; i--) {
                this.element[i + 1] = this.element[i];
            }
            this.element[index] = elm;
            this.size++;
        }
    };
    ArrayLinearList.prototype.addLast = function (elm) {
        this.element[this.size] = elm;
        this.size++;
    };
    ArrayLinearList.prototype.displayData = function () {
        for (var i = 0; i < this.size; i++) {
            console.log(this.element[i]);
        }
    };
    return ArrayLinearList;
}());
// ------------------ Stack -------------------
var Stack = /** @class */ (function () {
    function Stack() {
        this.myList = new ArrayLinearList();
    }
    Stack.prototype.isEmpty = function () {
        return this.myList.isEmpty();
    };
    Stack.prototype.puts = function (element) {
        this.myList.addLast(element);
    };
    Stack.prototype.pops = function () {
        if (this.myList.isEmpty())
            return '';
        else
            return (this.myList.removeData(this.myList.sizeList() - 1));
    };
    Stack.prototype.peek = function () {
        if (this.myList.isEmpty())
            return '';
        else
            return (this.myList.getData(this.myList.sizeList() - 1));
    };
    Stack.prototype.display = function () {
        for (var i = this.myList.sizeList() - 1; i >= 0; i--) {
            console.info(this.myList.getData(i));
        }
    };
    return Stack;
}());
// ------------------ Calculator -------------------
var Calculator = /** @class */ (function () {
    function Calculator(currentScreenText, historyScreenText) {
        this.historyOperand = " ";
        this.currentOperand = "0"; //เริ่มต้นเป็นDisplay เป็นเลข 0
        this.historyScreenText = historyScreenText;
        this.currentScreenText = currentScreenText;
        this.clear();
    }
    Calculator.prototype.updateHistory = function () {
        console.log("updateHistory!");
        this.historyScreenText.innerText = this.historyOperand;
        console.log("this.historyScreenText =", this.historyScreenText);
    };
    //เป็น Method เพื่อ Update display
    Calculator.prototype.updateDisplay = function () {
        this.currentScreenText.innerText = this.currentOperand;
        console.log("this.currentScreenText =", this.currentScreenText);
        console.log("history =", this.historyOperand);
    };
    //method สำหรับปุ่ม clear ใช่เพื่อ clear หน้าจอกลับเป็นค่าเริ่มต้นคือ 0
    Calculator.prototype.clear = function () {
        this.currentOperand = "0";
        this.historyOperand = "0";
        this.updateHistory();
    };
    //method สำหรับปุ่ม <-- ย้อกลับ ใช้ลบข้อมูล
    Calculator.prototype["delete"] = function () {
        if (this.currentOperand.length != 1 && this.currentOperand.charAt(1) != "0") { //ตรวจสอบว่าถ้าต้องไม่ใช่ตัวแรกถึงจะลบได้
            this.currentOperand = this.currentOperand.slice(0, -1); //ลบข้อมูลตัวหลังสุด
        }
        else if (this.currentOperand.length == 1 && this.currentOperand.charAt(1) != "0") { //ถ้ามีข้อมูลตัวเดียวและตัวนั้นไม่ใช่ 0 แล้วต้องการลบ
            this.clear();
        }
    };
    //method สำหรับปุ่มตัวเลข กดตัวเลขแล้วเพิ่มขึ้นไปในบนหน้าจอ
    Calculator.prototype.appendNum = function (num) {
        if (this.currentOperand.length == 1 && this.currentOperand.charAt(0) == "0") { //ถ้าตัวแรกเป็น 0 แล้วกดเลขจะทำการนำตัวที่กดมาแทนเลข 0 | ถ้าไม่ทำเวลากดจะมีศูนย์นำหน้าตัวเลข
            this.currentOperand = String(num);
            return;
        }
        this.currentOperand += String(num);
    };
    //method สำหรับปุ่มที่เป็น operator
    Calculator.prototype.appendOperator = function (ch) {
        var lastchar = this.currentOperand.charAt(this.currentOperand.length - 1);
        if (this.currentOperand === "0" || checkOperator(lastchar)) {
            this["delete"]();
            this.currentOperand += String(ch);
        }
        else {
            this.currentOperand += String(ch);
        }
    };
    //method 
    Calculator.prototype.compute = function () {
        this.historyOperand = this.currentOperand;
        var Postfix = infixToPostfix(this.currentOperand);
        var result = solvePostfix(Postfix);
        this.currentOperand = String(result);
    };
    return Calculator;
}());
var calculator = new Calculator(currentScreenText, historyScreenText);
numBtn.forEach(function (button) {
    button.addEventListener("click", function () {
        calculator.appendNum(button.innerText);
        calculator.updateDisplay();
    });
});
optBtn.forEach(function (button) {
    button.addEventListener("click", function () {
        calculator.appendOperator(button.innerText);
        calculator.updateDisplay();
    });
});
deleteBtn.addEventListener("click", function () {
    calculator["delete"]();
    calculator.updateDisplay();
});
clearBtn.addEventListener("click", function () {
    calculator.clear();
    calculator.updateDisplay();
});
equalBtn.addEventListener("click", function () {
    calculator.compute();
    calculator.updateDisplay();
    calculator.updateHistory();
});
//Function ตรวจว่าเป็น operator รึเปล่า  (Operater คือ +-*/)
function checkOperator(ch) {
    var mathOperatorRegex = /[+\-*/^]/;
    if (mathOperatorRegex.test(ch)) //ถ้าเป็นจะ return true, ถ้าไม่เป็น return false
        return true;
    else
        return false;
}
function infixToPostfix(str) {
    var ch;
    var output = " ";
    var myStack = new Stack();
    for (var i = 0; i < str.length; i++) {
        ch = str.charAt(i);
        if (ch == "(") {
            myStack.puts(ch);
            console.info("----list of stack 1 ----");
            myStack.display();
        }
        else if (checkOperator(ch)) {
            while (!myStack.isEmpty() && checkPriority(ch) <= checkPriority(myStack.peek())) {
                output = output + myStack.pops();
            }
            myStack.puts(ch);
            console.info("----list of stack 2 ----");
            myStack.display();
        }
        else if (ch == ")") {
            while (!myStack.isEmpty() && myStack.peek() != "(") {
                output = output + myStack.pops();
            }
            myStack.pops();
            console.info("----list of stack 3 ----");
            myStack.display();
        }
        else {
            output = output + ch;
        }
    }
    while (!myStack.isEmpty()) {
        output = output + myStack.pops();
    }
    return output;
}
function checkPriority(c) {
    if (c == "+" || c == "-")
        return 1;
    else if (c == "*" || c == "/")
        return 2;
    else if (c == "^")
        return 3;
    else
        return 0;
}
function solvePostfix(str) {
    var ch;
    var output = 0;
    var mystack = new Stack();
    for (var i = 0; i < str.length; i++) {
        ch = str.charAt(i);
        if (!checkOperator(ch)) {
            mystack.puts(ch);
            console.info("--- Next ---");
            mystack.display();
        }
        else {
            output = parseInt(mystack.pops());
            if (ch == "+") {
                output = parseInt(mystack.pops()) + output;
            }
            else if (ch == "-") {
                output = parseInt(mystack.pops()) - output;
            }
            else if (ch == "*") {
                output = parseInt(mystack.pops()) * output;
            }
            else if (ch == "/") {
                output = parseInt(mystack.pops()) / output;
            }
            else if (ch == "^") {
                output = Math.pow(parseInt(mystack.pops()), output);
            }
            mystack.puts(String(output));
            output = 0;
        }
    }
    output = parseInt(mystack.pops());
    return output;
}
