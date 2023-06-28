var baseApiURL = "http://127.0.0.1:5000/api"

var modelData, makeData;

d3.json(`${baseApiURL}/makes`).then(data => {
    makeData = data;

    makeData.unshift("All Makes");

    populateMakes();
});

d3.json(`${baseApiURL}/models`).then(data => {
    modelData = data;

    populateModels();
});

function populateMakes() {
    var makesDropDown = d3.select("#makes");

    var options =  makesDropDown.selectAll("option")
    .data(makeData)
    .enter()
    .append("option");

    options.text(d => {
        return d;
    })
    .attr("value", d => {
        if (d === "All Makes") {
            return 'all';
        }
        return d;
    });
}

function populateModels() {
    console.log(modelData);

    var modelDropDown = d3.select("#models");

    var options = modelDropDown.selectAll("option").remove();

    var selection = d3.select("#makes").property("value");

    var selectedData = [];

    if (selection === "all") {
        selectedData = ["All Models"];
    } else {
        selectedData = modelData[selection]

        selectedData.unshift("All Models"); 
    }

    options = modelDropDown.selectAll("option")
    .data(selectedData)
    .enter()
    .append("option");

    options.text(d => {
        return d;
    })
    .attr("value", d => {
        if (d === "All Models") {
            return "all";
        } 
        return d;
    });
}

function makeChanged() {
    populateModels();
    refreshData();
}

function modelChanged() {
    refreshData();
}

function refreshData() {

    var selectedMake = d3.select("#makes").property("value");
    var selectedModel = d3.select("#models").property("value");

    var selectedData = [];

    refreshDoughnut(selectedMake, selectedModel);
    refreshBarChart(selectedMake, selectedModel);
    refreshScatterChart(selectedMake, selectedModel);
    refreshPieChart(selectedMake, selectedModel);
}

function refreshDoughnut(make, model) {
        // Doughnut Refresh - Vehicle Title
        var url = `${baseApiURL}/titles/${make}/${model}`;

        console.log(url);
    
        d3.json(url).then(d => {
            console.log(make, model);
            console.log(d);

            keys = Object.keys(d);

            newDataset = [];

            for (let item in d) {
                newDataset.push(d[item]);
            };

            var newData = {
                labels: keys,
                  datasets: [{
                    label: '',
                    data: newDataset,
                    backgroundColor: [
                      'rgb(255, 99, 132)',
                      'rgb(54, 162, 235)',
                      'rgb(255, 205, 86)',
                      'rgb(255, 0, 255)'
                    ],
                    hoverOffset: 4
                  }]
            };
        
            updateDoughnut(newData);
        });
}

function refreshBarChart(make, model) {
        // Barchart Refresh
        var url = `${baseApiURL}/years/${make}/${model}`;

        console.log(url);
    
        d3.json(url).then(d => {
            console.log(make, model);
            console.log(d);

            keys = Object.keys(d);

            newDataset = [];

            for (let item in d) {
                newDataset.push(d[item]);
            };

            const data = {
                labels: keys,
                datasets: [{
                  label: '',
                  data: newDataset,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)'
                  ],
                  borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                  ],
                  borderWidth: 1
                }]
              };
    
              updateBarChart(data);

        });
}

function refreshScatterChart(make, model) {

    var url = `${baseApiURL}/scatterdata/${make}/${model}`;

    console.log(url);

    d3.json(url).then(d => {
        newDataset = [];
        console.log(url);

        for (let make_name in d) {

            item_data = [];

            for (let item in d[make_name]) {
                j = {
                    x: d[make_name][item]['price'], 
                    y: d[make_name][item]['mileage']
                }

                item_data.push(j);
            }



            j = {
                label: make_name,
                data: item_data,
            };

            newDataset.push(j);
        }

        console.log(newDataset);


        const data = {
            datasets: newDataset
          };

          updateScatterChart(data);

    });
}

function refreshPieChart(make, model) {

    var url = `${baseApiURL}/piedata/${make}/${model}`;

    d3.json(url).then(d => {

        keys = Object.keys(d);

        newDataset = [];

        for (let item in d) {
            newDataset.push(d[item]);
        };

        console.log(newDataset);
        console.log(url);

        var newData = {
            labels: keys,
            datasets: [{
              label: 'My First Dataset',
              data: newDataset,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          };

          updatePieChart(newData);
    });
}

function initalLoad() {
    refreshDoughnut('all', 'all');
    refreshBarChart('all', 'all');
    refreshScatterChart('all', 'all');
    refreshPieChart('all', 'all');
}

initalLoad();