import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        public AuthService: AuthService
    ) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiYXV0aCI6IkJPX1NVTkdfRFVfTElFVSIsInVzZXJuYW1lIjoiMSIsInVzZXJfaWQiOjEsImV4cCI6MTYyODk2MTM5MH0._u3-JDup4WDS0d6wDZ1BUbBt0rNhDU_-OsnT3ItZlSmeb40eTuGKatzBPQzxsLtDhmBq58yulfFCUIWXY1fsig`
            }
        });
        return next.handle(request);
    }




}
