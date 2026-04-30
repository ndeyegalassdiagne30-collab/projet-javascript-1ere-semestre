import { tableBody } from "../DOM/element.js"
import { formatDate } from "../utils/dateFormatter.js"

export function renderInscriptions(inscriptions) {
  tableBody.innerHTML = ""

  if (inscriptions.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:30px; color:gray;">
          Aucune inscription trouvée
        </td>
      </tr>
    `
    return
  }

  for (let i = 0; i < inscriptions.length; i++) {
    const inscription = inscriptions[i]
    const tr = document.createElement("tr")
    tr.dataset.id = inscription.id
    tr.innerHTML = `
      <td>${inscription.prenom}</td>
      <td>${inscription.nom}</td>
      <td>${inscription.adresse}</td>
      <td>${inscription.email}</td>
      <td>${inscription.telephone}</td>
      <td>${inscription.formation}</td>
      <td>${formatDate(inscription.dateInscription)}</td>
      <td class="actions-cell">
        <button class="btn-icon btn-edit"><i class="fas fa-pen"></i></button>
        <button class="btn-icon btn-delete"><i class="fas fa-trash"></i></button>
      </td>
    `
    tableBody.appendChild(tr)
  }
}
