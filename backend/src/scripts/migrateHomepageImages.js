import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Homepage from "../models/Homepage.js";

dotenv.config();

const defaults = {
  heroBackgroundImage:
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2675&q=80",
  aboutPreviewImage: "/hero.png",
  ctaBannerImage:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2670&q=80",
};

async function run() {
  await connectDB(process.env.MONGODB_URI);

  let doc = await Homepage.findOne();
  if (!doc) {
    doc = await Homepage.create({
      hero: { backgroundImage: defaults.heroBackgroundImage },
      about: { previewImage: defaults.aboutPreviewImage },
      cta: { bannerImage: defaults.ctaBannerImage },
    });
    console.log("Homepage not found. Created one with default image fields.");
  }

  const updatedFields = [];

  if (!doc.hero) {
    doc.hero = {};
  }
  if (!doc.hero.backgroundImage) {
    doc.hero.backgroundImage = defaults.heroBackgroundImage;
    updatedFields.push("hero.backgroundImage");
  }
  if (!doc.hero.backgroundImagePublicId) {
    doc.hero.backgroundImagePublicId = "";
    updatedFields.push("hero.backgroundImagePublicId");
  }

  if (!doc.about) {
    doc.about = {};
  }
  if (!doc.about.previewImage) {
    doc.about.previewImage = defaults.aboutPreviewImage;
    updatedFields.push("about.previewImage");
  }
  if (!doc.about.previewImagePublicId) {
    doc.about.previewImagePublicId = "";
    updatedFields.push("about.previewImagePublicId");
  }

  if (!doc.cta) {
    doc.cta = {};
  }
  if (!doc.cta.bannerImage) {
    doc.cta.bannerImage = defaults.ctaBannerImage;
    updatedFields.push("cta.bannerImage");
  }
  if (!doc.cta.bannerImagePublicId) {
    doc.cta.bannerImagePublicId = "";
    updatedFields.push("cta.bannerImagePublicId");
  }

  if (updatedFields.length > 0) {
    await doc.save();
    console.log("Homepage image migration completed.");
    console.log(`Updated fields: ${updatedFields.join(", ")}`);
  } else {
    console.log("Homepage image migration skipped. All image fields already present.");
  }

  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
