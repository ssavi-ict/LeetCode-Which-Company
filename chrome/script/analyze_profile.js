// content.js

// This function fetches the JSON content from the API URL

function fillSummaryTable(total_problems, total_tried, total_solved, total_failed, acceptance_ratio, locator_param){
    const userSummaryTable = document.getElementById('user-summary-table');

    if (locator_param !== 0){
        userSummaryTable.innerHTML = "";
        const heading_row = document.createElement('tr');
        const heading_th = document.createElement('th');
        heading_th.setAttribute("id", "ptable-td");
        heading_th.textContent = "User Summary";
        heading_th.colSpan = 2;
        heading_row.appendChild(heading_th);
        heading_th.style.backgroundColor = "#2196F3";
        heading_th.style.textAlign = 'center';
        userSummaryTable.appendChild(heading_row);
    }

    const row_total_problems = document.createElement('tr');
    const td_total_problems = document.createElement('td'); const td_total_problems_title = document.createElement('td');
    td_total_problems.textContent = total_problems.toString(); td_total_problems_title.textContent = 'Total Problems';
    row_total_problems.appendChild(td_total_problems_title); row_total_problems.appendChild(td_total_problems); userSummaryTable.appendChild(row_total_problems);

    const row_total_tried = document.createElement('tr');
    const td_total_tried = document.createElement('td'); const td_total_tried_title = document.createElement('td');
    td_total_tried.textContent = total_tried.toString(); td_total_tried_title.textContent = 'Total Tried';
    row_total_tried.appendChild(td_total_tried_title); row_total_tried.appendChild(td_total_tried); userSummaryTable.appendChild(row_total_tried);

    const row_total_solved = document.createElement('tr');
    const td_total_solved = document.createElement('td'); const td_total_solved_title = document.createElement('td');
    td_total_solved.textContent = total_solved.toString(); td_total_solved_title.textContent = 'Passed';
    row_total_solved.appendChild(td_total_solved_title); row_total_solved.appendChild(td_total_solved); userSummaryTable.appendChild(row_total_solved);

    const row_total_failed = document.createElement('tr');
    const td_total_failed = document.createElement('td'); const td_total_failed_title = document.createElement('td');
    td_total_failed.textContent = total_failed.toString(); td_total_failed_title.textContent = 'Failed';
    row_total_failed.appendChild(td_total_failed_title); row_total_failed.appendChild(td_total_failed); userSummaryTable.appendChild(row_total_failed);

    const row_ac_ratio = document.createElement('tr');
    const td_ac_ratio = document.createElement('td'); const td_ac_ratio_title = document.createElement('td');
    td_ac_ratio.textContent = parseFloat(acceptance_ratio.toString()).toFixed(2) + "%"; td_ac_ratio_title.textContent = 'Acceptance Ratio';
    row_ac_ratio.appendChild(td_ac_ratio_title); row_ac_ratio.appendChild(td_ac_ratio); userSummaryTable.appendChild(row_ac_ratio);
}
  
