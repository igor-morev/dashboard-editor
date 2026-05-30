import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { AuthResponse } from "../types/auth";
import { UserDto } from "../types/user";


const aiResponse = {
  "industry": "Название",
  "theme": {
    "primaryColor": "emerald | sky | rose | amber | slate",
    "range": 500,
    "typeScale": 1.2,
    "borderRadius": "8px | 24px | 0px"
  },
  "sections": [
    { "type": "header", "layout": "classic", "content": {} },
    { "type": "hero", "layout": "centered-overlay", "content": {} },
  ]
};

@Injectable({
  providedIn: 'root',
})
export class ProjectEditorApi {
  private http = inject(HttpClient);

  register(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { username, password });
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { username, password });
  }

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${environment.apiUrl}/user/all`); 
  }

  getUser(userId: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${environment.apiUrl}/user/${userId}`); 
  }

  getUserDetails(): Observable<{
    sub: string;
    username: string;
  }> {
    return this.http.get<{
      sub: string;
      username: string;
    }>(`${environment.apiUrl}/auth/userDetails`);
  }

  generatePageAI(projectId: string, pageId: string, prompt: string): Observable<{ success: boolean; message: typeof aiResponse }> {
    return this.http.post<{ success: boolean; message: typeof aiResponse }>(
      `${environment.apiUrl}/project/${projectId}/page/${pageId}/generate`,
      { prompt }
    );
  }

  exportProject(projectId: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/project/${projectId}/export`, { responseType: 'blob' });
  }

  getProjectList() {
    return this.http.get(`${environment.apiUrl}/project/list`);
  }

  getWidgetsLibrary() {
    return this.http.get(`${environment.apiUrl}/widgets/library`);
  }

  getLayers(projectId: string, pageId: string) {
    return this.http.get(`${environment.apiUrl}/project/${projectId}/page/${pageId}/layers`);
  }
  
}
