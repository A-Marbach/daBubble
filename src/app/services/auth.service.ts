import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor() {}

  async signUp(email: string, password: string, userData: any): Promise<UserCredential | null> {
    try {
      // Benutzer in Firebase Authentication erstellen
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User signed up:', userCredential.user);

      // UID des neu erstellten Benutzers abrufen
      const uid = userCredential.user.uid;

      // Benutzerdaten in Firestore speichern
      const cleanedUserData = { ...userData, uid: uid };
      const docRef = doc(this.firestore, 'users', uid);
      await setDoc(docRef, cleanedUserData);

      return userCredential; // Rückgabe des UserCredential-Objekts bei Erfolg
    } catch (error) {
      console.error('Error signing up:', error);
      return null; // Rückgabe von null im Fehlerfall
    }
  }

  async signIn(email: string, password: string): Promise<UserCredential | null> {
    try {
      // Benutzer anmelden
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User signed in:', userCredential.user);

      return userCredential; // Rückgabe des UserCredential-Objekts bei Erfolg
    } catch (error) {
      console.error('Error signing in:', error);
      return null; // Rückgabe von null im Fehlerfall
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('User signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }
}
