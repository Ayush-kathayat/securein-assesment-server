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

  try {
    const cves = await CVE.find({
      "cve.publishedDate": new RegExp(`^${year}`),
    });
    res.json(cves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter CVEs by score
export const getCVEByScore = async (req, res) => {
  const { min = 0, max = 10 } = req.query;

  try {
    const cves = await CVE.find({
      $or: [
        {
          "cve.metrics.cvssMetricV2.cvssData.baseScore": {
            $gte: parseFloat(min),
            $lte: parseFloat(max),
          },
        },
        {
          "cve.metrics.cvssMetricV3.cvssData.baseScore": {
            $gte: parseFloat(min),
            $lte: parseFloat(max),
          },
        },
      ],
    });
    res.json(cves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
