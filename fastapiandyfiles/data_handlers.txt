from SPARQLWrapper import SPARQLWrapper, JSON

def search_dbpedia(topic: str):
    sparql = SPARQLWrapper("http://dbpedia.org/sparql")
    sparql.setQuery(f"""
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX dbo: <http://dbpedia.org/ontology/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT DISTINCT ?person ?personName ?paper ?paperTitle WHERE {{
        ?paper dct:subject ?topic.
        ?topic rdfs:label ?topicLabel.
        ?paper dct:title ?paperTitle.
        ?person dbo:author ?paper.
        ?person rdfs:label ?personName.
        FILTER(CONTAINS(LCASE(?topicLabel), "{topic.lower()}")).
        FILTER(LANG(?topicLabel) = 'en').
        FILTER(LANG(?personName) = 'en').
    }}
    LIMIT 100
    """)
    sparql.setReturnFormat(JSON)
    results = sparql.query().convert()
    return process_results(results)

def process_results(results):
    nodes = []
    edges = []
    groups = {"Authors": set(), "Papers": set()}
    
    for result in results["results"]["bindings"]:
        person_id = result["person"]["value"].split('/')[-1]  # Extract ID
        person_name = result["personName"]["value"]
        paper_id = result["paper"]["value"].split('/')[-1]  # Extract ID
        paper_title = result["paperTitle"]["value"]
        
        # Nodes for authors
        if person_id not in groups["Authors"]:
            nodes.append({"id": person_id, "label": person_name, "type": "Author"})
            groups["Authors"].add(person_id)
        
        # Nodes for papers
        if paper_id not in groups["Papers"]:
            nodes.append({"id": paper_id, "label": paper_title, "type": "Paper"})
            groups["Papers"].add(paper_id)
        
        # Edge from author to paper
        edges.append({"from": person_id, "to": paper_id})
    
    # Convert set of IDs to list of group dictionaries
    group_data = [
        {"id": "Authors", "name": "Authors", "members": list(groups["Authors"])},
        {"id": "Papers", "name": "Papers", "members": list(groups["Papers"])}
    ]
    
    return {"nodes": nodes, "edges": edges, "groups": group_data}
