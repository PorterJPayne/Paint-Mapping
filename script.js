const MAP_WIDTH = 2000;
const MAP_HEIGHT = 743;

const overlay =
  document.getElementById("overlay");

const floorImage =
  document.getElementById("floorImage");

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

const notesField =
  document.getElementById("notesField");

const floorSelect =
  document.getElementById("floorSelect");

const drawBtn =
  document.getElementById("drawBtn");

const undoBtn =
  document.getElementById("undoBtn");

const finishBtn =
  document.getElementById("finishBtn");

const cancelBtn =
  document.getElementById("cancelBtn");

const drawStatus =
  document.getElementById("drawStatus");

const editBtn =
  document.getElementById("editBtn");

const saveBtn =
  document.getElementById("saveBtn");

const cancelEditBtn =
  document.getElementById("cancelEditBtn");

const deleteRoomBtn =
  document.getElementById("deleteRoomBtn");

const addPaintBtn =
  document.getElementById("addPaintBtn");

const exportBtn =
  document.getElementById("exportBtn");

const importBtn =
  document.getElementById("importBtn");

const importFile =
  document.getElementById("importFile");

const mapViewport =
  document.getElementById("mapViewport");

const mapTransform =
  document.getElementById("mapTransform");

const searchInput =
  document.getElementById("searchInput");

let currentFloor = "1st-floor";
let currentRoom = null;

let drawMode = false;
let editMode = false;

let drawPoints = [];

let zoom = 1;
let panX = 0;
let panY = 0;

let draggingMap = false;

let dragStartX = 0;
let dragStartY = 0;

