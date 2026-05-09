const inventoryView =
  document.getElementById(
    "inventoryView"
  );

const inventoryGrid =
  document.getElementById(
    "inventoryGrid"
  );

const inventorySearch =
  document.getElementById(
    "inventorySearch"
  );

const backToMapBtn =
  document.getElementById(
    "backToMapBtn"
  );


function openInventoryView(){

  currentView = "inventory";

  inventoryView.classList.remove(
    "hidden"
  );

  renderInventory();

}

function closeInventoryView(){

  currentView = "map";

  inventoryView.classList.add(
    "hidden"
  );

}

document.getElementById(
  "inventoryBtn"
).onclick =
  openInventoryView;

backToMapBtn.onclick =
  closeInventoryView;

function getRoomsUsingPaint(id){

  const rooms = [];

  Object.entries(
    buildingData.floors
  ).forEach(
    ([floorName,floor])=>{

      floor.rooms.forEach(room=>{

        room.paints.forEach(ref=>{

          if(
            ref.inventoryId === id
          ){

            rooms.push({

              floor:floorName,

              room:room.name

            });

          }

        });

      });

    }
  );

  return rooms;

}

function renderInventory(){

  inventoryGrid.innerHTML = "";

  const search =
    (
      inventorySearch.value || ""
    ).toLowerCase();

  const filtered =
    buildingData.inventory.filter(
      paint =>

        (paint.color || "")
          .toLowerCase()
          .includes(search)

        ||

        (paint.code || "")
          .toLowerCase()
          .includes(search)

        ||

        (paint.brand || "")
          .toLowerCase()
          .includes(search)
    );

  filtered.forEach(paint=>{

    const lowStock =

      Number(paint.quantity || 0)

      <=

      Number(
        paint.lowStock || 0
      );

    const card =
      document.createElement("div");

    card.className =
      `
      inventory-card
      ${lowStock ? "inventory-low" : ""}
      `;

    card.innerHTML = `

      <div
        class="inventory-swatch"
        style="
          background:
            ${paint.hex || "#ddd"};
        "
      ></div>

      <div class="inventory-info">

        <div class="inventory-name">
          ${paint.color || "Untitled"}
        </div>

        <div class="inventory-code">
          ${paint.code || ""}
        </div>

        <div class="inventory-meta">

          ${paint.brand || ""}

          <br>

          ${paint.finish || ""}

          <br><br>

          Used In:
          ${getPaintUsageCount(
            paint.inventoryId
          )} rooms

        </div>

      </div>

    `;

    card.onclick = ()=>{

      openInventoryModal(paint);

    };

    inventoryGrid.appendChild(card);

  });

}

