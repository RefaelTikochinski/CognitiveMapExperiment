import json
import pandas as pd
import os

# File path to save the CSV file
file_path = './data/participant_data.csv'

# Read the JSON data (You would normally pass the data from the frontend here)
# For now, let's use a sample data
data = json.loads(os.environ['GITHUB_EVENT_PAYLOAD'])

# Get participant ID and coordinates from the payload
participant_id = data['client_payload']['participantId']
coordinates = data['client_payload']['iconPositions']

# Prepare the data for CSV (Convert the data to a DataFrame)
df = pd.DataFrame(coordinates)

# If the CSV file already exists, append to it
if os.path.exists(file_path):
    df.to_csv(file_path, mode='a', header=False, index=False)
else:
    df.to_csv(file_path, mode='w', header=True, index=False)

print(f"Data saved for participant {participant_id}")
