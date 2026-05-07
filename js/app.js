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

      points[draggingVertex.index] =
        `${x},${y}`;

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
