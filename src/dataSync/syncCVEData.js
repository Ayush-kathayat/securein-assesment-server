import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron"; // Import node-cron
import connectDB from "../config/databaseConnection.js";
import CVE from "../models/cveModel.js";
import axiosRetry from "axios-retry";
dotenv.config();

const BASE_NVD_API = process.env.NVD_API_URL;
const RESULTS_PER_PAGE = 1000;

// Configure axios retry
axiosRetry(axios, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) =>
    axiosRetry.isNetworkOrIdempotentRequestError(error) ||
    error.code === "ECONNABORTED",
});

// Fetch and Store CVEs
const syncCVEData = async () => {
  try {
    console.log("Fetching CVE data from NVD...");

    console.log(
      `Making request to: ${BASE_NVD_API}?resultsPerPage=${RESULTS_PER_PAGE}`
    );

    // Request data from NVD API
    const response = await axios.get(
      `${BASE_NVD_API}?resultsPerPage=${RESULTS_PER_PAGE}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "axios/1.7.9",
        },
        timeout: 60000,
      }
    );
    const vulnerabilities = response.data.vulnerabilities || [];

    console.log(`Fetched ${vulnerabilities.length} CVEs. Processing...`);

    for (const item of vulnerabilities) {
      const cveData = item.cve;

      // Check if the CVE already exists
      const existingCVE = await CVE.findOne({ "cve.id": cveData.id });
      if (existingCVE) {
        console.log(`CVE ${cveData.id} already exists. Skipping...`);
        continue;
      }

      // Create a new CVE document
      const newCVE = new CVE({
        cve: {
          id: cveData.id,
          sourceIdentifier: cveData.sourceIdentifier,
          published: cveData.published,
          lastModified: cveData.lastModified,
          vulnStatus: cveData.vulnStatus,
          cveTags: cveData.cveTags,
          descriptions: cveData.descriptions,
          metrics: cveData.metrics,
          weaknesses: cveData.weaknesses,
          configurations: cveData.configurations,
          references: cveData.references,
        },
      });

      await newCVE.save();
      console.log(`CVE ${cveData.id} saved to database.`);
    }

    console.log("CVE data synchronization completed.");
  } catch (error) {
    console.error("Error while syncing CVE data:", error.message);
    console.error("Detailed Error:", error);
  }
};

// Start Sync Process
const startSync = async () => {
  await connectDB();
  await syncCVEData();
};

// Schedule Cron Job
cron.schedule("0 0 * * *", async () => {
  console.log("Cron Job: Starting CVE Data Sync...");
  await startSync();
  console.log("Cron Job: CVE Data Sync Completed.");
});

// Initial Run
startSync();
