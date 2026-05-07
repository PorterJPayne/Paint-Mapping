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

const addInventoryBtn =
  document.getElementById(
    "addInventoryBtn"
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

function renderInventory(){

  inventoryGrid.innerHTML = "";

  const search =
    inventorySearch.value
      .toLowerCase();

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

  const modal =
    document.createElement("div");

  modal.className =
    "inventory-modal";

  modal.innerHTML = `

    <div class="inventory-modal-content">

      <h2>
        ${paint.color || ""}
      </h2>

      <input id="invColor" value="${paint.color || ""}">
      <input id="invCode" value="${paint.code || ""}">
      <input id="invKiln" value="${paint.kilnSpec || ""}">
      <input id="invBrand" value="${paint.brand || ""}">
      <input id="invFinish" value="${paint.finish || ""}">
      <input id="invHex" value="${paint.hex || ""}">
      <input id="invQuantity" value="${paint.quantity || ""}">
      <input id="invLocation" value="${paint.location || ""}">

      <textarea id="invNotes">${paint.notes || ""}</textarea>

      <button id="saveInventoryPaint">
        Save
      </button>

      <button
        id="deleteInventoryPaint"
        style="
          background:#b42318;
          margin-top:10px;
        "
      >
        Delete
      </button>

    </div>

  `;

  document.body.appendChild(modal);

  modal.onclick = (e)=>{

    if(e.target === modal){

      modal.remove();

    }

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

    modal.remove();

  };

}

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

    surface:"",

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
inventorySearch.oninput =
  renderInventory;
