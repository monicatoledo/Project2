function buildMetadata(sample) {

  console.log("HERE WE GO inside-11: ", sample);

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/metadata/${sample}`).then((sample_metadata) => {

    console.log("HERE WE GO inside-12: ", sample_metadata);
    /*
    sample_metadata["sample"] = result[0]
    sample_metadata["ETHNICITY"] = result[1]
    sample_metadata["GENDER"] = result[2]
    sample_metadata["AGE"] = result[3]
    sample_metadata["LOCATION"] = result[4]
    sample_metadata["BBTYPE"] = result[5]
    sample_metadata["WFREQ"] = result[6]
    */

    // Use d3 to select the panel with id of `#sample-metadata`
    var selection = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    selection.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample_metadata).forEach(([key, value]) => {
      selection.append("li").text(`${key}: ${value}`);
    });

  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  console.log("HERE WE GO with Kurt++++++++++++++++++++++++++++++++");


  console.log("HERE WE GO inside-1: ", sample);

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((sample_data) => {

    console.log("HERE WE GO inside-2: ", sample_data);

    // @TODO: Build a Bubble Chart using the sample data
    /* Use `otu_ids` for the x values
    * Use `sample_values` for the y values
    * Use `sample_values` for the marker size
    * Use `otu_ids` for the marker colors
    * Use `otu_labels` for the text values */
  
    function getBubbleColor(otu_id) {
      var id_range = Math.max(...sample_data.otu_ids) - Math.min(...sample_data.otu_ids);
      var offset = 3*255;

      otu_id = parseInt(otu_id);
      otu_id = otu_id * (offset/id_range);
      var color_c = otu_id % offset;

      if (color_c < 255) {
        var red_c = color_c;
        var green_c = 0;
        var blue_c = 0;
      }
      else if (color_c < 255*2) {
        var red_c = 255;
        var green_c = color_c % 255;
        var blue_c = 0;
      }
      else {
        var red_c = 255;
        var green_c = 255;
        var blue_c = color_c % 255;
      }
      return `rgba(${red_c}, ${green_c}, ${blue_c}, 0.5)`;
    }

    var list_color = [];
    sample_data.otu_ids.forEach(function(d) {
      list_color.push(getBubbleColor(d));
    });
    console.log("HERE WE GO inside-2.5 color_list: ", list_color);

    var trace1 = {
      x: sample_data.otu_ids,
      y: sample_data.sample_values,
      mode: "markers",
      type: "scatter",
      hovertext: sample_data.otu_labels,
      marker: {
        size: sample_data.sample_values,
        color: list_color,
        symbol: "circle"
      }
    };

    console.log("HERE WE GO inside-3: ", trace1);

    // Make it an Array
    var bubble_data = [trace1];
    // The Layout of the whole chart
    var layout = {
      title: `Sample ${sample}`,
      xaxis: {title: "Otu_Id"},
      yaxis: {title: "Sample_Value"},
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
    // The option to show (or NOT) the mode-bar on the top of the chart
    var options = {
      displayModeBar: true
    };
    // Plot to the HTML
    Plotly.newPlot("bubble", bubble_data, layout, options);


    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    /* Use `sample_values` as the values for the PIE chart
    * Use `otu_ids` as the labels for the pie chart
    * Use `otu_labels` as the hovertext for the chart */

    var sample_values_sorted = [];
    var otu_ids_sorted = [];
    var otu_labels_sorted = [];

    // To get a sorted sample_values list
    sample_data.sample_values.forEach(function(d) {
      sample_values_sorted.push(d);
    });
    sample_values_sorted.sort((a,b) => b-a);

    // Get top 10
    sample_values_sorted = sample_values_sorted.slice(0, 10);
    sample_values_sorted.forEach(function(d) {
      var index = sample_data.sample_values.indexOf(d);
      otu_ids_sorted.push(sample_data.otu_ids[index]);
      otu_labels_sorted.push(sample_data.otu_labels[index]);
    });

    var trace2 = {
      labels: otu_ids_sorted,
      values: sample_values_sorted,
      hovertext: otu_labels_sorted,
      type: 'pie'
    };
    
    console.log("HERE WE GO inside-4: ", trace2);

    // Make it an Array
    var pie_data = [trace2];
    // The Layout of the whole chart
    var layout = {
      title: "Top 10 Samples",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
    // The option to show (or NOT) the mode-bar on the top of the chart
    var options = {
      displayModeBar: true
    };
    // Plot to the HTML
    Plotly.newPlot("pie", pie_data, layout, options);
  
  });
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    console.log("HERE WE GO: ", firstSample);
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
