let buildingData = {

  inventory:[],

  floors:{

    "1st-floor":{
      rooms:[]
    },

    "2nd-floor":{
      rooms:[]
    },

    "5th-floor":{
      rooms:[]
    }

  }

};

// CURRENT STATE

let currentFloor =
  "1st-floor";

let currentRoom =
  null;

let currentView =
  "map";

// DRAWING

let drawMode =
  false;

let drawPoints =
  [];

// EDITING

let editMode =
  false;

let draggingVertex =
  null;

// MAP MOVEMENT

let zoom = 1;

let panX = 0;

let panY = 0;

let draggingMap =
  false;

let dragStartX = 0;

let dragStartY = 0;

// ROOM MEMORY

let lastSelectedRooms = {

  "1st-floor":null,

  "2nd-floor":null,

  "5th-floor":null

};

// ROOM COLORS

let showRoomColors = true;

// MAP SIZE

const MAP_WIDTH = 2000;

const MAP_HEIGHT = 743;

// HELPERS

function getFloor(){

  return (
    buildingData
      .floors[
        currentFloor
      ]
  );

}

function getCurrentRoom(){

  return getFloor()
    .rooms
    .find(
      room =>
        room.id === currentRoom
    );

}

function getInventoryPaint(id){

  return buildingData
    .inventory
    .find(
      paint =>
        paint.inventoryId === id
    );

}

function getPaintUsageCount(id){

  let count = 0;

  Object.values(
    buildingData.floors
  ).forEach(floor=>{

    floor.rooms.forEach(room=>{

      room.paints.forEach(ref=>{

        if(
          ref.inventoryId === id
        ){

          count++;

        }

      });

    });

  });

  return count;

}

function createInventoryId(){

  return crypto.randomUUID();

}
