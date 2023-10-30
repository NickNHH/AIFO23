from flask import Flask, request
from flask_cors import CORS
import os
from google.cloud import dialogflow
import uuid
import json
from googleapiclient.discovery import build

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

api_key = 'AIzaSyDHp9JYjw2l36x448MRcpBEHr7EIpGnJ8U'
youtube = build('youtube', 'v3', developerKey=api_key)

# path to the key-file
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = './yt-chatbot-g99r-482b927c4e27.json'

last_video_id = None


def get_output(response):
    global last_video_id
    global last_video_id
    output = {
        "message": response['response']
    }
    intent_name = response['query_result'].intent.display_name
    if intent_name == 'video.search':
        channel = response['query_result'].parameters.get('channel')
        keyword = response['query_result'].parameters.get('keyword')
        length = response['query_result'].parameters.get('length')
        # output['channel'] = channel
        # output['keyword'] = keyword
        # output['length'] = length
        if channel != '' and keyword != '':
            channel_id = getChannelId(channel)

            search_response = get_search_response(keyword, channel_id, 1, length if length else 'any')

            for search_result in search_response.get('items', []):
                last_video_id = search_result['id']['videoId']
                video_title = search_result['snippet']['title']
                video_iframe = f'https://www.youtube.com/embed/{last_video_id}'
                output['video_iframe'] = video_iframe
                output['video_title'] = video_title
        else:
            last_video_id = None
    elif intent_name == 'video.statistics':
        if last_video_id:
            video_response = youtube.videos().list(
                part='statistics,snippet',
                id=last_video_id
            ).execute()
            video_statistics = video_response['items'][0]['statistics']
            output['view_count'] = video_statistics.get('viewCount', '0')
            output['like_count'] = video_statistics.get('likeCount', '0')
            output['dislike_count'] = video_statistics.get('dislikeCount', '0')
            output['comment_count'] = video_statistics.get('commentCount', '0')
            output['video_description'] = video_response['items'][0]['snippet']['description']
            output['video_title'] = video_response['items'][0]['snippet']['title']
        else:
            output['message'] = 'Search a video first'
    elif intent_name == 'video.more':
        amount = response['query_result'].parameters.get('amount')
        if amount != '':
            channel, keyword, length = None, None, None
            output_contexts = response['query_result'].output_contexts
            for context in output_contexts:
                if str(context.parameters.get('channel') != ""):
                    channel = context.parameters.get('channel')
                    keyword = context.parameters.get('keyword')
                    length = context.parameters.get('length')
                    break

            if channel is not None and keyword is not None:
                channel_id = getChannelId(channel)

                search_response = get_search_response(keyword, channel_id, amount, length if length else 'any')

                output['videos'] = []
                for search_result in search_response.get('items', []):
                    last_video_id = search_result['id']['videoId']
                    video_title = search_result['snippet']['title']
                    video_url = f'https://www.youtube.com/watch?v={last_video_id}'
                    output['videos'].append({'video_url': video_url, 'video_title': video_title})

    return output


def getChannelId(channel):
    # Führe die Kanalsuche durch
    search_response = youtube.search().list(
        q=channel,
        type='channel',
        part='snippet',
        maxResults=1  # Wir suchen nur nach dem ersten gefundenen Kanal
    ).execute()

    # Durchlaufe die Suchergebnisse und extrahiere den Kanal-ID
    channel_id = None
    if 'items' in search_response:
        channel_id = search_response['items'][0]['id']['channelId']

    return channel_id


def get_search_response(keyword, channel_id, maxResults, videoDuration):
    search_response = youtube.search().list(
        q=keyword,
        type='video',
        part='id,snippet',
        channelId=channel_id,
        maxResults=maxResults,  # Anzahl der Suchergebnisse, die du erhalten möchtest
        videoDuration=videoDuration
    ).execute()
    return search_response


@app.route('/sendMessage/', methods=['POST'])
def sendMessage():
    data = request.json  # Zugriff auf die im POST-Request gesendeten Daten
    if data and 'message' in data:
        message = data['message']
        session_id = "no-session-id"

        # new session?
        if 'newSession' in data and data['newSession'] == 'true':
            session_id = str(uuid.uuid4())

        response = detect_intent_demo('yt-chatbot-g99r', session_id, message, 'en')

        output = get_output(response)

        return output
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

    returnArray = {'query_result': response.query_result, 'response': format(response.query_result.fulfillment_text)}

    return returnArray


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
