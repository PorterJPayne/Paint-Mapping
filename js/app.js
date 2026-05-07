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

// DRAW CLICK

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

// KEYBOARD SHORTCUTS

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

// FLOOR SWITCHING

floorSelect.onchange = ()=>{

  currentFloor =
    floorSelect.value;

  renderFloor();

  const rememberedRoom =
    lastSelectedRooms[currentFloor];

  if(rememberedRoom){

    selectRoom(rememberedRoom);

  }

  else{

    currentRoom = null;

    roomPanel.classList.add(
      "hidden"
    );

    emptyState.classList.remove(
      "hidden"
    );

  }

};

// SEARCH

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

// ZOOM

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

// PAN + VERTEX DRAGGING

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

      points[
        draggingVertex.index
      ] = `${x},${y}`;

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

// RESET VIEW

resetViewBtn.onclick = ()=>{

  centerMap();

};

// STARTUP

window.addEventListener(
  "load",
  ()=>{

    centerMap();

    renderFloor();

  }
);
