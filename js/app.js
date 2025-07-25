let $ = document
let labelInput = $.querySelector('#description')
let amountInput = $.querySelector('#amount')
let expenseBtn = $.querySelector('.expensebtn')
let incomeBtn = $.querySelector('.incomebtn')
let expenseList = $.querySelector('#expense-list')
let form = $.querySelector('#expense-form')
let itemTr = $.querySelectorAll('.itemtr')
let myModalsElem = $.querySelector('#mymodals')
let categoryInput = $.querySelector('#category')
let totalAmountElem = $.querySelector('.totalamount')
let myDate = new Date()
let year = myDate.getFullYear()
let month = (myDate.getMonth() + 1).toString()
let day = myDate.getDate().toString()
let labelName = null
let categoryName = null
let amountName = null
let expenseId = null
let newDate = null
/////////////////////////////////////////////

window.addEventListener('load', getAllExpenses);
expenseBtn.addEventListener('click', addExpenseTr);
incomeBtn.addEventListener('click', addIncomeTr);


form.addEventListener('submit', (event) => {
    event.preventDefault()
})

function addExpenseTr() {
    if (labelInput.value && amountInput.value) {
        let expenseData = {
            label: labelInput.value,
            category: categoryInput.value,
            amount: Number(amountInput.value),
            date: year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0'),
            income: false
        };

        fetch('https://expense-tracker-project-de1d6-default-rtdb.firebaseio.com/expenseDatas.json', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        })
            .then(() => {
                labelName = labelInput.value;
                categoryName = categoryInput.value;
                amountName = amountInput.value
                expenseList.insertAdjacentHTML('beforeend', `
                    <tr class="itemtr">
                        <td>${labelName}</td>
                        <td>-${commafy(amountInput.value)}</td>
                        <td class="itemtdsvg" onclick="createModal('${labelName}', '${categoryName}', '${amountName}', '${expenseData.date}')">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 plussvg">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg> 
                        </td> 
                    </tr>
                `);
            })
            .then(() => clearInf())
            .then(() => getAllExpenses())
            .catch((res) => console.log(res));
    } else {
        alert('Please Fill Amount And Label!')

    }
};

function addIncomeTr() {
    if (labelInput.value && amountInput.value) {
        let expenseData = {
            label: labelInput.value,
            category: categoryInput.value,
            amount: Number(amountInput.value),
            date: year + '-' + month.padStart(2, '0') + '-' + day.padStart(2, '0'),
            income: true
        };

        fetch('https://expense-tracker-project-de1d6-default-rtdb.firebaseio.com/expenseDatas.json', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(expenseData)
        })
            .then(() => {
                labelName = labelInput.value;
                categoryName = categoryInput.value;
                amountName = amountInput.value
                expenseList.insertAdjacentHTML('beforeend', `
                <tr class="itemtr">
                    <td class='income'>${labelName}</td>
                    <td class='income'>${commafy(amountInput.value)}</td>
                    <td class="itemtdsvg income" onclick="createModal('${labelName}', '${categoryName}', '${amountName}', ${expenseData.date})">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 plussvg">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg> 
                    </td> 
                </tr>
            `);
            })
            .then(() => clearInf())
            .then(() => getAllExpenses())
            .catch((res) => console.log(res));
    } else {
        alert('Please Fill Amount And Label!')

    }
};



function clearInf() {
    labelInput.value = ''
    categoryInput.value = ''
    amountInput.value = ''
};

window.closeModal = function (event) {
    event.target.parentElement.parentElement.parentElement.parentElement.remove()
};

window.applyModalChanges = function (event, isIncome) {
    categoryName = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value
    labelName = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value
    amountName = event.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value
    newDate = event.target.parentElement.previousElementSibling.previousElementSibling.value

    let expenseData = {
        label: labelName,
        category: categoryName,
        amount: Number(amountName),
        date: newDate,
        income: isIncome,
    };

    fetch(`https://expense-tracker-project-de1d6-default-rtdb.firebaseio.com/expenseDatas/${expenseId}.json`, {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(expenseData)
    })
        .then(res => getAllExpenses())
        .then(() => {
            myModalsElem.innerHTML = ''
        })
        .then(() => {
            createModal(labelName, categoryName, amountName, newDate, expenseData.income, expenseId)
        })
};

