// affiche une notification en bas a droite de l'ecran
// type peut etre "success" (vert) ou "error" (rouge)
export function showMessage(texte, type) {
  if (!type) {
    type = "success"
  }

  // si un toast existe deja on le supprime avant d'en creer un nouveau
  const existing = document.querySelector(".toast")
  if (existing) {
    existing.remove()
  }

  const toast = document.createElement("div")
  toast.className = "toast toast-" + type
  toast.textContent = texte
  document.body.appendChild(toast)

  // on supprime le toast apres 3 secondes
  setTimeout(function() {
    toast.remove()
  }, 3000)
}
