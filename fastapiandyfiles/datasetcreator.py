import csv
import random

# Data for generation
base_app_names = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta", "Theta", "Iota", "Kappa"]
file_types = ["Excel", "TXT", "MP3", "JPG", "PDF", "DOCX", "PNG", "GIF", "MP4", "CSV"]

# Helper functions
def generate_unique_names(base_names, count):
    return [f"{name}_{i+1}" for name in base_names for i in range(count // len(base_names) + 1)][:count]

def choose_upstream(app_ids, current_id):
    possible_upstreams = [id for id in app_ids if id != current_id]
    return random.choice(possible_upstreams) if possible_upstreams else None

# Generate data
total_apps = 100
app_ids = list(range(1000, 1000 + total_apps))
app_names = generate_unique_names(base_app_names, total_apps)  # Ensure unique names

data = []
for app_id, app_name in zip(app_ids, app_names):
    if random.random() < 0.7:  # 70% chance to be an application
        app_type = "Application"
    else:
        app_type = random.choice(file_types)
        app_name = f"File_{app_type}_{app_id}"  # Unique name for files

    entry = {
        "App ID": app_id,
        "App Name": app_name,
        "App Type": app_type,
        "Upstream App": choose_upstream(app_ids, app_id)
    }
    data.append(entry)

# Write to CSV
csv_file = 'apps_and_files.csv'
with open(csv_file, 'w', newline='', encoding='utf-8') as file:
    writer = csv.DictWriter(file, fieldnames=["App ID", "App Name", "App Type", "Upstream App"])
    writer.writeheader()
    writer.writerows(data)

print(f"CSV file '{csv_file}' generated with {len(data)} unique entries.")
