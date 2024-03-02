function getErrorFormat(name, msg, location) {
  return {
    [name]: [{ msg, location, type: 'field', 'path': name }]
  } 
}

module.exports = { getErrorFormat }