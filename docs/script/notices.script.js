document.addEventListener("DOMContentLoaded", function() {
    const jsonUrl = 'https://raw.githubusercontent.com/ssavi-ict/LeetCode-Which-Company/main/data/notices.json';

    // Function to fetch JSON data
    async function fetchJsonData(url) {
      try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    }

    // Function to populate the unordered list
    function populateUnorderedList(data) {
      const noticeListContainer = document.getElementById('noticeListContainer');

      const noticeTitle = document.createElement('h2');
      noticeTitle.id = 'noticeTitle';
      noticeTitle.textContent = 'Notice(s)';
      noticeListContainer.appendChild(noticeTitle);

      const unorderedList = document.createElement('ol');
      unorderedList.id = 'noticeList';

      if (Object.keys(data).length === 0) {
        const noNoticesMessage = document.createElement('p');
        noNoticesMessage.textContent = 'No Available Notices.';
        noticeListContainer.appendChild(noNoticesMessage);
      } else {
        for (const notice in data) {
          if (data.hasOwnProperty(notice)) {
            const listItem = document.createElement('li');
            listItem.textContent = `${data[notice]}`;
            unorderedList.appendChild(listItem);
          }
        }

        noticeListContainer.appendChild(unorderedList);
      }
    }

    // Fetch JSON data and populate the unordered list
    fetchJsonData(jsonUrl)
      .then(data => {
        if (data) {
          populateUnorderedList(data);
        }
      });
});