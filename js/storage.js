async function saveData(){

  localStorage.setItem(

    "paintMapData",

    JSON.stringify(buildingData)

  );

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

    console.log(
      "GitHub save success"
    );

  }

  catch(error){

    console.error(
      "GitHub save failed",
      error
    );

  }

}

async function loadCloudData(){

  try{

    const response =
      await fetch("/api/load");

    const data =
      await response.json();

    if(data){

      buildingData = data;

      localStorage.setItem(

        "paintMapData",

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
