function D3_pyramind(d3) {
    //start 
    d3.pyramid = function() {
        var size = [1, 1],
            value = function(d) {
                return d.value
            },
            coordinates;

        var percentageValues = function(data) {
            var values = data.map(value);
            var sum = d3.sum(values, function(d) {
                return +d;
            });
            var percentValues = data.map(function(d, i) {
                d.value = +values[i];
                return values[i] / sum * 100;
            });
            percentValues.sort(function(a, b) {
                return b - a;
            });
            return percentValues;
        }
        var coordinatesCalculation = function(data) {
            var w = size[0],
                h = size[1],
                ratio = (w / 2) / h,
                percentValues = percentageValues(data),
                coordinates = [],
                area_of_triangle = (w * h) / 2;

            function d3Sum(i) {
                return d3.sum(percentValues, function(d, j) {
                    if (j >= i) {
                        return d;
                    }
                });
            }
            for (var i = 0, len = data.length; i < len; i++) {
                var selectedPercentValues = d3Sum(i),
                    area_of_element = selectedPercentValues / 100 * area_of_triangle,
                    height1 = Math.sqrt(area_of_element / ratio),
                    base = 2 * ratio * height1,
                    xwidth = (w - base) / 2;
                if (i === 0) {
                    coordinates[i] = {
                        "values": [{
                            "x": w / 2,
                            "y": 0
                        }, {
                            "x": xwidth,
                            "y": height1
                        }, {
                            "x": base + xwidth,
                            "y": height1
                        }]
                    };
                } else {
                    coordinates[i] = {
                        "values": [coordinates[i - 1].values[1], {
                            "x": xwidth,
                            "y": height1
                        }, {
                            "x": base + xwidth,
                            "y": height1
                        }, coordinates[i - 1].values[2]]
                    };
                }

            }
            coordinates[0].values[1] = coordinates[coordinates.length - 1].values[1];
            coordinates[0].values[2] = coordinates[coordinates.length - 1].values[2];
            var first_data = coordinates.splice(0, 1);
            coordinates = coordinates.reverse();
            coordinates.splice(0, 0, first_data[0]);
            return coordinates;
        }

        function pyramid(data) {
            var i = 0,
                coordinates = coordinatesCalculation(data);

            data.sort(function(a, b) {
                return a.value - b.value;
            })

            data.forEach(function() {
                data[i].coordinates = coordinates[i].values;
                i++;
            })
            return data;
        }
        pyramid.size = function(s) {
            if (s.length === 2) {
                size = s;
            }
            return pyramid;
        }
        pyramid.value = function(v) {
            if (!arguments.length) return value;
            value = v;
            return pyramid;
        };
        return pyramid;
    }


    //end 
};

function get_data() {
    return JSON.parse('[{"region":"Africa","population":"1110635000"},{"region":"Americas","population":"972005000"},{"region":"Asia","population":"4298723000"},{"region":"Europe","population":"742452000"},{"region":"Ocenia","population":"38304000"}]');
}

