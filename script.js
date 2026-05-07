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

let currentView = "map";

const defaultData = {

  inventory:[],

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

function createInventoryId(){

  return "INV-" +
    Math.random()
      .toString(36)
      .substring(2,8)
      .toUpperCase();

}

function getInventoryUsageCount(id){

  let count = 0;

  Object.values(buildingData.floors)
    .forEach(floor=>{

      floor.rooms.forEach(room=>{

        room.paints.forEach(paint=>{

          if(paint.inventoryId === id){

            count++;

          }

        });

      });

    });

  return count;

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

function ensureInventoryButton(){

  if(
    document.getElementById(
      "inventoryNavBtn"
    )
  ) return;

  const button =
    document.createElement("button");

  button.id =
    "inventoryNavBtn";

  button.textContent =
    "Inventory";

  button.onclick = ()=>{

    openInventoryView();

  };

  document.querySelector(
    ".topbar-left"
  ).appendChild(button);

}

function openInventoryView(){

  currentView = "inventory";

  document.querySelector(
    ".map-section"
  ).style.display = "none";

  document.querySelector(
    ".room-list"
  ).style.display = "none";

  roomPanel.classList.remove(
    "hidden"
  );

  emptyState.classList.add(
    "hidden"
  );

  roomTitle.textContent =
    "Paint Inventory";

  floorLabel.textContent =
    "";

  renderInventory();

}

function openMapView(){

  currentView = "map";

  document.querySelector(
    ".map-section"
  ).style.display = "";

  document.querySelector(
    ".room-list"
  ).style.display = "";

  renderFloor();

}

function renderInventory(){

  paintContainer.innerHTML = "";

  const topBar =
    document.createElement("div");

  topBar.style.marginBottom =
    "20px";

  const backBtn =
    document.createElement("button");

  backBtn.textContent =
    "Back To Map";

  backBtn.onclick =
    openMapView;

  const addBtn =
    document.createElement("button");

  addBtn.textContent =
    "+ Add Inventory Paint";

  addBtn.style.marginLeft =
    "10px";

  addBtn.onclick = ()=>{

    buildingData.inventory.push({

      inventoryId:
        createInventoryId(),

      color:"",
      code:"",
      kilnSpec:"",
      finish:"",
      brand:"",
      quantity:"",
      unit:"",
      location:"",
      vendor:"",
      notes:"",
      lowStock:""

    });

    saveData();

    renderInventory();

  };

  topBar.appendChild(backBtn);
  topBar.appendChild(addBtn);

  paintContainer.appendChild(topBar);

  buildingData.inventory.forEach(
    (paint,index)=>{

      const usage =
        getInventoryUsageCount(
          paint.inventoryId
        );

      const low =
        Number(paint.quantity)
        <= Number(paint.lowStock);

      const card =
        document.createElement("div");

      card.className =
        "edit-card";

      if(low){

        card.style.border =
          "2px solid #d92d20";

      }

      card.innerHTML = `

        <div style="
          font-size:12px;
          color:#666;
          margin-bottom:8px;
        ">
          ${paint.inventoryId}
        </div>

        <input
          placeholder="Color"
          value="${paint.color || ""}"
          onchange="
            buildingData.inventory[${index}].color=this.value;
            saveData();
          "
        >

        <input
          placeholder="Code"
          value="${paint.code || ""}"
          onchange="
            buildingData.inventory[${index}].code=this.value;
            saveData();
          "
        >

        <input
          placeholder="Kiln Spec"
          value="${paint.kilnSpec || ""}"
          onchange="
            buildingData.inventory[${index}].kilnSpec=this.value;
            saveData();
          "
        >

        <input
          placeholder="Brand"
          value="${paint.brand || ""}"
          onchange="
            buildingData.inventory[${index}].brand=this.value;
            saveData();
          "
        >

        <input
          placeholder="Finish"
          value="${paint.finish || ""}"
          onchange="
            buildingData.inventory[${index}].finish=this.value;
            saveData();
          "
        >

        <input
          placeholder="Quantity"
          value="${paint.quantity || ""}"
          onchange="
            buildingData.inventory[${index}].quantity=this.value;
            saveData();
          "
        >

        <input
          placeholder="Unit"
          value="${paint.unit || ""}"
          onchange="
            buildingData.inventory[${index}].unit=this.value;
            saveData();
          "
        >

        <input
          placeholder="Storage Location"
          value="${paint.location || ""}"
          onchange="
            buildingData.inventory[${index}].location=this.value;
            saveData();
          "
        >

        <input
          placeholder="Vendor"
          value="${paint.vendor || ""}"
          onchange="
            buildingData.inventory[${index}].vendor=this.value;
            saveData();
          "
        >

        <input
          placeholder="Low Stock Threshold"
          value="${paint.lowStock || ""}"
          onchange="
            buildingData.inventory[${index}].lowStock=this.value;
            saveData();
          "
        >

        <textarea
          placeholder="Notes"
          onchange="
            buildingData.inventory[${index}].notes=this.value;
            saveData();
          "
        >${paint.notes || ""}</textarea>

        <div style="
          margin-top:10px;
          font-size:13px;
          color:#666;
        ">
          Used In ${usage} Rooms
        </div>

        <button
          style="
            margin-top:12px;
            background:#b42318;
          "
          onclick="
            deleteInventoryPaint(${index})
          "
        >
          Delete Inventory Paint
        </button>

      `;

      paintContainer.appendChild(card);

    }
  );

}

function deleteInventoryPaint(index){

  if(
    !confirm(
      "Delete inventory paint?"
    )
  ) return;

  buildingData.inventory.splice(
    index,
    1
  );

  saveData();

  renderInventory();

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

  room.paints.forEach(paint=>{

    const card =
      document.createElement("div");

    card.className =
      "paint-card";

    card.innerHTML = `
      <div class="paint-name">
        ${paint.color || ""}
      </div>

      <div class="paint-code">
        ${paint.code || ""}
      </div>

      <div>
        Kiln Spec:
        ${paint.kilnSpec || ""}
      </div>

      <div class="paint-meta">

        <div>
          ${paint.finish || ""}
        </div>

        <div>
          ${paint.brand || ""}
        </div>

      </div>
    `;

    paintContainer.appendChild(card);

  });

  notesDisplay.textContent =
    room.notes || "No notes";

}

function renderDrawPreview(){

  drawPoints.forEach(point=>{

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

}

function startDraw(){

  drawMode = true;

  drawPoints = [];

  drawStatus.classList.remove(
    "hidden"
  );

}

function stopDraw(){

  drawMode = false;

  drawPoints = [];

  drawStatus.classList.add(
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

window.deleteInventoryPaint =
  deleteInventoryPaint;

window.addEventListener(
  "load",
  ()=>{

    ensureInventoryButton();

    centerMap();

    renderFloor();

  }
);
