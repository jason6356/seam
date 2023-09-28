import requests
from bs4 import BeautifulSoup

base_url = "https://tarc.edu.my/admissions/faqs/"
output_file = "faq_output.txt"

# Send a GET request to the website
response = requests.get(base_url)

# Check if the request was successful
if response.status_code == 200:
    html = response.text

    # Parse the HTML content
    soup = BeautifulSoup(html, 'html.parser')

    faqs = soup.find_all('div', {'class': 'panel'})

    # Open the output file in write mode
    with open(output_file, 'w', encoding='utf-8') as file:
        for faq in faqs:
            question = faq.find('div', {'class': 'panel-title'}).find('a').text
            file.write(f"Question: {question}\n")

            # Find all <p> tags within the current FAQ element and join them into one string
            answer = "\n".join(p.text for p in faq.find_all('p'))
            file.write(f"Answer: {answer}\n\n")

    print(f"Questions and answers saved to {output_file}")

else:
    print("Failed to retrieve the webpage.")
