function updateTransform(){

  mapTransform.style.transform =
    `
    translate(${panX}px,${panY}px)
    scale(${zoom})
    `;

}

function centerMap(){

  const w =
    mapViewport.clientWidth;

  const h =
    mapViewport.clientHeight;

  const scaleX =
    w / MAP_WIDTH;

  const scaleY =
    h / MAP_HEIGHT;

  zoom =
    Math.min(scaleX,scaleY) * 0.95;

  panX =
    (w - (MAP_WIDTH * zoom)) / 2;

  panY =
    (h - (MAP_HEIGHT * zoom)) / 2;

  updateTransform();

}
