import fs from "fs";
import path from "path";
import { sciFiPrefixes, sciFiSuffixes } from "./constants.js";

const TOTAL_ROWS = 1_000_000;
const BATCH_SIZE = 5000;

// Sci-fi planet name components for variety
let nasaPlanets = [];

function parseCSV(csvText) {
	const lines = csvText.trim().split("\n");
	const headers = lines[0].split(",").map((h) => h.trim());
	const data = [];

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(",");
		const row = {};
		headers.forEach((header, index) => {
			let value = values[index] ? values[index].trim() : null;
			// Clean up planet names - remove extra quotes and escapes
			if (header === "pl_name" && value) {
				value = value
					.replace(/^"/, "")
					.replace(/"$/, "")
					.replace(/\\/g, "");
			}
			row[header] = value === "" || value === "null" ? null : value;
		});
		if (row.pl_name) data.push(row);
	}
	return data;
}

function generateSciFiName() {
	const prefix =
		sciFiPrefixes[Math.floor(Math.random() * sciFiPrefixes.length)];
	const suffix =
		sciFiSuffixes[Math.floor(Math.random() * sciFiSuffixes.length)];
	const number = Math.floor(Math.random() * 9999) + 1;

	const formats = [
		`${prefix}-${number}`,
		`${prefix} ${suffix}`,
		`${prefix}-${number} ${suffix}`,
	];

	return formats[Math.floor(Math.random() * formats.length)];
}

// Get planet name (mix of real NASA names and generated sci-fi names)
function getPlanetName() {
	if (Math.random() < 0.7 && nasaPlanets.length > 0) {
		const randomPlanet =
			nasaPlanets[Math.floor(Math.random() * nasaPlanets.length)];
		return randomPlanet.pl_name;
	}
	return generateSciFiName();
}

// Generate surface temperature using NASA data when available, otherwise realistic ranges
function generateSurfaceTemp() {
	if (Math.random() < 0.3 && nasaPlanets.length > 0) {
		const randomPlanet =
			nasaPlanets[Math.floor(Math.random() * nasaPlanets.length)];
		if (randomPlanet.pl_eqt && !isNaN(parseFloat(randomPlanet.pl_eqt))) {
			const temp = parseFloat(randomPlanet.pl_eqt);
			// Add some variation to the real temperature
			return Math.max(
				100,
				Math.min(1500, temp + (Math.random() - 0.5) * 100)
			);
		}
	}

	const tempType = Math.random();
	if (tempType < 0.4) {
		return Math.floor(Math.random() * 200) + 100; // Cold: 100-300K
	} else if (tempType < 0.7) {
		return Math.floor(Math.random() * 200) + 250; // Temperate: 250-450K
	} else if (tempType < 0.9) {
		return Math.floor(Math.random() * 400) + 400; // Hot: 400-800K
	} else {
		return Math.floor(Math.random() * 700) + 800; // Very hot: 800-1500K
	}
}

// Generate life signs based on temperature (habitable zone ~250-350K)
function generateLifeSigns(temperature) {
	let noneProb = 0.95;
	let microbialProb = 0.04;
	let intelligentProb = 0.01;

	// Adjust probabilities based on habitable temperature range
	if (temperature >= 250 && temperature <= 350) {
		noneProb = 0.85;
		microbialProb = 0.12;
		intelligentProb = 0.03;
	} else if (temperature >= 200 && temperature <= 400) {
		noneProb = 0.92;
		microbialProb = 0.07;
		intelligentProb = 0.01;
	} else if (temperature < 150 || temperature > 600) {
		noneProb = 0.98;
		microbialProb = 0.015;
		intelligentProb = 0.005;
	}

	const random = Math.random();
	if (random < intelligentProb) return "Intelligent";
	if (random < intelligentProb + microbialProb) return "Microbial";
	return "None";
}

function generateScanId(index) {
	return `SCAN-${String(index).padStart(7, "0")}`;
}

function saveToCSV(batch, filepath, isFirstBatch) {
	let csvContent = "";

	if (isFirstBatch) {
		csvContent += "scan_id,planet_name,surface_temp_K,life_signs\n";
	}

	for (let i = 0; i < batch.length; i++) {
		const row = batch[i];
		csvContent += `${row.scan_id},${row.planet_name},${row.surface_temp_K},${row.life_signs}\n`;
	}

	if (isFirstBatch) {
		fs.writeFileSync(filepath, csvContent, "utf8");
	} else {
		fs.appendFileSync(filepath, csvContent, "utf8");
	}
}

function main() {
	const csvData = fs.readFileSync("data/nasa_exoplanet_cleaned.csv", {
		encoding: "utf8",
	});
	nasaPlanets = parseCSV(csvData);

	const filename = "planetary_scan_logs.csv";
	const dataDir = path.join(__dirname, "data");
	const filepath = path.join(dataDir, filename);

	// Create data directory if it doesn't exist
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}

	let batch = [];
	let isFirstBatch = true;

	for (let i = 1; i <= TOTAL_ROWS; i++) {
		const temperature = generateSurfaceTemp();

		batch.push({
			scan_id: generateScanId(i),
			planet_name: getPlanetName(),
			surface_temp_K: Math.round(temperature),
			life_signs: generateLifeSigns(temperature),
		});

		// Save every 5000 records or when finished
		if (batch.length === BATCH_SIZE || i === TOTAL_ROWS) {
			saveToCSV(batch, filepath, isFirstBatch);
			console.log(`Generated and saved ${i} records`);
			batch = [];
			isFirstBatch = false;
		}
	}

	console.log(
		`File creation complete: ${TOTAL_ROWS} records saved to ${filepath}`
	);
}

main();
