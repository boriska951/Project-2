const pathArray = ['AAPL.csv','AFRM.csv','AMZN.csv','CRM.csv','FB.csv','MDB.csv','MSFT.csv','NMRK.csv','TSLA.csv','UPST.csv']

let selectedStock = pathArray[0]

const ulList = document.querySelector('#stocklist')

function destroyStockList(){
    let listOfStocks = document.querySelectorAll('.stocktickers')
    for (let i = 0; i < listOfStocks.length; i++){
        listOfStocks[i].remove()
    }
}

chartIt()

async function chartIt(){
    const data = await getData()
    const ctx = document.getElementById('chart').getContext('2d');
    for(let i = 0; i < pathArray.length; i++){   
        let element = document.createElement('li')
        element.setAttribute("class", "stocktickers")
        element.innerHTML = pathArray[i].slice(0,-4)
        element.addEventListener('click',function(){ 
            selectedStock = element.innerHTML + ".csv"
            destroyStockList()
            myChart.destroy()
            chartIt()
        })
        ulList.appendChild(element)
    }
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.xAxis,
            datasets: [{
                label: `Historical Stock Prices ${selectedStock.slice(0,-4)}`,
                fill: false,
                data: data.yAxis,
                backgroundColor: 
                    'rgba(255, 99, 132, 0.2)'
                ,
                borderColor: 
                    'rgba(255, 99, 132, 1)'
                ,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        callback: function(value, index, values) {
                            return '$' + value;
                        },
                        font: {
                            size: 20
                        }
                    }
                },
                x: {
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 20,
                        font: {
                            size: 20
                        }
                    }
                }
            },
            plugins: {
                zoom: {
                    zoom: {
                        drag: {
                            enabled: true
                        },
                        wheel: {
                            enabled: true
                        },
                        mode: 'x'
                    }
                },
                legend: {
                    labels: {
                        font: {
                            size: 40
                        }
                    }
                }
            }
        }
    });
}

async function getData() {
    const xAxis = []
    const yAxis = []

    const response = await fetch(`../Historical/${selectedStock}`);
    const table = await response.text();

    const rows = table.split('\n').slice(1)
    const rowsLength = rows.length
    const tickerName = rows[0].split(';')[1]
    rows.forEach(row =>{
        const column = row.split(';')
        const stockTicker = column[1]
        const closingDate = column[2]
        xAxis.push(closingDate)
        const closingPrice = parseFloat(column[3].replace('$','').replace(',','.'))
        yAxis.push(closingPrice)
    })
    return {xAxis,yAxis}
}