function openInventoryModal(paint){

  const usedIn =
    getRoomsUsingPaint(
      paint.inventoryId
    );

  const modal =
    document.createElement("div");

  modal.className =
    "inventory-modal";

  modal.innerHTML = `

  <div class="inventory-modal-content">

    <div
      class="inventory-modal-swatch"
      style="
        background:
          ${paint.hex || "#ddd"};
      "
    >

      <div class="inventory-modal-top-actions">

        <button id="saveInventoryPaint">
          Save
        </button>

        <button
          id="deleteInventoryPaint"
          class="danger-btn"
        >
          Delete
        </button>

      </div>

    </div>

    <div class="inventory-modal-body">

      <input
        id="invColor"
        class="inventory-input large-input"
        placeholder="Color Name"
        value="${paint.color || ""}"
      >

      <div class="inventory-row">

        <input
          id="invCode"
          class="inventory-input"
          placeholder="Code"
          value="${paint.code || ""}"
        >

        <input
          id="invKiln"
          class="inventory-input"
          placeholder="Kiln Spec"
          value="${paint.kilnSpec || ""}"
        >

      </div>

      <div class="inventory-row">

        <input
          id="invBrand"
          class="inventory-input"
          placeholder="Brand"
          value="${paint.brand || ""}"
        >

        <input
          id="invFinish"
          class="inventory-input"
          placeholder="Finish"
          value="${paint.finish || ""}"
        >

      </div>

      <div class="inventory-row">

        <input
          id="invQuantity"
          class="inventory-input"
          placeholder="Gallons"
          value="${paint.quantity || ""}"
        >

        <input
          id="invLowStock"
          class="inventory-input"
          placeholder="Low Stock"
          value="${paint.lowStock || ""}"
        >

      </div>

      <div class="inventory-row">

        <input
          id="invLocation"
          class="inventory-input"
          placeholder="Storage"
          value="${paint.location || ""}"
        >

        <input
          id="invHex"
          class="inventory-input"
          placeholder="# Hex"
          value="${paint.hex || ""}"
        >

      </div>

      <div class="inventory-bottom-grid">

        <div class="used-in-section">

          <h3>
            Used In
          </h3>

          ${
            usedIn.length
            ? usedIn.map(
              room=>`
                <div class="used-room">

                  ${room.room}

                  <span>
                    ${room.floor}
                  </span>

                </div>
              `
            ).join("")
            : `
              <div class="used-room">
                Not used yet
              </div>
            `
          }

        </div>

        <div class="notes-section">

          <h3>
            Notes
          </h3>

          <textarea
            id="invNotes"
            class="inventory-input inventory-notes"
            placeholder="Notes"
          >${paint.notes || ""}</textarea>

        </div>

      </div>

    </div>

  </div>

`;
  document.body.appendChild(modal);

  modal.onclick = (e)=>{

    if(e.target === modal){

      modal.remove();

    }

  };

  document.getElementById(
    "invHex"
  ).oninput = (e)=>{

    modal.querySelector(
      ".inventory-modal-swatch"
    ).style.background =
      e.target.value;

  };

  document.getElementById(
    "saveInventoryPaint"
  ).onclick = ()=>{

    paint.color =
      document.getElementById(
        "invColor"
      ).value;

    paint.code =
      document.getElementById(
        "invCode"
      ).value;

    paint.kilnSpec =
      document.getElementById(
        "invKiln"
      ).value;

    paint.brand =
      document.getElementById(
        "invBrand"
      ).value;

    paint.finish =
      document.getElementById(
        "invFinish"
      ).value;

    paint.hex =
      document.getElementById(
        "invHex"
      ).value;

    paint.quantity =
      document.getElementById(
        "invQuantity"
      ).value;

    paint.lowStock =
      document.getElementById(
        "invLowStock"
      ).value;

    paint.location =
      document.getElementById(
        "invLocation"
      ).value;

    paint.notes =
      document.getElementById(
        "invNotes"
      ).value;

    saveData();

    renderInventory();

    renderFloor();

    if(currentRoom){

      selectRoom(currentRoom);

    }

    modal.remove();

  };

  document.getElementById(
    "deleteInventoryPaint"
  ).onclick = ()=>{

    if(
      !confirm(
        "Delete inventory paint?"
      )
    ) return;

    buildingData.inventory =
      buildingData.inventory.filter(
        p =>
          p.inventoryId !==
          paint.inventoryId
      );

    Object.values(
      buildingData.floors
    ).forEach(floor=>{

      floor.rooms.forEach(room=>{

        room.paints =
          room.paints.filter(
            ref =>
              ref.inventoryId !==
              paint.inventoryId
          );

      });

    });

    saveData();

    renderInventory();

    renderFloor();

    modal.remove();

  };

}

window.addEventListener(
  "load",
  ()=>{

    document.getElementById(
      "addInventoryBtn"
    ).onclick = ()=>{

      const newPaint = {

        inventoryId:
          createInventoryId(),

        color:"",
        code:"",
        kilnSpec:"",
        brand:"",
        finish:"",
        hex:"#cccccc",
        quantity:"",
        lowStock:"",
        location:"",
        notes:""

      };

      buildingData.inventory.push(
        newPaint
      );

      saveData();

      renderInventory();

      openInventoryModal(
        newPaint
      );

    };

  }
);

inventorySearch.oninput =
  renderInventory;
