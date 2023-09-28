import requests
from bs4 import BeautifulSoup
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate('private-key.json')
firebase_admin.initialize_app(cred)

# Create a Firestore client
db = firestore.client()

def request_and_scrape(url, form_data):
    # Send a POST request with form data
    response = requests.post(url, data=form_data)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the HTML content of the page using BeautifulSoup
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')

        # Find the table element that contains staff members
        table = soup.find('table')

        # Initialize an empty list to store staff member data
        staff_data_list = []
        current_department = None

        # Iterate through each <tr> (table row) in the table
        for row in table.find_all('tr'):
            # Check if the <tr> contains a divider
            if row.find('hr'):
                continue  # Skip this row (divider)
            
            # Check if the <tr> contains a department header
            department_header = row.find('h6', class_='orange')
            if department_header:
                current_department = department_header.text.strip()
                continue  # Skip this row (department header)

            # Check if the <tr> contains faculty information
            current_faculty = "FOCS"
            # Extract information from each <tr>
            staff_data = {}
            
            # Extract data within <td> elements in the current <tr>
            td_elements = row.find_all('td')
            
            staff_data['Image'] = td_elements[1].find('img')['src']
            print(staff_data['Image'])
            staff_data["Name"] = td_elements[3].find('strong').text.strip()
            staff_data["Position"] = td_elements[3].find('strong', class_='blue').text.strip()
            staff_data["Role"] = td_elements[3].find_all('strong')[2].text.strip()
            staff_data["Email"] = td_elements[3].find_all('small')[-3].text.strip()

            test_el = td_elements[3].find('b', text='Major of Study/Specialization:')
            if test_el:
                staff_data["Major of Study/Specialization"] = td_elements[3].find('i', class_='fa-envelope').find_next('small').text.strip()
            else:
                staff_data["Major of Study/Specialization"] = "None"

            test_el = td_elements[3].find('b', text='Major of Study/Specialization:')
            if test_el:
                staff_data["Area of Interest"] = td_elements[3].find('b', text='Major of Study/Specialization:').find_next('small').text.strip()
            else:
                staff_data["Area of Interest"] = "None"


            # Add department and faculty information to staff attributes if available
            if current_department:
                staff_data["Department"] = current_department
            if current_faculty:
                staff_data["Faculty"] = current_faculty

            # Append the staff member's data to the list
            staff_data_list.append(staff_data)

        with open("staff_data.txt", "w") as file:
        # Print or process the extracted staff data as needed
            for staff_data in staff_data_list:
                        # Create a new document reference with an auto-generated ID
                # Create a new document reference with an auto-generated ID
                doc_ref = db.collection('staff_members').document()

                # Set the data in the Firestore document
                doc_ref.set({
                    'Name': staff_data["Name"],
                    'Img' : staff_data["Image"],
                    'Position': staff_data["Position"],
                    'Role': staff_data["Role"],
                    'Email': staff_data["Email"],
                    'Major of Study/Specialization': staff_data["Major of Study/Specialization"],
                    'Area of Interest': staff_data["Area of Interest"],
                    'Department': staff_data.get("Department"),
                    'Faculty': staff_data.get("Faculty")
                })

                print(f"Data for {staff_data['Name']} saved to Firestore")
                print("Name:", staff_data["Name"])
                print("Position:", staff_data["Position"])
                print("Role:", staff_data["Role"])
                print("Email:", staff_data["Email"])
                print("Major of Study/Specialization:", staff_data["Major of Study/Specialization"])
                print("Area of Interest:", staff_data["Area of Interest"])
                print("Department:", staff_data.get("Department"))
                print("Faculty:", staff_data.get("Faculty"))
                print()

    else:
        print(f"Failed to retrieve data from URL: {url}")


# URL of the web page to make the POST request to
url = "https://www.tarc.edu.my/staffDirectory.jsp?cat_id=FDAA0D41-8967-4EAD-BE89-9BE26F147C47&fmenuid=5B689C00-D205-4D5C-A521-A77CB5420C2A"
divisions = ['DCSE', 'DICT', 'DISS', 'DMDS', 'DSET', 'FOCS']

for division in divisions:
    # Form data to be sent in the POST request
    form_data = {
        "fbrncd": "KL",
        "fdept": "FOCS",
        "fdivcd": division,
        "fstaff": "",
    }

    request_and_scrape(url, form_data)