const defaultData = {

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

let buildingData =
  JSON.parse(
    localStorage.getItem("paintMapData")
  ) || defaultData;

function saveData(){

  localStorage.setItem(
    "paintMapData",
    JSON.stringify(buildingData)
  );

}

function getFloor(){

  return buildingData
    .floors[currentFloor];

}

function updateTransform(){

  mapTransform.style.transform =
    `
    translate(${panX}px,${panY}px)
    scale(${zoom})
    `;

}

function centerMap(){

  const w =
    mapViewport.clientWidth;

  const h =
    mapViewport.clientHeight;

  panX =
    (w - MAP_WIDTH)/2;

  panY =
    (h - MAP_HEIGHT)/2;

  updateTransform();

}

function renderRoomList(){

  roomList.innerHTML = "";

  getFloor().rooms.forEach(room=>{

    const div =
      document.createElement("div");

    div.className = "room-item";

    if(room.id === currentRoom){

      div.classList.add("active");

    }

    div.textContent = room.id;

    div.onclick = ()=>{

      selectRoom(room.id);

    };

    roomList.appendChild(div);

  });

}

function renderFloor(){

  overlay.innerHTML = "";

  floorImage.src =
    getFloor().image;

  getFloor().rooms.forEach(room=>{

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

    if(room.id === currentRoom){

      polygon.classList.add("active");

    }

    polygon.onclick = (e)=>{

      e.stopPropagation();

      selectRoom(room.id);

    };

    overlay.appendChild(polygon);

  });

  if(drawMode){

    renderDrawPreview();

  }

  renderRoomList();

}

function selectRoom(id){

  currentRoom = id;

  const room =
    getFloor()
      .rooms
      .find(
        r => r.id === id
      );

  if(!room) return;

  emptyState.classList.add("hidden");

  roomPanel.classList.remove("hidden");

  roomTitle.textContent =
    room.id;

  floorLabel.textContent =
    currentFloor;

  paintContainer.innerHTML = "";

  room.paints.forEach(paint=>{

    const card =
      document.createElement("div");

    card.className = "paint-card";

    card.innerHTML = `
      <div class="paint-surface">
        ${paint.surface || ""}
      </div>

      <div class="paint-name">
        ${paint.color || ""}
      </div>

      <div class="paint-code">
        ${paint.code || ""}
      </div>

      <div class="paint-meta">

        <div>
          <strong>Finish</strong>
          <br>
          ${paint.finish || ""}
        </div>

        <div>
          <strong>Brand</strong>
          <br>
          ${paint.brand || ""}
        </div>

      </div>
    `;

    paintContainer.appendChild(card);

  });

  notesDisplay.textContent =
    room.notes || "No notes";

  renderFloor();

}

function renderDrawPreview(){

  drawPoints.forEach(point=>{

    const circle =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

    circle.setAttribute(
      "cx",
      point[0]
    );

    circle.setAttribute(
      "cy",
      point[1]
    );

    circle.setAttribute(
      "r",
      5
    );

    circle.setAttribute(
      "class",
      "draw-point"
    );

    overlay.appendChild(circle);

  });

  if(drawPoints.length > 1){

    const line =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

    line.setAttribute(
      "points",
      drawPoints
        .map(
          p => `${p[0]},${p[1]}`
        )
        .join(" ")
    );

    line.setAttribute(
      "class",
      "temp-line"
    );

    overlay.appendChild(line);

  }

}

function startDraw(){

  drawMode = true;

  drawPoints = [];

  drawStatus.classList.remove("hidden");

  drawBtn.classList.add("hidden");

  undoBtn.classList.remove("hidden");

  finishBtn.classList.remove("hidden");

  cancelBtn.classList.remove("hidden");

}

function stopDraw(){

  drawMode = false;

  drawPoints = [];

  drawStatus.classList.add("hidden");

  drawBtn.classList.remove("hidden");

  undoBtn.classList.add("hidden");

  finishBtn.classList.add("hidden");

  cancelBtn.classList.add("hidden");

  renderFloor();

}

function finishDraw(){

  if(drawPoints.length < 3){

    alert("Need at least 3 points");

    return;

  }

  const roomName =
    prompt("Room name");

  if(!roomName) return;

  getFloor().rooms.push({

    id:roomName,

    points:drawPoints
      .map(
        p => `${p[0]},${p[1]}`
      )
      .join(" "),

    paints:[],

    notes:""

  });

  saveData();

  stopDraw();

}

overlay.addEventListener(
  "click",
  (event)=>{

    if(!drawMode) return;

    const pt =
      overlay.createSVGPoint();

    pt.x = event.clientX;
    pt.y = event.clientY;

    const svgPoint =
      pt.matrixTransform(
        overlay.getScreenCTM().inverse()
      );

    drawPoints.push([
      svgPoint.x,
      svgPoint.y
    ]);

    renderFloor();

  }
);

drawBtn.onclick = startDraw;

cancelBtn.onclick = stopDraw;

undoBtn.onclick = ()=>{

  drawPoints.pop();

  renderFloor();

};

finishBtn.onclick = finishDraw;

document.addEventListener(
  "keydown",
  (e)=>{

    if(!drawMode) return;

    if(e.key === "Enter"){

      finishDraw();

    }

    if(e.key === "Backspace"){

      drawPoints.pop();

      renderFloor();

    }

  }
);

floorSelect.onchange = ()=>{

  currentFloor =
    floorSelect.value;

  currentRoom = null;

  renderFloor();

};

searchInput.oninput = ()=>{

  const value =
    searchInput.value.toLowerCase();

  const room =
    getFloor().rooms.find(
      r =>
      r.id.toLowerCase().includes(value)
    );

  if(room){

    selectRoom(room.id);

  }

};

exportBtn.onclick = ()=>{

  const blob =
    new Blob(
      [JSON.stringify(buildingData,null,2)],
      {type:"application/json"}
    );

  const url =
    URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download =
    "paint-map.paintmap";

  a.click();

};

importBtn.onclick = ()=>{

  importFile.click();

};

importFile.onchange = (event)=>{

  const file =
    event.target.files[0];

  if(!file) return;

  const reader =
    new FileReader();

  reader.onload = ()=>{

    buildingData =
      JSON.parse(reader.result);

    saveData();

    renderFloor();

  };

  reader.readAsText(file);

};

mapViewport.addEventListener(
  "wheel",
  (event)=>{

    event.preventDefault();

    const factor =
      event.deltaY < 0
      ? 1.03
      : 0.97;

    const oldZoom =
      zoom;

    zoom *= factor;

    zoom =
      Math.max(
        0.3,
        Math.min(zoom,5)
      );

    const rect =
      mapViewport.getBoundingClientRect();

    const mouseX =
      event.clientX - rect.left;

    const mouseY =
      event.clientY - rect.top;

    panX =
      mouseX -
      ((mouseX - panX)
      * (zoom / oldZoom));

    panY =
      mouseY -
      ((mouseY - panY)
      * (zoom / oldZoom));

    updateTransform();

  },
  { passive:false }
);

mapViewport.addEventListener(
  "mousedown",
  (e)=>{

    draggingMap = true;

    dragStartX =
      e.clientX - panX;

    dragStartY =
      e.clientY - panY;

  }
);

document.addEventListener(
  "mousemove",
  (e)=>{

    if(!draggingMap) return;

    panX =
      e.clientX - dragStartX;

    panY =
      e.clientY - dragStartY;

    updateTransform();

  }
);

document.addEventListener(
  "mouseup",
  ()=>{

    draggingMap = false;

  }
);

document.getElementById(
  "resetViewBtn"
).onclick = ()=>{

  zoom = 1;

  centerMap();

};

window.addEventListener(
  "load",
  ()=>{

    centerMap();

    renderFloor();

  }
);
