import c3 from "c3";

// this funciton is called by FileMaker.
let chart;
const seriesValues = {
  "Sales Amount": "fieldData.salesAmount",
  "Units Sold": "fieldData.unitsSold",
};

function updateTitle(productName, year) {
  const titleDiv = document.getElementById("title");
  titleDiv.style.display = "block";
  titleDiv.style.textAlign = "center";
  titleDiv.innerHTML = `${productName} Sales in ${year}`;
  titleDiv.style.color = "purple";
  titleDiv.style.fontWeight = "600";
  titleDiv.style.fontSize = "24px";
}
window.loadWidget = function (json) {
  const obj = JSON.parse(json);
  const { data, type, series } = obj;
  console.log(data);

  let value = [];
  series.forEach((item) => {
    value.push(seriesValues[item]);
  });
  console.log(value);
  const { year, productName } = data[0].fieldData;
  console.log(year, productName);

  updateTitle(productName, year);
  chart = c3.generate({
    bindto: "#chart",
    axis: {
      x: { type: "category" },
    },
    data: {
      json: data,
      type: type,
      colors: {
        "fieldData.salesAmount": "red",
      },
      names: {
        "fieldData.month": "Month",
        "fieldData.unitsSold": "Units Sold",
        "fieldData.salesAmount": "Sales Amount",
      },
      keys: {
        x: "fieldData.month",
        value: value,
      },
    },
  });
};

window.transformChart = function (json) {
  const obj = JSON.parse(json);
  const { type } = obj;
  chart.transform(type);
};

window.updateData = function (json) {
  const obj = JSON.parse(json);
  const { data, series } = obj;
  const { year, productName } = data[0].fieldData;
  console.log(year, productName);
  const valuesinChart = chart.data.shown().map((item) => item.id);
  console.log(valuesinChart);

  updateTitle(productName, year);
  let value = [];
  series.forEach((item) => {
    value.push(seriesValues[item]);
  });
  console.log(value);

  const newValuesToShow = value.filter((item) => !valuesinChart.includes(item));
  chart.load({
    json: data,
    keys: {
      x: "fieldData.month",
      value: value,
    },
  });
};
window.changeColors = function (json) {
  const obj = JSON.parse(json);
  const { colors } = obj;
  chart.data.colors(colors);
};
