//Declare Variable ประกาศตัวแปร
const numBtn = document.querySelectorAll('[btn]')
const optBtn = document.querySelectorAll('[opt]')
const equalBtn = document.querySelector('[equal]')
const deleteBtn = document.querySelector('[delete]')
const clearBtn = document.querySelector('[clear]')
const currentScreenText = document.querySelector('[current-operand]')
const historyScreenText = document.querySelector('[history]')



// ------------------ ArrayLinearList -------------------

interface LinearList {
  isEmpty: () => boolean
  sizeList: () => number
  getData: (index: number) => string
  indexOf: (elm: string) => number
  removeData: (index: number) => string
  addData: (index: number, elm: string) => void
}

class ArrayLinearList implements LinearList {
  size: number
  element: string[]
  constructor() {
    this.size = 0
    this.element = []
  }
  isEmpty(): boolean {
    return (this.size == 0)
  }
  sizeList(): number {
    return this.size
  }

  getData(index: number): string {
    if (index >= 0 && index <= this.size) {
      return this.element[index]
    } else {
      return index + 'index out of bounds'
    }
  }

  indexOf(elm: string): number {
    for (let i = 0; i < this.size; i++)
      if (elm == this.element[i])
        return i
    return -1

  }
  removeData(index: number): string {
    if (index >= 0 && index < this.size) {
      let dataRemove: string
      dataRemove = this.element[index]
      for (let i = index + 1; i < this.size; i++) {
        this.element[i - 1] = this.element[i]
      }
      this.element[this.size - 1] = " "
      this.size--
      return dataRemove
    }
    else {
      return index + " error index out of bounds"
    }
  }
  addData(index: number, elm: string) {
    if (index >= 0 && index < this.size) {
      for (let i = this.size; i >= index; i--) {
        this.element[i + 1] = this.element[i]
      }
      this.element[index] = elm
      this.size++
    }
  }
  addLast(elm: string) {
    this.element[this.size] = elm
    this.size++
  }
  displayData() {
    for (let i = 0; i < this.size; i++) {
      console.log(this.element[i])
    }
  }
}

// ------------------ Stack -------------------
class Stack {
  myList: ArrayLinearList
  constructor() {
    this.myList = new ArrayLinearList()
  }
  isEmpty(): boolean {
    return this.myList.isEmpty()
  }
  puts(element: string) {
    this.myList.addLast(element)
  }
  pops(): string {
    if (this.myList.isEmpty())
      return ''
    else
      return (this.myList.removeData(this.myList.sizeList() - 1))
  }
  peek(): string {
    if (this.myList.isEmpty())
      return ''
    else
      return (this.myList.getData(this.myList.sizeList() - 1))
  }
  display() {
    for (let i = this.myList.sizeList() - 1; i >= 0; i--) {
      console.info(this.myList.getData(i))
    }
  }
}

// ------------------ Calculator -------------------
class Calculator {
  currentScreenText: HTMLElement
  historyScreenText: HTMLElement
  historyOperand: string = " "
  currentOperand: string = "0" //เริ่มต้นเป็นDisplay เป็นเลข 0
  constructor(currentScreenText, historyScreenText) {
    this.historyScreenText = historyScreenText
    this.currentScreenText = currentScreenText
    this.clear()
  }
  updateHistory() {
    console.log("updateHistory!")
    this.historyScreenText.innerText = this.historyOperand
    console.log("this.historyScreenText =", this.historyScreenText)

  }
  //เป็น Method เพื่อ Update display
  updateDisplay() {
    this.currentScreenText.innerText = this.currentOperand
    console.log("this.currentScreenText =", this.currentScreenText)
    console.log("history =", this.historyOperand)
  }

  //method สำหรับปุ่ม clear ใช่เพื่อ clear หน้าจอกลับเป็นค่าเริ่มต้นคือ 0
  clear() {
    this.currentOperand = "0"
    this.historyOperand = "0"
    this.updateHistory()
  }

  //method สำหรับปุ่ม <-- ย้อกลับ ใช้ลบข้อมูล
  delete() {
    if (this.currentOperand.length != 1 && this.currentOperand.charAt(1) != "0") {//ตรวจสอบว่าถ้าต้องไม่ใช่ตัวแรกถึงจะลบได้
      this.currentOperand = this.currentOperand.slice(0, -1) //ลบข้อมูลตัวหลังสุด
    } else if (this.currentOperand.length == 1 && this.currentOperand.charAt(1) != "0") {//ถ้ามีข้อมูลตัวเดียวและตัวนั้นไม่ใช่ 0 แล้วต้องการลบ
      this.clear()
    }
  }

