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

let currentFloor =
  "1st-floor";

let currentRoom =
  null;

let currentView =
  "map";

let drawMode =
  false;

let drawPoints =
  [];

let editMode =
  false;

let draggingVertex =
  null;

let zoom = 1;

let panX = 0;

let panY = 0;

let draggingMap =
  false;

let dragStartX = 0;

let dragStartY = 0;

let lastSelectedRooms = {

  "1st-floor":null,

  "2nd-floor":null,

  "5th-floor":null

};

let showRoomColors =
  true;

const MAP_WIDTH =
  2000;

const MAP_HEIGHT =
  743;

function getFloor(){

  return buildingData
    .floors[
      currentFloor
    ];

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

function createInventoryId(){

  return crypto.randomUUID();

}
