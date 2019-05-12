/* eslint-disable no-extra-boolean-cast */
/* eslint-disable import/extensions */
import {carConfig } from "./configs.js";
import {onChange } from "./onchange.js";
import {drawCarMove} from "./uiFunctions.js";

var self;
export class Car{
    constructor(id){
        this.id=id;
        this.buildingId = 0;
        this.initLocation = 0;
        this.floorTravel = carConfig.FloorTravel;
        this.floorStop = carConfig.FloorStop;

        this.lastFloorNumber= 0;
        this.stops=[];
        this.stops.push({stop:0, ETA: Date.now()});
        this.proxystops = onChange(this.stops, this.iterateStops);
    }

    lastScheduledStop = function(){
        return this.stops[this.stops.length-1];
    };

    addStop(stopNumber, arrivalTime){
        // eslint-disable-next-line eqeqeq
        let eta= arrivalTime !=null? arrivalTime : calcBetweenStopsTravelTime(stopNumber, this.lastScheduledStop.stop);
        eta += this.floorStop;
        self=this;
        this.proxystops.push({stop:stopNumber, ETA: eta});
    }

    iterateStops() { 
        const dtNow=Date.now();
        for (var i = 1; i < self.stops.length; i++){
            let p=self.stops[i-1], c=self.stops[i];
            setTimeout(function() {
                self.moveCar(p, c);
                //upon arrival remove floor from stops list
                if (self.stops.length>1){
                    self.stops.shift();
                }
            }, 
            Math.max(p.ETA - dtNow, 0) //preventing car from leaving before staying 2s
            ); 
        }        
    }

    moveCar(p,c){
        //Just for fun:
        console.log(`elevator ${this.id} in building ${this.buildingId} travel from ${p.stop} to ${c.stop}`);
        
        //animate movement:
        drawCarMove(this.id, this.buildingId, p, c, carConfig.FloorTravel);        
    }
    
    calcBetweenStopsTravelTime(stopTo, stopFrom){
        var _stopTo= Boolean(stopTo)? stopTo: 0;
        var _stopFrom= Boolean(stopFrom)? stopFrom: 0;
        return  this.floorTravel * Math.abs(_stopTo - _stopFrom);
    }
    
    calcTimeUntilArrival(callingFloorNumber, callTime) {        
        // eslint-disable-next-line no-extra-boolean-cast
        const cTime= Boolean(callTime) ?  callTime: Date.now(); //or currrent!=null 
        if (typeof this.lastScheduledStop() !=='undefined'){
            const freedBy =  Math.max(cTime , this.lastScheduledStop().ETA);            
            const travelTime = this.calcBetweenStopsTravelTime(callingFloorNumber, this.lastScheduledStop().stop);
            return  freedBy + travelTime;            
        }      
    }

    calcTimeUntilArrivalIncludingStopTime(callingFloorNumber, callTime){
        return calcTimeUntilArrival(callingFloorNumber, callTim) + this.floorStop;
    }

    atStopStationary(number){
        const b= typeof this.stops!=='undefined'
                && this.stops.length===1
                && this.stops[0].stop===number;        
        return b;
    }

    atStopOnCertainTime(number, cTime){
        return this.stops.some(v=>v.stop===number 
            && v.ETA<=cTime 
            && v.ETA>=cTime+this.floorStop);
    }
}