  //method สำหรับปุ่มตัวเลข กดตัวเลขแล้วเพิ่มขึ้นไปในบนหน้าจอ
  appendNum(num) {
    if (this.currentOperand.length == 1 && this.currentOperand.charAt(0) == "0") {//ถ้าตัวแรกเป็น 0 แล้วกดเลขจะทำการนำตัวที่กดมาแทนเลข 0 | ถ้าไม่ทำเวลากดจะมีศูนย์นำหน้าตัวเลข
      this.currentOperand = String(num)
      return
    }
    this.currentOperand += String(num)
  }

  //method สำหรับปุ่มที่เป็น operator
  appendOperator(ch) {
    let lastchar = this.currentOperand.charAt(this.currentOperand.length - 1)
    if (this.currentOperand === "0" || checkOperator(lastchar)) {
      this.delete()
      this.currentOperand += String(ch)
    } else {
      this.currentOperand += String(ch)
    }
  }

  //method 
  compute() {
    this.historyOperand = this.currentOperand
    let Postfix = infixToPostfix(this.currentOperand)
    const result = solvePostfix(Postfix)
    this.currentOperand = String(result)
  }
}

let calculator = new Calculator(currentScreenText, historyScreenText)

numBtn.forEach((button : HTMLElement) => {
  button.addEventListener("click", () => {
    calculator.appendNum(button.innerText)
    calculator.updateDisplay()
  })
})

optBtn.forEach((button : HTMLElement) => {
  button.addEventListener("click", () => {
    calculator.appendOperator(button.innerText)
    calculator.updateDisplay()
  })
})

deleteBtn!.addEventListener("click", () => {
  calculator.delete()
  calculator.updateDisplay()
})

clearBtn!.addEventListener("click", () => {
  calculator.clear()
  calculator.updateDisplay()
})

equalBtn!.addEventListener("click", () => {
  calculator.compute()
  calculator.updateDisplay()
  calculator.updateHistory()
})





//Function ตรวจว่าเป็น operator รึเปล่า  (Operater คือ +-*/)
function checkOperator(ch: string): boolean {
  const mathOperatorRegex = /[+\-*/^]/
  if (mathOperatorRegex.test(ch)) //ถ้าเป็นจะ return true, ถ้าไม่เป็น return false
    return true
  else
    return false
}

function infixToPostfix(str:string) :string{
  let ch:string
  let output : string = " "
  let myStack: Stack = new Stack()
  for(let i = 0;i<str.length;i++){
    ch=str.charAt(i)
    if(ch=="("){
       myStack.puts(ch)
       console.info("----list of stack 1 ----")
       myStack.display()
    }
    else if (checkOperator(ch)){
        while(!myStack.isEmpty()&& checkPriority(ch)<=checkPriority(myStack.peek())){
            output = output + myStack.pops()
        }
        myStack.puts(ch)
        console.info("----list of stack 2 ----")
        myStack.display()
    }
    else if (ch== ")"){
        while(!myStack.isEmpty() && myStack.peek()!="(" ){
            output = output + myStack.pops()
        }
        myStack.pops()
        console.info("----list of stack 3 ----")
        myStack.display()
    }
    else{
        output=output+ch
    }
       }
       while(!myStack.isEmpty()){
           output = output+myStack.pops()
       }
       return output
   }
   
function checkPriority( c : string) : number{
    if(c == "+"|| c== "-")
    return 1
    else if (c == "*"|| c == "/")
    return 2
    else if (c =="^")
    return 3
    else
    return 0
}

function solvePostfix(str: string): number {
  let ch: string
  let output: number = 0
  let mystack: Stack = new Stack()
  for (let i = 0; i < str.length; i++) {
      ch = str.charAt(i)
      if (!checkOperator(ch)) {
          mystack.puts(ch)
          console.info("--- Next ---")
          mystack.display()
      } else {
          output = parseInt(mystack.pops())
          if (ch == "+") {
              output = parseInt(mystack.pops()) + output
          } else if (ch == "-") {
              output = parseInt(mystack.pops()) - output
          } else if (ch == "*") {
              output = parseInt(mystack.pops()) * output
          } else if (ch == "/") {
              output = parseInt(mystack.pops()) / output
          } else if (ch == "^") {
              output = parseInt(mystack.pops()) ** output
          }
          mystack.puts(String(output))
          output = 0
      }
  }
  output = parseInt(mystack.pops())
  return output
}