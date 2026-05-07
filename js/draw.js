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

    alert("Need at least 3 points");

    return;

  }

  const roomName =
    prompt("Room name");

  if(!roomName) return;

  getFloor().rooms.push({

    id:roomName,

    points:
      drawPoints
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
