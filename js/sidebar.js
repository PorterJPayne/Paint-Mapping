function renderSidebar(room){

  paintContainer.innerHTML = "";

  // VIEW MODE

  if(!editMode){

    room.paints.forEach(paint=>{

      const card =
        document.createElement("div");

      card.className =
        "paint-card";

      card.innerHTML = `
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

  else{

    const library =
      getPaintLibrary();

    const controls =
      document.createElement("div");

    controls.style.marginBottom =
      "20px";

    // EXISTING PAINT DROPDOWN

    const dropdown =
      document.createElement("select");

    dropdown.style.width = "100%";

    dropdown.style.marginBottom =
      "10px";

    dropdown.innerHTML =
      `
      <option value="">
        Add Existing Paint
      </option>
      `;

    library.forEach((paint,index)=>{

      const option =
        document.createElement("option");

      option.value =
        index;

      option.textContent =
        `${paint.color} — ${paint.brand}`;

      dropdown.appendChild(option);

    });

    dropdown.onchange = ()=>{

      if(dropdown.value === "")
        return;

      const paint =
        structuredClone(
          library[dropdown.value]
        );

      room.paints.push(paint);

      renderSidebar(room);

    };

    // ADD NEW PAINT

    const addManualBtn =
      document.createElement("button");

    addManualBtn.textContent =
      "+ Add New Paint";

    addManualBtn.onclick = ()=>{

      room.paints.push({

        surface:"",
        color:"",
        code:"",
        kilnSpec:"",
        finish:"",
        brand:""

      });

      renderSidebar(room);

    };

    // DELETE ROOM

    const deleteRoomBtn =
      document.createElement("button");

    deleteRoomBtn.textContent =
      "Delete Room";

    deleteRoomBtn.style.background =
      "#b42318";

    deleteRoomBtn.style.marginTop =
      "10px";

    deleteRoomBtn.onclick =
      deleteCurrentRoom;

    controls.appendChild(dropdown);

    controls.appendChild(addManualBtn);

    controls.appendChild(deleteRoomBtn);

    paintContainer.appendChild(controls);

    // EDIT CARDS

    room.paints.forEach((paint,index)=>{

      const card =
        document.createElement("div");

      card.className =
        "edit-card";

      card.innerHTML = `

        <input
          placeholder="Surface"
          data-field="surface"
          data-index="${index}"
          value="${paint.surface || ""}"
        >

        <input
          placeholder="Color"
          data-field="color"
          data-index="${index}"
          value="${paint.color || ""}"
        >

        <input
          placeholder="Code"
          data-field="code"
          data-index="${index}"
          value="${paint.code || ""}"
        >

        <input
          placeholder="Kiln Spec Number"
          data-field="kilnSpec"
          data-index="${index}"
          value="${paint.kilnSpec || ""}"
        >

        <input
          placeholder="Finish"
          data-field="finish"
          data-index="${index}"
          value="${paint.finish || ""}"
        >

        <input
          placeholder="Brand"
          data-field="brand"
          data-index="${index}"
          value="${paint.brand || ""}"
        >

        <button
          onclick="deletePaint(${index})"
          style="
            background:#b42318;
            margin-top:8px;
          "
        >
          Delete Paint
        </button>

      `;

      paintContainer.appendChild(card);

    });

  }

}

// DELETE PAINT

function deletePaint(index){

  if(!confirm("Delete paint?"))
    return;

  const room =
    getCurrentRoom();

  room.paints.splice(index,1);

  renderSidebar(room);

}

// DELETE ROOM

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

  renderSidebar(room);

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

  const inputs =
    document.querySelectorAll(
      ".edit-card input"
    );

  inputs.forEach(input=>{

    const index =
      input.dataset.index;

    const field =
      input.dataset.field;

    room.paints[index][field] =
      input.value;

  });

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

// GLOBALS

window.deletePaint =
  deletePaint;

window.deleteCurrentRoom =
  deleteCurrentRoom;
