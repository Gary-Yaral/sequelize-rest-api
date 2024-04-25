function getServerData(req) {
  const protocol = req.protocol
  return `${protocol}://${req.get('host')}`
}

function getEndPointRoute(req, endpoint) {
  return getServerData(req) + endpoint
}

async function emitStateChange(req, msg) {
  const io = req.app.get('io')
  io.emit('payment-status-updated', msg)
} 

module.exports = { getServerData, getEndPointRoute, emitStateChange }