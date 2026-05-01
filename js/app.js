import { renderInscriptions } from "./UI/etudiantRenderer.js"
import { openModal, closeModal, openDrawer, closeDrawer, fillEditForm } from "./UI/modalRenderer.js"
import { showMessage } from "./UI/messageRenderer.js"
import {
  validateForm,
  addInscription,
  updateInscription,
  archiverInscription,
  restaurerInscription,
  getActifs,
  filterByFormation,
  searchInscriptions
} from "./sercices/service.js"
import {
  btnOpenAdd, btnOpenDrawer,
  modalAdd, modalEdit, modalDelete, modalRestore,
  modalCloseButtons, drawerOverlay, drawerClose,
  formAdd, formEdit,
  addNom, addPrenom, addAdresse, addEmail, addTelephone, addFormation,
  editNom, editPrenom, editAdresse, editEmail, editTelephone, editFormation,
  btnCancelDelete, btnConfirmDelete,
  btnCancelRestore, btnConfirmRestore, restoreModalText,
  btnBulkRestore,
  tableBody, filterSelect, searchInput
} from "./DOM/element.js"

// affiche les erreurs sous les champs du formulaire
function showFormErrors(errors, prefix) {
  const fields = ["Nom", "Prenom", "Adresse", "Email", "Telephone", "Formation"]
  for (let i = 0; i < fields.length; i++) {
    const key = fields[i].toLowerCase()
    const span = document.getElementById(prefix + fields[i] + "Error")
    const input = document.getElementById(prefix + fields[i])
    if (span)  span.textContent = errors[key] || ""
    if (input) input.classList.toggle("input-error", !!errors[key])
  }
}

// efface toutes les erreurs d'un formulaire
function clearFormErrors(prefix) {
  const fields = ["Nom", "Prenom", "Adresse", "Email", "Telephone", "Formation"]
  for (let i = 0; i < fields.length; i++) {
    const span  = document.getElementById(prefix + fields[i] + "Error")
    const input = document.getElementById(prefix + fields[i])
    if (span)  span.textContent = ""
    if (input) input.classList.remove("input-error")
  }
}

// id de l'etudiant en cours de modification
let currentEditId = null

// id de l'etudiant en cours de suppression
let currentDeleteId = null

// liste des ids a desarchiver (1 seul ou plusieurs)
let pendingRestoreIds = []

// affichage initial de la liste depuis le localStorage
renderInscriptions(getActifs())

// OUVERTURE MODAL AJOUT
btnOpenAdd.addEventListener("click", function() {
  clearFormErrors("add")
  openModal(modalAdd)
})

// FERMETURE DES MODALES (X)
modalCloseButtons.forEach(function(btn) {
  btn.addEventListener("click", function() {
    const modal = btn.closest(".modal-overlay")
    if (modal) {
      closeModal(modal)
      clearFormErrors("add")
      clearFormErrors("edit")
    }
  })
})

//FERMETURE EN CLIQUANT SUR L'OVERLAY
const toutesLesModales = [modalAdd, modalEdit, modalDelete, modalRestore]
toutesLesModales.forEach(function(modal) {
  modal.addEventListener("click", function(e) {
    if (e.target === modal) {
      closeModal(modal)
      clearFormErrors("add")
      clearFormErrors("edit")
    }
  })
})

// SOUMISSION FORMULAIRE AJOUT
formAdd.addEventListener("submit", function(e) {
  e.preventDefault()

  const data = {
    nom:addNom.value.trim(),
    prenom:addPrenom.value.trim(),
    adresse:addAdresse.value.trim(),
    email:addEmail.value.trim(),
    telephone:addTelephone.value.trim(),
    formation:addFormation.value
  }

  const resultat = validateForm(data, null)
  if (!resultat.valid) {
    showFormErrors(resultat.errors, "add")
    return
  }

  addInscription(data)
  formAdd.reset()
  clearFormErrors("add")
  closeModal(modalAdd)
  renderInscriptions(getActifs())
  showMessage("Inscription ajoutée avec succès !")
})

// CLIC SUR LE TABLEAU modifier ou supprimer
tableBody.addEventListener("click", function(e) {
  const row = e.target.closest("tr")
  if (!row || !row.dataset.id) return

  const id = Number(row.dataset.id)

  if (e.target.closest(".btn-edit")) {
    currentEditId = id
    const actifs = getActifs()
    let inscription = null
    for (let i = 0; i < actifs.length; i++) {
      if (actifs[i].id === id) {
        inscription = actifs[i]
        break
      }
    }
    clearFormErrors("edit")
    fillEditForm(inscription)
    openModal(modalEdit)
  }

  if (e.target.closest(".btn-delete")) {
    currentDeleteId = id
    openModal(modalDelete)
  }
})

