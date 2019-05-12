//Helpers:
export function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

export function getBuildingId(btn){
    let buildingId=0;
    const building=btn.closest(".building");
    if (building!=='undefined') {
        buildingId=getIntID(building.id);
    } else {
        buildingId=findAncestor(btn, "building" );
    }
    return buildingId;
}

export function getIntID (str){
    //d-is-less-efficient-than-0-9
    const results=str.match(/\d+$/);
    if (results.length<1){
        return null;
    } else {
        return results[0];
    }
}

export function addToDate(dateToAdd, additionTimeMS) {
    var d=Date.parse(dateToAdd);
    d= new Date(d + additionTimeMS);
    return d;
}

//not used but nice:
// export function addToDate(dateToAdd, additionTimesMS) {
//     var d=Date.parse(dateToAdd);
//     const sumAdditionTimeMS = additionTimesMS.reduce((accumulator, a)=> {
//         return accumulator + a;
//     });
//     d= new Date(d + sumAdditionTimeMS);
//     return d;
// }
