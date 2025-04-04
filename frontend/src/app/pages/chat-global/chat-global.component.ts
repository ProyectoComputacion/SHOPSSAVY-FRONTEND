import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Message {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
  user?: { name: string; role: string }; // Opcional para evitar errores
}

@Component({
  selector: 'app-chat-global',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-global.component.html',
  styleUrls: ['./chat-global.component.scss']
})
export class ChatGlobalComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.cargarMensajes();
  }

  cargarMensajes() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http.get<Message[]>('http://localhost:8000/api/chat/messages', { headers }).subscribe(
      data => { 
        console.log('Mensajes recibidos:', data);

        // 📌 Asegurar que cada mensaje tenga un usuario definido
        this.messages = data.map(msg => ({
          ...msg,
          user: msg.user ? msg.user : { name: 'Usuario Desconocido', role: 'user' }
        }));
      },
      error => { 
        console.error('Error obteniendo mensajes:', error);
      }
    );
  }

  enviarMensaje() {
    if (!this.newMessage.trim()) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);

    this.http.post<Message>('http://localhost:8000/api/chat/messages', { message: this.newMessage }, { headers }).subscribe(
      (message) => {
        this.messages.push({
          ...message,
          user: message.user ? message.user : { name: 'Tú', role: 'user' } // Si no viene user, se muestra "Tú"
        });
        this.newMessage = '';
      },
      error => console.error('Error enviando mensaje:', error)
    );
  }
}
