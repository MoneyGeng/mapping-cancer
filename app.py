from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("about.html", pages={
        "analysis": "",
        "visualization": "",
        "about": "active"
    })


@app.route("/analysis/")
def analysis():
    return render_template("analysis.html", pages={
        "analysis": "active",
        "visualization": "",
        "about": ""
    })


@app.route("/visualization/")
def visualization():
    return render_template("visualization.html", pages={
        "summary": "",
        "visualization": "active",
        "about": ""
    })


@app.route("/about/")
def about():
    return render_template("about.html", pages={
        "analysis": "",
        "visualization": "",
        "about": "active"
    })

# TODO: create a sqlite database


@app.route("/api/geodata.json")
def geodata():
    with open('Resources/provincial_data.json', 'r') as f:
        data = json.load(f)
        return jsonify(data)

# TODO: create a sqlite database


@app.route("/api/georef.json")
def georef():
    with open('Resources/georef-canada-province@public.geojson', 'r') as f:
        data = json.load(f)
        return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)
