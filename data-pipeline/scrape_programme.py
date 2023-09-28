import requests
from bs4 import BeautifulSoup
import urllib.parse
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("private-key.json")
firebase_admin.initialize_app(cred)

# Create a Firestore client
db = firestore.client()

# Define the output file for results
output_file = "scraped_attributes.txt"

# Read the URLs from the text file
with open("scraped_urls.txt", "r") as file:
    urls = [line.strip() for line in file]

# Initialize an empty list to store the results
results = []

# Iterate through the URLs and scrape the attributes
for url in urls:
    response = requests.get(url)

    if response.status_code == 200:
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')

        # Find the program name based on the available HTML structure
        program_name = soup.find('h4', {'class' : 'shell'}).text.strip()  # Replace with the actual class or element

        # Find all <h5> elements
        h5_elements = soup.find_all('h5')

        imgs = soup.find_all('img')

        outline = soup.find('div', {'id' : 'tabs-3'}).children


        outline_str = ""

        for o in outline:
            outline_str += str(o)
        
        print(outline_str)

        #print(imgs[4])
        # Create a dictionary to store the attributes for this URL
        attributes = {"URL": url, "Program Name": program_name}

        # Initialize lists to store Intake and Campuses values
        intake_values = []
        campus_values = []

        # Iterate through the <h5> elements and extract the corresponding values
        for h5 in h5_elements:
            text = h5.text.strip()
            if text == "Programme Overview:":
                attributes["Programme Overview"] = h5.find_next('p').text.strip()
            elif text == "Duration:":
                attributes["Duration"] = h5.find_next('p').text.strip()
            elif text == "Intake:":
                intake_elements = h5.find_next('ul').find_all('li')
                intake_values = [item.text.strip() for item in intake_elements]
            elif text == "Campuses:":
                campus_elements = h5.find_next('ul').find_all('li')
                campus_values = [item.text.strip() for item in campus_elements]
            elif text == "Academic Progression:":
                attributes["Academic Progression"] = h5.find_next('p').text.strip()

        # Combine Intake and Campuses values with a comma separator
        attributes["Intake"] = ", ".join(intake_values)
        attributes["Campuses"] = ", ".join(campus_values)
        attributes["entry_requirements"] = imgs[4]['src']
        attributes["outline"] = outline_str

        # Append the attributes to the results list
        results.append(attributes)
          # Add the program data to Firestore
        program_ref = db.collection("programmes").add(attributes)
    else:
        print(f"Failed to retrieve data for URL: {url}")

# Save the results to the output file
with open(output_file, "w") as file:
    for result in results:

        doc_ref = db.collection('programmes').document()

        doc_ref.set({
            'URL': result["URL"],
            'Program Name': result.get("Program Name", ""),
            'Programme Overview': result.get("Programme Overview", ""),
            'Duration': result.get("Duration", ""),
            'Intake': result.get("Intake", ""),
            'Campuses': result.get("Campuses", ""),
            'Academic Progression': result.get("Academic Progression", ""),
            'entry_requirements': result.get("entry_requirements", ""),
            'outline': result.get("outline", "")
        })

        file.write("URL: " + result["URL"] + "\n")
        file.write("Program Name: " + result.get("Program Name", "") + "\n")
        file.write("Programme Overview: " + result.get("Programme Overview", "") + "\n")
        file.write("Duration: " + result.get("Duration", "") + "\n")
        file.write("Intake: " + result.get("Intake", "") + "\n")
        file.write("Campuses: " + result.get("Campuses", "") + "\n")
        file.write("Academic Progression: " + result.get("Academic Progression", "") + "\n")
        file.write("entry_requirements: " + result.get("entry_requirements", "") + "\n")
        file.write("outline: " + result.get("outline", "") + "\n")


print(f"Scraped attributes saved to {output_file}")




