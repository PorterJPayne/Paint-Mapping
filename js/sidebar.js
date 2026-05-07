function renderSidebar(room){

  paintContainer.innerHTML = "";

  room.paints.forEach(ref=>{

    const paint =
      getInventoryPaint(
        ref.inventoryId
      );

    if(!paint) return;

    const card =
      document.createElement("div");

    card.className =
      "paint-card";

    card.innerHTML = `

      <div
        style="
          height:18px;
          border-radius:8px;
          margin-bottom:14px;
          background:
            ${paint.hex || "#ddd"};
        "
      ></div>

      <div class="paint-surface">
        ${paint.surface || ""}
      </div>

      <div class="paint-name">
        ${paint.color || ""}
      </div>

      <div class="paint-code">
        ${paint.code || ""}
      </div>

      <div style="margin-bottom:12px;">
        <strong>Kiln Spec:</strong>
        ${paint.kilnSpec || ""}
      </div>

      <div class="paint-meta">

        <div>
          <strong>Finish</strong>
          <br>
          ${paint.finish || ""}
        </div>

        <div>
          <strong>Brand</strong>
          <br>
          ${paint.brand || ""}
        </div>

      </div>

    `;

    paintContainer.appendChild(card);

  });

  notesDisplay.textContent =
    room.notes || "No notes";

}

// EDIT MODE

editBtn.onclick = ()=>{

  editMode = true;

  editBtn.classList.add(
    "hidden"
  );

  saveBtn.classList.remove(
    "hidden"
  );

  cancelEditBtn.classList.remove(
    "hidden"
  );

  notesDisplay.classList.add(
    "hidden"
  );

  notesField.classList.remove(
    "hidden"
  );

  const room =
    getCurrentRoom();

  notesField.value =
    room.notes || "";

  renderPaintSelection(room);

  renderFloor();

};

// CANCEL EDIT

cancelEditBtn.onclick = ()=>{

  editMode = false;

  editBtn.classList.remove(
    "hidden"
  );

  saveBtn.classList.add(
    "hidden"
  );

  cancelEditBtn.classList.add(
    "hidden"
  );

  notesDisplay.classList.remove(
    "hidden"
  );

  notesField.classList.add(
    "hidden"
  );

  selectRoom(currentRoom);

};

// SAVE EDIT

saveBtn.onclick = ()=>{

  const room =
    getCurrentRoom();

  room.notes =
    notesField.value;

  saveData();

  editMode = false;

  editBtn.classList.remove(
    "hidden"
  );

  saveBtn.classList.add(
    "hidden"
  );

  cancelEditBtn.classList.add(
    "hidden"
  );

  notesDisplay.classList.remove(
    "hidden"
  );

  notesField.classList.add(
    "hidden"
  );

  selectRoom(currentRoom);

};

// INVENTORY PAINT PICKER

function renderPaintSelection(room){

  paintContainer.innerHTML = "";

  const wrapper =
    document.createElement("div");

  wrapper.style.display =
    "flex";

  wrapper.style.flexDirection =
    "column";

  wrapper.style.gap =
    "12px";

  // ADD INVENTORY PAINT

  const select =
    document.createElement("select");

  select.innerHTML =
    `
    <option value="">
      Add Paint From Inventory
    </option>
    `;

  buildingData.inventory.forEach(
    paint=>{

      const option =
        document.createElement(
          "option"
        );

      option.value =
        paint.inventoryId;

      option.textContent =
        `
        ${paint.color || "Untitled"}
        —
        ${paint.code || ""}
        `
        .replace(/\s+/g," ")
        .trim();

      select.appendChild(option);

    }
  );

  select.onchange = ()=>{

    if(!select.value) return;

    room.paints.push({

      inventoryId:
        select.value

    });

    saveData();

    renderPaintSelection(room);

  };

  wrapper.appendChild(select);

  // ROOM PAINTS

  room.paints.forEach(
    (ref,index)=>{

      const paint =
        getInventoryPaint(
          ref.inventoryId
        );

      if(!paint) return;

      const card =
        document.createElement("div");

      card.className =
        "paint-card";

      card.innerHTML = `

        <div
          style="
            height:18px;
            border-radius:8px;
            margin-bottom:14px;
            background:
              ${paint.hex || "#ddd"};
          "
        ></div>

        <div class="paint-name">
          ${paint.color || ""}
        </div>

        <div class="paint-code">
          ${paint.code || ""}
        </div>

        <div style="
          margin-top:12px;
          display:flex;
          gap:8px;
        ">

          <button
            onclick="
              openInventoryFromRoom(
                '${paint.inventoryId}'
              )
            "
          >
            Edit Inventory Paint
          </button>

          <button
            onclick="
              removeRoomPaint(${index})
            "
            style="
              background:#b42318;
            "
          >
            Remove
          </button>

        </div>

      `;

      wrapper.appendChild(card);

    }
  );

  // DELETE ROOM

  const deleteBtn =
    document.createElement("button");

  deleteBtn.textContent =
    "Delete Room";

  deleteBtn.style.background =
    "#b42318";

  deleteBtn.onclick =
    deleteCurrentRoom;

  wrapper.appendChild(deleteBtn);

  paintContainer.appendChild(
    wrapper
  );

}

function removeRoomPaint(index){

  const room =
    getCurrentRoom();

  room.paints.splice(index,1);

  saveData();

  renderPaintSelection(room);

}

function deleteCurrentRoom(){

  if(!confirm("Delete room?"))
    return;

  getFloor().rooms =
    getFloor().rooms.filter(
      room => room.id !== currentRoom
    );

  currentRoom = null;

  saveData();

  roomPanel.classList.add(
    "hidden"
  );

  emptyState.classList.remove(
    "hidden"
  );

  renderFloor();

}

function openInventoryFromRoom(id){

  openInventoryView();

  const paint =
    getInventoryPaint(id);

  if(!paint) return;

  openInventoryModal(paint);

}

// GLOBALS

window.removeRoomPaint =
  removeRoomPaint;

window.deleteCurrentRoom =
  deleteCurrentRoom;

window.openInventoryFromRoom =
  openInventoryFromRoom;
