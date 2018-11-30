import os

# import pandas as pd
# import numpy as np

# import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
# from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


@app.route("/")
def Home():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/World Map")
def WorldMap():
     """Movie Counting by Countries"""
     return render_template("map1.html")

@app.route("/Profits")
def Profits():
    """Profits Analysis"""
    return render_template("profit.html")


if __name__ == "__main__":
    app.run(debug=True)
