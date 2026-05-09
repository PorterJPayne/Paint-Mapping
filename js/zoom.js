function updateTransform(){

  mapTransform.style.transform =
    `
    translate(${panX}px, ${panY}px)
    scale(${zoom})
    `;

}

function centerMap(){

  const viewportRect =
    mapViewport.getBoundingClientRect();

  const availableWidth =
    viewportRect.width;

  const availableHeight =
    viewportRect.height;

  const scaleX =
    availableWidth
    / MAP_WIDTH;

  const scaleY =
    availableHeight
    / MAP_HEIGHT;

  // FIT COMFORTABLY

  zoom =
    Math.min(
      scaleX,
      scaleY
    ) * 0.92;

  const scaledWidth =
    MAP_WIDTH * zoom;

  const scaledHeight =
    MAP_HEIGHT * zoom;

  panX =
    (
      availableWidth
      - scaledWidth
    ) / 2;

  panY =
    (
      availableHeight
      - scaledHeight
    ) / 2;

  updateTransform();

}

// ZOOM

mapViewport.addEventListener(
  "wheel",
  (event)=>{

    event.preventDefault();

    const factor =
      event.deltaY < 0
? 1.03
: 0.97;

    const rect =
      mapViewport.getBoundingClientRect();

    const mouseX =
      event.clientX - rect.left;

    const mouseY =
      event.clientY - rect.top;

    const worldX =
      (mouseX - panX) / zoom;

    const worldY =
      (mouseY - panY) / zoom;

    zoom *= factor;

    zoom =
      Math.max(
        0.2,
        Math.min(zoom,5)
      );

    panX =
      mouseX - (worldX * zoom);

    panY =
      mouseY - (worldY * zoom);

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

document.addEventListener(
  "mousemove",
  (e)=>{

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

  }
);
