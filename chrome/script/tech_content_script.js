const tech_json_url = 'https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/refs/heads/main/data/tech_contents.json';

const tech_box_titles = {
    "system-design": "Today's System Design content",
    "low-level-design": "Today's Low Level Design content",
    "test-engineering": "Today's Test Engineering content",
    "behavioral": "Today's Leadership/Behavioral content"
};

const tech_box_colors = {
    "system-design": "#ffecb3",
    "low-level-design": "#c8e6c9",
    "test-engineering": "#bbdefb",
    "behavioral": "#f8bbd0"
};

function tech_getDailyIndex(keys) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const hash = today.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return hash % keys.length;
}

async function tech_fetchAndRender() {
    const res = await fetch(tech_json_url);
    const tech_data = await res.json();
    const container = document.getElementById("tech_content_container");

    Object.keys(tech_data).forEach(section => {
        const keys = Object.keys(tech_data[section]);
        const dailyIndex = tech_getDailyIndex(keys);
        const selectedKey = keys[dailyIndex];
        const url = tech_data[section][selectedKey];

        const box = document.createElement("div");
        box.className = "tech_box";
        box.style.backgroundColor = tech_box_colors[section];

        box.innerHTML = `
        <div style="text-align: left;"><h2>${tech_box_titles[section]}</h2></div>
        <div><a href="${url}" class="tech_content_link" target="_blank">${selectedKey}</a></div>
        <div><button class="tech_show_list" data-section="${section}">See complete list</button></div>
        `;

        container.appendChild(box);
    });

    window.tech_content_data = tech_data;

    document.querySelectorAll('.tech_show_list').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            tech_showList(section);
        });
    });
}

function tech_showList(section) {
    const modal = document.getElementById("tech_popup_modal");
    const modalBody = document.getElementById("tech_modal_body");
    const list = window.tech_content_data[section];

    // Build two-column numbered table
    const entries = Object.entries(list);
    const half = Math.ceil(entries.length / 2);
    const leftCol = entries.slice(0, half);
    const rightCol = entries.slice(half);

    let tableHtml = `<div class="tech_section_title">All ${section.replace(/-/g, ' ')} contents</div>`;
    tableHtml += `<table class="tech_list_table"><tbody>`;

    for (let i = 0; i < half; i++) {
    tableHtml += `<tr>`;
    const [key1, link1] = leftCol[i] || ["", ""];
    const [key2, link2] = rightCol[i] || ["", ""];
    tableHtml += `<td>${i + 1}. <a href="${link1}" target="_blank">${key1}</a></td>`;
    if (key2) {
        tableHtml += `<td>${i + 1 + half}. <a href="${link2}" target="_blank">${key2}</a></td>`;
    } else {
        tableHtml += `<td></td>`;
    }
        tableHtml += `</tr>`;
    }

    tableHtml += `</tbody></table>`;
    modalBody.innerHTML = tableHtml;
    modal.style.display = "block";
}

function tech_closeModal() {
    document.getElementById("tech_popup_modal").style.display = "none";
}

document.getElementById("tech_close_btn").addEventListener("click", tech_closeModal);

window.addEventListener("click", function(event) {
    const modal = document.getElementById("tech_popup_modal");
    if (event.target === modal) {
    tech_closeModal();
    }
});

tech_fetchAndRender();