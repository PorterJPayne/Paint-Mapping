function renderRoomList(){

  roomList.innerHTML = "";

  const rooms =
    getFloor().rooms || [];

  const search =
    (
      searchInput.value || ""
    ).toLowerCase();

  rooms
    .filter(room=>

      (room.name || "")
        .toLowerCase()
        .includes(search)

    )
    .forEach(room=>{

      const item =
        document.createElement("div");

      item.className =
        `
        room-item
        ${
          room.id === currentRoom
          ? "active"
          : ""
        }
        `;

      item.textContent =
        room.name || "Unnamed";

      item.onclick = ()=>{

        // EXIT EDIT MODE
        // WHEN SWITCHING ROOMS

        if(
          currentRoom !== room.id
        ){

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

        }

        selectRoom(room.id);

      };

      roomList.appendChild(item);

    });

}

function normalizeRoomPoints(room){

  // OLD STRING FORMAT

  if(
    typeof room.points ===
    "string"
  ){

    room.points =
      room.points
        .split(" ")
        .map(pair=>{

          const [x,y] =
            pair.split(",");

          return {

            x:Number(x),

            y:Number(y)

          };

        });

    saveData();

  }

  // SAFETY

  if(
    !Array.isArray(room.points)
  ){

    room.points = [];

  }

  // FILTER INVALID

  room.points =
    room.points.filter(
      p =>
        p &&
        typeof p.x === "number" &&
        typeof p.y === "number" &&
        !Number.isNaN(p.x) &&
        !Number.isNaN(p.y)
    );

}

function selectRoom(id){

  currentRoom = id;

  lastSelectedRooms[
    currentFloor
  ] = id;

  const room =
    getCurrentRoom();

  if(!room) return;

  normalizeRoomPoints(room);

  emptyState.classList.add(
    "hidden"
  );

  roomPanel.classList.remove(
    "hidden"
  );

  roomTitle.textContent =
    room.name;

  floorLabel.textContent =
    currentFloor
      .replace("-"," ")
      .replace("floor","Floor");

  renderSidebar(room);

  renderRoomList();

  renderFloor();

}

function renderFloor(){

  overlay.innerHTML = "";

  const rooms =
    getFloor().rooms || [];

  rooms.forEach(room=>{

    normalizeRoomPoints(room);

    if(!room.points.length){

      return;

    }

    const polygon =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );

    polygon.setAttribute(

      "points",

      room.points
        .map(
          p=>`${p.x},${p.y}`
        )
        .join(" ")

    );

    polygon.setAttribute(
      "fill",
      getRoomFill(room)
    );

    const primary =
      getInventoryPaint(
        room.primaryPaintId
      );

    polygon.setAttribute(
      "stroke",
      room.id === currentRoom
        ? (
            primary?.hex ||
            "#2563eb"
          )
        : "#334155"
    );

    polygon.setAttribute(
      "stroke-width",
      room.id === currentRoom
        ? "5"
        : "2"
    );

    polygon.setAttribute(
      "stroke-opacity",
      room.id === currentRoom
        ? "1"
        : "0.65"
    );

    polygon.style.cursor =
      "pointer";

    polygon.onclick = ()=>{

      if(
        currentRoom !== room.id
      ){

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

      }

      selectRoom(room.id);

    };

    overlay.appendChild(
      polygon
    );

    // DRAGGABLE VERTICES

    if(
      editMode
      &&
      room.id === currentRoom
    ){

      room.points.forEach(
        (point,index)=>{

          const vertex =
            document.createElementNS(
              "http://www.w3.org/2000/svg",
              "circle"
            );

          vertex.setAttribute(
            "cx",
            point.x
          );

          vertex.setAttribute(
            "cy",
            point.y
          );

          vertex.setAttribute(
            "r",
            "8"
          );

          vertex.setAttribute(
            "fill",
            primary?.hex || "#2563eb"
          );

          vertex.setAttribute(
            "stroke",
            "#ffffff"
          );

          vertex.setAttribute(
            "stroke-width",
            "2"
          );

          vertex.style.cursor =
            "move";

          vertex.onmousedown =
            (e)=>{

              e.stopPropagation();

              draggingVertex = {

                roomId:room.id,

                index

              };

            };

          overlay.appendChild(
            vertex
          );

        }
      );

    }

  });

  // DRAWING LINES

  if(drawPoints.length){

    const safeDrawPoints =
      drawPoints.filter(
        p =>
          p &&
          typeof p.x === "number" &&
          typeof p.y === "number"
      );

    const polyline =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
      );

    polyline.setAttribute(

      "points",

      safeDrawPoints
        .map(
          p=>`${p.x},${p.y}`
        )
        .join(" ")

    );

    polyline.setAttribute(
      "fill",
      "none"
    );

    polyline.setAttribute(
      "stroke",
      "#2563eb"
    );

    polyline.setAttribute(
      "stroke-width",
      "3"
    );

    overlay.appendChild(
      polyline
    );

    safeDrawPoints.forEach(point=>{

      const circle =
        document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );

      circle.setAttribute(
        "cx",
        point.x
      );

      circle.setAttribute(
        "cy",
        point.y
      );

      circle.setAttribute(
        "r",
        "5"
      );

      circle.setAttribute(
        "fill",
        "#2563eb"
      );

      overlay.appendChild(
        circle
      );

    });

  }

}

function createRoom(name){

  const safeDrawPoints =
    drawPoints.filter(
      p =>
        p &&
        typeof p.x === "number" &&
        typeof p.y === "number"
    );

  const room = {

    id:
      crypto.randomUUID(),

    name,

    notes:"",

    paints:[],

    primaryPaintId:null,

    points:safeDrawPoints

  };

  getFloor().rooms.push(room);

  saveData();

  drawPoints = [];

  drawMode = false;

  drawBtn.classList.remove(
    "active"
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

  drawStatus.classList.add(
    "hidden"
  );

  renderRoomList();

  renderFloor();

  selectRoom(room.id);

}

function getRoomFill(room){

  if(
    typeof showRoomColors ===
    "undefined"
  ){

    return "rgba(59,130,246,0.15)";

  }

  if(!showRoomColors){

    return "rgba(59,130,246,0.15)";

  }

  if(
    !room.primaryPaintId
    &&
    room.paints.length
  ){

    room.primaryPaintId =
      room.paints[0].inventoryId;

  }

  const primary =
    getInventoryPaint(
      room.primaryPaintId
    );

  if(!primary?.hex){

    return "rgba(59,130,246,0.15)";

  }

  return hexToRGBA(
    primary.hex,
    0.18
  );

}

function hexToRGBA(hex,opacity){

  hex =
    (hex || "")
      .replace("#","");

  if(hex.length !== 6){

    return "rgba(59,130,246,0.15)";

  }

  const r =
    parseInt(
      hex.substring(0,2),
      16
    );

  const g =
    parseInt(
      hex.substring(2,4),
      16
    );

  const b =
    parseInt(
      hex.substring(4,6),
      16
    );

  return `
    rgba(
      ${r},
      ${g},
      ${b},
      ${opacity}
    )
  `.replace(/\s+/g,"");

}
