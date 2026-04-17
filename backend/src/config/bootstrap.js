import Homepage from "../models/Homepage.js";
import Setting from "../models/Setting.js";
import bcrypt from "bcryptjs";
import AdminCredential from "../models/AdminCredential.js";

export async function bootstrapDefaults() {
  const homepage = await Homepage.findOne();
  if (!homepage) {
    await Homepage.create({
      hero: {
        brandline: "Brandlina LLP",
        titleLineOne: "Turnkey infrastructure",
        titleLineTwo: "solutions that",
        titleAccent: "execute.",
        subtitle:
          "Specializing in Fire Detection, Networking Systems, Security Integration, HVAC, Electrical Works, and Comprehensive Civil & Mechanical Engineering.",
        ctaPrimary: "Explore Services",
        backgroundImage:
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2675&q=80",
      },
      about: {
        previewImage: "/hero.png",
      },
      cta: {
        bannerImage:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80",
      },
      stats: [
        { label: "Projects Delivered", value: 500, suffix: "+" },
        { label: "Enterprise Clients", value: 200, suffix: "+" },
        { label: "Years Experience", value: 15, suffix: "+" },
        { label: "Support Availability", value: 24, suffix: "/7" },
      ],
      testimonials: [
        {
          quote:
            "Brandlina delivered our integrated CCTV and access control stack ahead of timeline. Documentation, training, and handover quality were exceptional.",
          author: "Operations Head",
          role: "Large Retail Campus",
          initials: "OH",
        },
      ],
      marquee: ["Fire Alarm", "CCTV", "LAN/WAN", "WiFi", "RFID", "HVAC", "BMS"],
    });
  }

  const settings = await Setting.findOne();
  if (!settings) {
    await Setting.create({
      siteName: "BRANDLINA LLP",
      supportEmail: "brandlina33@gmail.com",
      contactPhone: "+91 76679 26063",
      address: "Ranchi, Jharkhand",
    });
  }

  const admin = await AdminCredential.findOne();
  if (!admin) {
    const username = String(process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
    const rawPassword = String(process.env.ADMIN_PASSWORD || "Brandlina@123");
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    await AdminCredential.create({
      username,
      displayName: "Brandlina Admin",
      email: "",
      passwordHash,
      isActive: true,
    });

    console.log(`Default admin created: ${username}`);
  }
}
