/* eslint-disable import/extensions */
import  {myconfig } from "./configs.js";
import  {Car } from "./car.js";
import  {Cars } from "./cars.js";
import {callElavator, listener } from "./uiFunctions.js";
import  { getIntID } from "./Helpers.js";

export class Building{
    constructor(id){
        this.id=id;
        this.floors=[];
        this.cars= new Cars();
    }  
}

export const allbuildings=[];

export function buildBuildings(){
    let i=0;
    do {
        addbuilding(i);
        i+=1;
    }
    while (i<myconfig.NumberOfBuildings);
}



function addbuilding(id){

    var buildings=document.getElementById('buildings');
    var newdiv = document.createElement('div');
    newdiv.id='building'+id;
    newdiv.className='building';
    buildings.appendChild(newdiv);
    
    allbuildings.push(new Building(id));

    addFloors(newdiv.id);
    addElevators(newdiv.id);
}

function addFloors(id){
    const building=document.getElementById(id);
    const newdivContainer = document.createElement('div');
    newdivContainer.id=id+'floors';
    newdivContainer.className='floors';
    building.appendChild(newdivContainer);

    const floors= [];
    let f;
    for (f=myconfig.NumberOfFloors -1; f>=0; f--) {
        floors[f]={floorNumber:f};
        const newdiv = document.createElement('div');
        newdiv.id=id+'floor'+f;
        newdiv.className='floor';
        newdivContainer.appendChild(newdiv, f);
        if (f>0){
            const newline = document.createElement('hr');
            newdivContainer.appendChild(newline);
        }
        addButtonTimer(newdiv.id, f);
    }
    allbuildings[getIntID(id)].floors=floors;
}

function addButtonTimer(floorid, f){
    const floor=document.getElementById(floorid);
    const newdiv = document.createElement('button');
    newdiv.id=floorid+'Button';
    newdiv.innerText=f; //Can also use getIntID
    newdiv.className='metal linear';
    newdiv.addEventListener("click", function(){        
            callElavator(newdiv);                
    });
    floor.appendChild(newdiv);   
        
    const newdivTimer = document.createElement('div');
    newdivTimer.id=floorid+'Timer';
    newdivTimer.className='timer'; 
    floor.insertBefore(newdivTimer, newdiv);
    newdivTimer.style.display="none";
}

function addElevators(id){
    const buildingElement=document.getElementById(id);
    const newdivContainer = document.createElement('div');
    newdivContainer.id=id+'elevators';
    newdivContainer.className='elevators';
    buildingElement.appendChild(newdivContainer);
    let cars= new Cars();
    let f;
    for (f=0; f<myconfig.NumberOfElevators; f++) {
        cars.push(new Car(f));
        const newdivShaft = document.createElement('div');
        newdivShaft.id=id+'elevatorshaft'+f;
        newdivShaft.className='elevatorshaft';
        newdivContainer.appendChild(newdivShaft);
        const newdiv = createDiv('elevator', id, f);

        newdiv.innerHTML='<img src="resources/elv.png" alt="Elevator" class="elevatorImg"/>';
        newdiv.addEventListener("animationstart", listener, false);
        newdiv.addEventListener("animationend", listener, false);
        newdivShaft.appendChild(newdiv);

        const elevFillerT = createDiv('elevFillerT', id, f);
        const numberOfFloors = allbuildings[getIntID(id)].floors.length - 1;
        elevFillerT.style.flex=`${numberOfFloors} 1 auto`;
        newdivShaft.appendChild(elevFillerT);

        const elevFillerB = createDiv('elevFillerB', id, f);
        elevFillerB.style.flex='0 1 auto';
        newdivShaft.insertBefore(elevFillerB, newdiv);
    }

    allbuildings[getIntID(id)].cars=cars;
}

function createDiv(name, id, f){
    const newdiv = document.createElement('div');
    newdiv.id=id+name+f;
    newdiv.className=name;

    return newdiv;
}