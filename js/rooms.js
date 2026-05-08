function renderRoomList(){

  roomList.innerHTML = "";

  const rooms =
    getFloor().rooms;

  const search =
    searchInput.value
      .toLowerCase();

  rooms
    .filter(room=>

      room.name
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
        room.name;

      item.onclick = ()=>{

        selectRoom(room.id);

      };

      roomList.appendChild(item);

    });

}

function selectRoom(id){

  currentRoom = id;

  lastSelectedRooms[
    currentFloor
  ] = id;

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
    getFloor().rooms;

  rooms.forEach(room=>{

    if(
      !Array.isArray(room.points)
    ){

      console.error(
        "Invalid room points",
        room
      );

      return;

    }

    const safePoints =
      room.points.filter(
        p =>
          p &&
          typeof p.x === "number" &&
          typeof p.y === "number"
      );

    if(!safePoints.length){

      return;

    }

    const polygon =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
      );

    polygon.setAttribute(

      "points",

      safePoints
        .map(
          p=>`${p.x},${p.y}`
        )
        .join(" ")

    );

    polygon.setAttribute(
      "fill",
      getRoomFill(room)
    );

    polygon.setAttribute(
      "stroke",
      room.id === currentRoom
        ? "#2563eb"
        : "#1e293b"
    );

    polygon.setAttribute(
      "stroke-width",
      room.id === currentRoom
        ? "4"
        : "2"
    );

    polygon.style.cursor =
      "pointer";

    polygon.onclick = ()=>{

      selectRoom(room.id);

    };

    overlay.appendChild(
      polygon
    );

    // VERTEX EDITING

    if(
      editMode
      &&
      room.id === currentRoom
    ){

      safePoints.forEach(
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
            "#2563eb"
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
