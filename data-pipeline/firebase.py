import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("private-key.json")
firebase_admin.initialize_app(cred)

# Create a Firestore client
db = firestore.client()

# Define the program data you want to save
program_data = {
    "Program Name": "Sample Program",
    "Programme Overview": "This is a sample program overview.",
    "Duration": "2 years",
    "Intake": "June",
    "Campuses": "Campus A, Campus B",
    "Academic Progression": "Graduates may continue to...",
}

# Specify the Firestore collection and document to save the program data
collection_name = "programmes"  # Replace with the name of your collection
document_name = "sample_program"  # Replace with a unique document name

# Add the program data to Firestore
doc_ref = db.collection(collection_name).document(document_name)
doc_ref.set(program_data)

print("Program data saved to Firestore.")
