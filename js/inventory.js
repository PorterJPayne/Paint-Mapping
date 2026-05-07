const inventoryPanel =
  document.getElementById(
    "inventoryPanel"
  );

const inventoryBtn =
  document.getElementById(
    "inventoryBtn"
  );

const closeInventoryBtn =
  document.getElementById(
    "closeInventoryBtn"
  );

const addInventoryBtn =
  document.getElementById(
    "addInventoryBtn"
  );

const inventoryList =
  document.getElementById(
    "inventoryList"
  );

const inventorySearch =
  document.getElementById(
    "inventorySearch"
  );

function createInventoryId(){

  return "INV-" +
    Math.random()
      .toString(36)
      .substring(2,8)
      .toUpperCase();

}

function openInventory(){

  inventoryPanel.classList.remove(
    "hidden"
  );

  renderInventory();

}

function closeInventory(){

  inventoryPanel.classList.add(
    "hidden"
  );

}

function renderInventory(){

  inventoryList.innerHTML = "";

  const search =
    inventorySearch.value
      .toLowerCase();

  const filtered =
    buildingData.inventory.filter(
      item =>

        item.color
          .toLowerCase()
          .includes(search)

        ||

        item.code
          .toLowerCase()
          .includes(search)

        ||

        item.brand
          .toLowerCase()
          .includes(search)
    );

  filtered.forEach((paint,index)=>{

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
      inventory-item
      ${lowStock ? "low-stock" : ""}
      `;

    card.innerHTML = `

      <div class="inventory-title">
        ${paint.color || "Untitled Paint"}
      </div>

      <div style="
        font-size:12px;
        color:#666;
        margin-bottom:10px;
      ">
        ${paint.inventoryId}
      </div>

      <input
        placeholder="Color"
        value="${paint.color || ""}"
        onchange="
          buildingData.inventory[${index}].color=this.value;
          saveData();
        "
      >

      <input
        placeholder="Code"
        value="${paint.code || ""}"
        onchange="
          buildingData.inventory[${index}].code=this.value;
          saveData();
        "
      >

      <input
        placeholder="Kiln Spec"
        value="${paint.kilnSpec || ""}"
        onchange="
          buildingData.inventory[${index}].kilnSpec=this.value;
          saveData();
        "
      >

      <input
        placeholder="Brand"
        value="${paint.brand || ""}"
        onchange="
          buildingData.inventory[${index}].brand=this.value;
          saveData();
        "
      >

      <input
        placeholder="Finish"
        value="${paint.finish || ""}"
        onchange="
          buildingData.inventory[${index}].finish=this.value;
          saveData();
        "
      >

      <input
        placeholder="Quantity"
        value="${paint.quantity || ""}"
        onchange="
          buildingData.inventory[${index}].quantity=this.value;
          saveData();
        "
      >

      <input
        placeholder="Low Stock Threshold"
        value="${paint.lowStock || ""}"
        onchange="
          buildingData.inventory[${index}].lowStock=this.value;
          saveData();
        "
      >

      <input
        placeholder="Storage Location"
        value="${paint.location || ""}"
        onchange="
          buildingData.inventory[${index}].location=this.value;
          saveData();
        "
      >

      <textarea
        placeholder="Notes"
        onchange="
          buildingData.inventory[${index}].notes=this.value;
          saveData();
        "
      >${paint.notes || ""}</textarea>

      <button
        onclick="deleteInventoryPaint(${index})"
        style="
          background:#b42318;
        "
      >
        Delete Paint
      </button>

    `;

    inventoryList.appendChild(card);

  });

}

function deleteInventoryPaint(index){

  if(
    !confirm(
      "Delete inventory paint?"
    )
  ) return;

  buildingData.inventory.splice(
    index,
    1
  );

  saveData();

  renderInventory();

}

inventoryBtn.onclick =
  openInventory;

closeInventoryBtn.onclick =
  closeInventory;

addInventoryBtn.onclick = ()=>{

  buildingData.inventory.push({

    inventoryId:
      createInventoryId(),

    color:"",
    code:"",
    kilnSpec:"",
    brand:"",
    finish:"",
    quantity:"",
    lowStock:"",
    location:"",
    notes:""

  });

  saveData();

  renderInventory();

};

inventorySearch.oninput =
  renderInventory;

window.deleteInventoryPaint =
  deleteInventoryPaint;
