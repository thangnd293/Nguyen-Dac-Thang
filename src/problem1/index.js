// 1. Using a loop
// Time complexity: O(n)

var sum_to_n_a = function (n) {
  let sum = 0;

  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  return sum;
};

// If we prefer time over space, we can use a cache to store the sum of the first n natural numbers
// and return the value from the cache if it exists
var sum_to_n_a_with_cache = (function () {
  let cache = {};

  return function (n) {
    if (cache[n]) return cache[n];

    let sum = 0;

    for (let i = 1; i <= n; i++) {
      sum += i;
    }

    cache[n] = sum;

    return sum;
  };
})();

// 2. Using recursion
// Time complexity: O(n)
// If n is very large, this solution can cause a stack overflow
var sum_to_n_b = function (n) {
  if (n === 1) return 1;

  return n + sum_to_n_b(n - 1);
};

// We can use a cache to store the sum of the first n natural numbers
var sum_to_n_b_with_cache = (function () {
  let cache = {};

  return function sum_to_n_b(n) {
    if (cache[n]) return cache[n];

    if (n === 1) return 1;

    let sum = n + sum_to_n_b(n - 1);

    cache[n] = sum;

    return sum;
  };
})();

// 3. Using the formula for the sum of the first n natural numbers
// sum = n * (n + 1) / 2
// Time complexity: O(1)
// This is the most efficient solution
var sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2;
};

// Test
const button = document.querySelector("button");

button.addEventListener("click", () => {
  const n = 1000;
  console.time("a");
  console.log(sum_to_n_a(n));
  console.timeEnd("a");

  console.time("a with cache");
  console.log(sum_to_n_a_with_cache(n));
  console.timeEnd("a with cache");

  console.time("b");
  console.log(sum_to_n_b(n));
  console.timeEnd("b");

  console.time("b with cache");
  console.log(sum_to_n_b_with_cache(n));
  console.timeEnd("b with cache");

  console.time("c");
  console.log(sum_to_n_c(n));
  console.timeEnd("c");
});
