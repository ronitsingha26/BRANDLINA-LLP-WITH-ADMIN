import Homepage from "../models/Homepage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";
import { deleteFromCloudinary, uploadImageBuffer } from "../utils/cloudinaryUpload.js";

function parseJsonField(value) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

const defaultHomepage = {
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
    kicker: "About Brandlina",
    heading: "Engineering-first teams delivering resilient systems for tomorrow.",
    description:
      "BRANDLINA LLP provides comprehensive turnkey solutions for Fire Detection, PA Systems, EPABX, BMS, Networking, Security Integration, Electrical & Mechanical Works, Civil Consultancy, and more. We deliver end-to-end technology and infrastructure that performs under real-world load.",
    ctaLabel: "Discover our story",
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
        "Brandlina executed our CCTV and access control integration across all MCL mine sites with exceptional safety compliance. Their documentation and handover quality set a new benchmark for us.",
      author: "Rajendra Kumar Singh",
      role: "Chief Engineer, Mahanadi Coalfields Limited (MCL)",
      initials: "RKS",
    },
    {
      quote:
        "MECO Technologies partnered with Brandlina for our network and PA system rollout. Their methodical approach and zero-disruption delivery impressed our entire operations team.",
      author: "Anand Prasad",
      role: "Head of IT Infrastructure, MECO Technologies Pvt. Ltd.",
      initials: "AP",
    },
    {
      quote:
        "The IP surveillance and pipeline security integration Brandlina delivered for GAIL across our Jharkhand zone was flawless. Full compliance with OISD standards and delivered ahead of schedule.",
      author: "Sunita Mahato",
      role: "Project Director, GAIL (India) Limited",
      initials: "SM",
    },
    {
      quote:
        "Brandlina handled our fire alarm zoning, EPABX, and BMS integration across the Bokaro Steel City township. The coordination between their teams was impeccable throughout.",
      author: "Vikram Banerjee",
      role: "Plant Administrator, Steel Authority of India (SAIL)",
      initials: "VB",
    },
    {
      quote:
        "Our LAN/WAN and IP telephony upgrade at NTPC Patratu was mission-critical. Brandlina delivered a zero-downtime cutover with full documentation and post-handover support.",
      author: "P. N. Sharma",
      role: "CTO, NTPC Limited, Patratu Thermal Power Station",
      initials: "PNS",
    },
    {
      quote:
        "Brandlina's HVAC and MEP coordination across our ONGC field office in Ranchi was seamless. Their team understood industrial-grade uptime requirements and delivered accordingly.",
      author: "Deepa Mishra",
      role: "Facilities Manager, ONGC, Jharkhand Field Zone",
      initials: "DM",
    },
    {
      quote:
        "For Tata Steel's expanding service infrastructure in Jamshedpur, Brandlina provided a scalable and well-documented biometric access and RFID solution. Highly recommended.",
      author: "Avinash Kumar Tiwari",
      role: "Infrastructure Lead, Tata Steel Limited",
      initials: "AKT",
    },
    {
      quote:
        "MECON's new corporate headquarters in Ranchi required a complete building management upgrade. Brandlina delivered the entire MEP, security, and networking scope within the agreed timeline.",
      author: "Ravi Choudhary",
      role: "Programme Manager, MECON Limited, Ranchi",
      initials: "RC",
    },
  ],
  marquee: ["Fire Alarm", "CCTV", "LAN/WAN", "WiFi", "RFID", "HVAC", "BMS"],
};

async function getOrCreateHomepage() {
  let doc = await Homepage.findOne();
  if (!doc) {
    doc = await Homepage.create(defaultHomepage);
  }
  return doc;
}

function mapHomepage(doc) {
  const payload = doc.toObject ? doc.toObject() : doc;
  const hero = {
    ...defaultHomepage.hero,
    ...(payload.hero || {}),
  };
  hero.backgroundImage = hero.backgroundImage || defaultHomepage.hero.backgroundImage;
  hero.backgroundImagePublicId = hero.backgroundImagePublicId || "";

  const about = {
    ...defaultHomepage.about,
    ...(payload.about || {}),
  };
  about.previewImage = about.previewImage || defaultHomepage.about.previewImage;
  about.previewImagePublicId = about.previewImagePublicId || "";

  const cta = {
    ...defaultHomepage.cta,
    ...(payload.cta || {}),
  };
  cta.bannerImage = cta.bannerImage || defaultHomepage.cta.bannerImage;
  cta.bannerImagePublicId = cta.bannerImagePublicId || "";

  return {
    ...payload,
    hero,
    about,
    cta,
    stats: Array.isArray(payload.stats) && payload.stats.length ? payload.stats : defaultHomepage.stats,
    testimonials:
      Array.isArray(payload.testimonials) && payload.testimonials.length > 1
        ? payload.testimonials
        : defaultHomepage.testimonials,
    marquee: Array.isArray(payload.marquee) && payload.marquee.length ? payload.marquee : defaultHomepage.marquee,
  };
}

