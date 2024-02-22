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

function hasSameValue(reqData, tableSQL, exclude = []) {
  let requestData = { ...reqData }
  let modelSQL = { ...tableSQL.dataValues }
  // Remove las que vamos a excluir
  exclude.forEach(key => {
    delete requestData[key]
  })
  // Extraemos todas propiedades que compararemos
  const props = Object.keys(requestData)
  let equalProps = []
  props.forEach(prop=>{
    if(modelSQL[prop]){
      let propTableType = typeof tableSQL[prop]
      let propReqDataType = typeof reqData[prop]
      if(propTableType === propReqDataType) {
        if(tableSQL[prop] === reqData[prop]) {
          equalProps.push(prop)
        }
      }
    }
  })
  // Comparamos si ambos arreglos tienen la misma cantidad de elementos
  return props.length === equalProps.length
}


module.exports = { 
  wasReceivedAllProps, 
  hasEmptyFields,
  wasReceivedProps,
  hasSameValue
}
