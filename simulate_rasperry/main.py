import requests
import random
import time
from datetime import datetime
#url = 'https://wool-infrequent-domain.glitch.me/data'
#url = 'http://127.0.0.1:5000/data'
#url = 'http://192.168.178.26:5000/data'
url = "https://factual-temporal-alligator.glitch.me/data";

maxTemp = 32
minTemp = 18
Temp = random.randint(minTemp,maxTemp)
maxHumi = 80
minHumi = 40
Humi = random.randint(minHumi,maxHumi)
TempInterval = 1
HumInterval = 1

def checkIntervals(humi,temp):
    if humi < minHumi:
        humi = humi + 2*HumInterval
    elif humi > maxHumi:
        humi = humi-2*HumInterval
    
    if temp < minTemp:
        temp = temp + 2* TempInterval
    elif temp > maxHumi:
        temp = temp-2* TempInterval
    
    return (humi,temp)


while(1):
    Temp = random.randint(Temp-TempInterval,Temp+TempInterval)
    Humi = random.randint(Humi-HumInterval,Humi+HumInterval)

    (Humi,Temp) = checkIntervals(Humi,Temp)
    now = datetime.now()
    current_time = now.strftime(" %H:%M:%S  - %d %B %y ")
    print(current_time)
    #print("Current Time =", current_time)
    query = {'time': current_time,'Temp':Temp, 'Humi':Humi}
    
    res = requests.post(url, data=query)
    print("response: " + res.text)
    time.sleep(1)


#{"args":{},"data":{"time":"nan"},"files":{},"form":{},"headers":{"x-forwarded-proto":"https","x-forwarded-port":"443","host":"postman-echo.com","x-amzn-trace-id":"Root=1-5f903d1d-5669a9830abe41b9021c4ddf","content-length":"14","content-type":"application/json"},"json":{"time":"nan"},"url":"https://postman-echo.com/post"}
