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

    var totalFeatures = d3.sum(
      dataset.map(function(d) {
        return d.count;
      })
    );

    function midAngle(d) {
      return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    var svg = d3
      .select("#features-pie-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    var pieGroup = svg
      .append("g")
      .attr("class", "pie")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius * 0.7);

    /* Used for labels and label lines. */
    var outerArc = d3
      .arc()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.8);

    // Passing null to .sort and .sortValues puts pie slices in input order.
    var pie = d3
      .pie()
      .value(function(d) {
        return d.count;
      })
      .sort(null)
      .sortValues(null);

    var path = pieGroup
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

    /* ------- TEXT LABELS -------*/

    pieGroup.append("g")
      .attr("class", "labels");

    var labels = pieGroup.select(".labels").selectAll("text")
      .data(pie(dataset));

    var texts = labels.enter()
      .append("text")
      .attr("dy", "0.35em")
      .attr("transform", function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .attr("text-anchor", function(d) {
        return midAngle(d) < Math.PI ? "start" : "end";
      });

    texts
      .append("tspan")
      .text(function(d) {
        return d.data.label;
      });

    texts
      .append("tspan")
      .attr("x", "0")
      .attr("dy", "1.5em")
      .style("font-size", "smaller")
      .style("fill", "#555")
      .text(function(d) {
        var percent = Math.round(1000 * d.data.count / totalFeatures) / 10;
        return d.data.count + " Features (" + percent + "%)";
      });

    /* ------- LINES TO TEXT LABELS -------*/

    pieGroup.append("g")
      .attr("class", "lines");

    var polyline = pieGroup.select(".lines").selectAll("polyline")
      .data(pie(dataset));

    polyline.enter()
      .append("polyline")
      .attr("class", "pie-label-line")
      .attr("points", function(d) {
        var pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

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
