function saveData(){

  localStorage.setItem(
    "paintMapData",
    JSON.stringify(buildingData)
  );

}
