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

const db = firebase.firestore()

const programmes = await db.collection("programmes").get()

const course1Select = document.querySelector("#course1")
console.log(course1Select)

const tableBody = document.querySelector("#table-body")
console.log(tableBody)

const courseMap = new Map()

programmes.forEach((doc) => {
  const data = doc.data()
  courseMap.set(data["Program Name"].trim(), data)
  console.log(`Program Name : ${data["Program Name"]} with` + courseMap.size)
})

console.log(courseMap)

function renderTable(course1, course2) {
  tableBody.innerHTML = ""
  tableBody.innerHTML += `<tr><td>${course1["Program Name"]}</td><td>Name</td><td>${course2["Program Name"]}</td></tr>`
  tableBody.innerHTML += `<tr><td>${course1["Intake"]}</td><td>Intake</td><td>${course2["Intake"]}</td></tr>`
  tableBody.innerHTML += `<tr><td>${course1["Duration"]}</td><td>Duration</td><td>${course2["Duration"]}</td></tr>`
  tableBody.innerHTML += `<tr><td>${course1["Programme Overview"]}</td><td>Programme Overview</td><td>${course2["Programme Overview"]}</td></tr>`
  tableBody.innerHTML += `<tr><td>${course1["outline"]}</td><td>Outline</td><td>${course2["outline"]}</td></tr>`
}

setInterval(() => {
  // Interval Code
  const course1Option = document.querySelector(
    "body > div > div.row.mb-4 > div:nth-child(1) > div > span"
  )
  const course2Option = document.querySelector(
    "body > div > div.row.mb-4 > div:nth-child(2) > div > span"
  )
  let course1Value = course1Option.innerHTML.trim()
  let course2Value = course2Option.innerHTML.trim()

  let course1Obj = courseMap.get(course1Value)
  let course2Obj = courseMap.get(course2Value)
  if (course1Obj && course2Obj) {
    renderTable(course1Obj, course2Obj)
  } else {
    tableBody.innerHTML = ""
  }
}, 1000)
