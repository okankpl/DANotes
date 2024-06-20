import { Injectable, inject} from '@angular/core';
import { Note } from '../interfaces/note.interface';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';



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

  async addNote(item: Note, collId: any) {
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
    return collection(this.firestore, 'trash');
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId);
  }
}
