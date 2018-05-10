(function(d3) {
  "use strict";

  function readJsonFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
    };
    rawFile.send(null);
  }

  readJsonFile("dashboard-input.json", function(text) {
    var data = JSON.parse(text);
    window.drawFeaturesPieChart(data, d3);
    window.drawFeaturesBurnDownChart(data, d3);
  });
})(window.d3);
