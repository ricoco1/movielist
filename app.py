import os
from os.path import join, dirname
from dotenv import load_dotenv
from http import client
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import requests
from bs4 import BeautifulSoup

# Load environment variables from .env
load_dotenv()

# Membaca nilai variabel lingkungan
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/movie", methods=["POST"])
def movie_post():
    url_receive = request.form['url_give']
    star_receive = request.form['star_give']
    comment_receive = request.form['comment_give']

    headers = {'User-Agent' : 'Mozillgia/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    og_image = soup.select_one('meta[property="og:image"]')
    og_title = soup.select_one('meta[property="og:title"]')
    og_description = soup.select_one('meta[name="description"]')

    image = og_image['content']
    title = og_title['content'].encode('ascii', 'ignore').decode('ascii')
    desc = og_description['content'].encode('ascii', 'ignore').decode('ascii')
    doc = {
        'image':image,
        'title':title,
        'description': desc,
        'star': star_receive,
        'comment':comment_receive,
    }
    db.movies.insert_one(doc)
    # print(url_receive)
    return jsonify({'msg':'Save Movie Success'})

@app.route("/movie", methods=["GET"])
def movie_get():
    movie_list = list(db.movies.find({},{'_id': False}))

    return jsonify({'movies':movie_list})

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)