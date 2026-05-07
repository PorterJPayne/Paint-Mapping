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

    drawPoints.push([x,y]);

    renderFloor();

  }
);

floorSelect.onchange = ()=>{

  currentFloor =
    floorSelect.value;

  renderFloor();

};

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

    updateTransform();

  },
  { passive:false }
);

resetViewBtn.onclick = ()=>{

  centerMap();

};

window.addEventListener(
  "load",
  ()=>{

    centerMap();

    renderFloor();

  }
);
