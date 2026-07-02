import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) return next(req);

  const reqWithToken = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  });

  return next(reqWithToken).pipe(
    catchError(
      error => {
        if (error.status === 401){
          authService.logout();
          router.navigate(['/auth/login']);
        }
        return throwError( ()=> error );
      })
  );

};
