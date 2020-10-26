var ctx = document.getElementById('firstChart').getContext('2d');
var canvasElement = document.getElementById('container1')

var hideTempButton = document.getElementById('hideTemp').onclick = hideTemperature
var hideHumiButton = document.getElementById('hideHumi').onclick = hideHumidity
var clearDataButton = document.getElementById('ClearData').onclick = clearData
var nrDataSamplesShow = document.getElementById('nrDataSamples')

var hideCanvasSettingsButton = document.getElementById('hideCanvasSettings').onclick = hideCanvasSettings
var canvasSettingsDiv = document.getElementById('canvasSettings')

var gloablTempData = []
var gloablHumiData = []
var globalLabels = []

humMax = 75
humMin = 50
tempMax = 26
tempMin = 19

//HOST = "http://192.168.178.26:5000"
//HOST = "http://127.0.0.1:5000";
HOST = "https://esp-data-logger.herokuapp.com"


ALLDATA_URL = HOST + "/alldata";
//ALLDATA_URL = "esp-weather-station.vercel.app/alldata"

API_URL = HOST + '/graphData';
//API_URL = 'http://192.168.178.26:5000/graphData';
//API_URL = "esp-weather-station.vercel.app/graphData"

const ADDRESS = "192.168.178.26";

fetch(ALLDATA_URL).then(function(response) {
    // The response is a Response instance.
    // You parse the data into a useable format using `.json()`
    return response.json();
  }).then(function(data){
    // `data` is the parsed version of the JSON returned from the above endpoint.
    if(data.labels[0] != ""){
        //console.log(data.labels[0]);
        //console.log(data.Temperature[0]);
        //console.log(data.Humidity[0]);
        console.log("Gathering data upon Initial loading " + String(data.labels[0].length) + " dataseamples")

        globalLabels = data.labels[0]
        console.log("Recieving: " + String(data.labels[0].length) + " new labels")
        console.log("Parsing data on Initial Load. This may take a bit")
        for(var i= 0; i< (data.labels[0].length) ; i++){
            gloablTempData.push(softenData(data.Temperature[0][i],gloablTempData))
            gloablHumiData.push(softenData(data.Humidity[0][i],gloablHumiData)) 
        }
        //temptemp = softenData(temptemp,gloablTempData) // last one of last function call is always undefined, why???
        //temphumi = softenData(temphumi,gloablHumiData) 
        //gloablTempData = data.Temperature[0]
        //gloablHumiData = data.Humidity[0]
       
        updataLabelsinChart(myChart,globalLabels)
        updateDatainChart(myChart,gloablTempData,gloablHumiData)
        nrDataSamplesShow.innerHTML  = String(globalLabels.length) + " data Samples";
        myChart.update();
        console.log("Done Loading Data")
    }
    else
    {
        console.log("No Data found")
    }
  });


function hideCanvasSettings(){
    if (canvasSettingsDiv.hidden == false) {
        canvasSettingsDiv.hidden = true;
    } else {
        canvasSettingsDiv.hidden = false;
    }
}

function clearData()
{
    myChart.data.datasets[0].data = []
    myChart.data.datasets[1].data = []
    gloablTempData = []
    gloablHumiData = []
    myChart.update();
    console.log("Cleared All Data")
    console.log(myChart.data.datasets[0])
    console.log(myChart.data.datasets[1])
    console.log(gloablTempData)
    console.log(gloablHumiData)
}

function hideTemperature(){
    if (myChart.data.datasets[0].hidden == false) {
        myChart.data.datasets[0].hidden = true;
    } else {
        myChart.data.datasets[0].hidden = false;
    }
    myChart.update();
    //myChart.data.datasets[0].display = "none";
}
function hideHumidity(){
    if (myChart.data.datasets[1].hidden == false) {
        myChart.data.datasets[1].hidden = true;
    } else {
        myChart.data.datasets[1].hidden = false;
    }
    myChart.update();
    //myChart.data.datasets[0].display = "none";

}

function HideCanvas(){
    if (canvasElement.style.display === "none") {
        canvasElement.style.display = "block";
    } else {
        canvasElement.style.display = "none";
    }
}


UPDATE_INTERVAL = 20000
updating_interval = window.setInterval(updataData, UPDATE_INTERVAL);
var updateIntervalSelectOr = document.getElementById('updateIntervalSelect')
updateIntervalSelectOr.onchange = updateInterval
function updateInterval(){
    UPDATE_INTERVAL = updateIntervalSelectOr.value;
    window.clearInterval(updating_interval);
    updating_interval = window.setInterval(updataData, UPDATE_INTERVAL);
}

