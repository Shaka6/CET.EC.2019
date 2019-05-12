/* eslint-disable import/extensions */
import {allbuildings } from "./buildingPart.js";
import {assignCarToCall} from "./carAssignAlgo.js";
import {getBuildingId, getIntID} from "./helpers.js";


export function elevatorOnFloor(buildid, callingFloorNumber){   
    const dtNow= Date.now();
    const found=allbuildings[buildid].cars.findIfAnyCarAtStop(callingFloorNumber, dtNow);                
    return found!== false;    
}

export function callElavator(btn){
    if (btn.style.color!=="green"){

        const buildingId=getBuildingId(btn);
        const callingFloorNumber=parseInt(btn.innerText); //Used Algo relies also on distance. Therefore must have calling floor

        if (!elevatorOnFloor(buildingId, callingFloorNumber)){
            btn.style.color="green";

            let bestCar=assignCarToCall(buildingId, callingFloorNumber);

            let calledCar=bestCar.car;

            toggleFloor(buildingId, callingFloorNumber, calledCar, btn);
        }
    }
}

export function drawCarMove(calledCarId, buildingId, floorFrom, floorTo, floorTravel){
       
    if (floorTo.stop-floorFrom.stop!==undefined & floorTo.stop-floorFrom.stop!==0){        

        modifyFillers(calledCarId, buildingId, floorFrom, floorTo, floorTravel);
    }
}

function modifyFillers(calledCarId, buildingId, floorFrom, floorTo, floorTravel){

    const carView=document.getElementById('building'+buildingId+'elevator'+calledCarId);
    const fillerB=carView.previousSibling;
    const fillerT=carView.nextSibling;
    setFillersStyle(fillerB, fillerT,  buildingId, floorFrom, floorTo, floorTravel);
}

function setFillersStyle(fillerB, fillerT,  buildingId, floorFrom, floorTo, floorTravel){

    let totalTravelTime=Math.abs((floorTo.stop-floorFrom.stop) * floorTravel)/1000;
    const floorsbelow = floorTo.stop;
    const floorsabove = allbuildings[buildingId].floors.length - floorTo.stop - 1;    
    fillerB.style.flex=`${floorsbelow} 1 auto`;
    fillerT.style.flex=`${floorsabove} 1 auto`;
    fillerB.style.transition=`flex ${totalTravelTime}s ease-in-out`; //linear
    fillerT.style.transition=fillerB.style.transition;
}

function ringBell(){
    let audio = new Audio('../resources/ding.mp3');
    audio.loop = false;
    //audio.time=4000;
    audio.play();
}

function toggleFloor(buildingId, callingFloorNumber, calledCar, btn){

    const arrivalPlusWaitMS = calledCar.stops.find((el)=>{
        return el.stop===callingFloorNumber;
    }).ETA;
    
    const dtNow=Date.now();
    // eslint-disable-next-line no-extra-parens
    const waitingTimeMS=(arrivalPlusWaitMS - calledCar.floorStop) - dtNow - calledCar.floorStop;
    
    const buildingFloor=document.getElementById(`building${buildingId}floor${callingFloorNumber}`);
    const floorTimer=buildingFloor.firstChild;

    if (floorTimer.style.display === "none") {
        floorTimer.style.display = "block";

        let seconds = Math.ceil(waitingTimeMS/1000);
        
        //simplest way to start immediately. There are other options...
        floorTimer.innerText=seconds;  
        let x = setInterval(function() {  
            seconds--;               
            if (seconds <= 0) {
                resetAll(floorTimer, btn, buildingId, calledCar.id);
                clearInterval(x);              
            } else {
                floorTimer.innerText=seconds;
            }            
          }, 1000);        
      } else {
        resetAll(floorTimer, btn, buildingId, calledCar.id);
    }
}

function resetAll(floorTimer, btn, buildingId, calledCarId){
    resetFloor(floorTimer, btn);
    resetElevator(buildingId, calledCarId);
}

function resetElevator(buildingId, calledCarId){
    const carView=document.getElementById('building'+buildingId+'elevator'+calledCarId);
    const fillerB=carView.previousSibling;
    const fillerT=carView.nextSibling;
    fillerB.style.transition=`none`;   
    fillerT.style.transition=fillerB.style.transition;
}

function resetFloor(floorTimer, btn){
    ringBell();
    // eslint-disable-next-line eqeqeq
    if (floorTimer!=null){
        floorTimer.style.display = "none";
    }
    // eslint-disable-next-line eqeqeq
    if (btn!=null){
        btn.style.color="hsla(0,0%,20%,1)";
    }
}

//Not used, but nice to have, e.g....
export function listener(event) {
    const carView= event.target;
    switch(event.type) {
      case "animationstart":
        break;
      case "animationend":
        break;
    }
}