/** @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API|MDN} */
let vibrateInterval;

// Starts vibration at passed in level
function startVibrate(duration) {
  window.navigator.vibrate(duration);
}

// Stops vibration
function stopVibrate() {
  // Clear interval and stop persistent vibrating
  if (vibrateInterval) clearInterval(vibrateInterval);
  window.navigator.vibrate(0);
}

// Start persistent vibration at given duration and interval
// Assumes a number value is given
function startPersistentVibrate(duration, interval) {
  vibrateInterval = setInterval(() => {
    startVibrate(duration);
  }, interval);
}

