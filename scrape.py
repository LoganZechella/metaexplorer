import requests
from bs4 import BeautifulSoup

def process_url(url):
    # Format the URL
    url = url.lower()
    if url.startswith("www."):
        url = "https://" + url
    elif not url.startswith("http"):
        url = "https://www." + url

    # Scrape the metadata
    metadata = {}
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find and store the title
        title = soup.find('title')
        if title:
            metadata['title'] = title.string

        # Find and store the meta tags
        metas = soup.find_all('meta')
        for meta in metas:
            if 'name' in meta.attrs and 'content' in meta.attrs:
                metadata[meta['name']] = meta['content']

    except requests.exceptions.RequestException as e:
        metadata['error'] = f"An error occurred while fetching the URL: {e}"
    print(metadata)
    return metadata

def run(url_list):
    # This function will be called by the Flask app
    results = []
    for url in url_list:
        metadata = process_url(url)
        results.append(metadata)
    return results
