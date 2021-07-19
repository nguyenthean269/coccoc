import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        public authService: AuthService
    ) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let jwt = '';
        if (this.authService.jwt) {
            jwt = this.authService.jwt;
        } else {
            const authen = this.authService.getAuthen();
            if (authen) {
                jwt = authen.jwt;
                this.authService.setAuthenRAM(authen);
            } else {
                jwt = '';
            }
        }
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${jwt}`
            }
        });
        return next.handle(request).pipe(
            tap(
                (event: any) => {
                },
                (err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        if (err.status === 401) {
                            this.authService.logout();
                        }
                    }
                }
            )
        );
    }




}
