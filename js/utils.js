function getFloor(){

  return buildingData.floors[currentFloor];

}

function getCurrentRoom(){

  return getFloor().rooms.find(
    r => r.id === currentRoom
  );

}

function getPaintLibrary(){

  const map = new Map();

  Object.values(buildingData.floors)
    .forEach(floor=>{

      floor.rooms.forEach(room=>{

        room.paints.forEach(paint=>{

          const key =
            JSON.stringify(paint);

          map.set(key,paint);

        });

      });

    });

  return [...map.values()];

}
