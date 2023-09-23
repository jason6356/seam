import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js"
// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js"
// Add Firebase products that you want to use
import { getAuth } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js"
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js"
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBdjLVH41Lo86OINMZD2U_m9XQVUtob9jM",
  authDomain: "tarumt-focs-evolution.firebaseapp.com",
  projectId: "tarumt-focs-evolution",
  storageBucket: "tarumt-focs-evolution.appspot.com",
  messagingSenderId: "1069194099295",
  appId: "1:1069194099295:web:efca06b7733545b69679ea",
  measurementId: "G-LM491W7ZT3",
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
console.log("Firebase initialized!")

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const doc_id = urlParams.get("docid")
console.log(doc_id)
const db = firebase.firestore()

const course = await db.collection("programmes").doc(doc_id).get()

const data = course.data()
const objective = document.querySelector("#home > div")
objective.innerHTML = `<p>${data["Programme Overview"]}</p>`

const banner = document.querySelector(
  "body > section.banner_area > div > div.container > div > h2"
)
banner.innerHTML = `${data["Program Name"]}`

const entryReq = document.querySelector("#profile > div")
entryReq.innerHTML = `<img src="${data["entry_requirements"]}" alt="" width="800px"/>`
const outline = document.querySelector("#contact")
outline.innerHTML = data["outline"]
