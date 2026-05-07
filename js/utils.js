function getFloor(){

  return buildingData.floors[currentFloor];

}

function getCurrentRoom(){

  return getFloor().rooms.find(
    r => r.id === currentRoom
  );

}

function getInventoryPaint(id){

  return buildingData.inventory.find(
    paint =>
      paint.inventoryId === id
  );

}

function createInventoryId(){

  return "INV-" +
    Math.random()
      .toString(36)
      .substring(2,8)
      .toUpperCase();

}

function getPaintUsageCount(id){

  let count = 0;

  Object.values(
    buildingData.floors
  ).forEach(floor=>{

    floor.rooms.forEach(room=>{

      room.paints.forEach(ref=>{

        if(ref.inventoryId === id){

          count++;

        }

      });

    });

  });

  return count;

}
