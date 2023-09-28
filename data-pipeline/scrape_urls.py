import requests
from bs4 import BeautifulSoup
import urllib.parse

base_url = "https://www.tarc.edu.my/focs/programmes/programmes/"
output_file = "course_urls.txt"

# Send a GET request to the website
response = requests.get(base_url)

# Check if the request was successful
if response.status_code == 200:
    html = response.text

    # Parse the HTML content
    soup = BeautifulSoup(html, 'html.parser')

    container = soup.find('div', {
        'id': 'tabs-3'
    })

    # Find all <a> tags and extract the 'href' attribute
    relative_urls = [a['href'] for a in container.find_all('a')]

    # Convert relative URLs to absolute URLs
    absolute_urls = [urllib.parse.urljoin(base_url, relative_url) for relative_url in relative_urls]

    # Print the absolute URLs
    with open(output_file, 'a') as file:
        for url in absolute_urls:
            print("Adding Url : " + url)
            file.write(url + '\n')
else:
    print("Failed to retrieve the webpage.")
