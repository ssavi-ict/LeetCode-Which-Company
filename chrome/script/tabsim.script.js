document.addEventListener("DOMContentLoaded", () => {
    loadCompanyNames();
    bindTabEvents();
});

let companyInfo = {}; // To store parsed company_info.json
let selectedRow = null; // To track the currently selected row

function bindTabEvents() {
    const companyTab = document.getElementById('companyQuestionsTab');
    const interviewTab = document.getElementById('interviewQuestionsTab');

    companyTab.addEventListener('click', () => openTab('companyQuestions', 'Filtered by Company', companyTab));
    interviewTab.addEventListener('click', () => openTab('companyTable', 'Filtered by Problems', interviewTab));
}

async function openTab(tabName, headerText, tabElement) {
    document.getElementById('companyInfoHeaderText').innerText = headerText;

    const contents = document.getElementsByClassName('tab-content');
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove('active');
    }

    const buttons = document.getElementsByClassName('tab-buttons')[0].children;
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }

    document.getElementById(tabName).classList.add('active');
    tabElement.classList.add('active');
}


async function loadCompanyNames() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/main/data/company_names.json');
        const data = await response.json();
        const companyNames = data.company;

        // Clear existing rows in companyNameTable
        const tbody = document.getElementById('companyNameTable').querySelector('tbody');
        tbody.innerHTML = '';

        let selectedRow = null; // Track the currently selected row

        // Populate company names into the table
        companyNames.forEach(name => {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.textContent = name;
            row.appendChild(cell);
            tbody.appendChild(row);

            // Make each row clickable
            row.addEventListener('click', () => {

                // Remove highlight from previously selected row
                if (selectedRow) {
                    selectedRow.classList.remove('selected-row');
                }
                
                // Highlight the clicked row and update selectedRow reference
                row.classList.add('selected-row');
                selectedRow = row;

                console.log(`Company selected: ${name}`);
                document.getElementById('selectedCompanyHeaderText').innerHTML = "Problem(s) asked in : <b>" + name + "</b>";
                loadProblemQuestionsByCompany(name); // Call function to filter questions
            });
        });
    } catch (error) {
        console.error('Error loading company names:', error);
    }

    // Load company_info.json after company names are loaded
    await loadCompanyInfo();
}

async function loadCompanyInfo() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/ssavi-ict/LC-Which-Company/main/data/company_info.json');
        companyInfo = await response.json(); // Store the parsed JSON
    } catch (error) {
        console.error('Error loading company info:', error);
    }
}

function loadProblemQuestionsByCompany(company) {
    const questionsTable = document.getElementById('questionsByCompanyTable');
    questionsTable.innerHTML = ''; // Clear previous results

    // Loop through each problem URL and check if the company is part of the list
    
    var rowSep = 0;
    var row = document.createElement('tr');
    var nameCell = document.createElement('td');
    var nameLink = document.createElement('a');

    for (let url in companyInfo) {
        const companyList = companyInfo[url];
        if (companyList.includes(company)) {
            const problemName = companyList[0]; // The first element is the problem name
            
            // Create and populate the table cells
            nameLink.href = url;
            nameLink.target = "_blank";
            nameLink.style.textDecoration = "none";
            nameLink.textContent = problemName;
            nameCell.appendChild(nameLink);
            row.appendChild(nameCell);
            
            nameCell = document.createElement('td');
            nameLink = document.createElement('a');
            console.log(problemName);
            rowSep += 1;

            if(rowSep%2 == 0){
                questionsTable.appendChild(row); // Append the row to the table
                row = document.createElement('tr');
            }
        }
    }
    if(rowSep%2 == 1){
        questionsTable.appendChild(row); // Append the row to the table
    }
}