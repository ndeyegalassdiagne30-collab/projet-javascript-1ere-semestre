import { drawer, drawerOverlay, editNom, editPrenom, editAdresse, editEmail, editTelephone, editFormation } from "../DOM/element.js"
import { getArchives } from "../sercices/service.js"
import { formatDate } from "../utils/dateFormatter.js"

export function openModal(modal) {
  modal.classList.add("active")
}

export function closeModal(modal) {
  modal.classList.remove("active")
}

export function openDrawer() {
  drawer.classList.add("open")
  drawerOverlay.classList.add("active")
  renderArchives()
}

export function closeDrawer() {
  drawer.classList.remove("open")
  drawerOverlay.classList.remove("active")
}

export function fillEditForm(inscription) {
  editNom.value = inscription.nom
  editPrenom.value = inscription.prenom
  editAdresse.value = inscription.adresse
  editEmail.value = inscription.email
  editTelephone.value = inscription.telephone
  editFormation.value = inscription.formation
}

function renderArchives() {
  const drawerBody = document.querySelector(".drawer-body")
  const archives = getArchives()

  drawerBody.innerHTML = ""

  if (archives.length === 0) {
    drawerBody.innerHTML = "<p style='text-align:center;color:gray;margin-top:20px'>Aucun étudiant archivé</p>"
    return
  }

  archives.forEach(a => {
    const div = document.createElement("div")
    div.className  = "archive-item"
    div.dataset.id = a.id
    div.innerHTML  = `
      <input type="checkbox" class="archive-check" />
      <div class="archive-info">
        <span class="archive-name">${a.prenom} ${a.nom}</span>
        <span class="archive-meta">${a.formation} · ${formatDate(a.dateInscription)}</span>
      </div>
      <button class="btn-restore-item">
        <i class="fas fa-rotate-left"></i> Désarchiver
      </button>
    `
    drawerBody.appendChild(div)
  })
}
