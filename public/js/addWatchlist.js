const pathArray = ['AAPL','AFRM','AMZN','CRM','FB','MDB','MSFT','NMRK','TSLA','UPST']

const ulList = document.querySelector('#stocklist')

for(let i = 0; i < pathArray.length; i++){   
    let element = document.createElement('li')
    element.innerHTML = pathArray[i]
    let input = document.createElement('input')
    input.setAttribute("type", "checkbox");
    input.setAttribute("name", `${pathArray[i]}`);
    ulList.appendChild(element)
    ulList.appendChild(input)
}