window.deleteExpense = function (event) {
    fetch(`https://expense-tracker-project-de1d6-default-rtdb.firebaseio.com/expenseDatas/${expenseId}.json`, {
        method: 'DELETE'
    })
        .then((res) => {
            getAllExpenses()
        })
        .then(() => {
            event.target.parentElement.parentElement.parentElement.parentElement.style.display = 'none'
        })
        .catch((res) => console.log(res))
}

window.createModal = function (labelName, categoryName, amountName, date, isIncome, id) {
    expenseId = id
    myModalsElem.insertAdjacentHTML('beforeend', `
        <div class="modalwrapper">
            <section class="optionsmodal">
                <div class="modal">
                    <div class="modalheader">
                        <span class="modal-header-explain">You can set date, change label,<br> and remove item.</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="size-6 crosssvg" onclick="closeModal(event)">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                        </svg>
                    </div>
                    <div class="modalmain">
                        <label for="changelabel">New Label:</label>
                        <input id="changelabel" type="text" class="rounded-input" value="${labelName}">
                        <br>
                        <label for="modalcategory">Category:</label>
                        <input id="modalcategory" type="text" class="rounded-input" value="${categoryName}">
                        <br>
                        <label for="changeamount">New Amount:</label>
                        <input id="changeamount" type="text" class="rounded-input" value="${amountName}">
                        <br>
                        <label for="changedate">Date:</label>
                        <input id="changedate" type="date" class="rounded-input"  value="${date}">
                        <br>
                        <div class="modalbuttons">
                            <button id="applychanges" onclick="applyModalChanges(event,${isIncome})">Apply Changes</button>
                            <button id="removebtn" onclick="deleteExpense(event)">Delete</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        `);

};

function getAllExpenses() {
    fetch(`https://expense-tracker-project-de1d6-default-rtdb.firebaseio.com/expenseDatas.json`)
        .then(res => res.json())
        .then((datas) => {
            if (datas) {
                let expenseDatas = Object.entries(datas)
                expenseList.innerHTML = ''
                expenseDatas.forEach((expense) => {
                    expenseList.insertAdjacentHTML('beforeend', `
                <tr class="itemtr">
                            <td ${expense[1].income ? `class="income"` : `class="class"`}>${expense[1].label}</td>
                            <td ${expense[1].income ? `class="income"` : `class="class"`}>${expense[1].income ? `` : `-`}${commafy(expense[1].amount)}</td>
                            <td  class="itemtdsvg" onclick="createModal('${expense[1].label}', '${expense[1].category}','${expense[1].amount}',  '${expense[1].date}', ${expense[1].income}, '${expense[0]}')">
                                <svg  class="size-6 plussvg ${expense[1].income ? `income` : ``}"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" "/>
                                    </svg> 
                            </td> 
                        </tr>
                `)
                })
            } else {
                expenseList.innerHTML = ''
            }

        })
        .then(() => {
            expenseCalculator()
        })
        .catch(res => console.log(res))
};

function commafy(num) {
    let str = num.toString().split('.');
    if (str[0].length >= 4) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    return str.join('.');
};

function expenseCalculator() {
    fetch(`https://expense-tracker-project-de1d6-default-rtdb.firebaseio.com/expenseDatas.json`)
        .then(res => res.json())
        .then((datas) => {
            if (datas) {
                let expenseDatas = Object.entries(datas)
                let sum = expenseDatas.reduce((accumulator, currentValue) => {
                    if (!currentValue[1].income) {
                        currentValue[1].amount = -currentValue[1].amount
                    }
                    return accumulator + currentValue[1].amount
                }, 0)
                totalAmountElem.innerHTML = commafy(sum)
            } else {
                totalAmountElem.innerHTML = ''
            }
        })
}
