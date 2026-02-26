const inFlight = new Map(); // userId -> boolean

export function acquireLock(userId) {
  if (inFlight.get(userId)) return false; // already running
  inFlight.set(userId, true);
  return true;
}

export function releaseLock(userId) {
  inFlight.delete(userId);
}
