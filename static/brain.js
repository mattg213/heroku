var baseApiURL = "http://127.0.0.1:5000/api"

var modelData, makeData, cleanedData, titleData;

d3.json(`${baseApiURL}/makes`).then(data => {
    makeData = data;

    makeData.unshift("All Makes");

    populateMakes();
});

d3.json(`${baseApiURL}/models`).then(data => {
    modelData = data;

    console.log(modelData);

    populateModels();
});

d3.csv("./python/data/cleaned-data.csv").then(data => {
    cleanedData = data;
    console.log(data);
});

d3.json("./python/data/info/titles.json").then(data => {
    titleData = data;

    refreshData();
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
        return d;
    });
}

function populateModels() {
    console.log(modelData);

    var modelDropDown = d3.select("#models");

    var options = modelDropDown.selectAll("option").remove();

    var selection = d3.select("#makes").property("value");

    var selectedData = [];

    if (selection === "All Makes") {
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

    cleanedData.forEach(item => {
        if (selectedMake === "All Makes") {
            selectedData = cleanedData;
            return;
        }

        if (item.make == selectedMake) {

            if (selectedModel === "All Models") {
                selectedData.push(item);
            } else if (selectedModel === item.model) {
                selectedData.push(item);
            }
        }
    });

    refreshDoughnut(selectedData);
    refreshBarChart(selectedData);

}

function refreshDoughnut(selectedData) {
        // Doughnut Refresh - Vehicle Title

        doughnutArray = Array(titleData.length).fill(0);

        selectedData.forEach(item => {
            switch(item.vehicle_title) {
                case "Rebuilt, Rebuildable & Reconstructed":
                    doughnutArray[0] += 1;
                    break;
                case "Clean":
                    doughnutArray[1] += 1;
                    break;
                case "Salvage":
                    doughnutArray[2] += 1;
                    break;
                case "Flood, Water Damage":
                    doughnutArray[3] += 1;
                    break;
                default:
                    console.log("Default");
            }
        });
    
        var newData = {
            labels: titleData,
              datasets: [{
                label: '',
                data: doughnutArray,
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
}

function refreshBarChart(selectedData) {

}