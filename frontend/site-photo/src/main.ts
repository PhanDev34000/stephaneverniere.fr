import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/core/auth.interceptor';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBA8LYTwWrMPSJsx3CN1zXwp8dAmYpA3Dw",
  authDomain: "sitephotosv.firebaseapp.com",
  projectId: "sitephotosv",
  storageBucket: "sitephotosv.appspot.com",
  messagingSenderId: "774347671515",
  appId: "1:774347671515:web:ada959be1fffbd409949fe",
  measurementId: "G-BJ6FHCNW4W"
};

initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
}).catch(err => console.error(err));