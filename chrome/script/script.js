fetch('https://raw.githubusercontent.com/ssavi-ict/LC-Which-Company/main/data/company_info.json')
                    .then(response => response.json())
                    .then(data => {
                        let table = document.getElementById('dtBasicExample');
                        let tableContent = '';
                        tableContent +=  '<thead><tr><th class="th-sm"><center>Problem Name</center></th>';
                        tableContent +=  '<th class="th-sm"><center>Companies Asked</center></th>';
                        tableContent +=  '<th class="th-sm"><center>Tutorial<center></th></tr></thead>';
                        tableContent +=  '<tbody>';
                        
                        // Parse the Data. And add them into the Table.
                        for (let key in data){
                            let plink = key, pname = data[key][0];
                            tableContent += "<tr>";
                            tableContent += "<td><a href = '" + plink + "' target='_blank'>" + pname +"</a></td>";
                            tableContent += "<td style='background-image: linear-gradient(45deg, red, orange, green, blue, indigo, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'>";
                            for(let i=1; i<data[key].length; i++){
                                if(i > 1){
                                    tableContent += ', ';
                                }
                                tableContent += data[key][i];
                            }
                            tableContent += "</td>";
                            tableContent += "<td></td>";
                            tableContent += "</tr>";
                        }

                        tableContent += '</tbody>';
                        table.innerHTML = tableContent;
                        $('#dtBasicExample').DataTable();
                    });