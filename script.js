document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-url');
    const scrapeButton = document.getElementById('scrape');
    const exportButton = document.getElementById('export');
    const restartButton = document.getElementById('restart');
    const urlInput = document.getElementById('url-input');
    const urlListSection = document.getElementById('url-list-section');
    const resultsSection = document.getElementById('results-section');

    let urlList = [];

    addButton.addEventListener('click', () => {
        // Split input by comma and add to the URL list
        let urls = urlInput.value.split(',');
        urls.forEach(url => {
            if (url.trim()) {
                urlList.push(url.trim());
                let div = document.createElement('div');
                div.textContent = url.trim();
                urlListSection.appendChild(div);
            }
        });
        urlInput.value = ''; // Clear the input box
    });

    scrapeButton.addEventListener('click', () => {
        // Disable the button to prevent multiple requests
        scrapeButton.disabled = true;
        scrapeButton.textContent = 'Scraping...';
        console.log('Sending JSON:', JSON.stringify({ urls: urlList }));
        // Make a POST request to the server-side endpoint with the URL list
        fetch('http://127.0.0.1:5000/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urls: urlList }),
        })
            .then(response => response.json())
            .then(data => {
                // Handle the data returned from the Python script
                displayResults(data);
            })
            .catch(error => {
                // Handle any errors
                console.error('Error:', error);
            })
            .finally(() => {
                // Re-enable the button after the request is completed
                scrapeButton.disabled = false;
                scrapeButton.textContent = 'Scrape!';
            });
    });

    exportButton.addEventListener('click', () => {
        // Implement the export to JSON functionality
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(urlList));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "scrape_results.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    restartButton.addEventListener('click', () => {
        // Clear the URL list and the results section
        urlList = [];
        urlListSection.innerHTML = '';
        resultsSection.innerHTML = '';
    });

    function displayResults(data) {
        // Clear previous results
        resultsSection.innerHTML = '';

        // Iterate over the data and create elements for each result
        data.forEach(result => {
            let resultDiv = document.createElement('div');
            resultDiv.classList.add('result');

            // Create a string that contains all the metadata in a formatted manner
            let metadataHtml = '';
            for (const [key, value] of Object.entries(result)) {
                metadataHtml += `<p><strong>${key}</strong>: ${value}</p>`;
            }

            resultDiv.innerHTML = metadataHtml;
            resultsSection.appendChild(resultDiv);
        });
    }
});
