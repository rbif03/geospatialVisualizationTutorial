from flask import Flask, render_template, jsonify, redirect, url_for, request
import json

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/geojson/<option>")
def get_geojson(option):
    if option in ["density", "population"]:
        file_path = f"static/{option}.geojson"
        with open(file_path, "r") as file:
            geojson = json.load(file) # dict

        return jsonify(geojson)
    else:
        return jsonify({})

app.run(debug=True)