import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { botReplies, gifsLinks, imageLinks } from './bot-replies';
import { map } from "rxjs";

@Injectable()
export class ChatBotService {

  constructor(protected httpClient: HttpClient) {
  }

  loadBotReplies() {
    return botReplies;
  }

  reply(message: string) {
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

    this.getDialogFlowResponse()
    botReply.reply.text = "LOLS";
    return { ...botReply.reply };
  }

  getDialogFlowResponse() {
    return this.httpClient.get("http://localhost:8080/hello/", {responseType: 'text'})
      .subscribe(data => {
        console.log(data)
      });
  }
}
