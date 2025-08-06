import fs from "fs";
import path from "path";
import { THREAT_TYPES, SEVERITY_LEVELS, COUNTRIES } from "./constants.js";

const TOTAL_ROWS = 1_000_000;

function generateReportId() {
	return Math.floor(100000000 + Math.random() * 900000000).toString();
}

function generateRandomTimestamp() {
	const startDate = new Date("2010-01-01T00:00:00Z");
	const endDate = new Date("2025-05-31T23:59:59Z");
	const randomTime =
		startDate.getTime() +
		Math.random() * (endDate.getTime() - startDate.getTime());
	return new Date(randomTime).toISOString();
}

function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function generateCyberThreat() {
	const records = [];
	const usedIds = new Set();

	for (let i = 0; i < TOTAL_ROWS; i++) {
		// generate a unique reportId
		let reportId;
		do {
			reportId = generateReportId();
		} while (usedIds.has(reportId));
		usedIds.add(reportId);

		const record = {
			reportId: `THREAT-${reportId}`,
			threat_type: getRandomElement(THREAT_TYPES),
			severity: getRandomElement(SEVERITY_LEVELS),
			origin_country: getRandomElement(COUNTRIES),
			timestamp: generateRandomTimestamp(),
		};

		records.push(record);
	}

	return records;
}

function saveToCSV(records, filename) {
	let csvContent =
		"report_id,threat_type,severity,origin_country,timestamp\n";

	for (let i = 0; i < records.length; i++) {
		const record = records[i];
		csvContent += `${record.reportId},"${record.threat_type}",${record.severity},"${record.origin_country}",${record.timestamp}\n`;

		// Progress indicator for CSV conversion
		if ((i + 1) % 5000 === 0) {
			console.log(`Saved ${i + 1} records to CSV...`);
		}
	}
	fs.writeFileSync(filename, csvContent, "utf8");
}

function main() {
	const records = generateCyberThreat();

	const filename = "cyber-threat-reports.csv";
	const dataDir = path.join(__dirname, "data");
	const filepath = path.join(dataDir, filename);

	// Create data directory if it doesn't exist
	if (!fs.existsSync(dataDir)) {
		fs.mkdirSync(dataDir, { recursive: true });
	}

	saveToCSV(records, filepath);
}

main();
