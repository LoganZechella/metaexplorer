import requests
from bs4 import BeautifulSoup
import json

def process_url(url):
    # Format the URL
    url = url.lower()
    if url.startswith("www."):
        url = "https://" + url
    else:
        url = "https://www." + url.split("https://")[1]

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
        print(f"An error occurred while fetching the URL: {e}")

    return metadata

def scrape_urls(url_list):
    results = []
    for url in url_list:
        results.append(process_url(url))
    return results

url_list = ['www.google.com', 'www.github.com', 'https://stackoverflow.com']
metadata_results = scrape_urls(url_list)

print(json.dumps(metadata_results, indent=4))