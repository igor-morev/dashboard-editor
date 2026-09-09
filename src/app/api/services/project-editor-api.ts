import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment.development";
import { AuthResponse } from "../types/auth";
import { UserDto } from "../types/user";
import { AIGenerationPayload } from "../types/ai";
import {
  CreatePageDto,
  CreateProjectDto,
  ExportPayloadDto,
  LayerDto,
  PageDto,
  ProjectDto,
  ProjectResponseDto,
  ProjectSummaryDto,
  UpdateProjectDto,
} from "../types/project";

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

  loadPage(projectId: string, pageId: string): Observable<PageDto> {
    return this.http.get<PageDto>(
      `${environment.apiUrl}/project/${projectId}/page/${pageId}`
    );
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

  previewProject(payload: ExportPayloadDto): Observable<string> {
    return this.http.post(`${environment.apiUrl}/project/preview`, payload, {
      responseType: 'text',
    });
  }

  createProject(dto: CreateProjectDto): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${environment.apiUrl}/project/create`, dto);
  }

  getProjectList(): Observable<ProjectSummaryDto[]> {
    return this.http.get<ProjectSummaryDto[]>(`${environment.apiUrl}/project/list`);
  }

  getProject(projectId: string): Observable<ProjectDto> {
    return this.http.get<ProjectDto>(`${environment.apiUrl}/project/${projectId}`);
  }

  saveProject(projectId: string, dto: UpdateProjectDto): Observable<ProjectDto> {
    return this.http.patch<ProjectDto>(`${environment.apiUrl}/project/${projectId}`, dto);
  }

  savePage(projectId: string, pageId: string, layers: LayerDto[]): Observable<void> {
    return this.http.put<void>(
      `${environment.apiUrl}/project/${projectId}/page/${pageId}`,
      { layers },
    );
  }

  getWidgetsLibrary() {
    return this.http.get(`${environment.apiUrl}/widgets/library`);
  }

  getLayers(projectId: string, pageId: string): Observable<LayerDto[]> {
    return this.http.get<LayerDto[]>(`${environment.apiUrl}/project/${projectId}/page/${pageId}/layers`);
  }

  createPage(projectId: string, dto: CreatePageDto): Observable<PageDto> {
    return this.http.post<PageDto>(`${environment.apiUrl}/project/${projectId}/page`, dto);
  }

  deletePage(projectId: string, pageId: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/project/${projectId}/page/${pageId}`);
  }

  publishProject(projectId: string): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${environment.apiUrl}/project/${projectId}/publish`, {});
  }

  unpublishProject(projectId: string): Observable<ProjectDto> {
    return this.http.post<ProjectDto>(`${environment.apiUrl}/project/${projectId}/unpublish`, {});
  }

}
