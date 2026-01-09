import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket: Socket;

  constructor(private authService: AuthService, private http: HttpClient) {
    this.socket = io('http://localhost:3000');

    // Auto-join room on connect if user is already logged in
    const userRole = this.authService.getToken();
    // Ideally get ID properly. For now we assume component handles join.
  }

  joinRoom(userId: number) {
    this.socket.emit('join_room', userId);
  }

  getChatHistory(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`/api/chat/${userId}`, {
      headers: { 'Authorization': `Bearer ${this.authService.getToken()}` }
    });
  }

  sendMessage(senderId: number, receiverId: number, message: string) {
    this.socket.emit('send_message', { senderId, receiverId, message });
  }

  getMessages(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive_message', (data) => {
        observer.next(data);
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
