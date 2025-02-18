import mongoose from "mongoose";

const cveSchema = new mongoose.Schema({
  cve: {
    id: { type: String, required: true, unique: true },
    sourceIdentifier: { type: String, required: true },
    published: { type: Date, required: true },
    lastModified: { type: Date, required: true },
    vulnStatus: { type: String, required: true },
    cveTags: [{ type: String }],
    descriptions: [
      {
        lang: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
    metrics: {
      cvssMetricV2: [
        {
          source: { type: String, required: true },
          type: { type: String, required: true },
          cvssData: {
            version: { type: String, required: true },
            vectorString: { type: String, required: true },
            baseScore: { type: Number, required: true, min: 0, max: 10 },
            accessVector: { type: String, required: true },
            accessComplexity: { type: String, required: true },
            authentication: { type: String, required: true },
            confidentialityImpact: { type: String, required: true },
            integrityImpact: { type: String, required: true },
            availabilityImpact: { type: String, required: true },
          },
          baseSeverity: { type: String, required: true },
          exploitabilityScore: { type: Number, min: 0, max: 10 },
          impactScore: { type: Number, min: 0, max: 10 },
          acInsufInfo: { type: Boolean, default: false },
          obtainAllPrivilege: { type: Boolean, default: false },
          obtainUserPrivilege: { type: Boolean, default: false },
          obtainOtherPrivilege: { type: Boolean, default: false },
          userInteractionRequired: { type: Boolean, default: false },
        },
      ],
    },
    weaknesses: [
      {
        source: { type: String, required: true },
        type: { type: String, required: true },
        description: [
          {
            lang: { type: String, required: true },
            value: { type: String, required: true },
          },
        ],
      },
    ],
    configurations: [
      {
        nodes: [
          {
            operator: { type: String, required: true },
            negate: { type: Boolean, default: false },
            cpeMatch: [
              {
                vulnerable: { type: Boolean, default: false },
                criteria: { type: String, required: true },
                matchCriteriaId: { type: String, required: true },
              },
            ],
          },
        ],
      },
    ],
    references: [
      {
        url: { type: String, required: true },
        source: { type: String, required: true },
      },
    ],
  },
});

// Create the Model
const CVE = mongoose.model("CVE", cveSchema, "cve_data");
export default CVE;
