let rawData = [];
let displayedFields = [];

function readFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function (event) {
        const result = event.target.result;

        const fileExtension = file.name.split('.').pop().toLowerCase();

        try {
            if (fileExtension === 'json') 
            {
                const parsedData = JSON.parse(result);
    
                if (Array.isArray(parsedData)) {
                    rawData = parsedData;
                    displayStep(2);
                } else if (typeof parsedData === 'object') {
                    // If parsedData is an object, convert it to an array using Object.values()
                    rawData = Object.values(parsedData);
                    displayStep(2);
                } else {
                    console.error('Error: Parsed data is neither an array nor an object.');
                    alert('Error: Parsed data is neither an array nor an object. Please make sure the file is valid.');
                }
            }
            else if (fileExtension === 'csv')
            {
                const parsedData = parseCsv(result);
                rawData = parsedData;
                displayStep(2);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Error parsing JSON. Please make sure the file is valid.');
        }
    };

    reader.readAsText(file);
}

function parseCsv(csvText) {
    const lines = csvText.split('\n');
    const header = lines[0].split(',');
    const csvData = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry = {};

        for (let j = 0; j < header.length; j++) {
            entry[header[j]] = values[j];
        }

        csvData.push(entry);
    }

    return csvData;
}



function parseData() {
    const format = document.getElementById('format').value;

    if (!rawData || rawData.length === 0) {
        console.error('Error: rawData is undefined or empty.');
        alert('Error: rawData is undefined or empty. Please make sure the file is valid.');
        return;
    }

    // Add logic to parse CSV if needed

    const hasHeader = document.getElementById('hasHeader').checked;

    displayedFields = hasHeader ? Object.keys(rawData[0]) : Object.keys(rawData[0]).map((_, index) => `Column ${index + 1}`);

    displayOptions();
    displayTableHeaders();
    displayStep(3);
}

function displayOptions() {
    const displayOptions = document.getElementById('displayOptions');
    displayOptions.innerHTML = '';

    const availableFields = ["subcategory", "title", "price", "popularity"];

    availableFields.forEach(field => {
        const option = document.createElement('option');
        option.value = field;
        option.text = field;
        displayOptions.add(option);
    });
}

function displayTableHeaders() {
    const tableHeaders = document.getElementById('tableHeaders');
    tableHeaders.innerHTML = '';

    displayedFields.forEach(field => {
        const th = document.createElement('th');
        th.textContent = field;
        tableHeaders.appendChild(th);
    });
}

function displayTable() {
    const productTable = document.getElementById('productTable');
    const productBody = document.getElementById('productBody');
    productBody.innerHTML = '';

    const count = rawData[0];
    const products = rawData[1];

    // Convert the products object to an array
    const productArray = Object.values(products);

    // Sort the productArray by descending popularity
    const sortedData = productArray.sort((a, b) => b.popularity - a.popularity);

    sortedData.forEach(product => {
        const row = document.createElement('tr');
        displayedFields.forEach(field => {
            const td = document.createElement('td');
            td.textContent = product[field];
            row.appendChild(td);
        });
        productBody.appendChild(row);
    });
}


function addSelected() {
    const displayOptions = document.getElementById('displayOptions');
    const selectedOptions = Array.from(displayOptions.selectedOptions).map(option => option.value);
    
    // Add selected options to the displayedFields array
    displayedFields = [...displayedFields, ...selectedOptions];
    
    displayTableHeaders();
    displayTable();
}

function removeSelected() {
    const displayOptions = document.getElementById('displayOptions');
    const selectedOptions = Array.from(displayOptions.selectedOptions).map(option => option.value);
    
    // Remove selected options from the displayedFields array
    displayedFields = displayedFields.filter(field => !selectedOptions.includes(field));
    
    displayTableHeaders();
    displayTable();
}

function displayStep(stepNumber) {
    for (let i = 1; i <= 3; i++) {
        const step = document.getElementById(`step${i}`);
        step.style.display = i === stepNumber ? 'block' : 'none';
    }

    if (stepNumber === 3) {
        displayTable();
    }
}
