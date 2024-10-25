import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth'; 
import { provideStorage, getStorage } from '@angular/fire/storage';
import { routes } from './app.routes';
import { provideDatabase, getDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp({ 
      apiKey: "AIzaSyDCDke_Enpm4Gt_Ynl3mRtmNGsxBv8v8Pk",
      authDomain: "da-bubble-c1e09.firebaseapp.com",
      databaseURL: "https://da-bubble-c1e09-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "da-bubble-c1e09",
      storageBucket: "da-bubble-c1e09.appspot.com",
      messagingSenderId: "145879322110",
      appId: "1:145879322110:web:430526b9ef37ff1f98c4af",
      measurementId: "G-7ZJZB34GTG"
    })),
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase())
  ]
};
