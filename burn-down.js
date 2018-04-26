(function(d3) {
  "use strict";
  var rootWidth = 700;
  var rootHeight = 480;
  var root = d3
    .select("#burn-down-chart")
    .append("svg")
    .attr("width", rootWidth)
    .attr("height", rootHeight);

  // Render the title.
  var titleHeight = 50;
  root
    .append("text")
    .attr("class", "title")
    .attr("x", rootWidth / 2)
    .attr("y", titleHeight / 2)
    .text("PSM Features Progress");

  var yAxisWidth = 50;
  var xAxisHeight = 50;

  // Define the root g element.
  var chartWidth = rootWidth - yAxisWidth;
  var chartHeight = rootHeight - xAxisHeight - titleHeight;
  var chartG = root
    .append("g")
    .attr("class", "histo")
    .attr("transform", "translate(" + yAxisWidth + ", " + titleHeight + ")");

  // features data in array form, add id to each feature object
  var featuresArray = Object.keys(features)
    .map(function(key) {
      var feature = features[key];
      feature["id"] = key;
      return feature;
    })
    .sort(function(a, b) {
      return a.completedDate > b.completedDate;
    });

  // Render the axis.

  var xScale = d3
    .scaleTime()
    .domain([new Date("2018-06-01"), new Date("2018-12-31")])
    .range([0, 600]);

  var xAxis = d3.axisBottom().scale(xScale);
  chartG
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(xAxis);

  var barHeight = chartHeight / featuresArray.length;

  var barWidth = function(feature) {
    var end = xScale(new Date(feature.completedDate));
    var start = xScale(new Date(feature.startDate));
    return end - start;
  };
  var barX = 0;
  var barY = function(datum, index) {
    return index * barHeight;
  };

  // Render the bars.
  chartG
    .selectAll("rect.bar")
    .data(featuresArray)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", barX)
    .attr("width", barWidth)
    .attr("y", barY)
    .attr("height", barHeight);
})(window.d3);
