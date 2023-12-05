
import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial)


  //get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }

    });
    const json = await response.json()
    console.log(json)
    setNotes(json)


  }


  //Add Notes

  const addNote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
            const note=await response.json();
           setNotes(notes.concat(note))


 }

  //Delete Notes


  const deleteNote = async (id) => {


    //api calls
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },

    });
    const json = response.json();
    console.log(json)



    console.log("Deleting notes with id succesfully" + id)
    const newNotes = notes.filter((note) => { return note._id !== id })
    setNotes(newNotes)

  }

  const editNote = async (id, title, description, tag) => {
    //api call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = response.json();
    let newNotes = JSON.parse(JSON.stringify(notes))
    //logic to edit in client
    for (let index = 0; index < notes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }

    }
    setNotes(newNotes)



  }
// for fetch user name
  // const getUser = async () => {
  //   const response = await fetch(`${host}/api/auth/getuser`, {
  //     method: "GET",

  //     headers: {
  //       "Content-Type": "application/json",
  //       "auth-token": localStorage.getItem('token')
  //     }

  //   });
  //   const json = await response.json()
  //   console.log(json)
   


  // }
 




  return (

    //we pass object in value khud se
    <NoteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes }}>

      {props.children}

    </NoteContext.Provider>
  )
}

export default NoteState;