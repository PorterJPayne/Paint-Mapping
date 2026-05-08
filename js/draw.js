function startDraw(){

  drawMode = true;

  drawPoints = [];

  drawStatus.classList.remove(
    "hidden"
  );

  drawBtn.classList.add(
    "hidden"
  );

  undoBtn.classList.remove(
    "hidden"
  );

  finishBtn.classList.remove(
    "hidden"
  );

  cancelBtn.classList.remove(
    "hidden"
  );

}

function stopDraw(){

  drawMode = false;

  drawPoints = [];

  drawStatus.classList.add(
    "hidden"
  );

  drawBtn.classList.remove(
    "hidden"
  );

  undoBtn.classList.add(
    "hidden"
  );

  finishBtn.classList.add(
    "hidden"
  );

  cancelBtn.classList.add(
    "hidden"
  );

  renderFloor();

}

function finishDraw(){

  if(drawPoints.length < 3){

    alert(
      "Need at least 3 points"
    );

    return;

  }

  const roomName =
    prompt(
      "Room name"
    );

  if(!roomName) return;

  const room = {

    id:
      crypto.randomUUID(),

    name:roomName,

    notes:"",

    paints:[],

    primaryPaintId:null,

    points:[...drawPoints]

  };

  getFloor().rooms.push(
    room
  );

  saveData();

  renderRoomList();

  stopDraw();

  selectRoom(room.id);

}
