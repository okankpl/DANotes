import { Injectable, inject, OnInit, OnDestroy } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collectionData, collection, doc, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';



@Injectable({
  providedIn: 'root'
})

export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];


  firestore: Firestore = inject(Firestore);

  unSubTrash: any;
  unSubNotes: any;

  constructor() {
    this.unSubNotes = this.subNotesList();
    this.unSubTrash = this.subTrashList();
  }

  async addNote(item: {}) {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => { console.error(err) })
      .then
      ((docRef) => { console.log("Document written with ID: ", docRef?.id) })
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }

  ngOnDestroy() {
    this.unSubTrash();
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
