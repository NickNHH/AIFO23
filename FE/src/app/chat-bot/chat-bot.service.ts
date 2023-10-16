import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { botReplies, gifsLinks, imageLinks } from './bot-replies';

@Injectable()
export class ChatBotService {
  public output: string | undefined = '';

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
    botReply.reply.text = this.output;
    return { ...botReply.reply };
  }

  async getMessage(input: string) {
    return this.httpClient.post("http://localhost:8080/sendMessage/", {'message': input}, {responseType: 'text'}).toPromise().then(data => {
      this.output = data;
    });
  }
}
