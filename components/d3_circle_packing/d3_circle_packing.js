define(['d3'], function (d3) {

	 return function (instanceData) {	
		
	 			var data = { name: "data", children: [] };

                // Build the tree...
                var series0 = instanceData.series[0];
                
                var currentCategory = "";
                for (var index = 0; index < series0.length; ++index) {
                    
                    var record = series0[index];
                    
                    if ( currentCategory != record.category )
                    {
                        currentCategory = record.category;
                        
                        var categoryObject = { name: currentCategory, children: [] };
                        
                        // populate sub categories
                        for (var index2 = 0; index2 < series0.length; ++index2) {
                            var subrecord = series0[index2];
                            if (subrecord.category == currentCategory)
                            {
                                categoryObject.children.push({ name: subrecord.subcategory, size: subrecord.value });
                            }
                        }
                        data.children.push( categoryObject );
                    }
                 } 

                 var w = instanceData.width,
                     h = instanceData.height,
                     format = d3.format(",d");

                var pack = d3.layout.pack()
                    .size([w - 4, h - 4])
                    .value(function(d) { return d.size; });

                var vis = d3.select("#" + instanceData.id).append("svg:svg")
                	.attr("id", instanceData.id + "svg")
                    .attr("width", w)
                    .attr("height", h)
                    .attr("class", "pack")
                  .append("svg:g")
                    .attr("transform", "translate(2, 2)");

                  var node = vis.datum(data).selectAll("g.node")
                      .data(pack.nodes)
                    .enter().append("svg:g")
                      .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
                      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                  node.append("svg:title")
                      .text(function(d) { return d.name + (d.children ? "" : ": " + format(d.size)); });

                  node.append("svg:circle")
                      .attr("r", function(d) { return d.r; });

                  node.filter(function(d) { return !d.children; }).append("svg:text")
                      .attr("text-anchor", "middle")
                      .attr("dy", ".3em")
                      .text(function(d) { return d.name.substring(0, d.r / 3); });
		
	};
		
});

