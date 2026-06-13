import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { AuthResponse } from "../types/auth";
import { UserDto } from "../types/user";
import { AIGenerationPayload } from "../types/ai";
import { ExportPayloadDto, ProjectResponseDto } from "../types/project";
import { PROJECT_PAGE_RESPONSE } from "@app/application-project-editor/mock/response";

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

  loadPage(projectId: string, pageId: string): Observable<ProjectResponseDto> {
    // return this.http.get<ProjectResponseDto>(
    //   `${environment.apiUrl}/project/${projectId}/page/${pageId}`
    // );

    return of(PROJECT_PAGE_RESPONSE as any);
  }

  generatePageAI(payload: AIGenerationPayload): Observable<ProjectResponseDto> {
    return this.http.post<ProjectResponseDto>(
      `${environment.apiUrl}/ai/generate`,
      payload
    );
  }

  exportProject(projectId: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/project/${projectId}/export`, { responseType: 'blob' });
  }

  exportByJson(payload: ExportPayloadDto): Observable<Blob> {
    return this.http.post(`${environment.apiUrl}/project/export`, payload, { responseType: 'blob' });
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
