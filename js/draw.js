function renderDrawPreview(){

  drawPoints.forEach((point,index)=>{

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
      6
    );

    circle.setAttribute(
      "class",
      "draw-point"
    );

    overlay.appendChild(circle);

    const label =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

    label.setAttribute(
      "x",
      point.x + 10
    );

    label.setAttribute(
      "y",
      point.y - 10
    );

    label.setAttribute(
      "fill",
      "red"
    );

    label.setAttribute(
      "font-size",
      "18"
    );

    label.setAttribute(
      "font-weight",
      "bold"
    );

    label.textContent =
      index + 1;

    overlay.appendChild(label);

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
          p => `${p.x},${p.y}`
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

    id:
      crypto.randomUUID(),

    name:roomName,

    points:[...drawPoints],

    paints:[],

    primaryPaintId:null,

    notes:""

  });

  saveData();

  renderRoomList();

  stopDraw();

}
