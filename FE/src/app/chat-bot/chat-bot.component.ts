import {Component, OnInit} from '@angular/core';
import {ChatBotService} from "./chat-bot.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.scss']
})
export class ChatBotComponent implements OnInit {
  safeUrl: SafeUrl = '';
  messages: any[];

  constructor(protected chatBotService: ChatBotService, private sanitizer: DomSanitizer) {
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
    this.getVideoURL();
    if (botReply) {
      setTimeout(() => { this.messages.push(botReply) }, 500);
    }
  }

  getVideoURL(): void {
    if (this.chatBotService.output?.message == 'Have fun with your video!') {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.chatBotService.output!.video_iframe);
    }
  }
}
