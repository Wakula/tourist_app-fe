import { Injectable } from '@angular/core';
import { throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  handleError(error, sessionId?){
    let errorMessage = '';
    if(sessionId !== undefined && sessionId === null){
      window.location.reload();
      return throwError('Empty session id');
    }
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error.data}`;
      if(error.status === 401){
        localStorage.removeItem('sessionId');
        window.location.reload();
        return throwError(error);
      }
    }
    window.alert(errorMessage);
    return throwError(error);
  }

  constructor() { }
}