function wrap(path, width) {
            path.each(function() {
                var path = this;
                var obj = path.parentNode;
                var blockNumber = obj.id.match(/\d+/)[0];
                var productList = path.nextElementSibling.innerHTML;
              
                obj.removeChild(path.nextElementSibling);
                console.log("Product List" + productList);
                var pathLength = Math.floor(path.getTotalLength());
                var pointsArray = [];
                var tempY = 0;
                for (var i = 0; i < 100; i++) {
                    var prcnt = i;
                    prcnt = (prcnt * pathLength) / 100;
                    pt = path.getPointAtLength(prcnt);
                    pt.x = Math.round(pt.x);
                    pt.y = Math.round(pt.y);
                    if (tempY != pt.y) {
                        pointsArray.push({
                            "x": pt.x,
                            "y": pt.y
                        });

                        var text = window.document.createElementNS("http://www.w3.org/2000/svg", "text");
                        text.textContent = "*";
                        text.setAttributeNS(null, "y", pt.y);
                        text.setAttributeNS(null, "x", pt.x);
                        /* obj.appendChild(text);*/
                    }
                    tempY = pt.y;
                }

                if (blockNumber == "1" || blockNumber == "2" || blockNumber == "3") {
                    var actualSize = pointsArray.length;
                    var positionSize = pointsArray.length / 2;
                    for (var i = 0; i < positionSize; i++) {
                        if (i != 0 && i != positionSize) {
                            var line = window.document.createElementNS("http://www.w3.org/2000/svg", "line");
                            line.setAttributeNS(null, "y1", pointsArray[i].y);
                            line.setAttributeNS(null, "x1", pointsArray[i].x);

                            line.setAttributeNS(null, "y2", pointsArray[actualSize - (i + 1)].y);
                            line.setAttributeNS(null, "x2", pointsArray[actualSize - (i + 1)].x);
                            line.setAttributeNS(null, "stroke", "black");
                            line.setAttributeNS(null, "stroke-width", "1");
                            var lineObject = obj.appendChild(line);


                            var text1 = window.document.createElementNS("http://www.w3.org/2000/svg", "text");
                            text1.setAttributeNS(null, "y", lineObject.getBBox().y);
                            text1.setAttributeNS(null, "x", lineObject.getBBox().x);
                            text1.setAttributeNS(null, "width", lineObject.getBBox().width);
                            text1.setAttributeNS(null, "height", lineObject.getBBox().height);
                            text1.setAttributeNS(null, "data-block", obj.id);
                            obj.appendChild(text1);
                        }
                    }

                }
                var textElements = document.querySelectorAll("text[data-block=" + obj.id + "]");
                var allLineElements = document.querySelectorAll("line");
                for (var i = 0; i < allLineElements.length; i++) {
                    obj.removeChild(allLineElements[i]);
                }
               
                var noOfCharIn = 0;
				if(blockNumber == "1"){
					for (var i = 0; i < textElements.length; i++) 
					{
						
                    var textEle = textElements[i];
                    var textWidth = Math.round(textEle.getAttribute("width"))
					textWidth = Math.round(textWidth);
                    var txtStackSize = Math.round(textWidth / 7);
						if (i > 6 && (i % 2) === 0) {
							var tempChara = "";
							for (var j = 0; j < txtStackSize; j++) {
								if (productList.length < noOfCharIn) {
									 break; 
								}
								if (productList[noOfCharIn]) {
									tempChara += productList[noOfCharIn];
									noOfCharIn++;
								}
							}
							textEle.textContent = tempChara;
						}

					}
				}else if(blockNumber == "2" || blockNumber == "3"){
					for (var i = textElements.length; i>=0; i--) {
                    var textEle = textElements[i];
					if( textEle ){
						var textWidth = Math.round(textEle.getAttribute("width"))
					textWidth = Math.round(textWidth);
                    var txtStackSize = Math.round(textWidth / 7);
                    if ((i % 2) === 0 && i!=(textElements.length-1)) {
                        var tempChara = "";
                        for (var j = 0; j < txtStackSize; j++) {
                            if (productList.length < noOfCharIn) {
                                break;
                            }
                            if ( productList[noOfCharIn]) {
                                tempChara += productList[noOfCharIn];
                                noOfCharIn++;
                            }
                        }
                        textEle.textContent = tempChara;
						}
						
					}
                    

                }
					
					
				}
                


            });
        }
		
define('pyramid', ['d3'], function(d3) {
    D3_pyramind(d3);
	//wrap();
    return function(instanceData) {
        var width = 700,
            height = 450,
            radius = Math.min(width, height) / 2;

        var color = d3.scale.ordinal()
			.range(["rgb(255,0,0)", "rgb(255,255,0)", "rgb(0,128,0)"]).domain(d3.range(0, 3));
            //.range(["#255aee", "#3a6fff", "#4f84ff", "rgb(101,154,302)", "rgb(122,175,323)", "rgb(144,197,345)", "rgb(165,218,366)"]);

        var svg = d3.select("#" + instanceData.id).append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")

        //d3.csv("data.csv", function(error, data) {
        //var data = get_data();
		var data = instanceData.series[0];
        var pyramid = d3.pyramid()
            .size([width, height])
            .value(function(d) {
                return d.population;
            });

        var line = d3.svg.line()
            .interpolate('linear-closed')
            .x(function(d, i) {
                return d.x;
            })
            .y(function(d, i) {
                return d.y;
            });

        var g = svg.selectAll(".pyramid-group")
            .data(pyramid(data))
            .enter().append("g")
            .attr("class", "pyramid-group");

        g.append("path")
            .attr("d", function(d) {
                return line(d.coordinates);
            })
            .style("fill", function(d) {
                return color(d.region);
            });

        g.append("text")
            .attr({
                "y": function(d, i) {
                    if (d.coordinates.length === 4) {
                        return (((d.coordinates[0].y - d.coordinates[1].y) / 2) + d.coordinates[1].y) + 5;
                    } else {
                        return (d.coordinates[0].y + d.coordinates[1].y) / 2 + 10;
                    }
                },
                "x": function(d, i) {
                    return width / 2;
                }
            })
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.region;
            });
		//g.selectAll(".pyramid-group path").call(wrap, x.rangeBand());
		
        d3.select("#" + instanceData.id).append("table")
            .attr({
                "id": "footer",
                "width": width + "px"
            })
        //});
    };
});