export const getHomepage = asyncHandler(async (req, res) => {
  const doc = await getOrCreateHomepage();
  res.json(mapHomepage(doc));
});

export const updateHomepage = asyncHandler(async (req, res) => {
  const doc = await getOrCreateHomepage();

  const heroPayload = parseJsonField(req.body.hero);
  const aboutPayload = parseJsonField(req.body.about);
  const ctaPayload = parseJsonField(req.body.cta);
  const statsPayload = parseJsonField(req.body.stats);
  const testimonialsPayload = parseJsonField(req.body.testimonials);
  const marqueePayload = parseJsonField(req.body.marquee);

  if (heroPayload && typeof heroPayload === "object" && !Array.isArray(heroPayload)) {
    doc.hero = {
      ...doc.hero,
      ...heroPayload,
    };
  }

  if (!doc.about) {
    doc.about = {};
  }

  if (aboutPayload && typeof aboutPayload === "object" && !Array.isArray(aboutPayload)) {
    doc.about = {
      ...doc.about,
      ...aboutPayload,
    };
  }

  if (!doc.cta) {
    doc.cta = {};
  }

  if (ctaPayload && typeof ctaPayload === "object" && !Array.isArray(ctaPayload)) {
    doc.cta = {
      ...doc.cta,
      ...ctaPayload,
    };
  }

  const heroImageFile = req.files?.heroImage?.[0];
  if (heroImageFile?.buffer) {
    if (doc.hero?.backgroundImagePublicId) {
      await deleteFromCloudinary(doc.hero.backgroundImagePublicId);
    }

    const upload = await uploadImageBuffer({
      buffer: heroImageFile.buffer,
      folder: "brandlina/homepage/hero",
      mimeType: heroImageFile.mimetype,
      originalName: heroImageFile.originalname,
    });

    doc.hero = {
      ...doc.hero,
      backgroundImage: upload.secure_url,
      backgroundImagePublicId: upload.public_id,
    };
  }

  const aboutImageFile = req.files?.aboutImage?.[0];
  if (aboutImageFile?.buffer) {
    if (doc.about?.previewImagePublicId) {
      await deleteFromCloudinary(doc.about.previewImagePublicId);
    }

    const upload = await uploadImageBuffer({
      buffer: aboutImageFile.buffer,
      folder: "brandlina/homepage/about",
      mimeType: aboutImageFile.mimetype,
      originalName: aboutImageFile.originalname,
    });

    doc.about = {
      ...doc.about,
      previewImage: upload.secure_url,
      previewImagePublicId: upload.public_id,
    };
  }

  const ctaImageFile = req.files?.ctaImage?.[0];
  if (ctaImageFile?.buffer) {
    if (doc.cta?.bannerImagePublicId) {
      await deleteFromCloudinary(doc.cta.bannerImagePublicId);
    }

    const upload = await uploadImageBuffer({
      buffer: ctaImageFile.buffer,
      folder: "brandlina/homepage/cta",
      mimeType: ctaImageFile.mimetype,
      originalName: ctaImageFile.originalname,
    });

    doc.cta = {
      ...doc.cta,
      bannerImage: upload.secure_url,
      bannerImagePublicId: upload.public_id,
    };
  }

  if (Array.isArray(statsPayload)) {
    doc.stats = statsPayload;
  }

  if (Array.isArray(testimonialsPayload)) {
    doc.testimonials = testimonialsPayload;
  }

  // Handle per-testimonial portrait uploads: testimonialImage_0, testimonialImage_1, …
  if (Array.isArray(doc.testimonials) && req.files) {
    for (let i = 0; i < doc.testimonials.length; i++) {
      const fileKey = `testimonialImage_${i}`;
      const file = req.files[fileKey]?.[0];
      if (file?.buffer) {
        if (doc.testimonials[i]?.imagePublicId) {
          await deleteFromCloudinary(doc.testimonials[i].imagePublicId);
        }
        const upload = await uploadImageBuffer({
          buffer: file.buffer,
          folder: "brandlina/homepage/testimonials",
          mimeType: file.mimetype,
          originalName: file.originalname,
        });
        doc.testimonials[i] = {
          ...doc.testimonials[i],
          image: upload.secure_url,
          imagePublicId: upload.public_id,
        };
      }
    }
  }

  if (Array.isArray(marqueePayload)) {
    doc.marquee = marqueePayload;
  } else if (typeof marqueePayload === "string") {
    doc.marquee = marqueePayload
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  await doc.save();

  await recordActivity({
    action: "update",
    module: "homepage",
    message: "Updated homepage content",
    resourceId: doc._id.toString(),
  });

  res.json(mapHomepage(doc));
});
