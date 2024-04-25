function getServerData(req) {
  const protocol = req.protocol
  return `${protocol}://${req.get('host')}`
}

function getEndPointRoute(req, endpoint) {
  return getServerData(req) + endpoint
}

const EVENT_STATE_CHANGE = 'payment-status-updated'

async function emitStateChange(req, msg) {
  const io = req.app.get('io')
  io.emit(EVENT_STATE_CHANGE, msg)
} 

module.exports = { getServerData, getEndPointRoute, emitStateChange }