var map = AmCharts.makeChart("chartdiv", {
    type: "map",
    theme: "dark",
    projection: "mercator",
    panEventsEnabled : true,
    backgroundColor : "#535364",
    backgroundAlpha : 1,
    zoomControl: {
        zoomControlEnabled : true
    },
    "dataProvider": {
      "map": "worldLow",
      "getAreasFromMap": true
    },
    areasSettings : {
        autoZoom : true,
        color : "#B4B4B7",
        colorSolid : "#84ADE9",
        selectedColor : "#84ADE9",
        outlineColor : "#666666",
        rollOverColor : "#9EC2F7",
        rollOverOutlineColor : "#000000"
    },
    /**
     * Add init event to perform country selection
     */
    "listeners": [{
      "event": "init",
      "method": function(e) {
        preSelectCountries( ["AO","AR","AU","BR","CA","CN","CZ","DZ","ES","FR","HN","IN","KZ","NG","NI","RU","SD","TZ","US"]);
      }
    }]
  });
  
  /**
   * Function which extracts currently selected country list.
   * Returns array consisting of country ISO2 codes
   */
  function preSelectCountries(list) {
    for(var i = 0; i < list.length; i++) {
      var area = map.getObjectById(list[i]);
      area.showAsSelected = true;
      map.returnInitialColor(area);
    }
  }