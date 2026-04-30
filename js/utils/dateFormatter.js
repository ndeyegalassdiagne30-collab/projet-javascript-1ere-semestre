const mois = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Aoû","Sep","Oct","Nov","Déc"]

export function formatDate(isoString) {
  const date = new Date(isoString)
  return `${date.getDate()} ${mois[date.getMonth()]} ${date.getFullYear()}`
}
