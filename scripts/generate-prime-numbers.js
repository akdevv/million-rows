/**
 * Prime Number Theorm: how many prime numbers exists below a given number
 * π(N) ≈ N / ln(N)
 *
 * π(N) = 1,000,000
 * N / ln(N) = 1,000,000
 * (now solve for N, by approximating)
 *
 * we get, N = 16.7 million
 *
 */

import fs from "fs";
import path from "path";

const N = 16_700_000;

function sieveOfEratosthenes(limit) {
	// Create array of true values, index represents the number
	const isPrime = new Array(limit + 1).fill(true);
	isPrime[0] = isPrime[1] = false; // 0 and 1 are not prime numbers

	for (let i = 2; i * i <= limit; i++) {
		if (isPrime[i]) {
			// Mark all multiples of i as not prime
			for (let j = i * i; j <= limit; j += i) {
				isPrime[j] = false;
			}
		}
	}

	// Collect all prime numbers
	const primes = [];
	for (let i = 2; i <= limit; i++) {
		if (isPrime[i]) {
			primes.push(i);
		}
	}

	return primes;
}

function savePrimesToCSV(primes, filename) {
	let csvContent = "index,prime\n";

	for (let i = 0; i < primes.length; i++) {
		csvContent += `${i + 1},${primes[i]}\n`;
	}

	fs.writeFileSync(filename, csvContent, "utf8");
}

function main() {
	const primes = sieveOfEratosthenes(N);

	const filename = `primes_up_to_${N}.csv`;
	const dataDir = path.join(__dirname, "data");
	const filepath = path.join(dataDir, filename);

	// Create data directory if it doesn't exist
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}

	savePrimesToCSV(primes, filepath);

	console.log(`CSV file '${filepath}' created successfully!`);
}

main();
