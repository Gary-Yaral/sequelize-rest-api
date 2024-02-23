function wasReceivedAllProps(req, expectedProps) {
  const props = Object.keys(req.body)
  if (props.length != expectedProps.length) {
    return false
  }
  let counter = 0
  for (let i = 0; i < expectedProps.length; i++) {
    if (!props.includes(expectedProps[i])) {
      counter--
      break
    } else {
      counter++
    }
  }
  return counter === expectedProps.length
}

function wasReceivedProps(req, expectedProps, noRequired = 'image') {
  const copy = {...req.body }
  delete copy[noRequired]
  let required = [...expectedProps]
  required = required.filter((prop) => prop !== noRequired)
  const props = Object.keys(copy)
  if (props.length != required.length) {
    return false
  }

  let counter = 0
  for (let i = 0; i < required.length; i++) {
    if (!props.includes(expectedProps[i])) {
      counter--
      break
    } else {
      counter++
    }
  }
  return counter === required.length
}

function hasEmptyFields(req) {
  const props = Object.keys(req.body)
  let counter = 0
  for (let i = 0; i < props.length; i++) {
    if ((req.body[props[i]] === '')) {
      counter++
    }
  }
  return counter
}

function areEquals(newData, currentData) {
  // Extraemos todas propiedades que compararemos
  const newProps = Object.keys(newData)
  const currentProps = Object.keys(newData)
  if(newProps.length !== currentProps.length) {
    return false
  }

  let equalProps = []
  newProps.forEach( prop =>{
    if(currentData[prop]){
      // Verificamos que sean del mismo tipo
      if(currentData[prop] === newData[prop]) {
        equalProps.push(prop)
      }
    }
  })
  // Comparamos si ambos arreglos tienen la misma cantidad de elementos
  return newProps.length === equalProps.length
}

function removeEmpty(object) {
  // Eliminamos los campos que vengan vacios
  const attrs = Object.keys(object)
  attrs.forEach(prop => {
    if(object[prop] === '') { delete object[prop] }
  })
}

// Extrae solo las propiedades de un modelo en una consulta tipo raw
function getPropsOfQuery(modelName, object) {
  const keys = Object.keys(object)
  let newObject = {}
  keys.map((key)=> {
    if(key.includes(`${modelName}.`)) {
      let prop = key.split('.')[1]
      newObject[prop] = object[key]
    }
  })
  delete newObject.id
  return newObject
}

function extractProperties(object, props) {
  let obj = {}
  props.forEach(prop => {
    if(object[prop]) {
      obj[prop] = object[prop]
    }
  })
  return obj
}

function extractPropsAndRename(object, props, names) {
  let obj = {}
  props.forEach((prop, i) => {
    if(object[prop]) {
      obj[names[i]] = object[prop]
    }
  })
  return obj
}


module.exports = { 
  wasReceivedAllProps, 
  hasEmptyFields,
  wasReceivedProps,
  areEquals,
  getPropsOfQuery,
  removeEmpty,
  extractProperties,
  extractPropsAndRename
}
