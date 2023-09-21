import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-c8093-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementsInDB = ref(database, "endorsements")

onValue(endorsementsInDB, (snapshot) => {
    if (snapshot.exists()) {
        let endorsementArray = Object.entries(snapshot.val())

        clearEndorsementListEl()
        
        for (let i = 0; i < endorsementArray.length; i++) {
            let currentEndorsement = endorsementArray[i]

            appendEndorsementToListEl(currentEndorsement)
        }
    }
})

const publishBtn = document.getElementById("publish-btn")
const endorsementTextEl = document.getElementById("endorsement-text")
const endorsementListEl = document.getElementById("endorsement-list")
const fromInputEl = document.getElementById("from-input")
const toInputEl = document.getElementById("to-input")

publishBtn.addEventListener("click", () => {
    let inputObject = {
        text: endorsementTextEl.value,
        from: fromInputEl.value,
        to: toInputEl.value,
        likes: 0,
    }

    push(endorsementsInDB, inputObject)

    clearEndorsementInputFields()
})

function clearEndorsementInputFields() {
    endorsementTextEl.value = ""
    fromInputEl.value = ""
    toInputEl.value = ""
}

function clearEndorsementListEl() {
    endorsementListEl.innerHTML = ""
}

function appendEndorsementToListEl(endorsement) {
    let endorsementID = endorsement[0]
    let endorsementValue = endorsement[1].text
    let endorsementFrom = endorsement[1].from
    let endorsementTo = endorsement[1].to
    let endorsementLikes = endorsement[1].likes

    let newEl = document.createElement("li")
    newEl.innerHTML = `
        <h3>To ${endorsementTo}</h3>
        <p>${endorsementValue}</p>
        <h3>From ${endorsementFrom}</h3>
        <p id="${endorsementID}">❤️ ${endorsementLikes}</p>
    `

    endorsementListEl.prepend(newEl)

    let likesEl = document.getElementById(endorsementID)

    let likeCount = endorsementLikes

    likesEl.addEventListener("click", () => {
        let locationOfEndorsementInDB = ref(database, `endorsements/${endorsementID}`)

        let hasLiked = localStorage.getItem(endorsementID)

        console.log(hasLiked)

        if (!hasLiked) {
            likeCount++

            update(locationOfEndorsementInDB, {
                likes: likeCount,
            })

            localStorage.setItem(endorsementID, true)    
        } else {
            likeCount--

            update(locationOfEndorsementInDB, {
                likes: likeCount,
            })

            localStorage.removeItem(endorsementID)
        }
    })
}
