import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Question {
  question: string;
  type: string;
  theme: string;
  keywords?: string[];
}

export interface QuestionsResponse {
  questions: Question[];
  success: boolean;
  generatedAt: string;
}

export interface EditorialResponse {
  success: boolean;
  editorial: string;
  wordCount: number;
  characterCount: number;
  source: string;
}

export interface AnswerResponse {
  success: boolean;
  answer: string;
  question: string;
  generatedAt: string;
  estimatedWords: number;
}

@Injectable({
  providedIn: 'root'
})
export class EditorialService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  extractEditorial(url: string): Observable<EditorialResponse> {
    return this.http.post<EditorialResponse>(`${this.apiUrl}/editorial/extract`, { url });
  }

  generateQuestions(editorialText: string): Observable<QuestionsResponse> {
    return this.http.post<QuestionsResponse>(`${this.apiUrl}/editorial/generate-questions`, { editorialText });
  }

  generateAnswer(question: string, editorialContext: string): Observable<AnswerResponse> {
    return this.http.post<AnswerResponse>(`${this.apiUrl}/editorial/generate-answer`, { 
      question, 
      editorialContext 
    });
  }
}