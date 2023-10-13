import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatBotComponent} from "./chat-bot/chat-bot.component";

const routes: Routes = [
  { path: '', component: ChatBotComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
