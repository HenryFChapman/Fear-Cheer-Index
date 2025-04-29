import requests
import json
import io

def hubspot_api_request(site_data_dict_str):
    # Convert dictionary to JSON string if it's not already a string
    if isinstance(site_data_dict_str, dict):
        site_data_dict_str = json.dumps(site_data_dict_str)

    # Convert JSON string to bytes
    json_bytes = site_data_dict_str.encode()

    # Create a binary file-like object from the JSON bytes
    file_like_object = io.BytesIO(json_bytes)

    # Replace these variables with your actual values
    api_key = open("hubspot_key.txt", "r").read()
    file_id = '188965475354'
    filename = 'data.json'  # The name the file should have on HubSpot

    file_options = {
        'access': 'PUBLIC_INDEXABLE',
        'ttl': 'P3M'
    }

    files_data = {
        'file': (filename, file_like_object.read(), 'application/octet-stream'),
        'options': (None, json.dumps(file_options), 'text/strings')
    }

    # Endpoint URL for updating files

    url = f'https://api.hubapi.com/filemanager/api/v3/files/{file_id}/replace'

    # Prepare headers and parameters
    headers = {
        'Authorization': f'Bearer {api_key}'
    }

    # print(files_data)

    # Make the request to update the file
    response = requests.post(url, headers = headers, files=files_data)

    # Check the response
    if response.status_code == 200:
        print("File successfully replaced.")
    else:
        print(f"Failed to replace file. Status code: {response.status_code}, Response: {response.text}")
