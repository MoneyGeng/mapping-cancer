from flask import Flask, render_template
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objs as go
from plotly.subplots import make_subplots
import sqlite3


conn = sqlite3.connect("Resources/cancer.sqlite")
provincial_data = pd.read_sql("SELECT * FROM provincial_data", conn)

provincial_data = provincial_data.iloc[2:]
header = provincial_data.iloc[0]
provincial_data = provincial_data[1:]
provincial_data.columns = header

for i in range(2, len(provincial_data.columns)):
    provincial_data.iloc[:, i] = pd.to_numeric(provincial_data.iloc[:, i], errors='coerce')


def create_visualizations(df):
    # Creating unique visualizations using Plotly
    fig1 = px.bar(df, x='Cancer_type', y='Both sexes 2 years', title='Cancer Type vs Both sexes 2 years')
    fig2 = px.pie(df, values='Total 5 years', names='Cancer_type', title='Total 5 years per Cancer Type')
    fig3 = px.scatter(df, x='Cancer_type', y='Males 25 years', title='Cancer Type vs Males 25 years')

    return fig1, fig2, fig3

    return fig


app = Flask(__name__)

@app.route('/')
def index():
    fig1, fig2, fig3 = create_visualizations(provincial_data)
    return render_template('index.html', plot1=fig1.to_html(full_html=False),
                                         plot2=fig2.to_html(full_html=False),
                                         plot3=fig3.to_html(full_html=False))


if __name__ == '__main__':
    app.run(debug=True)
