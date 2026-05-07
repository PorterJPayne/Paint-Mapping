const MAP_WIDTH = 2000;
const MAP_HEIGHT = 743;

const overlay = document.getElementById("overlay");
const floorImage = document.getElementById("floorImage");
const roomList = document.getElementById("roomList");
const roomPanel = document.getElementById("roomPanel");
const emptyState = document.getElementById("emptyState");
const roomTitle = document.getElementById("roomTitle");
const floorLabel = document.getElementById("floorLabel");
const paintContainer = document.getElementById("paintContainer");
const notesDisplay = document.getElementById("notesDisplay");
const notesField = document.getElementById("notesField");

const floorSelect = document.getElementById("floorSelect");

const drawBtn = document.getElementById("drawBtn");
const undoBtn = document.getElementById("undoBtn");
const finishBtn = document.getElementById("finishBtn");
const cancelBtn = document.getElementById("cancelBtn");

const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");

const mapViewport = document.getElementById("mapViewport");
const mapTransform = document.getElementById("mapTransform");

const searchInput = document.getElementById("searchInput");
const resetViewBtn = document.getElementById("resetViewBtn");

const drawStatus = document.getElementById("drawStatus");

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

let draggingVertex = null;

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

  const scaleX =
    w / MAP_WIDTH;

  const scaleY =
    h / MAP_HEIGHT;

  zoom =
    Math.min(scaleX,scaleY) * 0.95;

  panX =
    (w - (MAP_WIDTH * zoom)) / 2;

  panY =
    (h - (MAP_HEIGHT * zoom)) / 2;

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

function renderVertices(room){

  if(!editMode) return;

  const points =
    room.points
      .split(" ")
      .map(
        p => p.split(",").map(Number)
      );

  points.forEach((point,index)=>{

    const vertex =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

    vertex.setAttribute("cx",point[0]);
    vertex.setAttribute("cy",point[1]);
    vertex.setAttribute("r",7);

    vertex.setAttribute(
      "class",
      "vertex"
    );

    vertex.addEventListener(
      "mousedown",
      (e)=>{

        e.stopPropagation();

        draggingVertex = {
          room,
          index
        };

      }
    );

    overlay.appendChild(vertex);

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

    if(room.id === currentRoom){

      renderVertices(room);

    }

  });

  if(drawMode){

    renderDrawPreview();

  }

  renderRoomList();

}

function selectRoom(id){

  currentRoom = id;

  const room =
    getCurrentRoom();

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

  renderSidebar(room);

  renderFloor();

}

