/**
 * Creates a promise that resolves after a specified number of milliseconds.
 * This is used to control the speed of animations in the sorting algorithms.
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the delay.
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export default sleep;
