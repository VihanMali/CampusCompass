from cs50 import SQL
import sys
import requests

db = SQL("sqlite:///testDatabase")

#query that we will be sending to overpass
clgName = input("Which college: ")
query = f"""
[out:json];
(
  node["name"="{clgName}"];
  way["name"="{clgName}"];
  relation["name"="{clgName}"];
);
out geom;
"""

headers = {
    "User-Agent": "CampusCompass/1.0"
}

#pass the query to overpass and store the return value in data
response = requests.post(
    "https://lz4.overpass-api.de/api/interpreter",
    data={"data": query},
    headers=headers
)

# Check if our request to the api was a success or not and print different status codes
print(response.status_code)
if response.status_code == 400:
    print("Please input a valid college name. Abbreviations, Common names won't work. Try putting the actual College Name" \
    "e.g - IIT Delhi ✘" \
    "      Indian Institute Of Technology Delhi ✔")
elif response.status_code == 503:
    print("Server is currently busy")
elif response.status_code != 200:
    print("Some weird status code IDK about")
else:
    data = response.json()
    inserted = False
    if db.execute("SELECT * FROM mapData Where clgName = ?", clgName):
        inserted = True

    #check whether the data returned has a way with geometry or a relation inside of which is a 
    # way that has a geometry (only these 2 contain the actual boundary of the coords of the college)
    elements = data["elements"]

    has_boundary = any(
        (el["type"] == "way" and "geometry" in el) or
        (el["type"] == "relation" and any(
            m["type"] == "way" and "geometry" in m for m in el.get("members", [])
        ))
        for el in elements
    )

    if not has_boundary:
        print(f"No boundary data found for {clgName} — only point data (or nothing) is available in OSM.")
    else:

        #insert the college if not already in the database

        if not inserted:
            for element in data["elements"]:
                if element["type"] == "node":
                    lat_lon = str(element["lat"]) + " " + str(element["lon"])
                    if inserted:
                        db.execute("UPDATE mapData SET edgeCoords = edgeCoords || ? WHERE clgName = ?", ";" + lat_lon, clgName)
                    else:
                        db.execute("INSERT INTO mapData (clgName, edgeCoords) VALUES (?, ?)", clgName, lat_lon)
                        inserted = True


                    print(element["lat"], element["lon"])
                elif element["type"] == "way":
                    if "geometry" in element:
                        for point in element["geometry"]:
                            lat_lon = str(point["lat"]) + " " + str(point["lon"])
                            if inserted:
                                db.execute("UPDATE mapData SET edgeCoords = edgeCoords || ? WHERE clgName = ?", ";" + lat_lon, clgName)
                            else:
                                db.execute("INSERT INTO mapData (clgName, edgeCoords) VALUES (?, ?)", clgName, lat_lon)
                                inserted = True
                elif element["type"] == "relation":
                    for member in element.get("members", []):
                        if member["type"] == "way" and "geometry" in member:
                            for point in member["geometry"]:
                                lat_lon = str(point["lat"]) + " " + str(point["lon"])
                                if inserted:
                                    db.execute("UPDATE mapData SET edgeCoords = edgeCoords || ? WHERE clgName = ?", ";" + lat_lon, clgName)
                                else:
                                    db.execute("INSERT INTO mapData (clgName, edgeCoords) VALUES (?, ?)", clgName, lat_lon)
                                    inserted = True
