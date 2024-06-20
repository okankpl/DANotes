import { Injectable, inject, OnInit, OnDestroy } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collectionData, collection, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);


  items$: any;
  items;



  unSubList: () => void;
  // unSubSingle:() => void;

  constructor() {
    this.unSubList = onSnapshot(this.getNotesRef(), (list) => {
      list.forEach(element => {
        console.log(element.data());
      })
    });


    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe((list: Note[]) => {
      list.forEach((element: any) => {
        console.log(element);
      });
    })


  }


  ngOnDestroy() {
    this.unSubList();
    this.items.unsubscribe();
  }

  getTrashRef() {
    return collection(this.firestore, 'Trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'Notes');
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId);
  }
}
