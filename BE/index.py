from flask import Flask, request
from flask_cors import CORS
import os
from google.cloud import dialogflow
import uuid

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

# path to the key-file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"]='/Users/tuni/OneDrive/Studium/3 sem/AIFo/Project/yt-chatbot-g99r-482b927c4e27.json'

@app.route('/hello/', methods=['GET'])
def welcome():
    return "Hello Worlds!"

session_id = "no-session-id"
@app.route('/sendMessage/', methods=['POST'])
def sendMessage():
    data = request.json  # Zugriff auf die im POST-Request gesendeten Daten
    if data and 'message' in data:
        message = data['message']

        # new session?
        if 'newSession' in data and data['newSession'] == 'true':
            session_id = str(uuid.uuid4())

        response = detect_intent_demo('yt-chatbot-g99r', session_id, message, 'en')

        return response['response']
    else:
        return "Invalid POST request, 'message' field is missing."


def detect_intent_demo(project_id, session_id, text, language_code):
    from google.cloud import dialogflow

    session_client = dialogflow.SessionsClient()

    session = session_client.session_path(project_id, session_id)

    text_input = dialogflow.TextInput(text=text, language_code=language_code)

    query_input = dialogflow.QueryInput(text=text_input)

    response = session_client.detect_intent(
        request={"session": session, "query_input": query_input}
    )

    returnArray = []

    returnArray['intent'] = response.query_result.intent
    returnArray['response'] = format(response.query_result.fulfillment_text))

    return returnArray

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
