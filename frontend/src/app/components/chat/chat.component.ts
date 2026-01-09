import { Component, OnInit, OnDestroy, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { AuthService } from '../../services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="chat-wrapper fade-in">
      <mat-card class="chat-terminal">
        <div class="chat-header">
           <button mat-icon-button routerLink="/requests" class="back-btn">
             <mat-icon>arrow_back</mat-icon>
           </button>
           <div class="chat-user-info">
             <div class="user-avatar-small">
                <mat-icon>person</mat-icon>
             </div>
             <div>
                <h2>Chat Session</h2>
                <p>User ID: {{ receiverId }}</p>
             </div>
           </div>
           <span class="spacer"></span>
           <div class="chat-status ripple">Online</div>
        </div>
        
        <mat-card-content class="message-display" #scrollFrame>
          <div *ngFor="let msg of messages" 
               class="message-row"
               [ngClass]="{'is-mine': msg.senderId === currentUser.id, 'is-other': msg.senderId !== currentUser.id}">
            
            <div class="message-bubble-group">
                <div class="bubble">
                    {{ msg.message }}
                </div>
                <span class="timestamp">{{ msg.timestamp | date:'shortTime' }}</span>
            </div>
          </div>
          
          <div *ngIf="messages.length === 0" class="chat-empty">
             <mat-icon>forum</mat-icon>
             <p>Send a message to start the conversation</p>
          </div>
        </mat-card-content>

        <div class="chat-footer">
            <mat-form-field appearance="outline" class="chat-input-field">
                <input matInput [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Write your message here...">
                <button mat-icon-button matSuffix class="send-btn" (click)="sendMessage()" [disabled]="!newMessage.trim()">
                    <mat-icon>send</mat-icon>
                </button>
            </mat-form-field>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .chat-wrapper {
      padding: 32px 24px;
      height: calc(100vh - 140px);
      display: flex;
      justify-content: center;
      background: var(--bg-main);
    }
    .chat-terminal {
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
      border-radius: 24px !important;
      overflow: hidden;
    }
    
    .chat-header {
      padding: 16px 24px;
      background: rgba(255, 255, 255, 0.9);
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .chat-user-info h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }
    .chat-user-info p { margin: 0; font-size: 0.8rem; color: var(--text-muted); }
    .user-avatar-small { width: 40px; height: 40px; background: var(--pastel-blue); color: #0369a1; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
    
    .chat-status { font-size: 0.75rem; color: #15803d; background: var(--pastel-mint); padding: 4px 10px; border-radius: 20px; font-weight: 600; }
    .spacer { flex: 1; }

    .message-display {
      flex: 1;
      overflow-y: auto;
      padding: 24px !important;
      background: #fdfdfd;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .message-row { display: flex; width: 100%; }
    .is-mine { justify-content: flex-end; }
    .is-other { justify-content: flex-start; }
    
    .message-bubble-group { max-width: 70%; display: flex; flex-direction: column; gap: 4px; }
    .is-mine .message-bubble-group { align-items: flex-end; }
    
    .bubble {
      padding: 12px 18px;
      border-radius: 20px;
      font-size: 0.95rem;
      line-height: 1.5;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    
    .is-mine .bubble { background: #0369a1; color: white; border-bottom-right-radius: 4px; }
    .is-other .bubble { background: white; border: 1px solid #f1f5f9; color: var(--text-main); border-bottom-left-radius: 4px; }
    
    .timestamp { font-size: 0.7rem; color: var(--text-muted); padding: 0 4px; }

    .chat-footer { padding: 20px 24px; background: white; border-top: 1px solid #f1f5f9; }
    .chat-input-field { width: 100%; margin: 0; }
    ::ng-deep .chat-input-field .mat-mdc-text-field-wrapper { border-radius: 50px !important; background: #f8fafc !important; }
    
    .send-btn { 
      background: #0369a1 !important; 
      color: white !important; 
      margin-right: -8px; 
      transform: scale(0.9);
      transition: transform 0.2s ease !important;
    }
    .send-btn:hover { transform: scale(1); }
    .send-btn:disabled { background: #cbd5e1 !important; }

    .chat-empty { text-align: center; margin: auto; color: var(--text-muted); }
    .chat-empty mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.2; margin-bottom: 16px; }

    .back-btn { color: var(--text-muted); }
  `]
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollFrame') private scrollContainer!: ElementRef;

  messages: any[] = [];
  newMessage: string = '';
  currentUser: any;
  receiverId: number = 0;

  private chatService = inject(ChatService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.chatService.joinRoom(user.id);
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.receiverId = +params['id'];
        if (this.currentUser) {
          this.loadChatHistory();
        }
      }
    });

    this.chatService.getMessages().subscribe(data => {
      this.messages.push({
        ...data,
        timestamp: new Date()
      });
      this.autoScroll();
    });
  }

  ngAfterViewChecked() {
    this.autoScroll();
  }

  loadChatHistory() {
    this.chatService.getChatHistory(this.receiverId).subscribe(data => {
      this.messages = data.map(m => ({
        senderId: m.sender_id,
        receiverId: m.receiver_id,
        message: m.content,
        timestamp: m.created_at
      }));
      this.autoScroll();
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.receiverId) {
      const msgData = {
        senderId: this.currentUser.id,
        receiverId: this.receiverId,
        message: this.newMessage,
        timestamp: new Date()
      };

      this.chatService.sendMessage(this.currentUser.id, this.receiverId, this.newMessage);
      this.messages.push(msgData);
      this.newMessage = '';
      this.autoScroll();
    }
  }

  autoScroll() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  ngOnDestroy() {
    this.chatService.disconnect();
  }
}
