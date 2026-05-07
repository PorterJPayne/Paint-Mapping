function renderRoomList(){

  roomList.innerHTML = "";

  getFloor().rooms.forEach(room=>{

    const div =
      document.createElement("div");

    div.className =
      "room-item";

    if(room.id === currentRoom){

      div.classList.add("active");

    }

    div.textContent =
      room.id;

    div.onclick = ()=>{

      selectRoom(room.id);

    };

    roomList.appendChild(div);

  });

}

function selectRoom(id){

  currentRoom = id;

  const room =
    getCurrentRoom();

  if(!room) return;

  emptyState.classList.add(
    "hidden"
  );

  roomPanel.classList.remove(
    "hidden"
  );

  roomTitle.textContent =
    room.id;

  floorLabel.textContent =
    currentFloor;

  renderSidebar(room);

  renderFloor();

}
