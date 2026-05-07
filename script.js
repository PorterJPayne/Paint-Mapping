const MAP_WIDTH = 2000;
const MAP_HEIGHT = 743;

const floorImage =
  document.getElementById("floorImage");

const overlay =
  document.getElementById("overlay");

const mapViewport =
  document.getElementById("mapViewport");

const mapTransform =
  document.getElementById("mapTransform");

const roomList =
  document.getElementById("roomList");

const roomPanel =
  document.getElementById("roomPanel");

const emptyState =
  document.getElementById("emptyState");

const roomTitle =
  document.getElementById("roomTitle");

const floorLabel =
  document.getElementById("floorLabel");

const paintContainer =
  document.getElementById("paintContainer");

const notesDisplay =
  document.getElementById("notesDisplay");

let currentFloor = "1st-floor";
let currentRoom = null;

let zoom = 1;
let panX = 0;
let panY = 0;

const buildingData = {

  floors:{

    "1st-floor":{
      image:"1st-floor.png",
      rooms:[]
    },

    "2nd-floor":{
      image:"2nd-floor.png",
      rooms:[]
    },

    "5th-floor":{
      image:"5th-floor.png",
      rooms:[]
    }

  }

};

function updateTransform(){

  mapTransform.style.transform =
    `
    translate(${panX}px, ${panY}px)
    scale(${zoom})
    `;

}

function centerMap(){

  const viewportWidth =
    mapViewport.clientWidth;

  const viewportHeight =
    mapViewport.clientHeight;

  panX =
    (viewportWidth - MAP_WIDTH) / 2;

  panY =
    (viewportHeight - MAP_HEIGHT) / 2;

  updateTransform();

}

function renderFloor(){

  overlay.innerHTML = "";

  const floor =
    buildingData.floors[currentFloor];

  floorImage.src = floor.image;

  floor.rooms.forEach(room=>{

    const polygon =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );

    polygon.setAttribute(
      "points",
      room.points
    );

    polygon.setAttribute(
      "class",
      "room"
    );

    polygon.addEventListener(
      "click",
      ()=>{

        selectRoom(room.id);

      }
    );

    overlay.appendChild(polygon);

  });

}

function selectRoom(roomId){

  currentRoom = roomId;

  const room =
    buildingData
      .floors[currentFloor]
      .rooms
      .find(
        room => room.id === roomId
      );

  if(!room) return;

  emptyState.classList.add(
    "hidden"
  );

  roomPanel.classList.remove(
    "hidden"
  );

  roomTitle.textContent =
    room.id;

  floorLabel.textContent =
    currentFloor;

  paintContainer.innerHTML = "";

  room.paints.forEach(paint=>{

    const card =
      document.createElement("div");

    card.className =
      "paint-display-card";

    card.innerHTML = `
      <div class="paint-surface">
        ${paint.surface}
      </div>

      <div class="paint-name">
        ${paint.color}
      </div>

      <div class="paint-code">
        ${paint.code}
      </div>

      <div class="paint-meta-row">

        <div>
          <strong>Finish</strong>
          <br>
          ${paint.finish}
        </div>

        <div>
          <strong>Brand</strong>
          <br>
          ${paint.brand}
        </div>

      </div>
    `;

    paintContainer.appendChild(card);

  });

  notesDisplay.textContent =
    room.notes || "No notes";

}

function zoomAtPoint(
  screenX,
  screenY,
  zoomFactor
){

  const oldZoom = zoom;

  zoom *= zoomFactor;

  zoom =
    Math.max(
      0.4,
      Math.min(zoom, 5)
    );

  const zoomRatio =
    zoom / oldZoom;

  const rect =
    mapViewport.getBoundingClientRect();

  const viewportX =
    screenX - rect.left;

  const viewportY =
    screenY - rect.top;

  panX =
    viewportX -
    (viewportX - panX)
    * zoomRatio;

  panY =
    viewportY -
    (viewportY - panY)
    * zoomRatio;

  updateTransform();

}

mapViewport.addEventListener(
  "wheel",
  (event)=>{

    event.preventDefault();

    const zoomFactor =
      event.deltaY < 0
      ? 1.03
      : 0.97;

    zoomAtPoint(
      event.clientX,
      event.clientY,
      zoomFactor
    );

  },
  { passive:false }
);

window.addEventListener(
  "load",
  ()=>{

    centerMap();

    renderFloor();

  }
);
