import { Component, OnInit } from '@angular/core';
import {ChatBotService} from "./chat-bot.service";

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {
  messages: any[];

  constructor(protected chatBotService: ChatBotService) {
    this.messages = [];
  }

  ngOnInit(): void { }

  async sendMessage(event: any) {
    const files = !event.files ? [] : event.files.map((file: { src: any; type: any; }) => {
      return {
        url: file.src,
        type: file.type,
        icon: 'file-text-outline',
      };
    });

    this.messages.push({
      text: event.message,
      date: new Date(),
      reply: true,
      type: files.length ? 'file' : 'text',
      files: files,
      user: {
        name: 'You',
      },
    });
    const botReply = await this.chatBotService.reply(event.message);
    if (botReply) {
      setTimeout(() => { this.messages.push(botReply) }, 500);
    }
  }
}
