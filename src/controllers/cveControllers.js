import CVE from "../models/cveModel.js";

// Get all CVEs with pagination
export const getAllCVEs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * parseInt(limit);

  try {
    const totalRecords = await CVE.countDocuments();
    const cves = await CVE.find().skip(skip).limit(parseInt(limit));
    res.json({ totalRecords, cves });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get CVE by ID
export const getCVEById = async (req, res) => {
  try {
    const cve = await CVE.findOne({ "cve.id": req.params.id });
    if (!cve) return res.status(404).json({ message: "CVE not found" });
    res.json(cve);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter CVEs by year
export const getCVEByYear = async (req, res) => {
  const { year } = req.params;
  const { pubStartDate, pubEndDate } = req.query;

  try {
    // Validate year format
    if (!/^\d{4}$/.test(year)) {
      return res.status(400).json({ error: "Invalid year format." });
    }

    // If pubStartDate and pubEndDate are provided, they should be required
    if (pubStartDate || pubEndDate) {
      if (!pubStartDate || !pubEndDate) {
        return res.status(400).json({
          error:
            "Both pubStartDate and pubEndDate are required if one is provided.",
        });
      }

      // Parse the pubStartDate and pubEndDate into Date objects
      const startDate = new Date(pubStartDate);
      const endDate = new Date(pubEndDate);

      // Validate the date objects
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({
          error: "Invalid date format. Use extended ISO-8601 format.",
        });
      }

      // Ensure the date range is not greater than 120 days
      const timeDifference = (endDate - startDate) / (1000 * 3600 * 24); // in days
      if (timeDifference > 120) {
        return res.status(400).json({
          error: "The maximum allowable date range is 120 days.",
        });
      }

      // Query MongoDB to find CVEs published within the specified date range
      const cves = await CVE.find({
        "cve.published": { $gte: startDate, $lte: endDate },
      });

      return res.json(cves);
    }

    // If no pubStartDate and pubEndDate, filter by year
    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    // Query MongoDB to find CVEs published within the specified year
    const cves = await CVE.find({
      "cve.published": { $gte: startOfYear, $lte: endOfYear },
    });

    return res.json(cves);
  } catch (err) {
    console.error("Error while fetching CVEs by year:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Filter CVEs by last modified date range
export const getCVEByLastModified = async (req, res) => {
  console.log("Controller Reached");
  const { year } = req.params;
  const { lastModStartDate, lastModEndDate } = req.query;

  try {
    // Validate year format
    if (!/^\d{4}$/.test(year)) {
      return res.status(400).json({ error: "Invalid year format." });
    }

    if (lastModStartDate || lastModEndDate) {
      if (!lastModStartDate || !lastModEndDate) {
        return res.status(400).json({
          error:
            "Both lastModStartDate and lastModEndDate are required if one is provided.",
        });
      }

      // Parse the pubStartDate and pubEndDate into Date objects
      const startDate = new Date(lastModStartDate);
      const endDate = new Date(lastModEndDate);

      // Validate the date objects
      if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({
          error: "Invalid date format. Use extended ISO-8601 format.",
        });
      }

      // Ensure the date range is not greater than 120 days
      const timeDifference = (endDate - startDate) / (1000 * 3600 * 24); // in days
      if (timeDifference > 120) {
        return res.status(400).json({
          error: "The maximum allowable date range is 120 days.",
        });
      }

      // Query MongoDB to find CVEs published within the specified date range
      const cves = await CVE.find({
        "cve.lastModified": { $gte: startDate, $lte: endDate },
      });

      return res.json(cves);
    }

    const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

    const cves = await CVE.find({
      "cve.lastModified": { $gte: startOfYear, $lte: endOfYear },
    });

    return res.json(cves);
  } catch (err) {
    console.error("Error while fetching CVEs by year:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const getCVEByScore = async (req, res) => {
  console.log("Controller Reached");
  console.log("Query Params:", req.query);

  const { score } = req.query;

  try {
    const cves = await CVE.find({
      "cve.metrics.cvssMetricV2.0.cvssData.baseScore": parseFloat(score),
    }).lean();

    console.log("Query Result:", cves);

    if (cves.length === 0) {
      return res.status(404).json({ message: "CVE not found" });
    }

    res.json(cves);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};
