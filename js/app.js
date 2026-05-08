//second try
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

};

searchInput.oninput =
  renderRoomList;

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

    if(draggingVertex) return;

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

resetViewBtn.onclick =
  centerMap;

window.addEventListener(
  "load",
  async ()=>{

    try{

      await loadCloudData();

    }

    catch(error){

      console.error(error);

    }

    floorImage.src =
      `images/${currentFloor}.png`;

    renderRoomList();

    centerMap();

    renderFloor();

  }
);
