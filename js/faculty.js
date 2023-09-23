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

const facultyMembers = await db.collection("staff_members").get()
renderCards(facultyMembers, "Department", null)

function renderCards(facultyMembers, department, searchQuery) {
  let count = 0

  const el = document.querySelector("#course-cards")
  el.innerHTML = ""

  facultyMembers.forEach((doc) => {
    const data = doc.data()

    if (searchQuery !== "" && searchQuery !== null) {
      if (!data["Name"]) return

      if (searchQuery && !data["Name"].includes(searchQuery)) {
        return
      } else {
        console.log(`Search Query : ` + searchQuery)
        console.log(`Data : ` + data["Name"])
      }
    } else {
      if (!data["Department"]) return

      if (department && !data["Department"].includes(department)) {
        return
      }

      console.log(`Department : ` + department)
      console.log(`Data : ` + data["Department"])
    }

    // Create a new row element if the count is zero or if the count is a multiple of 3 and the previous row is open.
    if (
      count === 0 ||
      (count % 2 === 0 && el.lastChild.classList.contains("row"))
    ) {
      const rowElement = document.createElement("div")
      rowElement.classList.add("row")
      el.appendChild(rowElement)
    }

    // Create a new card element and append it to the current row.
    const cardElement = document.createElement("div")
    cardElement.classList.add("col-md-6")
    cardElement.innerHTML = `
        <div class="card">
          <img class="card-img-top" src="${data["Img"]}" alt="Card image cap">
          <div class="card-body">
            <h5 class="card-title">${data["Name"]}</h5>
            <p class="card-text">
              Department : ${data["Department"]}
              <br />
              ${data["Area of Interest"]}
              <br />
                Email : ${data["Email"]}
            </p>
          </div>
        </div>
      `

    el.lastChild.appendChild(cardElement)

    count++
  })

  if (!el.lastChild) {
    return
  }
  // Close the last row if it is still open.
  if (el.lastChild.classList.contains("row")) {
    el.appendChild(document.createElement("div")).classList.add("row")
  }
}

const input = document.querySelector("#searchValue")
setInterval(() => {
  let value = document
    .querySelector(
      "body > section.container.mt-10 > div > div.col-md-5 > div > span"
    )
    .innerHTML.trim()

  if (input.value !== "") {
    console.log(input.value)
    renderCards(facultyMembers, value, input.value)
  } else {
    //Filter the programmes based on the value
    renderCards(facultyMembers, value, null)
  }
}, 1000)
