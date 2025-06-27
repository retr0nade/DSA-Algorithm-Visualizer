// src/utils/sortingAlgorithms.js

/**
 * Generates animation steps for Bubble Sort.
 * @param {number[]} array - The array to be sorted.
 * @returns {Array<Object>} An array of animation steps.
 * Each step is an object, e.g.,
 * { type: 'compare', indices: [j, j + 1] }
 * { type: 'swap', indices: [j, j + 1], array: newArrayStateAfterSwap }
 * { type: 'sorted', index: i } // Marks element i as sorted
 */
export function getBubbleSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;

  const arr = [...array]; // Create a mutable copy
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      // Step 1: Highlight elements being compared
      animations.push({ type: 'compare', indices: [j, j + 1] });

      if (arr[j] > arr[j + 1]) {
        // Step 2: Highlight elements being swapped (can be same as compare or different color)
        // and then record the swap with the new array state.
        animations.push({ type: 'swap', indices: [j, j + 1] });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Perform swap
        swapped = true;
        // Store the current state of the array after swap
        animations.push({ type: 'update_array', array: [...arr] });
      }
      // Step 3: Revert comparison highlight (optional, or handled by next comparison)
      // animations.push({ type: 'uncompare', indices: [j, j + 1] }); // Could be implicit
    }
    // After each pass, the element at n - 1 - i is in its sorted position.
    animations.push({ type: 'sorted', index: n - 1 - i });
    if (!swapped) {
      // If no swaps occurred in a pass, the array is sorted.
      // Mark all remaining elements as sorted.
      for (let k = 0; k < n - 1 - i; k++) {
        animations.push({ type: 'sorted', index: k });
      }
      break;
    }
  }
  // Ensure the first element is marked as sorted if loop finishes early or for n=1 case.
  if (n > 0 && (animations.length === 0 || animations[animations.length-1].index !== 0) ) {
     // Check if the first element is already marked sorted by a full pass or early exit.
    let firstSorted = false;
    for(const anim of animations){
        if(anim.type === 'sorted' && anim.index === 0){
            firstSorted = true;
            break;
        }
    }
    if(!firstSorted) animations.push({ type: 'sorted', index: 0 });
  }


  return animations;
}

/**
 * Generates animation steps for Merge Sort.
 * @param {number[]} array - The array to be sorted.
 * @returns {Array<Object>} An array of animation steps.
 */
export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) {
    if (array.length === 1) animations.push({ type: 'sorted', index: 0 });
    return animations;
  }

  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);

  // After sorting, mark all elements as sorted one by one for final animation
  for (let i = 0; i < array.length; i++) {
    animations.push({ type: 'sorted', index: i });
  }
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;

  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx; // Pointer for mainArray
  let i = startIdx; // Pointer for left half (in auxiliaryArray)
  let j = middleIdx + 1; // Pointer for right half (in auxiliaryArray)

  while (i <= middleIdx && j <= endIdx) {
    // Highlight elements being compared from auxiliary array segments
    animations.push({ type: 'compare', indices: [i, j] });
    // animations.push({ type: 'uncompare', indices: [i, j] }); // Revert after comparison

    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // Overwrite value at k in mainArray with value from auxiliaryArray[i]
      animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[i] });
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      // Overwrite value at k in mainArray with value from auxiliaryArray[j]
      animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[j] });
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

  while (i <= middleIdx) {
    // Highlight remaining elements from left half
    animations.push({ type: 'compare', indices: [i, i] });
    // animations.push({ type: 'uncompare', indices: [i, i] });
    animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[i] });
    mainArray[k++] = auxiliaryArray[i++];
  }

  while (j <= endIdx) {
    // Highlight remaining elements from right half
    animations.push({ type: 'compare', indices: [j, j] });
    // animations.push({ type: 'uncompare', indices: [j, j] });
    animations.push({ type: 'overwrite', index: k, value: auxiliaryArray[j] });
    mainArray[k++] = auxiliaryArray[j++];
  }
}


/**
 * Generates animation steps for Quick Sort.
 * @param {number[]} array - The array to be sorted.
 * @returns {Array<Object>} An array of animation steps.
 */
export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) {
    if (array.length === 1) animations.push({ type: 'sorted', index: 0 });
    return animations;
  }
  const arr = [...array];
  quickSortHelper(arr, 0, arr.length - 1, animations);
  return animations;
}

function quickSortHelper(arr, low, high, animations) {
  if (low < high) {
    const partitionIndex = partition(arr, low, high, animations);
    // Mark pivot as sorted after partition
    animations.push({ type: 'sorted', index: partitionIndex });

    quickSortHelper(arr, low, partitionIndex - 1, animations);
    quickSortHelper(arr, partitionIndex + 1, high, animations);
  } else if (low === high) {
    // Single element partition is sorted
    animations.push({ type: 'sorted', index: low });
  }
}

function partition(arr, low, high, animations) {
  const pivotValue = arr[high];
  animations.push({ type: 'pivot_on', index: high }); // Highlight pivot
  let i = low - 1; // Index of smaller element

  for (let j = low; j < high; j++) {
    animations.push({ type: 'compare', indices: [j, high] }); // Compare with pivot

    if (arr[j] < pivotValue) {
      i++;
      if (i !== j) { // Only swap if i and j are different
        animations.push({ type: 'swap', indices: [i, j] });
        [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
        animations.push({ type: 'update_array', array: [...arr] });
      }
    }
    // animations.push({ type: 'uncompare', indices: [j, high] }); // Optional: unhighlight after comparison
  }

  // Swap pivot to its correct position
  if (i + 1 !== high) { // Only swap if pivot is not already in place
      animations.push({ type: 'swap', indices: [i + 1, high] });
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      animations.push({ type: 'update_array', array: [...arr] });
  }

  animations.push({ type: 'pivot_off', index: i + 1 }); // Unhighlight pivot (now at i+1)
  return i + 1; // Return partition index
}
