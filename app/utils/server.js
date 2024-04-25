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

const VOUCHER_WAS_CHANGED = 'voucher-was-changed'
async function emitVoucherChange(req, msg) {
  const io = req.app.get('io')
  io.emit(VOUCHER_WAS_CHANGED, msg)
} 

module.exports = { getServerData, getEndPointRoute, emitStateChange, emitVoucherChange}