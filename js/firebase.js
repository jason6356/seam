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
renderCards(programmes, "Diploma")

function renderCards(querySnapshot, query) {
  let count = 0

  const el = document.querySelector("#course-cards")
  el.innerHTML = ""

  querySnapshot.forEach((doc) => {
    const data = doc.data()
    if (query && !data["Program Name"].includes(query)) {
      return
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
    cardElement.classList.add("col-md-4")
    cardElement.innerHTML = `
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${data["Program Name"]}</h5>
            <p class="card-text">
              Duration : ${data["Duration"]}
              <br />
              Campuses : ${data["Campuses"]}
            </p>
            <a href="/course-details.html?docid=${doc.id}" class="btn btn-primary">View Details</a>
          </div>
        </div>
      `

    el.lastChild.appendChild(cardElement)

    count++
  })

  // Close the last row if it is still open.
  if (el.lastChild.classList.contains("row")) {
    el.appendChild(document.createElement("div")).classList.add("row")
  }
}

const input = document.querySelector("#searchValue")
let isSearching = false
console.log(input)

function getSpmResults() {
  let spmResults = window.localStorage.getItem("spmResults")
  if (spmResults) {
    return JSON.parse(spmResults)
  } else {
    return {}
  }
}

let studentResult = getSpmResults()
let numOfCredit = window.localStorage.getItem("creditCount")

// if (studentResult) {
//   if (numOfCredit < 5) {
//     alert("You have insufficent credit to apply for any courses!")
//     window.location.href = "/index.html"
//   } else if (numOfCredit === null) {
//   } else {
//     alert("You have minimum credit to apply for any courses!")
//   }
// }

setInterval(() => {
  let value = document.querySelector(
    "body > section.container.mt-10 > div > div.col-md-2 > div > span"
  ).innerHTML

  console.log(input.value)

  if (value === "Degree") {
    value = "Bachelor"
  }

  if (input.value !== "") {
    value = input.value
  }
  //Filter the programmes based on the value
  renderCards(programmes, value)
}, 1000)
