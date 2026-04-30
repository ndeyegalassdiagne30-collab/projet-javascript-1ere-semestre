import { getActifs, getArchives } from "../sercices/service.js"

export function renderStats() {
  const total    = getActifs().length
  const archives = getArchives().length

  return { total, archives }
}
