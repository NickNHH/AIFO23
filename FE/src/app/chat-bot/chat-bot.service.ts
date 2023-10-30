import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {botAvatar, botReplies, gifsLinks, imageLinks} from './bot-replies';

interface MessageJSON {
  message: string;
  video_iframe: string;
  video_title: string;
  comment_count: string,
  like_count: string,
  view_count: string,
  videos: Video
}

interface Video {
  video_title: string,
  video_url: string
}

@Injectable()
export class ChatBotService {
  public output: MessageJSON | undefined = undefined;

  constructor(protected httpClient: HttpClient) {
  }

  loadBotReplies() {
    return botReplies;
  }

  async reply(message: string) {
    const botReply: any =  this.loadBotReplies()
      .find((reply: any) => message.search(reply.regExp) !== -1);

    if (botReply.reply.type === 'quote') {
      botReply.reply.quote = message;
    }

    if (botReply.type === 'gif') {
      botReply.reply.files[0].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];
    }

    if (botReply.type === 'pic') {
      botReply.reply.files[0].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    }

    if (botReply.type === 'group') {
      botReply.reply.files[1].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];
      botReply.reply.files[2].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    }

    await this.getMessage(message)
    botReply.reply.text = this.output?.message;
    console.log(this.output)

    if (this.output?.video_title != null && this.output.comment_count == null) {
      return this.getVideoIntent(this.output?.message);
    }

    if (this.output?.videos != null) {
      botReply.reply.text = this.getMultipleVideosIntent(this.output);
    }

    if (this.output?.comment_count != null) {
      botReply.reply.text = this.getStatisticsIntent(this.output);
    }

    return { ...botReply.reply };
  }

  async getMessage(input: string) {
    return this.httpClient.post("http://localhost:8080/sendMessage/", {'message': input}, {responseType: 'text'}).toPromise().then(data => {
      this.output = JSON.parse(data!.toString());
    });
  }

  getVideoIntent(message: string) {
    return {
      type: 'video',
      answerArray: [message],
      user: {
        name: 'Bot',
        avatar: botAvatar,
      },
    }
  }

  getMultipleVideosIntent(output: any) {
    let message = 'Here are more videos like this:\n';
    output.videos.forEach(function (video: Video) {
      message += `- Video title: ${video.video_title}\n- Video URL: ${video.video_url}\n\n`
    });
    return message;
  }

  getStatisticsIntent(output: any) {
    return `${output.message}\n- Title: ${output.video_title}\n- Comments: ${output.comment_count}\n- Likes: ${output.like_count}\n- Views: ${output.view_count}`
  }
}
