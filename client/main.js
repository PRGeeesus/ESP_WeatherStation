
var ctx = document.getElementById('firstChart').getContext('2d');
var randomizeBtn = document.getElementById('scambleData').onclick = randomizeData
var gloablData = []
var globalLabels =[]



function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function randomizeData() {
    data.forEach(function(part,idx,some){
        data[idx] = getRandomInt(20)        
    });
    console.log(xdata)
    console.log(ydata)
    myChart.update();
}
//API_URL = 'http://127.0.0.1:5000/graphData'
API_URL = 'http://127.0.0.1:5000/graphData'

window.setInterval(updataData, 1000);


function updataData()
{
fetch(API_URL).then(function(response) {
    // The response is a Response instance.
    // You parse the data into a useable format using `.json()`
    return response.json();
  }).then(function(data){
    // `data` is the parsed version of the JSON returned from the above endpoint.
    console.log(data.labels[0]);
    globalLabels = data.labels[0]
    gloablData = data.xvals[0]
    
    updateDatainChart(myChart,gloablData,globalLabels)
    myChart.update();
  });
}

function updateDatainChart(chart,data,labels) {
    chart.data.datasets[0].data = data
    chart.data.labels = labels 
}

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ["sd","sd","sd","sd","sd","sd","sd"],
        datasets: [{
            label: '# of Votes',
            data: gloablData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: false,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        layout: {
            padding: {
                left: 50,
                right: 0,
                top: 0,
                bottom: 50
            }
        },
        animation: {
            duration: 0
            }
        
    }
});
