document.addEventListener("DOMContentLoaded", async function () {
    try {
        const JSON_FILE_PATH = 'script/ext_data/sheets.json';
        // Load JSON data from file
        const response = await fetch(JSON_FILE_PATH);
        const jsonData = await response.json();
        const jsonSelector = document.getElementById("jsonSelector");
        const tableContainer = document.getElementById("tableContainer");
        const currentSheetButton = document.getElementById("currentSheetButton");
        const allSheetsButton = document.getElementById("allSheetsButton");
    
        // Load table based on selected JSON
        function loadTable(jsonKey) {
            const data = jsonData[jsonKey];
            if (!data) return;
    
            const table = document.createElement("table");
            table.classList.add("custom-table");
    
            const thead = document.createElement("thead");
            const tbody = document.createElement("tbody");
    
            // Create table header
            const headerRow = document.createElement("tr");
            headerRow.innerHTML = `<th class="custom-th custom-checkbox">Status</th><th class="custom-th">Problem Link</th>`;
            thead.appendChild(headerRow);
    
            // Create table rows
            for (const key in data) {
                const value = data[key];
    
                const row = document.createElement("tr");
                const checkboxCell = document.createElement("td"); checkboxCell.setAttribute("class", "custom-td custom-checkbox");
                const valueCell = document.createElement("td"); valueCell.setAttribute("class", "custom-td");
    
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = key;
                checkbox.checked = localStorage.getItem(key) === "true"; // Check local storage for saved status
    
                checkbox.addEventListener("change", function () {
                    // localStorage.setItem(key, checkbox.checked); // Save status to local storage
                    handleCheckboxChange(key, checkbox.checked);
                    progressBarCaller(JSON_FILE_PATH);
                });
    
                checkboxCell.appendChild(checkbox);
                valueCell.innerHTML = `<a href="${key}" target="_blank" class="custom-link">${value}</a>`;
    
                row.appendChild(checkboxCell);
                row.appendChild(valueCell);
    
                tbody.appendChild(row);
            }
    
            table.appendChild(thead);
            table.appendChild(tbody);
    
            // Replace existing table or append new one
            tableContainer.innerHTML = "";
            tableContainer.appendChild(table);
        }

        // Load table on initial page load
        loadTable(jsonSelector.value);
        progressBarCaller(JSON_FILE_PATH);

        // Add event listener for JSON selection change
        jsonSelector.addEventListener("change", function () {
            loadTable(jsonSelector.value);
            progressBarCaller(JSON_FILE_PATH);
        });

        // Add event listener for Current Sheet button click
        currentSheetButton.addEventListener("click", function () {
            resetProgress(jsonSelector.value);
            progressBarCaller(JSON_FILE_PATH);
        });

        // Add event listener for All Sheets button click
        allSheetsButton.addEventListener("click", function () {
            // Reset progress for all sheets
            for (const key in jsonData) {
                resetProgress(key);
                progressBarCaller(JSON_FILE_PATH);
            }
        });

        function handleCheckboxChange(k, isChecked) {
            if (isChecked) {
              // Save to local storage
              localStorage.setItem(`${k}`, 'true');
            } else {
              // Remove from local storage
              localStorage.removeItem(`${k}`);
            }
        }

        // Function to reset progress for a specific sheet
        function resetProgress(sheetKey) {
            const data = jsonData[sheetKey];
            if (data) {
                for (const key in data) {
                    localStorage.removeItem(key); // Remove stored status
                    const checkbox = document.getElementById(key);
                    if (checkbox) {
                        checkbox.checked = false; // Uncheck checkboxes
                    }
                }
            }
        }

        function progressBarCaller(jsonFile){
            fetch(jsonFile)
            .then(response => response.json())
            .then(data => {
                // Call the function to update counts based on JSON data and local storage
                const categories = ["blind75", "striver", "neetcode"];
                var percentageSum = 0;
                categories.forEach(category => {
                    percentageSum += updateCounts(category, data[category]);
                });
                const redinessText = document.getElementById("readyStatus");
                redinessText.innerHTML = 'Overall Completion: <h1 style="display: inline-block;">' + Math.round(percentageSum/categories.length) + "%</h3>. Fingers Crossed.";
            })
            .catch(error => console.error('Error fetching JSON:', error));
        }

        function updateCounts(sheetName, sheetData) {
            const totalEntries = Object.keys(sheetData).length;
            let setAsTrueEntries = 0;
        
            // Check if each key in sheetData exists in local storage and is set to true
            Object.keys(sheetData).forEach(url => {
              if (localStorage.getItem(url)) {
                setAsTrueEntries++;
              }
            });
            // Calculate the percentage
            const percentage = (setAsTrueEntries / totalEntries) * 100;
        
            // Update the counts and progress bars
            let sdeSheetName = sheetName.toProperCase() + " SDE Sheet";
            const countElement = document.getElementById(`${sheetName}Count`);
            const progressBar = document.getElementById(`${sheetName}ProgressBar`);
        
            countElement.innerText = `${sdeSheetName} (${setAsTrueEntries}/${totalEntries}) - [ ${percentage.toFixed(2)}% ]`;
            progressBar.style.width = percentage + '%';
            return percentage;
          }

          String.prototype.toProperCase = function () {
            return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
          };
    }
    catch (error) {
        console.error('Error loading JSON:', error);
    }
});