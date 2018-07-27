var svg = d3.select("#bar"),
    margin = {top: 5, right: 200, bottom: 60, left: 60},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleBand()
    .rangeRound([0, width])
    .padding(0.08);

var x1 = d3.scaleBand();

var y = d3.scaleLinear()
    .range([height, 0]);

var y1max;

// Manipulate colors for stacked bar chart
var color = d3.scaleOrdinal()
    .range(["#d5d495", "#80b1d3", "#edb1ef", "#7fc97f", "#fdb462", "#77dcde", "#fb8072"]);

// Read in data from csv file
d3.csv("data.csv", function(d, i, columns) {
  for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
  d.total = t;
  return d;
}, function(error, data) {
  if (error) throw error;

  // The column names of the csv file are the keys
  var keys = data.columns.slice(1);

  y1max = d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); });

  x.domain(data.map(function(d) { return d.Year; }));
  x1.domain(keys).rangeRound([0, x.bandwidth()]);
  y.domain([0, 800]).nice();
  color.domain(keys);

  // Draw rectangles for stacked bar chart
  g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", function(d) { return color(d.key); })
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.Year); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth())
      .attr("stroke", "black")
      .attr("stroke-width", "1");

  rect = g.selectAll("rect");

  // Add x axis and rotate labels
  g.append("g")
      .attr("id", "xaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("y",0)
      .attr("x",-30)
      .attr("dy",".35em")
      .attr("transform","rotate(270)")
      .style("text-anchor","start");

  // Add x axis label
  g.append("text")
      .attr("transform",
            "translate(" + (width/2) + " ," +
                           (height + 60) + ")")
      .attr("font-family", "sans-serif")
      .style("text-anchor", "middle")
      .attr("font-size", 13)
      .text("Year");

  // Add y axis
  g.append("g")
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  // Add y axis label
  g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height/2))
      .attr("dy", "1em")
      .attr("font-family", "sans-serif")
      .attr("font-size", 13)
      .style("text-anchor", "middle")
      .text("Number of Reported Homicides");

  // Create labels for legend
  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // Draw rectangles for legend
  legend.append("rect")
      .attr("x", width + 110)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color)
      .attr("stroke", "black")
      .attr("stroke-width", "1");

  // Add labels for legend to chart
  legend.append("text")
      .attr("x", width + 105)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });

  Scene0();
});

d3.selectAll(".step-link")
    .on("click", function(d) {
      var clickedStep = d3.select(this).attr("id");
        d3.selectAll(".step-link").classed("active", false);
        d3.select("#" + clickedStep).classed("active", true);

        if (clickedStep === "step1") transitionScene1();
        else if (clickedStep === "step2") transitionScene2();
        else if (clickedStep === "step3") transitionScene3();
        else if (clickedStep === "step4") transitionScene4();
        else if (clickedStep === "step5") transitionScene5();
      return false;
    });

function Scene0() {
  d3.select("#div1")
    .style("display", "none");

  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  d3.select("#step1-annotation")
    .style("display", "block")
    .style("opacity", 1);

  y.domain([0, 800]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

 rect.transition()
     .attr("y", function(d) { return y(d[1]); })
     .attr("height", function(d) { return y(d[0]) - y(d[1]); })
     .attr("x", function(d) { return x(d.data.Year); })
     .attr("width", x.bandwidth());
}

function transitionScene1() {
   d3.select("#div1")
     .style("display", "none");

   d3.selectAll(".annotation-step")
     .style("display", "none")
     .style("opacity", 0.0);

   d3.select("#step1-annotation")
     .style("display", "block")
     .transition().delay(300).duration(500)
       .style("opacity", 1);

   y.domain([0, 800]);
   d3.select("#yaxis").remove();
   g.append("g")
     .transition()
       .duration(500)
       .delay(function(d, i) { return i * 10; })
       .attr("id", "yaxis")
       .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
  .transition()
      .attr("x", function(d) { return x(d.data.Year); })
      .attr("width", x.bandwidth());
}

function transitionScene2() {
  d3.select("#div1")
    .style("display", "none");

  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, y1max]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });

  d3.select("#step2-annotation")
    .transition().delay(1600).duration(500)
      .style("display", "block")
      .style("opacity", 1);
}

function transitionScene3() {
  d3.select("#div1")
    .style("display", "none");

  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, 175]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}

function transitionScene4() {
  d3.select("#div1")
    .style("display", "none");

  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, 115]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}

function transitionScene5() {
  document.getElementById('radio1').checked = true;

  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  d3.select("#step5-annotation")
    .transition().delay(500).duration(500)
      .style("display", "block")
      .style("opacity", 1);

  y.domain([0, 800]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

 rect.transition()
     .duration(500)
     .delay(function(d, i) { return i * 10; })
     .attr("y", function(d) { return y(d[1]); })
     .attr("height", function(d) { return y(d[0]) - y(d[1]); })
 .transition()
     .attr("x", function(d) { return x(d.data.Year); })
     .attr("width", x.bandwidth());

  d3.select("#div1")
    .transition().duration(500).delay(500)
      .style("display", "block");
}

d3.selectAll("input")
    .on("change", changed2);

function changed2() {
  if (this.value === "stacked") transitionScene5();
  else if (this.value === "grouped") transitionScene5Grouped();
  else if (this.value === "zoom1") transitionScene5Zoom1();
  else if (this.value === "zoom2") transitionScene5Zoom2();
  else if (this.value === "zoom3") transitionScene5Zoom3();
  else if (this.value === "zoom4") transitionScene5Zoom4();
  else if (this.value === "zoom5") transitionScene5Zoom5();
  else if (this.value === "zoom6") transitionScene5Zoom6();
}

function transitionScene5Grouped() {
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, y1max]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}

function transitionScene5Zoom1() {
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, 173]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}

function transitionScene5Zoom2() {
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, 114]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}

function transitionScene5Zoom3() {
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, 57]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}

function transitionScene5Zoom4() {
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, 51]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}

function transitionScene5Zoom5() {
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, 38]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}

function transitionScene5Zoom6() {
  d3.selectAll(".annotation-step")
    .style("display", "none")
    .style("opacity", 0.0);

  y.domain([0, 29]);
  d3.select("#yaxis").remove();
  g.append("g")
    .transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("id", "yaxis")
      .call(d3.axisLeft(y).ticks(null, "s"));

  rect.transition()
      .duration(500)
      .delay(function(d, i) { return i * 10; })
      .attr("x", function(d) { return x(d.data.Year) + x1(d3.select(this.parentNode).datum().key); })
      .attr("width", x.bandwidth() / 7)
  .transition()
    .attr("height", function(d) { return y(0) - y(d[1] - d[0]); })
      .attr("y", function(d) { return y(d[1] - d[0]); });
}
