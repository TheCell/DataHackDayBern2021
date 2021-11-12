/*!
* Start Bootstrap - Simple Sidebar v6.0.3 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }
});

var svg = d3.select("svg"),
    margin = 200, width = svg.attr("width") - margin,
    height = svg.attr("height") - margin;
    
    svg.append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 50).attr("y", 50)
    .attr("font-size", "20px")
    .attr("class", "title")
    .text("Population bar chart")
    
    var x = d3.scaleBand().range([0, width]).padding(0.4),
    y = d3.scaleLinear().range([height, 0]);
    
    var g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

    d3.csv("data.csv", function(error, data) {
        console.log(error, data);
        if (error) {
            throw error;
        }
            
        x.domain(data.map(function(d) { return d.year; }));
        y.domain([0, d3.max(data, function(d) { return d.population; })]);
                    
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .append("text")
            .attr("y", height - 250)
            .attr("x", width - 100)
            .attr("text-anchor", "end")
            .attr("font-size", "18px")
            .attr("stroke", "blue").text("year");
            
        g.append("g")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-5.1em")
            .attr("text-anchor", "end")
            .attr("font-size", "18px")
            .attr("stroke", "blue")
            .text("population");
                        
        g.append("g")
            .attr("transform", "translate(0, 0)")
            .call(d3.axisLeft(y))

        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .on("mouseover", onMouseOver) 
            .on("mouseout", onMouseOut)   
            .attr("x", function(d) { return x(d.year); })
            .attr("y", function(d) { return y(d.population); })
            .attr("width", x.bandwidth()).transition()
            .ease(d3.easeLinear).duration(200)
            .delay(function (d, i) {
                return i * 25;
            })
                
        .attr("height", function(d) { return height - y(d.population); });
    });
    
    
    function onMouseOver(d, i) {
    d3.select(this)
    .attr('class', 'highlight');
        
    d3.select(this)
        .transition()     
        .duration(200)
        .attr('width', x.bandwidth() + 5)
        .attr("y", function(d) { return y(d.population) - 10; })
        .attr("height", function(d) { return height - y(d.population) + 10; });
        
    g.append("text")
        .attr('class', 'val')
        .attr('x', function() {
            return x(d.year);
        })
        
    .attr('y', function() {
        return y(d.value) - 10;
    })
    }
    
    function onMouseOut(d, i) {
        
    d3.select(this)
        .attr('class', 'bar');
    
    d3.select(this)
        .transition()     
        .duration(200)
        .attr('width', x.bandwidth())
        .attr("y", function(d) { return y(d.population); })
        .attr("height", function(d) { return height - y(d.population); });
    
    d3.selectAll('.val')
        .remove()
    }
