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


module.exports = { 
  wasReceivedAllProps, 
  hasEmptyFields,
  wasReceivedProps
}
