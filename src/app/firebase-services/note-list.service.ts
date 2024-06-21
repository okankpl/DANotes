import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, orderBy, limit, query, where, } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})

export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  markedNotes: Note[] = [];

  firestore: Firestore = inject(Firestore);

  unSubTrash: any;
  unSubNotes: any;
  unSubMarkedNotes: any;

  constructor() {
    this.unSubNotes = this.subNotesList();
    this.unSubTrash = this.subTrashList();
    this.unSubMarkedNotes = this.subMarkedNotes();
  }

  async deleteNote(collId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(collId, docId)).catch(
      (err) => { console.log(err) }
    )
  }

  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getCollIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err); }
      )
    }
  }

  getCleanJson(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked,
    }
  }

  getCollIdFromNote(note: Note) {
    if (note.type == "note") {
      return 'notes'
    } else {
      return 'trash'
    }
  }

  async addNote(item: Note, collId: string) {
    const collRef = this.getCollectionRef(collId);
    await addDoc(collRef, item).then(docRef => {
      console.log("Document written with ID: ", docRef.id);
    }).catch(err => {
      console.error(err);
    });
  }

  getCollectionRef(collId: string) {
    return collection(this.firestore, collId);
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
    const q = query(this.getNotesRef(), orderBy('title', 'asc'), (limit(100)));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
      list.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New note: ", change.doc.data());
        }
        if (change.type === "modified") {
          console.log("Modified note: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed note: ", change.doc.data());
        }
      });
    });
  }

  subMarkedNotes() {
    const q = query(this.getNotesRef(), where('marked', '==', true), (limit(100)));
    return onSnapshot(q, (list) => {
      this.markedNotes = [];
      list.forEach(element => {
        this.markedNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }

  ngOnDestroy() {
    this.unSubTrash();
    this.unSubMarkedNotes();
    this.unSubMarkedNotes();
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId);
  }
}
