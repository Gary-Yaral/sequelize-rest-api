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
  hasEmptyFields 
}
