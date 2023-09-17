import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-c8093-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

const publishBtn = document.getElementById("publish-btn")
const endorsementTextEl = document.getElementById("endorsement-text")
const endorsementListEl = document.getElementById("endorsement-list")

publishBtn.addEventListener("click", () => {
    let textInput = endorsementTextEl.value
    push(endorsementsInDB, textInput)

    clearEndorsementTextEl()
})

function clearEndorsementTextEl() {
    endorsementTextEl.value = ""
}