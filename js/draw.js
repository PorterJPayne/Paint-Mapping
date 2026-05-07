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

    const label =
      document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );

    label.setAttribute(
      "x",
      point[0] + 10
    );

    label.setAttribute(
      "y",
      point[1] - 10
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