function fillNextToSolveTable(table_heading, current_table, p_title_list, p_url_list, cat_total, cat_solved, bg_color_code, locator_param){
    let already_shown = [];
    const suggestProblems = document.getElementById(current_table);
    
    if (locator_param !== 0){
        suggestProblems.innerHTML = "";
        const heading_row = document.createElement('tr');
        
        const heading_th = document.createElement('th');
        heading_th.setAttribute("id", "ptable-td");
        heading_th.textContent = table_heading + " (" + cat_solved + " / " + cat_total  + ")";
        heading_th.style.backgroundColor = bg_color_code;
        heading_th.style.textAlign = 'center';
        heading_th.style.width = '96%';
        heading_row.appendChild(heading_th);

        const heading_th_2 = document.createElement('th');
        heading_th_2.setAttribute("id", "ptable-td");
        heading_th_2.style.textAlign = 'center';
        heading_th_2.style.backgroundColor = bg_color_code;

        const button = document.createElement('button');
        button.innerHTML = "&#x27f3;";
        button.title = 'Reload Different Problems';
        button.style.cursor = "pointer";
        if (locator_param === 1){
            heading_th.setAttribute('id', 'easy_title_header_text');
            button.setAttribute('id', 'easy_button');
            button.onclick = function() {
                fetchLeetCodeData(1);
            };
        }
        else if (locator_param === 2){
            heading_th.setAttribute('id', 'mid_title_header_text');
            button.setAttribute('id', 'mid_button');
            button.onclick = function() {
                fetchLeetCodeData(2);
            };
        }
        else if (locator_param === 3){
            heading_th.setAttribute('id', 'hard_title_header_text');
            button.setAttribute('id', 'hard_button');
            button.onclick = function() {
                fetchLeetCodeData(3);
            };
        }

        heading_th_2.appendChild(button);
        heading_row.appendChild(heading_th_2);
        suggestProblems.appendChild(heading_row);
    }

    for(let i=0; i<3; i++){
        let random_index =  Math.floor(Math.random()*p_url_list.length);
        if(already_shown.indexOf(random_index) !== -1){
            continue;
        }
        else{
            let problem_title = p_title_list[random_index];
            let problem_url = p_url_list[random_index];
            already_shown.push(random_index);

            const cp_row = document.createElement('tr');
			const cp_data = document.createElement('td');
            cp_data.colSpan = 2;
            const p_text_link = document.createElement('a');

            p_text_link.href = problem_url;
            p_text_link.textContent = (i+1) + '. ' + problem_title;
            p_text_link.target = "_blank";
            cp_data.appendChild(p_text_link);
            cp_row.appendChild(cp_data);
            
            suggestProblems.appendChild(cp_row);
        }
    }
}

function fillExceptionTable(current_table, table_heading, bg_color_code, locator_param){
    const errorTable = document.getElementById(current_table);
    let customTexttoAdd = "user information";

    if(table_heading.length > 0){
        if (locator_param !== 0){
            errorTable.innerHTML = "";
            const heading_row = document.createElement('tr');
            const heading_th = document.createElement('th');
            heading_th.setAttribute("id", "ptable-td");
            heading_th.textContent = table_heading + " (0 / 0)";
            heading_th.style.backgroundColor = bg_color_code;
            heading_th.style.textAlign = 'center';
            heading_th.style.width = '96%';
            heading_row.appendChild(heading_th);

            const heading_th_2 = document.createElement('th');
            heading_th_2.setAttribute("id", "ptable-td");
            heading_th_2.style.textAlign = 'center';
            heading_th_2.style.backgroundColor = bg_color_code;

            const button = document.createElement('button');
            button.innerHTML = "&#x27f3;";
            button.title = 'Reload Different Problems';
            button.style.cursor = "pointer";
            if (locator_param === 1){
                heading_th.setAttribute('id', 'easy_title_header_text');
                button.setAttribute('id', 'easy_button');
                button.onclick = function() {
                    fetchLeetCodeData(1);
                };
            }
            else if (locator_param === 2){
                heading_th.setAttribute('id', 'mid_title_header_text');
                button.setAttribute('id', 'mid_button');
                button.onclick = function() {
                    fetchLeetCodeData(2);
                };
            }
            else if (locator_param === 3){
                heading_th.setAttribute('id', 'hard_title_header_text');
                button.setAttribute('id', 'hard_button');
                button.onclick = function() {
                    fetchLeetCodeData(3);
                };
            }

            heading_th_2.appendChild(button);
            heading_row.appendChild(heading_th_2);
            errorTable.appendChild(heading_row);
        }
        customTexttoAdd = "suggested " + table_heading + " problems";
    }
    
    const cp_row = document.createElement('tr');
    const cp_data = document.createElement('td');
    cp_data.textContent = "No data found! You must login to LeetCode to see " + customTexttoAdd;
    cp_row.appendChild(cp_data); 
    cp_data.colSpan = 2;
    errorTable.appendChild(cp_row);
}

