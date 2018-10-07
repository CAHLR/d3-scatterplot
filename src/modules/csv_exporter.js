let selectedData = () => {
  let elements = document.getElementsByClassName('selected');
  let data = []
  for(let i = 0; i < elements.length; i++) {
    data.push(elements[i].__data__);
  }
  return data;
}
let formatToCsvString = (dataArray) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  let headers = Object.keys(dataArray[0]);
  csvContent += `${headers.join(',')}\r\n`;
  dataArray.forEach((datum) => {
    csvContent += `${Object.values(datum).join(',')}\r\n`;
  });
  return csvContent;
}
let saveSelectionAsCsv = () => {
  window.open(encodeURI(formatToCsvString(selectedData())));
}

export const CsvExporter = {
  createExportButton: () => {
    let button = document.createElement('input');
    button.type = 'submit';
    button.value = 'Export selection to CSV!'
    button.onclick = saveSelectionAsCsv;
    return button;
  }
}