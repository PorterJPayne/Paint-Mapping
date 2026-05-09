function updateTransform(){

  mapTransform.style.transform =
    `
    translate(${panX}px,${panY}px)
    scale(${zoom})
    `;

}

function centerMap(){

  zoom = 1;

  panX = 0;

  panY = 0;

  updateTransform();

}

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

    if(
      draggingVertex
    ) return;

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
