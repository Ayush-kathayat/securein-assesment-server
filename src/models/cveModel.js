import mongoose from "mongoose";

const cveSchema = new mongoose.Schema({
  cve: {
    id: { type: String, required: true, unique: true },
    sourceIdentifier: String,
    published: Date,
    lastModified: Date,
    vulnStatus: String,
    cveTags: [String],
    descriptions: [
      {
        lang: String,
        value: String,
      },
    ],
    metrics: {
      cvssMetricV2: [
        {
          source: String,
          type: String,
          cvssData: {
            version: String,
            vectorString: String,
            baseScore: Number,
            accessVector: String,
            accessComplexity: String,
            authentication: String,
            confidentialityImpact: String,
            integrityImpact: String,
            availabilityImpact: String,
          },
          baseSeverity: String,
          exploitabilityScore: Number,
          impactScore: Number,
          acInsufInfo: Boolean,
          obtainAllPrivilege: Boolean,
          obtainUserPrivilege: Boolean,
          obtainOtherPrivilege: Boolean,
          userInteractionRequired: Boolean,
        },
      ],
    },
    weaknesses: [
      {
        source: String,
        type: String,
        description: [
          {
            lang: String,
            value: String,
          },
        ],
      },
    ],
    configurations: [
      {
        nodes: [
          {
            operator: String,
            negate: Boolean,
            cpeMatch: [
              {
                vulnerable: Boolean,
                criteria: String,
                matchCriteriaId: String,
              },
            ],
          },
        ],
      },
    ],
    references: [
      {
        url: String,
        source: String,
      },
    ],
  },
});

// Create the Model
const CVE = mongoose.model("CVE", cveSchema, "cve_data");
export default CVE;
