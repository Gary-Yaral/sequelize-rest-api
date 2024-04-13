const ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  USER: 3,
}
const PACKAGE_TYPES = {
  ADMIN: 1,
  USER: 2,
}

const USER_STATUS = {
  ACTIVO: 1,
  BLOQUEADO: 2
}

const RESERVATION_STATUS = {
  EN_ESPERA: 1,
  APROBADA: 2,
  RECHAZADA: 3
}

const RESERVATION_TIME_TYPE = {
  PER_HOURS: 1,
  PER_DAY: 2
}

const ALL_DAY_TIMES = {
  INITIAL: '00:00:00',
  FINAL: '23:30:00'
}

const ERROR_PARENT_CODE = 1451

module.exports = {
  ROLES,
  USER_STATUS,
  PACKAGE_TYPES,
  RESERVATION_STATUS,
  RESERVATION_TIME_TYPE,
  ALL_DAY_TIMES,
  ERROR_PARENT_CODE
}