// FORMULAIRE DE MODIFICATION
formEdit.addEventListener("submit", function(e) {
  e.preventDefault()

  const data = {
    nom:editNom.value.trim(),
    prenom:editPrenom.value.trim(),
    adresse:editAdresse.value.trim(),
    email:editEmail.value.trim(),
    telephone:editTelephone.value.trim(),
    formation:editFormation.value
  }

  const resultat = validateForm(data, currentEditId)
  if (!resultat.valid) {
    showFormErrors(resultat.errors, "edit")
    return
  }

  updateInscription(currentEditId, data)
  clearFormErrors("edit")
  closeModal(modalEdit)
  renderInscriptions(getActifs())
  showMessage("Inscription modifiée avec succès !")
})

// MODAL SUPPRESSION
btnCancelDelete.addEventListener("click", function() {
  closeModal(modalDelete)
})

btnConfirmDelete.addEventListener("click", function() {
  archiverInscription(currentDeleteId)
  closeModal(modalDelete)
  renderInscriptions(getActifs())
  showMessage("Étudiant archivé avec succès !")
})

// DRAWER ARCHIVES
btnOpenDrawer.addEventListener("click", function() {
  openDrawer()
})

drawerClose.addEventListener("click", function() {
  closeDrawer()
})

drawerOverlay.addEventListener("click", function() {
  closeDrawer()
})

//MET A JOUR LE BOUTON "TOUT DESARCHIVER"
const drawerBody = document.querySelector(".drawer-body")

function updateBulkButton() {
  const cases = drawerBody.querySelectorAll(".archive-check:checked")
  if (cases.length >= 3) {
    btnBulkRestore.disabled = false
  } else {
    btnBulkRestore.disabled = true
  }
}

//CLIC SUR DESARCHIVER (POUR un seul etudiant)
drawerBody.addEventListener("click", function(e) {
  const btn = e.target.closest(".btn-restore-item")
  if (!btn) return

  const item = btn.closest(".archive-item")
  pendingRestoreIds = [Number(item.dataset.id)]
  restoreModalText.innerHTML = "Voulez-vous vraiment désarchiver cet étudiant ?<br/>Il sera de nouveau visible dans la liste."
  openModal(modalRestore)
})

//CHANGEMENT D'UNE CASE A COCHER
drawerBody.addEventListener("change", function(e) {
  if (e.target.classList.contains("archive-check")) {
    updateBulkButton()
  }
})

//BOUTON "TOUT DESARCHIVER" (plusieurs etudiants)
btnBulkRestore.addEventListener("click", function() {
  const cases = drawerBody.querySelectorAll(".archive-check:checked")

  pendingRestoreIds = []
  for (let i = 0; i < cases.length; i++) {
    const item = cases[i].closest(".archive-item")
    pendingRestoreIds.push(Number(item.dataset.id))
  }

  restoreModalText.innerHTML = "Voulez-vous vraiment désarchiver <strong>" + pendingRestoreIds.length + " étudiants</strong> sélectionnés ?<br/>Ils seront de nouveau visibles dans la liste."
  openModal(modalRestore)
})

//ANNULER DESARCHIVAGE
btnCancelRestore.addEventListener("click", function() {
  closeModal(modalRestore)
})

//CONFIRMER DESARCHIVAGE
btnConfirmRestore.addEventListener("click", function() {
  for (let i = 0; i < pendingRestoreIds.length; i++) {
    restaurerInscription(pendingRestoreIds[i])
  }

  let message = "Étudiant désarchivé avec succès !"
  if (pendingRestoreIds.length > 1) {
    message = pendingRestoreIds.length + " étudiants désarchivés avec succès !"
  }

  closeModal(modalRestore)
  renderInscriptions(getActifs())
  openDrawer()
  showMessage(message)
})

//FILTRE PAR FORMATION
filterSelect.addEventListener("change", function() {
  renderInscriptions(filterByFormation(filterSelect.value))
})

//RECHERCHE
searchInput.addEventListener("input", function() {
  const query = searchInput.value.trim()
  if (query === "") {
    renderInscriptions(getActifs())
  } else {
    renderInscriptions(searchInscriptions(query))
  }
})
