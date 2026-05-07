const MAP_WIDTH = 2000;
const MAP_HEIGHT = 743;

let currentFloor = "1st-floor";
let currentRoom = null;

const lastSelectedRooms = {

  "1st-floor":null,
  "2nd-floor":null,
  "5th-floor":null

};

let drawMode = false;
let editMode = false;

let drawPoints = [];

let zoom = 1;
let panX = 0;
let panY = 0;

let draggingMap = false;

let dragStartX = 0;
let dragStartY = 0;

let draggingVertex = null;

const defaultData = {

  floors:{

    "1st-floor":{
      image:"images/1st-floor.png",
      rooms:[]
    },

    "2nd-floor":{
      image:"images/2nd-floor.png",
      rooms:[]
    },

    "5th-floor":{
      image:"images/5th-floor.png",
      rooms:[]
    }

  }

};

let buildingData =
  JSON.parse(
    localStorage.getItem("paintMapData")
  ) || defaultData;
