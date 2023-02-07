const isEntityFromRequestingUser = (
  entityOwnerUserId: number,
  requestingUserId?: number
) => {
  return requestingUserId === entityOwnerUserId
}

export { isEntityFromRequestingUser }
