const express = require("express");
//const cors = require('cors');
var bodyParser = require('body-parser')


const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, http://95.90.250.196");  
  res.header("Access-Control-Allow-Origin", "http://yourdomain.com");
  next();
});

app.use(function(err, req, res, next) {
  console.error("CCRROR CAUGHT BY ME: ");
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))


var labels = []
var Temperature = []
var Humidity = []

var tempCache = []
var labelsCache = []
var humiCache = []

var GlobalPreviosDate = "";

app.get('/main',function(req,res){
    var path = __dirname + '/main.js'
    res.sendFile(path);
});
app.get('/styles',function(req,res){
    var path = __dirname + '/styles.css'
    res.sendFile(path);
});


app.get('/',function(req,res){
    var path = __dirname + '/index.html'
    res.sendFile(path);
});

app.get('/alldata',function(req,res){
    res.send({'labels': [labels],'Temperature': [Temperature],'Humidity':[Humidity]})
    humiCache = [];
    tempCache = [];
    labelsCache = [];
});


app.get('/graphData',function(req,res){
  
    res.send({'labels': [labelsCache],'Temperature': [tempCache],'Humidity':[humiCache]})

    humiCache = [];
    tempCache = [];
    labelsCache = [];
});

app.post('/data',(req,res)=>{
    //console.log(req.protocol)
    //console.log(req.get('Content-Type'))
    //console.log(req.hostname)
    //console.log(req.body)
    const {time,Temp,Humi } = req.body;
    if (time == "nan")
    {	
        //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var today = new Date();
        var date = today.getDate()+'-'+(today.getMonth()+1+'-'+today.getFullYear());
        var currenttime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var lastlabel = String(labels[labels.length-1])
        
        // only display date if there was a change in date
        if(date == GlobalPreviosDate){ 
            console.log("same Date");
            var realtime = currenttime;
        }
        else{
            var realtime = date+"  - "+currenttime;    
        }
    }
    else{
        realtime = time;
    }
    GlobalPreviosDate = date;

    // this is to be emptied as doon as the newest data was rquested
    tempCache.push(Temp)
    labelsCache.push(realtime)
    humiCache.push(Humi)
    

    // this should be in a database I am saving 24 hrs in a local array :/
    Temperature.push(Temp)
    Humidity.push(Humi)
    labels.push(realtime)
    if (Temperature.length > 40000){
        Temperature.shift();
        Humidity.shift();
        labels.shift();
    }
    //console.log("recieved new Data from ESP")
    res.send('thanks from node :D');
});

// catch all unrouted errors

app.all('*', function(req, res) {
    throw new Error("Bad request")
    console.log("Bad request")
})

//const PORT = process.env.PORT || 8888;
const PORT = process.env.PORT;

//const ADDRESS = "192.168.178.26";
//const ADDRESS = "127.0.0.1";

var server = app.listen(PORT, function(err) {
    if (err) return console.log(err);
    console.log("Listening on adress " + server.address().address + ":" + server.address().port)
    console.log("Server Started")
});



