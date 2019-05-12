export class Cars extends Array {
    constructor(...items) {
        super(...items);        
    }

    findMin= (attribut, callingFloorNumber) => {

        var mapT=[];
        this.forEach((x) =>  {
            var el={car:x, eta:x[attribut](callingFloorNumber) + x.floorStop};
            mapT.push(el);
        });
        
        return mapT.reduce(function(p, c){
            return c.eta < p.eta ? c: p;
        });
        //Below shorter, but calculate twice for each comparison...
        // return this.reduce(function(prev, curr){
        //     return curr[attribut](callingFloorNumber) < prev[attribut](callingFloorNumber) ? curr : prev; 
        // });
     }; 
     
     findIfAnyCarAtStop (floorNumber, cTime){
        var someOnFloorAtTime = function (el) {
            return el.atStopStationary(floorNumber) || el.atStopOnCertainTime(floorNumber, cTime);
        };

        return this.some(someOnFloorAtTime);
     }
}