function fillExceptionTableCaller(locator_param){
    const heading_line= document.getElementById("heading-line");
    heading_line.innerHTML = '<center>Login <a href="https://leetcode.com/" target="_blank">LeetCode</a> to see your DSA Solving Status</center>';
    
    if(locator_param == 0){
        fillExceptionTable("user-summary-table", "", "", locator_param);
    }

    if (locator_param === 1 || locator_param === 0){
        const easy_title_header_text = document.getElementById("easy_title_header_text");
        easy_title_header_text.innerHTML = "Easy (0 / 0)";
        fillExceptionTable("easy-table", "Easy", "#00AF9B", locator_param);
    }
    if(locator_param === 2 || locator_param === 0){
        const mid_title_header_text = document.getElementById("mid_title_header_text");
        mid_title_header_text.innerHTML = "Medium (0 / 0)";
        fillExceptionTable("mid-table", "Medium", "orange", locator_param);
    }
    if(locator_param === 3 || locator_param === 0){
        const hard_title_header_text = document.getElementById("hard_title_header_text");
        hard_title_header_text.innerHTML = "Hard (0 / 0)";
        fillExceptionTable("hard-table", "Hard", "red", locator_param);
    }
}

async function fetchLeetCodeData(locator_param) {
    try {
        const response = await fetch('https://leetcode.com/api/problems/algorithms/');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
  
        const jsonData = await response.json();
        const heading_line= document.getElementById("heading-line");
        const user_name = jsonData["user_name"];

        if(user_name.length == 0){
            fillExceptionTableCaller(locator_param);
            return;
        }

        const total_problems = jsonData["num_total"];
        const total_solved = jsonData["num_solved"];
        const total_easy_solved = jsonData["ac_easy"];
        const total_medium_solved = jsonData["ac_medium"];
        const total_hard_solved = jsonData["ac_hard"];
        const user_name_link = "https://leetcode.com/" + user_name;

        let total_failed = 0;
        let total_tried = 0;
        let non_ac_easy_url = []; let non_ac_easy_title = [];
        let non_ac_mid_url = []; let non_ac_mid_title = [];
        let non_ac_hard_url = []; let non_ac_hard_title = [];
        let total_easy_problems = 0;
        let total_mid_problems = 0;
        let total_hard_problems = 0;

        for(let i=0; i<jsonData["stat_status_pairs"].length; i++){
            let p_link = "https://leetcode.com/problems/" + jsonData["stat_status_pairs"][i].stat.question__title_slug;
            let p_title = jsonData["stat_status_pairs"][i].stat.question__title;

            if(jsonData["stat_status_pairs"][i].status === null){
                if(jsonData["stat_status_pairs"][i].paid_only === true) continue;
                if(jsonData["stat_status_pairs"][i].difficulty.level === 1){
                    non_ac_easy_url.push(p_link); non_ac_easy_title.push(p_title);
                    total_easy_problems++;
                }
                else if(jsonData["stat_status_pairs"][i].difficulty.level === 2){
                    non_ac_mid_url.push(p_link); non_ac_mid_title.push(p_title);
                    total_mid_problems++;
                }
                else if(jsonData["stat_status_pairs"][i].difficulty.level === 3){
                    non_ac_hard_url.push(p_link); non_ac_hard_title.push(p_title);
                    total_hard_problems++;
                }
            }
            else if(jsonData["stat_status_pairs"][i].status === "ac"){
                total_tried++;
                if(jsonData["stat_status_pairs"][i].difficulty.level === 1){
                    total_easy_problems++;
                }
                else if(jsonData["stat_status_pairs"][i].difficulty.level === 2){
                    total_mid_problems++;
                }
                else if(jsonData["stat_status_pairs"][i].difficulty.level === 3){
                    total_hard_problems++;
                }
            }
            else if(jsonData["stat_status_pairs"][i].status === "notac"){
                total_failed++; total_tried++;
                if(jsonData["stat_status_pairs"][i].paid_only === true) continue;
                if(jsonData["stat_status_pairs"][i].difficulty.level === 1){
                    non_ac_easy_url.push(p_link); non_ac_easy_title.push(p_title);
                    total_easy_problems++;
                }
                else if(jsonData["stat_status_pairs"][i].difficulty.level === 2){
                    non_ac_mid_url.push(p_link); non_ac_mid_title.push(p_title);
                    total_mid_problems++;
                }
                else if(jsonData["stat_status_pairs"][i].difficulty.level === 3){
                    non_ac_hard_url.push(p_link); non_ac_hard_title.push(p_title);
                    total_hard_problems++;
                }
            }
        }

        const acceptance_ratio = (total_solved / total_tried) * 100;

        // Linking With HTML Starts here ....
        
        heading_line.innerHTML = '<center><a href="' + user_name_link + '" target="_blank">' + user_name + '</a>' +"'s DSA Solving Status</center>";
        fillSummaryTable(total_problems, total_tried, total_solved, total_failed, acceptance_ratio, locator_param);

        if(locator_param === 0 || locator_param === 1){
            easy_title_header_text.innerHTML = "Easy (" + total_easy_solved + " / " + total_easy_problems + ")";
            fillNextToSolveTable("Easy", "easy-table", non_ac_easy_title, non_ac_easy_url, total_easy_problems, total_easy_solved, '#00AF9B', locator_param);
        }

        if(locator_param === 0 || locator_param === 2){
            mid_title_header_text.innerHTML = "Medium (" + total_medium_solved + " / " + total_mid_problems + ")";
            fillNextToSolveTable("Medium", "mid-table", non_ac_mid_title, non_ac_mid_url, total_mid_problems, total_medium_solved, 'orange', locator_param);
        }

        if(locator_param === 0 || locator_param === 3){
            hard_title_header_text.innerHTML = "Hard (" + total_hard_solved + " / " + total_hard_problems + ")";
            fillNextToSolveTable("Hard", "hard-table", non_ac_hard_title, non_ac_hard_url, total_hard_problems, total_hard_solved, 'red', locator_param);
        }
        makePieChart(total_easy_solved, total_medium_solved, total_hard_solved);
        
    } catch (error) {
      console.error('Error fetching data:', error);
      fillExceptionTableCaller(locator_param);
      return null;
    }
  }

  function makePieChart(easy, medium, hard){
    // Pie chart data
    const data = {
      labels: ['Easy', 'Medium', 'Hard'],
      datasets: [{
        data: [easy, medium, hard],
        backgroundColor: ['#00AF9B', 'orange', 'red'],
      }],
    };

    // Get canvas element
    const canvas = document.getElementById('pieChart');
    const textContent = document.getElementById('pTitle');
    textContent.innerHTML = "Solving Status";

    new Chart(canvas, {
        type: 'pie',
        data: data,
        options: {
          legend: {
            display: false // Disable the legend
          },
          plugins: {
            datalabels: {
              color: 'white', // Color of data labels
              formatter: (value, context) => {
                return `${context.chart.data.labels[context.dataIndex]}: ${value}`;
              }
            }
          }
        }
      });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    if (window.location.href.includes('leetcoder.html')) {
        // Example usage: Fetch data and use it
        fetchLeetCodeData(0);
        
        const easy_button = document.getElementById("easy_button");
        const mid_button = document.getElementById("mid_button");
        const hard_button = document.getElementById("hard_button");

        // Add onclick event handlers for each button
        if(!easy_button && !mid_button && !hard_button) return;
        easy_button.onclick = function() {
            fetchLeetCodeData(1);
        };

        mid_button.onclick = function() {
            fetchLeetCodeData(2);
        };

        hard_button.onclick = function() {
            fetchLeetCodeData(3);
        };
    }
});

