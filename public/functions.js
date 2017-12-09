

function drawBars(e) {
    var prices = [];
    prices.push(e.price);
    prices.push(e.oneYear);
    prices.push(e.threeYear);
    prices.push(e.fiveYear);
    var years = ["2017", "2018", "2020", "2022"];

    var barchart = svg.append("g")
        .attr("class", "barchart");

    barchart.selectAll(".bar").data(prices).enter()
        .append("rect")
        .attr("y", function(d, i) {return 3 + i * 44;})
        .attr("x", 36)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("height", 35)
        .attr("width", 30)
        .attr("class", "bar")
        .style("fill", function(d) {
            return colorScale(d);
        })
        .transition().duration(1000)
        .attr("width", function(d) { return yScale(d);});

    barchart.selectAll(".price").data(prices).enter()
        .append("text")
        .text(function(d) {return Math.floor(d / 1000) + "K";})
        .attr("text-anchor", "start")
        .attr("y", function(d, i) {return i * 44 + 25;})
        .attr("x", 70)
        .attr("font-size", "13px")
        .attr("fill", "#4d4d4d")
        .attr("class", "price")
        .transition().duration(600)
        .attr("x", function(d) {return 40 + yScale(d)});

    barchart.selectAll(".year").data(years).enter()
        .append("text")
        .text(function(d) {return d;})
        .attr("text-anchor", "start")
        .attr("y", function(d, i) {return 25 + i * 44;})
        .attr("x", 0)
        .attr("font-size", "12px")
        .attr("class", "year");
}

function showBack() {
    var backChart = svg.append("g").attr("class", "back");
    var widths = [50, 120, 130, 180];
    backChart.selectAll(".backbar").data(widths).enter()
        .append("rect")
        .attr("y", function(d, i) {return 3 + i * 44;})
        .attr("x", 10)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr("height", 35)
        .attr("width", function(d) { return d;})
        .attr("class", "backbar")
        .style("opacity", "0")
        .style("fill", "#d9d9d9")
        .transition().duration(1000)
        .style("opacity", 1);
}

function updateYear() {
    if (zipcode !== "") {
        mymap.removeLayer(markerGroup);
        markerGroup = L.layerGroup().addTo(mymap);
        query_Update.forEach(function (e) {
            if (e.zipcode === zipcode) {
                var color = colorScale(e.price);
                if (getYear() === "Current") {
                    color = colorScale(e.price);
                }
                if (getYear() === "1") {
                    color = colorScale(e.oneYear);
                }
                if (getYear() === "3") {
                    color = colorScale(e.threeYear);
                }
                if (getYear() === "5") {
                    color = colorScale(e.fiveYear);
                }
                L.circle([e.lat, e.long], {
                    color: "none",
                    stroke: 1,
                    fillColor: color,
                    fillOpacity: 1,
                    radius: 40
                }).addTo(markerGroup)
                    .bindPopup("price: $" + e.price)
                    .on('mouseover', function () {
                        d3.selectAll(".back").remove();
                        this.openPopup();
                        drawBars(e);
                    })
                    .on('mouseout', function() {
                        this.closePopup();
                        d3.selectAll(".barchart").remove();
                        showBack();
                    })
            }
        })
    }
}

function getYear() {
    var radios = document.getElementsByName("choice");
    var i = 0, len = radios.length;
    var checked = false;
    var userAnswer;

    for (; i < len; i++) {
        if (radios[i].checked) {
            checked = true;
            userAnswer = radios[i].value;
        }
    }
    return userAnswer;
}

function filterHouse() {
    var value1 = document.getElementById('mySearch1').value;
    var value2 = document.getElementById('mySearch2').value;
    var value3 = document.getElementById('mySearch3').value;
    var value4 = document.getElementById('mySearch4').value;
    return [value1, value2, value3, value4];

}