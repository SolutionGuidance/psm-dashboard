(function(d3) {
  "use strict";

  function randomizeFeature(feature) {
    var random = Math.random() * 3;
    if (random < 1) {
      feature.status = "Completed";
      if (random < 0.5) {
        feature.startDate = "2018-02-01";
        feature.completedDate = "2018-04-01";
      } else {
        feature.startDate = "2018-03-01";
        feature.completedDate = "2018-04-01";
      }
    } else if (random > 2) {
      feature.status = "InProgress";
      if (random < 2.5) {
        feature.startDate = "2018-03-01";
      } else {
        feature.startDate = "2018-04-01";
      }
    }
  }

  function randomizeFeatures(features) {
    Object.keys(features).forEach(function(featureId) {
      randomizeFeature(features[featureId])
    });
  }

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

  readJsonFile("sample-input.json", function(text) {
    var data = JSON.parse(text);

    // A temporary measure. 
    randomizeFeatures(data.features)

    window.drawFeaturesPieChart(data, d3);
    window.drawFeaturesBurnDownChart(data, d3);
  });
})(window.d3);
