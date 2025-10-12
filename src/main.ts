import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { AuthInterceptor } from './app/interceptors/auth.interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
}).catch(err => console.error(err));
