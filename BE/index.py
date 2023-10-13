from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/hello/', methods=['GET'])
def welcome():
    return "Hello Worlds!"


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
