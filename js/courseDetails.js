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
