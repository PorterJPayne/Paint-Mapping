const STORAGE_KEY =
  "paintMapData";

function saveData(){

  try{

    // LOCAL SAVE FIRST

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        buildingData
      )

    );

    // OPTIONAL CLOUD SAVE

    saveCloudData();

  }

  catch(error){

    console.error(
      "Save failed",
      error
    );

  }

}

function loadData(){

  try{

    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if(!raw) return;

    const parsed =
      JSON.parse(raw);

    // BASIC VALIDATION

    if(
      parsed &&
      parsed.floors &&
      parsed.inventory
    ){

      buildingData =
        parsed;

    }

  }

  catch(error){

    console.error(
      "Load failed",
      error
    );

  }

}

async function saveCloudData(){

  try{

    await fetch(
      "/api/save",
      {

        method:"POST",

        headers:{
          "Content-Type":
            "application/json"
        },

        body:JSON.stringify(
          buildingData
        )

      }
    );

  }

  catch(error){

    console.error(
      "Cloud save failed",
      error
    );

  }

}

async function loadCloudData(){

  try{

    const response =
      await fetch(
        "/api/load"
      );

    if(
      !response.ok
    ) return;

    const data =
      await response.json();

    if(
      data &&
      data.floors &&
      data.inventory
    ){

      buildingData = data;

      localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

      );

    }

  }

  catch(error){

    console.error(
      "Cloud load failed",
      error
    );

  }

}

// LOAD LOCAL IMMEDIATELY

loadData();
