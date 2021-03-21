  
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
.then(response => response.json())
.then(data => {

    drawChart(data);
    
});


function drawChart (data){
    const svgWidth = 750;
    const svgHeight = 500;
    const padding = 60;

    //define svg inside svg variable
    const svg = d3.select("svg")
                    .attr("width", svgWidth)
                    .attr("height", svgHeight);

    //create x-axis scale
    const xAxisScale = d3.scaleLinear()
                            .domain([d3.min(data, item => item["Year"]) - 1, d3.max(data, item => item["Year"]) + 1])
                            .range([padding, svgWidth - padding]);
                        
    //create y-axis scale
    const yAxisScale = d3.scaleLinear()
                            // domain([d3.min(new Date(milliseconds)), d3.max(new Date(milliseconds))])
                            .domain([d3.min(data, item => {
                                return new Date(item["Seconds"] * 1000)
                            }), d3.max(data, item => {
                                return new Date(item["Seconds"] * 1000)
                            })])
                            .range([padding, svgHeight - padding]);


    //define x and y axis
    const xAxis = d3.axisBottom(xAxisScale)
                    .tickFormat(d3.format("d"));

    const yAxis = d3.axisLeft(yAxisScale)
                    .tickFormat(d3.timeFormat('%M:%S'));

    const tooltip = d3.select('#tooltip')
                        .style("opacity", 0);
    
    const legend = d3.select("#legend");


    //create a 'g' element by calling x and y axis and translate to its position
    svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${svgHeight - padding})`);

    svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", `translate(${padding}, 0)`);


    //create circles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append('circle')
        .attr("class", "dot")
        .attr("r", "5")
        .attr("data-xvalue", item => item["Year"])
        .attr("data-yvalue", item => new Date(item["Seconds"] * 1000)) //new Date(milliseconds)
        .attr("cx", item => xAxisScale(item["Year"]))
        .attr("cy", item => yAxisScale(item["Seconds"] * 1000)) //yAxisScale(milliseconds)
        .attr("fill", item => item["URL"] == "" ? "green" : "red")
        .on("mouseover", (event, item) => {
            tooltip.transition()
                .duration(200)
                .style("visibility", "visible")
                .style("opacity", 0.9);

            if (item.Doping === ""){
                tooltip.html(
                    `${item.Name}: ${item.Nationality} <br>
                    Year: ${item.Year}, Time: ${item.Time}<br><br>
                    No Doping Allegations
                    `
                )
            }else{
                tooltip.html(
                    `${item.Name}: ${item.Nationality} <br>
                    Year: ${item.Year}, Time: ${item.Time}<br>
                    ${item.Doping}
                    `
                )
            }

            tooltip.style("left", (event.pageX + 10)  + 'px')
                    .style("top", (event.pageY + 10) + 'px');

            tooltip.attr("data-year", item.Year);
                
        })
        .on("mouseout", () => {
            tooltip.transition()
                    .duration(500)
                    .style("visibility", "hidden");
        })
        .on("click", (event, item) =>{
            if(item.URL !== ""){
                window.open(item.URL)
            }
        })
    
    legend.html(
        `<span id="green-dot"></span>No doping Allegation<br>
        <span id="red-dot"></span>Doping Allegation`
    )


}