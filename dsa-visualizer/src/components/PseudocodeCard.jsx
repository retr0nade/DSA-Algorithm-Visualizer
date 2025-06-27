import React from 'react';

const ALGORITHM_DETAILS = {
  bubbleSort: {
    name: 'Bubble Sort',
    pseudocode: [
      "procedure bubbleSort(A : list of sortable items)",
      "  n = length(A)",
      "  repeat",
      "    swapped = false",
      "    for i = 1 to n-1 inclusive do",
      "      if A[i-1] > A[i] then",
      "        swap(A[i-1], A[i])",
      "        swapped = true",
      "      end if",
      "    end for",
      "    n = n - 1",
      "  until not swapped",
      "end procedure",
    ],
    timeComplexity: "O(n^2) average and worst case, O(n) best case",
    spaceComplexity: "O(1)",
  },
  mergeSort: {
    name: 'Merge Sort',
    pseudocode: [
      "procedure mergeSort(A, p, r)",
      "  if p < r then",
      "    q = floor((p + r) / 2)",
      "    mergeSort(A, p, q)",
      "    mergeSort(A, q + 1, r)",
      "    merge(A, p, q, r)",
      "  end if",
      "end procedure",
      "",
      "procedure merge(A, p, q, r)",
      "  n1 = q - p + 1",
      "  n2 = r - q",
      "  let L[1..n1+1] and R[1..n2+1] be new arrays",
      "  for i = 1 to n1 do L[i] = A[p + i - 1]",
      "  for j = 1 to n2 do R[j] = A[q + j]",
      "  L[n1 + 1] = ∞",
      "  R[n2 + 1] = ∞",
      "  i = 1",
      "  j = 1",
      "  for k = p to r do",
      "    if L[i] ≤ R[j] then",
      "      A[k] = L[i]",
      "      i = i + 1",
      "    else",
      "      A[k] = R[j]",
      "      j = j + 1",
      "    end if",
      "  end for",
      "end procedure",
    ],
    timeComplexity: "O(n log n) best, average, and worst case",
    spaceComplexity: "O(n) or O(log n) depending on implementation", // O(n) for typical auxiliary array, O(log n) for recursive stack space if in-place variant (more complex)
  },
  quickSort: {
    name: 'Quick Sort',
    pseudocode: [
      "procedure quickSort(A, low, high)",
      "  if low < high then",
      "    pivot_index = partition(A, low, high)",
      "    quickSort(A, low, pivot_index - 1)",
      "    quickSort(A, pivot_index + 1, high)",
      "  end if",
      "end procedure",
      "",
      "procedure partition(A, low, high)",
      "  pivot = A[high]",
      "  i = low - 1",
      "  for j = low to high - 1 do",
      "    if A[j] < pivot then",
      "      i = i + 1",
      "      swap(A[i], A[j])",
      "    end if",
      "  end for",
      "  swap(A[i+1], A[high])",
      "  return i + 1",
      "end procedure",
    ],
    timeComplexity: "O(n log n) average and best case, O(n^2) worst case",
    spaceComplexity: "O(log n) average (due to recursion stack)",
  },
};

const PseudocodeCard = ({ currentAlgorithm, currentStepHighlight }) => {
  const details = ALGORITHM_DETAILS[currentAlgorithm];

  if (!details) {
    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl h-full">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Algorithm Details</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Select an algorithm to see details.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100 sticky top-0 bg-white dark:bg-gray-800 py-2">
        {details.name}
      </h3>
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
        <h4 className="text-md font-medium mt-2 mb-1 text-gray-700 dark:text-gray-200">Pseudocode:</h4>
        <pre className="text-xs sm:text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md overflow-x-auto custom-scrollbar">
          <code>
            {details.pseudocode.map((line, index) => (
              <div
                key={index}
                className={`whitespace-pre-wrap ${currentStepHighlight === index ? 'bg-blue-200 dark:bg-blue-700 rounded' : ''}`}
              >
                {line || '\u00A0'} {/* Render non-breaking space for empty lines to maintain height */}
              </div>
            ))}
          </code>
        </pre>
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-medium mb-1 text-gray-700 dark:text-gray-200">Time Complexity:</h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{details.timeComplexity}</p>
        </div>
        <div className="mt-3">
          <h4 className="text-md font-medium mb-1 text-gray-700 dark:text-gray-200">Space Complexity:</h4>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{details.spaceComplexity}</p>
        </div>
      </div>
    </div>
  );
};

export default PseudocodeCard;
