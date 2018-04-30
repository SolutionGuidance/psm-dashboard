(function() {
  "use strict";

  window.drawFeaturesPieChart = function(data, d3) {
    var dataset = [
      {
        label: "Completed",
        count: 150
      },
      {
        label: "Not Started",
        count: 222
      },
      {
        label: "In Process",
        count: 300
      }
    ];

    var width = 800;
    var height = 360;
    var radius = Math.min(width, height) / 2;

    var color = d3.scaleOrdinal().range(["#5c2484", "#ddb138", "#2a8424"]);

    var svg = d3
      .select("#features-pie-chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius);

    var pie = d3
      .pie()
      .value(function(d) {
        return d.count;
      })
      .sort(null);

    var path = svg
      .selectAll("path")
      .data(pie(dataset))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", function(d) {
        return color(d.data.label);
      });

    var legendRectSize = 18;
    var legendSpacing = 4;

    var legend = svg
      .selectAll(".legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = height * color.domain().length / 2;
        var horz = 11 * legendRectSize;
        var vert = i * height - offset;
        return "translate(" + horz + "," + vert + ")";
      });

    legend
      .append("rect")
      .attr("width", legendRectSize)
      .attr("height", legendRectSize)
      .style("fill", color)
      .style("stroke", color);

    legend
      .append("text")
      .attr("x", legendRectSize + legendSpacing)
      .attr("y", legendRectSize - legendSpacing)
      .text(function(d) {
        return d;
      });

    var tooltip = d3
      .select("#chart")
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
