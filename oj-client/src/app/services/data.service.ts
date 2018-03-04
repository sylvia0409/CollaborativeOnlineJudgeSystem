import { Injectable } from '@angular/core';
import { Problem } from '../models/problem.model';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DataService { 
  private problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private http: HttpClient) { }

  getProblems(): Observable<Problem[]> {
    this.http.get<Problem[]>('api/v1/problems')
    .toPromise()
    .then((res: Problem[]) => {
      this.problemSource.next(res);
    }) 
    .catch(this.handleError)
    return this.problemSource.asObservable();
  } 

  getProblem(id: number): Promise<Problem>{
    return this.http.get<Problem>(`api/v1/problems/${id}`)
        .toPromise()
        .catch(this.handleError);
  }

  addProblem(newProblem: Problem): Promise<any>{
    const options = {
      headers: new HttpHeaders({'content-type': 'application/json'})
    }
    return this.http.post('api/v1/problems',newProblem,options)
      .toPromise()
      .then((res:Response) =>{
        this.getProblems();          
      })
      .catch(this.handleError);

  }

  buildAndRun(data: any): Promise<Object>{
    const options = {
      headers: new HttpHeaders({'content-type': 'application/json'})
    }
    return this.http.post('api/v1/build_and_run', data, options)
      .toPromise()
      .then((res:Response) =>{
        return res;          
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any>{
    console.error('get problem failed', error);
    return Promise.reject(error.body || error);
  }

}
