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
