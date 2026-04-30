import { getInscription, saveInscriptions } from "../store/store.js"

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^((\+221|00221)?(70|71|75|76|77|78)\d{7}|(\+220|00220)?[235679]\d{6})$/

// verifie que l'email n'existe pas deja dans les donnees
export function isEmailUnique(email, excludeId) {
  const inscriptions = getInscription()
  for (let i = 0; i < inscriptions.length; i++) {
    if (inscriptions[i].email === email && inscriptions[i].id !== excludeId) {
      return false
    }
  }
  return true
}

// verifie que le telephone n'existe pas deja dans les donnees
export function isPhoneUnique(telephone, excludeId) {
  const inscriptions = getInscription()
  for (let i = 0; i < inscriptions.length; i++) {
    if (inscriptions[i].telephone === telephone && inscriptions[i].id !== excludeId) {
      return false
    }
  }
  return true
}

// valide les champs du formulaire et retourne { valid, errors }
// errors est un objet { nom, prenom, adresse, email, telephone, formation }
export function validateForm(data, excludeId) {
  const errors = {}

  if (!data.nom)errors.nom = "Le nom est requis"
  if (!data.prenom)errors.prenom = "Le prénom est requis"
  if (!data.adresse)errors.adresse = "L'adresse est requise"
  if (!data.formation)errors.formation = "Veuillez choisir une formation"

  if (!data.email) {
    errors.email = "L'email est requis"
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Adresse email invalide"
  } else if (!isEmailUnique(data.email, excludeId)) {
    errors.email = "Cet email est déjà utilisé"
  }

  if (!data.telephone) {
    errors.telephone = "Le téléphone est requis"
  } else if (!PHONE_REGEX.test(data.telephone)) {
    errors.telephone = "Numéro invalide (Sénégal: 77XXXXXXX · Gambie: 7XXXXXX)"
  } else if (!isPhoneUnique(data.telephone, excludeId)) {
    errors.telephone = "Ce numéro est déjà utilisé"
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

// ajoute une nouvelle inscription dans le localStorage
export function addInscription(data) {
  const inscriptions = getInscription()

  const nouvelle = {
    id:Date.now(),
    nom:data.nom,
    prenom:data.prenom,
    adresse:data.adresse,
    email:data.email,
    telephone:data.telephone,
    formation:data.formation,
    dateInscription: new Date().toISOString(),
    actif: true
  }

  inscriptions.push(nouvelle)
  saveInscriptions(inscriptions)
  return nouvelle
}

// modifie une inscription existante par son id
export function updateInscription(id, data) {
  const inscriptions = getInscription()

  for (let i = 0; i < inscriptions.length; i++) {
    if (inscriptions[i].id === id) {
      inscriptions[i].nom = data.nom
      inscriptions[i].prenom = data.prenom
      inscriptions[i].adresse = data.adresse
      inscriptions[i].email = data.email
      inscriptions[i].telephone = data.telephone
      inscriptions[i].formation = data.formation
      break
    }
  }

  saveInscriptions(inscriptions)
}

// passe l'etudiant en archive (actif = false)
export function archiverInscription(id) {
  const inscriptions = getInscription()

  for (let i = 0; i < inscriptions.length; i++) {
    if (inscriptions[i].id === id) {
      inscriptions[i].actif = false
      break
    }
  }

  saveInscriptions(inscriptions)
}

// remet l'etudiant dans la liste (actif = true)
export function restaurerInscription(id) {
  const inscriptions = getInscription()

  for (let i = 0; i < inscriptions.length; i++) {
    if (inscriptions[i].id === id) {
      inscriptions[i].actif = true
      break
    }
  }

  saveInscriptions(inscriptions)
}

// retourne uniquement les etudiants actifs
export function getActifs() {
  const inscriptions = getInscription()
  const actifs = []

  for (let i = 0; i < inscriptions.length; i++) {
    if (inscriptions[i].actif === true) {
      actifs.push(inscriptions[i])
    }
  }

  return actifs
}

// retourne uniquement les etudiants archives
export function getArchives() {
  const inscriptions = getInscription()
  const archives = []

  for (let i = 0; i < inscriptions.length; i++) {
    if (inscriptions[i].actif === false) {
      archives.push(inscriptions[i])
    }
  }

  return archives
}

// filtre les actifs par formation
export function filterByFormation(formation) {
  const actifs = getActifs()

  if (!formation) {
    return actifs
  }

  const resultat = []
  for (let i = 0; i < actifs.length; i++) {
    if (actifs[i].formation === formation) {
      resultat.push(actifs[i])
    }
  }

  return resultat
}

// recherche dans nom, prenom et email
export function searchInscriptions(query) {
  const actifs = getActifs()
  const q = query.toLowerCase()
  const resultat = []

  for (let i = 0; i < actifs.length; i++) {
    const nom = actifs[i].nom.toLowerCase()
    const prenom = actifs[i].prenom.toLowerCase()
    const email = actifs[i].email.toLowerCase()

    if (nom.includes(q) || prenom.includes(q) || email.includes(q)) {
      resultat.push(actifs[i])
    }
  }
  return resultat
}

