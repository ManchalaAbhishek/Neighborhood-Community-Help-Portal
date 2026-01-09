import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface HelpRequest {
  id?: number;
  resident_id?: number;
  helper_id?: number;
  title: string;
  description: string;
  category: string;
  status: 'Pending' | 'Accepted' | 'In-progress' | 'Completed';
  attachments?: string;
  resident_name?: string;
  helper_name?: string;
  created_at?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  getAllRequests(): Observable<HelpRequest[]> {
    return this.http.get<HelpRequest[]>('/api/requests', this.getHeaders());
  }

  createRequest(request: Partial<HelpRequest>): Observable<any> {
    return this.http.post('/api/requests', request, this.getHeaders());
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`/api/requests/${id}/status`, { status }, this.getHeaders());
  }
}
