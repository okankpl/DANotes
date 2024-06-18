import { Injectable ,inject} from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collectionData, collection,doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore: Firestore = inject(Firestore);

  constructor() { }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getSingleDocRef(collId:string, docId:string) {
    return doc(collection(this.firestore, collId), docId);
  }
}
