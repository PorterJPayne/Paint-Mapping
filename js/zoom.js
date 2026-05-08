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

// INVENTORY BUTTON

inventoryBtn.onclick = ()=>{

  if(
    typeof openInventoryView ===
    "function"
  ){

    openInventoryView();

  }

};

// DRAWING

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

    drawPoints.push({
      x,
      y
    });

    renderFloor();

  }
);

// KEYBOARD

document.addEventListener(
  "keydown",
  (e)=>{

    if(!drawMode) return;

    if(e.key === "Enter"){

      finishDraw();

    }

    if(e.key === "Backspace"){

      e.preventDefault();

      drawPoints.pop();

      renderFloor();

    }

  }
);

// FLOOR SWITCHING

floorSelect.onchange = ()=>{

  currentFloor =
    floorSelect.value;

  floorImage.src =
    `images/${currentFloor}.png`;

  renderRoomList();

  renderFloor();

  const rememberedRoom =
    lastSelectedRooms[
      currentFloor
    ];

  if(rememberedRoom){

    selectRoom(
      rememberedRoom
    );

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

searchInput.oninput =
  renderRoomList;

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

// PAN

mapViewport.addEventListener(
  "mousedown",
  (e)=>{

    if(draggingVertex) return;

    draggingMap = true;

    dragStartX =
      e.clientX - panX;

    dragStartY =
      e.clientY - panY;

  }
);

// DRAGGING

document.addEventListener(
  "mousemove",
  (e)=>{

    // VERTEX

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
        getFloor().rooms.find(
          r =>
            r.id ===
            draggingVertex.roomId
        );

      if(!room) return;

      room.points[
        draggingVertex.index
      ] = {
        x,
        y
      };

      renderFloor();

      return;

    }

    // MAP

    if(!draggingMap) return;

    panX =
      e.clientX - dragStartX;

    panY =
      e.clientY - dragStartY;

    updateTransform();

  }
);

// MOUSE UP

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

resetViewBtn.onclick =
  centerMap;

// STARTUP

window.addEventListener(
  "load",
  async ()=>{

    try{

      // CLOUD LOAD

      await loadCloudData();

    }

    catch(error){

      console.error(
        "Cloud load failed",
        error
      );

    }

    // IMAGE

    floorImage.src =
      `images/${currentFloor}.png`;

    // RENDER

    renderRoomList();

    centerMap();

    renderFloor();

  }
);
