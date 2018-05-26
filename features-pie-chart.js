(function() {
  "use strict";

  function extractData(data) {
    var features = data.features;
    var featureIds = Object.keys(features);

    function getFeatureCount(status, featureIds, features) {
      return featureIds.filter(function(id) {
        return features[id].status === status;
      }).length;
    }

    return [
      {
        label: "Completed",
        count: getFeatureCount("Completed", featureIds, features)
      },
      {
        label: "In Progress",
        count: getFeatureCount("InProgress", featureIds, features)
      },
      {
        label: "Not Started",
        count: getFeatureCount("NotStarted", featureIds, features)
      }
    ];
  }

  window.drawFeaturesPieChart = function(data, d3) {
    var dataset = extractData(data);
    var chartEl = d3.select("#features-pie-chart");

    if (!chartEl.selectAll("*").empty()) {
      chartEl.selectAll("*").remove();
    }
    var width = +chartEl.style("width").replace(/(px)/g, "");
    var height = +chartEl.style("height").replace(/(px)/g, "");
    var radius = Math.min(width, height) / 2.5;

    var svg = d3
      .select("#features-pie-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("class", "pie")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius);

    // Passing null to .sort and .sortValues puts pie slices in input order.
    var pie = d3
      .pie()
      .value(function(d) {
        return d.count;
      })
      .sort(null)
      .sortValues(null);

    var path = svg
      .selectAll("path")
      .data(pie(dataset))
      .enter()
      .append("path")
      .attr("class", function(d) {
        return {
          "Not Started": "not-started",
          "In Progress": "in-progress",
          "Completed": "completed"
        }[d.data.label];
      })
      .attr("d", arc);

    var tooltip = d3
      .select("#features-pie-chart")
      .append("div")
      .attr("class", "tooltip");

    tooltip.append("div").attr("class", "label");
    tooltip.append("div").attr("class", "count");
    tooltip.append("div").attr("class", "percent");

    path.on("mouseover", function(d) {
      var total = d3.sum(
        dataset.map(function(d) {
          return d.count;
        })
      );
      var percent = Math.round(1000 * d.data.count / total) / 10;
      tooltip.select(".label").html(d.data.label);
      tooltip.select(".count").html(d.data.count);
      tooltip.select(".percent").html(percent + "%");
      tooltip.style("display", "block");
    });

    path.on("mouseout", function() {
      tooltip.style("display", "none");
    });
    // OPTIONAL
    path.on("mousemove", function(d) {
      tooltip
        .style("top", d3.event.layerY + 10 + "px")
        .style("left", d3.event.layerX + 10 + "px");
    });
  };
})();
