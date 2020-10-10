const express = require("express");
const cors = require('cors');
var bodyParser = require('body-parser')


const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))


ydata = []
xdata1 = []


app.get('/main',function(req,res){
    path = __dirname + '\\client\\' + 'main.js'
    res.sendFile(path);
});

app.get('/',function(req,res){
    path = __dirname + '\\client\\' + 'index.html'
    res.sendFile(path);
});

app.get('/graphData',function(req,res){
    path = __dirname + '\\client\\' + 'index.html'
    res.send({'labels': [ydata],'xvals': [xdata1]})
});

app.post('/data',(req,res)=>{
    const { time, value } = req.body;

    xdata1.push(value)
    ydata.push(time)
    
    if (ydata.length > 20){
        ydata.shift();
        xdata1.shift();
    }
    console.log("recieved new Data from Pi")
    res.send('thanks from node :D');
});


const PORT = process.env.PORT || 5000;
app.listen(PORT);
console.log("Listening on port 5000")
