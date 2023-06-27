var modelData, makeData;

d3.json("./python/data/info/makes.json").then(data => {
    makeData = data;

    makeData.unshift("All Makes");

    populateMakes();
});

d3.json("./python/data/info/models.json").then(data => {
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
        return d;
    });
}

function makeChanged() {
    populateModels();
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