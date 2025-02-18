import axios from "axios";
const BASE_NVD_API = "https://services.nvd.nist.gov/rest/json/cves/2.0"; // Your URL
const RESULTS_PER_PAGE = 1000;

const testAxios = async () => {
  try {
    const response = await axios.get(
      `${BASE_NVD_API}?resultsPerPage=${RESULTS_PER_PAGE}`,
      { timeout: 10000 }
    );
    console.log("CVE Data Fetched:", response.data);
  } catch (error) {
    console.error("Error fetching CVE data:", error);
  }
};

testAxios();
