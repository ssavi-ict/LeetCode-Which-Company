import json
import os

# Define the paths
data_directory = os.path.join('..', 'data')  # Path to the data directory from the script directory
input_file_path = os.path.join(data_directory, 'company_info.json')
output_file_path = os.path.join(data_directory, 'company_names.json')

# Load the company information from company_info.json
with open(input_file_path, 'r') as file:
    data = json.load(file)

# Set to store unique company names
company_set = set()

# Parse the company names from each entry
for link, details in data.items():
    # Skip the first element (problem name) and add the rest (companies) to the set
    companies = details[1:]
    company_set.update(companies)

# Convert the set to a sorted list for consistency
company_list = sorted(company_set)

# Create the output JSON structure
output_data = {"company": company_list}

# Write the result to company_names.json
with open(output_file_path, 'w') as output_file:
    json.dump(output_data, output_file, indent=4)

print("Company names have been successfully extracted to company_names.json in the data directory.")
