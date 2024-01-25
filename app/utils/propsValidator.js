function wasReceivedAllProps(req, expectedProps) {
  const props = Object.keys(req.body)
  if (props.length != expectedProps.length) {
    return false
  }
  let counter = 0
  for (let i = 0; i < expectedProps.length; i++) {
    if (!props.includes(expectedProps[i])) {
      counter = counter - 1
      break
    } else {
      counter++
    }
  }
  return counter === expectedProps.length
}

module.exports = { wasReceivedAllProps }
