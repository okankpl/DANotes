import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-3edc1","appId":"1:65492954698:web:faad3d75ef4dddd86780b3","storageBucket":"danotes-3edc1.appspot.com","apiKey":"AIzaSyDCRkdOT1krE7cL68ZxfZDUUswMWCKAU88","authDomain":"danotes-3edc1.firebaseapp.com","messagingSenderId":"65492954698"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
