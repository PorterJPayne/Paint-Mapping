function renderSidebar(room){

  paintContainer.innerHTML = "";

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

      <div>
        Kiln Spec:
        ${paint.kilnSpec || ""}
      </div>
    `;

    paintContainer.appendChild(card);

  });

}
