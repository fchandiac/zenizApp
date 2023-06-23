
function solution(numbers, Y) {
  const frequency = {}

  for (const num of numbers) {
    frequency[num] = (frequency[num] || 0) + 1
  }

  const sortedFrequency = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);


  return sortedFrequency.sort((a, b) => b - a)
}

console.log(solution([2, 3, 3, 3, 1, 1], 2))