function renderSidebar(room){

  paintContainer.innerHTML = "";

  if(!editMode){

    room.paints.forEach(paint=>{

      const card =
        document.createElement("div");

      card.className =
        "paint-card";

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

        <div style="margin-bottom:12px;">
          <strong>Kiln Spec:</strong>
          ${paint.kilnSpec || ""}
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

  }

  else{

    const library =
      getPaintLibrary();

    const controls =
      document.createElement("div");

    controls.style.marginBottom =
      "20px";

    const dropdown =
      document.createElement("select");

    dropdown.style.width = "100%";
    dropdown.style.marginBottom = "10px";

    dropdown.innerHTML =
      `
      <option value="">
        Add Existing Paint
      </option>
      `;

    library.forEach((paint,index)=>{

      const option =
        document.createElement("option");

      option.value = index;

      option.textContent =
        `${paint.color} — ${paint.brand}`;

      dropdown.appendChild(option);

    });

    dropdown.onchange = ()=>{

      if(dropdown.value === "")
        return;

      const paint =
        structuredClone(
          library[dropdown.value]
        );

      room.paints.push(paint);

      renderSidebar(room);

    };

    const addManualBtn =
      document.createElement("button");

    addManualBtn.textContent =
      "+ Add New Paint";

    addManualBtn.onclick = ()=>{

      room.paints.push({

        surface:"",
        color:"",
        code:"",
        kilnSpec:"",
        finish:"",
        brand:""

      });

      renderSidebar(room);

    };

    const deleteRoomBtn =
      document.createElement("button");

    deleteRoomBtn.textContent =
      "Delete Room";

    deleteRoomBtn.style.background =
      "#b42318";

    deleteRoomBtn.style.marginTop =
      "10px";

    deleteRoomBtn.onclick =
      deleteCurrentRoom;

    controls.appendChild(dropdown);
    controls.appendChild(addManualBtn);
    controls.appendChild(deleteRoomBtn);

    paintContainer.appendChild(controls);

    room.paints.forEach((paint,index)=>{

      const card =
        document.createElement("div");

      card.className =
        "edit-card";

      card.innerHTML = `

        <input
          placeholder="Surface"
          data-field="surface"
          data-index="${index}"
          value="${paint.surface || ""}"
        >

        <input
          placeholder="Color"
          data-field="color"
          data-index="${index}"
          value="${paint.color || ""}"
        >

        <input
          placeholder="Code"
          data-field="code"
          data-index="${index}"
          value="${paint.code || ""}"
        >

        <input
          placeholder="Kiln Spec Number"
          data-field="kilnSpec"
          data-index="${index}"
          value="${paint.kilnSpec || ""}"
        >

        <input
          placeholder="Finish"
          data-field="finish"
          data-index="${index}"
          value="${paint.finish || ""}"
        >

        <input
          placeholder="Brand"
          data-field="brand"
          data-index="${index}"
          value="${paint.brand || ""}"
        >

        <button
          onclick="deletePaint(${index})"
          style="
            background:#b42318;
            margin-top:8px;
          "
        >
          Delete Paint
        </button>

      `;

      paintContainer.appendChild(card);

    });

  }

}

function deletePaint(index){

  if(!confirm("Delete paint?"))
    return;

  const room =
    getCurrentRoom();

  room.paints.splice(index,1);

  renderSidebar(room);

}

function deleteCurrentRoom(){

  if(!confirm("Delete room?"))
    return;

  getFloor().rooms =
    getFloor().rooms.filter(
      room => room.id !== currentRoom
    );

  currentRoom = null;

  saveData();

  roomPanel.classList.add(
    "hidden"
  );

  emptyState.classList.remove(
    "hidden"
  );

  renderFloor();

}

function renderDrawPreview(){

  drawPoints.forEach((point,index)=>{

    const circle =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );

    circle.setAttribute("cx",point[0]);
    circle.setAttribute("cy",point[1]);
    circle.setAttribute("r",6);

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

  drawStatus.classList.remove(
    "hidden"
  );

  drawBtn.classList.add(
    "hidden"
  );

  undoBtn.classList.remove(
    "hidden"
  );

  finishBtn.classList.remove(
    "hidden"
  );

  cancelBtn.classList.remove(
    "hidden"
  );

}

function stopDraw(){

  drawMode = false;

  drawPoints = [];

  drawStatus.classList.add(
    "hidden"
  );

  drawBtn.classList.remove(
    "hidden"
  );

  undoBtn.classList.add(
    "hidden"
  );

  finishBtn.classList.add(
    "hidden"
  );

  cancelBtn.classList.add(
    "hidden"
  );

  renderFloor();

}

function finishDraw(){

  if(drawPoints.length < 3){

    alert(
      "Need at least 3 points"
    );

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

    const rect =
      overlay.getBoundingClientRect();

    const x =
      ((event.clientX - rect.left)
      / rect.width)
      * MAP_WIDTH;

    const y =
      ((event.clientY - rect.top)
      / rect.height)
      * MAP_HEIGHT;

    drawPoints.push([x,y]);

    renderFloor();

  }
);

drawBtn.onclick =
  startDraw;

cancelBtn.onclick =
  stopDraw;

undoBtn.onclick = ()=>{

  drawPoints.pop();

  renderFloor();

};

finishBtn.onclick =
  finishDraw;

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

  roomPanel.classList.add(
    "hidden"
  );

  emptyState.classList.remove(
    "hidden"
  );

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

editBtn.onclick = ()=>{

  editMode = true;

  editBtn.classList.add(
    "hidden"
  );

  saveBtn.classList.remove(
    "hidden"
  );

  cancelEditBtn.classList.remove(
    "hidden"
  );

  notesDisplay.classList.add(
    "hidden"
  );

  notesField.classList.remove(
    "hidden"
  );

  const room =
    getCurrentRoom();

  notesField.value =
    room.notes || "";

  renderSidebar(room);

  renderFloor();

};

cancelEditBtn.onclick = ()=>{

  editMode = false;

  editBtn.classList.remove(
    "hidden"
  );

  saveBtn.classList.add(
    "hidden"
  );

  cancelEditBtn.classList.add(
    "hidden"
  );

  notesDisplay.classList.remove(
    "hidden"
  );

  notesField.classList.add(
    "hidden"
  );

  selectRoom(currentRoom);

};

saveBtn.onclick = ()=>{

  const room =
    getCurrentRoom();

  const inputs =
    document.querySelectorAll(
      ".edit-card input"
    );

  inputs.forEach(input=>{

    const index =
      input.dataset.index;

    const field =
      input.dataset.field;

    room.paints[index][field] =
      input.value;

  });

  room.notes =
    notesField.value;

  saveData();

  editMode = false;

  editBtn.classList.remove(
    "hidden"
  );

  saveBtn.classList.add(
    "hidden"
  );

  cancelEditBtn.classList.add(
    "hidden"
  );

  notesDisplay.classList.remove(
    "hidden"
  );

  notesField.classList.add(
    "hidden"
  );

  selectRoom(currentRoom);

};

mapViewport.addEventListener(
  "wheel",
  (event)=>{

    event.preventDefault();

    const factor =
      event.deltaY < 0
      ? 1.02
      : 0.98;

    const oldZoom =
      zoom;

    zoom *= factor;

    zoom =
      Math.max(
        0.2,
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

    if(draggingVertex){

      const rect =
        overlay.getBoundingClientRect();

      const x =
        ((e.clientX - rect.left)
        / rect.width)
        * MAP_WIDTH;

      const y =
        ((e.clientY - rect.top)
        / rect.height)
        * MAP_HEIGHT;

      const room =
        draggingVertex.room;

      const points =
        room.points
          .split(" ");

      points[draggingVertex.index] =
        `${x},${y}`;

      room.points =
        points.join(" ");

      renderFloor();

      return;

    }

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

    if(draggingVertex){

      saveData();

    }

    draggingVertex = null;

  }
);

resetViewBtn.onclick = ()=>{

  centerMap();

};

window.deletePaint =
  deletePaint;

window.deleteCurrentRoom =
  deleteCurrentRoom;

window.addEventListener(
  "load",
  ()=>{

    centerMap();

    renderFloor();

  }
);
