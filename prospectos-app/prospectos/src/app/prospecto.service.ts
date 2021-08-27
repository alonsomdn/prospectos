import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Prospecto } from './prospecto';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProspectoService {
  private baseUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {
    
   }

  getProspectos(): Observable<Prospecto[]> {
    const url = this.baseUrl + '/prospectos';

    return this.http.get<Prospecto[]>(url)
      .pipe(
        catchError(this.handleError<Prospecto[]>('getProspectos', []))
        );
  }

  getProspecto(id: number): Observable<Prospecto> {
    const url = this.baseUrl + `/prospectos/${id}`;

    return this.http.get<Prospecto>(url)
      .pipe(
        catchError(this.handleError<Prospecto>('getProspectos'))
        );
  }

  postProspecto(prospecto: Prospecto): Observable<Prospecto> {
    const url = this.baseUrl + `/prospectos`;
    
    const headers = { headers: { 'Content-Type': 'application/json' } };
    
    return this.http.post<Prospecto>(url, prospecto, headers)
      .pipe(
        catchError(this.handleError<Prospecto>('getProspectos'))
        );
  }

  autorizar(prospecto: Prospecto): Observable<Prospecto> {
    const url = this.baseUrl + `/prospectos/autorizar`;
    
    const headers = { headers: { 'Content-Type': 'application/json' } };
    
    return this.http.put<Prospecto>(url, prospecto, headers)
      .pipe(
        catchError(this.handleError<Prospecto>('getProspectos'))
        );
  }

  rechazar(prospecto: Prospecto): Observable<Prospecto> {
    const url = this.baseUrl + `/prospectos/rechazar`;
    
    const headers = { 'Content-Type': 'application/json' };
    
    return this.http.put<Prospecto>(url, prospecto, {headers})
      .pipe(
        catchError(this.handleError<Prospecto>('getProspectos'))
        );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
