var url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

var margin = {
  left: 80,
  right:20,
  top:20,
  bottom: 20
};

var w = 1000 - margin.left - margin.right;
var h = 500 - margin.top - margin.bottom;


$.getJSON(url, function(json) { 
  var data = json.data;
  var minDate = new Date(data[0][0]);
  var maxDate = new Date(data[274][0]);
  
  var currency = d3.format("$,.2f")
 
  var xScale = d3.time.scale()
            .domain([minDate, maxDate])
            .range([margin.left,w])

  var yScale = d3.scale.linear()
            .domain([0, d3.max(data, function(d) {return d[1]})])
            .range([h, 0]);

  var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .ticks(10, "");

  var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom")
            .tickFormat(d3.time.format("%Y"), 5) //merely a suggestion
  
  var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

  var svg = d3.select("svg").attr('width', w).attr('height', h);

  svg.selectAll("rect")
       .data(data)
       .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d){return xScale(new Date(d[0]))})
          .attr("y", function(d){return (yScale(d[1]))})    
          .attr("height", function(d) {return (h-(yScale(d[1])))})
          .attr("width", function(d) {return (Math.ceil(w /274))})
          .attr("transform", "translate(0,-20)")
          .on("mouseover", function(d) {      
              var currDate = new Date(d[0]);
              var currYear = currDate.getFullYear();
              var currMonth = currDate.getMonth();
              div.transition()        
                .duration(100)      
                .style("opacity", .9);      
             div.html("<span>" + currency(d[1]) + " Billion<br/>"+ months[currMonth] + " " + currYear + "</span>")  
                .style("left", (d3.event.pageX) + "px")     
                .style("top", (d3.event.pageY - 28) + "px");    
            })                  
        .on("mouseout", function(d) {       
            div.transition()        
                .duration(500)      
                .style("opacity", 0);   
        });

svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + (h-margin.top) + ")")
  .call(xAxis)

svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")")
  .call(yAxis)
});