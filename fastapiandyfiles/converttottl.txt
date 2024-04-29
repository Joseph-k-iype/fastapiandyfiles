import csv
from rdflib import Graph, Literal, RDF, URIRef, Namespace

# Namespaces
APP = Namespace("http://example.org/app/")

# Create a new graph
g = Graph()

# Function to add triples to the graph
def add_triples(app_id, app_name, app_type, upstream_app):
    app_uri = APP[str(app_id)]
    g.add((app_uri, RDF.type, APP.Application if app_type == "Application" else APP.File))
    g.add((app_uri, APP.hasName, Literal(app_name)))
    g.add((app_uri, APP.hasType, Literal(app_type)))
    if upstream_app:
        upstream_uri = APP[str(upstream_app)]
        g.add((app_uri, APP.hasUpstreamApp, upstream_uri))

# Read the CSV and convert to TTL
csv_file = 'apps_and_files.csv'
with open(csv_file, 'r', newline='', encoding='utf-8') as file:
    reader = csv.DictReader(file)
    for row in reader:
        add_triples(row["App ID"], row["App Name"], row["App Type"], row["Upstream App"])

# Save the graph to a Turtle file
ttl_file = 'apps_and_files.ttl'
g.serialize(destination=ttl_file, format='turtle')

print(f"TTL file '{ttl_file}' generated from '{csv_file}'.")
