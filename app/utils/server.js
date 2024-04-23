function getServerData(req) {
  const protocol = req.protocol
  return `${protocol}://${req.get('host')}`
}

function getEndPointRoute(req, endpoint) {
  return getServerData(req) + endpoint
}

module.exports = { getServerData, getEndPointRoute }