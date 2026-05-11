const STORAGE_KEY =
  "paintMapData";

let saveTimeout =
  null;

// SAVE

async function saveData(){

  clearTimeout(
    saveTimeout
  );

  saveTimeout =
    setTimeout(
      async ()=>{

        try{

          const response =
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

          if(!response.ok){

            throw new Error(
              "Save request failed"
            );

          }

          console.log(
            "Cloud save success"
          );

        }

        catch(error){

          console.error(
            "Cloud save failed",
            error
          );

        }

      },
      300
    );

}

// LOAD

async function loadCloudData(){

  try{

    const response =
      await fetch(
        "/api/load"
      );

    if(!response.ok){

      throw new Error(
        "Cloud load failed"
      );

    }

    const data =
      await response.json();

    if(
      !data ||
      !data.floors
    ){

      throw new Error(
        "Invalid cloud data"
      );

    }

    buildingData = data;

    console.log(
      "Cloud load success"
    );

  }

  catch(error){

    console.error(
      "Cloud load failed",
      error
    );

  }

}

// FORCE SAVE

async function forceSave(){

  try{

    const response =
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

    if(!response.ok){

      throw new Error(
        "Force save failed"
      );

    }

    console.log(
      "Force save success"
    );

  }

  catch(error){

    console.error(
      error
    );

  }

}
