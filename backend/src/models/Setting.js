import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "BRANDLINA LLP" },
    supportEmail: { type: String, default: "brandlina33@gmail.com" },
    contactPhone: { type: String, default: "+91 76679 26063" },
    address: { type: String, default: "Ranchi, Jharkhand" },
    aboutHeroKicker: { type: String, default: "About" },
    aboutHeroTitle: { type: String, default: "Our Story, Standards and Discipline" },
    aboutHeroRoute: { type: String, default: "Company" },
    aboutMainKicker: { type: String, default: "About Us" },
    aboutMainHeading: {
      type: String,
      default: "BRANDLINA LLP provides comprehensive turnkey solutions for specialized infrastructure and engineering.",
    },
    aboutMainParagraphOne: {
      type: String,
      default:
        "We provide turnkey solutions to meet our clients' requirements for Fire Detection, PA systems, EPABX, BMS, Networking Systems, data, Voice, Video, and Security Integration.",
    },
    aboutMainParagraphTwo: {
      type: String,
      default:
        "Our field of specialization includes designing and implementing projects like LAN & WAN, CCTV, I.P. Surveillance, R-F Connectivity for P2P/MP2P, Wi-Fi, U.T.M Firewall, Fire Alarm System, P.A. System and Biometric & Access Control Systems, RFID System, Electrical works, HVAC, interior design, and Project Civil Work Consultancy.",
    },
    aboutMainParagraphThree: {
      type: String,
      default:
        "We also deliver expert Electrical engineering, Mechanical engineering, and Horticulture Maintenance and Development.",
    },
    aboutMainImage: { type: String, default: "" },
    aboutMainImagePublicId: { type: String, default: "" },
    aboutMissionKicker: { type: String, default: "Mission" },
    aboutMissionTitle: { type: String, default: "Performance under pressure." },
    aboutMissionDescription: {
      type: String,
      default: "Build robust systems that protect people, assets and operations through reliability-first design and execution.",
    },
    aboutVisionKicker: { type: String, default: "Vision" },
    aboutVisionTitle: { type: String, default: "The benchmark turnkey partner." },
    aboutVisionDescription: {
      type: String,
      default: "Become India's most trusted engineering partner for integrated safety, security and infrastructure delivery.",
    },
    aboutTeamKicker: { type: String, default: "Our Teams" },
    aboutTeamHeading: { type: String, default: "Specialized engineers, one coordinated execution model." },
    aboutTeams: {
      type: [
        {
          role: { type: String, default: "" },
          count: { type: String, default: "" },
        },
      ],
      default: [
        { role: "Project Engineering", count: "45+" },
        { role: "Safety & Compliance", count: "18+" },
        { role: "Field Operations", count: "60+" },
        { role: "Design & Consultancy", count: "22+" },
      ],
    },
    aboutOfficeKicker: { type: String, default: "Office Locations" },
    aboutRegisteredOfficeTitle: { type: String, default: "Registered Office" },
    aboutRegisteredOfficeAddress: {
      type: String,
      default: "E type 196, HEC Dhurwa Sector-2\nDhurwa, Ranchi, Jharkhand (834004)",
    },
    aboutCorporateOfficeTitle: { type: String, default: "Corporate Office" },
    aboutCorporateOfficeAddress: {
      type: String,
      default: "207/A Nandan enclave Tupudana\nRanchi Jharkhand (835221)",
    },
  },
  { timestamps: true },
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