// TODO: Update the boud so that the graph looks nice
function updateTempHumiBounds(temperature,humidity)
{
    
    if(temperature <= tempMin)
    {
        tempMin = temperature -1;
    }
    if(temperature > tempMax)
    {
        tempMax = temperature+1;
    }
    if(humidity <= humMin)
    {
        humMin = humidity-1;
    }
    if(humidity > humMax)
    {
        humMax = humidity+1;
    }
    myChart.options.scales.yAxes[0].ticks.min = tempMin
    myChart.options.scales.yAxes[0].ticks.max = tempMax
    myChart.options.scales.yAxes[1].ticks.min = humMin
    myChart.options.scales.yAxes[1].ticks.max = humMax
    myChart.update();
}

function softenData(data,water)
{
    //console.log("Softening:")
    var SoftenInterval = 5;
    var avgData = 0;
    if(water.length < SoftenInterval+1){
        return data
    }
    for(i=1; i <= SoftenInterval;i++)
    {   
        avgData += water[water.length-i]    
        //console.log(water[water.length-i])
        //console.log(typeof(water[water.length-i]))
    }
    avgData += data
    avgData = avgData/(SoftenInterval+1)
    //console.log(data)
    //console.log(typeof(data))
    //console.log(avgData)
    //console.log(typeof(avgData))
    return avgData
}

function updataData()
{
fetch(API_URL).then(function(response) {
    // The response is a Response instance.
    // You parse the data into a useable format using `.json()`
    return response.json();
  }).then(function(data){
    // `data` is the parsed version of the JSON returned from the above endpoint.
    if((data.labels[0]) && (data.Temperature[0]) && (data.Humidity[0])){
        //console.log(data.labels[0]);
        //console.log(data.Temperature[0]);
        //console.log(data.Humidity[0]);
        console.log("Getting new data from Server: " + String(data.labels[0].length) + " datapoints" )

        for (var i = 0; i < data.labels[0].length; i++){
            var temptemp = data.Temperature[0][i]
            var temphumi = data.Humidity[0][i]
            //console.log(temptemp)
            //console.log(typeof(temptemp))
            //console.log(temphumi)
            //console.log(typeof(temphumi))

            //updateTempHumiBounds(data.Temperature[0][i],data.Humidity[0][i])
            temptemp = softenData(temptemp,gloablTempData) // last one of last function call is always undefined, why???
            temphumi = softenData(temphumi,gloablHumiData)  

            gloablTempData.push(temptemp)
            gloablHumiData.push(temphumi)
            globalLabels.push(data.labels[0][i])
          }
        updateDatainChart(myChart,gloablTempData,gloablHumiData)
        updataLabelsinChart(myChart,globalLabels)
        nrDataSamplesShow.innerHTML  = String(globalLabels.length) + " data Samples";
        myChart.update();
    }
    else{
        console.log("No Data found")
    }
  });
}

function updateDatainChart(chart,temp,humi) {
    chart.data.datasets[0].data = temp
    chart.data.datasets[1].data = humi
}

function updataLabelsinChart(chart,labels){
    chart.data.labels = labels
}

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: globalLabels,
        datasets: [{
            label: "Temperature",
            data: gloablTempData,
            fill : false,
            borderColor : 'rgba(255, 0, 0, 0.6)',
            pointRadius: 0,
            yAxisID: 'A',
            hidden: false,
        },
        {
            label: "Humidity",
            data: gloablHumiData,
            fill : false,
            borderColor : 'rgba(0, 0, 255, 0.4)',
            pointRadius: 0,
            yAxisID: 'B',
            hidden: false,
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        title: {
            display: true,
            text: 'Temperatur and Humidity'
        },
        scales: {
            yAxes: [{
                id: 'A',
                type: 'linear',
                position: 'left',
                ticks: {
                    max: tempMax,
                    min: tempMin
                  },
                scaleLabel: {
                    display: true,
                    labelString: "Temperature",
                    fontColor: "red",
                    padding: 20,
                    fontFamily: "'Arial', sans-serif",
                    fontSize: 12,
                    fontStyle: "bold",

                  }
              }, {
                id: 'B',
                type: 'linear',
                position: 'right',
                ticks: {
                  max: humMax,
                  min: humMin
                },
                scaleLabel: {
                    display: true,
                    labelString: "Humidity",
                    fontColor: "Blue",
                    padding: 20,
                    fontFamily: "'Arial', sans-serif",
                    fontSize: 12,
                    fontStyle: "bold",
                  }
              }],
            xAxes: [{
                ticks: {
                    beginAtZero: false,
                    fontSize: 16,
                    maxRotation: 30,
                    minRotation: 0
                },
                scaleLabel: {
                    display: true,
                    labelString: "Time",
                    fontColor: "black",
                    padding: 30,
                    fontFamily: "'Arial', sans-serif",
                    fontSize: 32,
                    fontStyle: "bold",
                  }
            }]
        },

        animation: {
            duration: 0
            }
        
    }
});
