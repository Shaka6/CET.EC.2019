/* eslint-disable import/extensions */
import {allbuildings} from "./buildingPart.js";

export function assignCarToCall(buildingId, callingFloorNumber){
    const cars=allbuildings[buildingId].cars;
    //Algorithm to choose minimum waiting time without affecting others.
    //Can also be other Algos, e.g. "Elevator_algorithm"
    const minWaitingTimeCar = cars.findMin('calcTimeUntilArrival', callingFloorNumber);
    //after finding the "closest" (by total waiting time) car, we add new stop to it.
    //we must now add the waiting time, to make sure future calculation include this
    //better to place this in car class, but then we lose the calculation of time done here...
    minWaitingTimeCar.car.addStop(callingFloorNumber, minWaitingTimeCar.eta);
    minWaitingTimeCar.car.buildingId=buildingId;

    return minWaitingTimeCar;
}