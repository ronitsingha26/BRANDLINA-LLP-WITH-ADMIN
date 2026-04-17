import Setting from "../models/Setting.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";
import { deleteFromCloudinary, uploadImageBuffer } from "../utils/cloudinaryUpload.js";

async function getOrCreateSettings() {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  return settings;
}

export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json(settings);
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();

  settings.siteName = req.body.siteName ?? settings.siteName;
  settings.supportEmail = req.body.supportEmail ?? settings.supportEmail;
  settings.contactPhone = req.body.contactPhone ?? settings.contactPhone;
  settings.address = req.body.address ?? settings.address;
  settings.aboutHeroKicker = req.body.aboutHeroKicker ?? settings.aboutHeroKicker;
  settings.aboutHeroTitle = req.body.aboutHeroTitle ?? settings.aboutHeroTitle;
  settings.aboutHeroRoute = req.body.aboutHeroRoute ?? settings.aboutHeroRoute;
  settings.aboutMainKicker = req.body.aboutMainKicker ?? settings.aboutMainKicker;
  settings.aboutMainHeading = req.body.aboutMainHeading ?? settings.aboutMainHeading;
  settings.aboutMainParagraphOne = req.body.aboutMainParagraphOne ?? settings.aboutMainParagraphOne;
  settings.aboutMainParagraphTwo = req.body.aboutMainParagraphTwo ?? settings.aboutMainParagraphTwo;
  settings.aboutMainParagraphThree = req.body.aboutMainParagraphThree ?? settings.aboutMainParagraphThree;
  settings.aboutMissionKicker = req.body.aboutMissionKicker ?? settings.aboutMissionKicker;
  settings.aboutMissionTitle = req.body.aboutMissionTitle ?? settings.aboutMissionTitle;
  settings.aboutMissionDescription = req.body.aboutMissionDescription ?? settings.aboutMissionDescription;
  settings.aboutVisionKicker = req.body.aboutVisionKicker ?? settings.aboutVisionKicker;
  settings.aboutVisionTitle = req.body.aboutVisionTitle ?? settings.aboutVisionTitle;
  settings.aboutVisionDescription = req.body.aboutVisionDescription ?? settings.aboutVisionDescription;
  settings.aboutTeamKicker = req.body.aboutTeamKicker ?? settings.aboutTeamKicker;
  settings.aboutTeamHeading = req.body.aboutTeamHeading ?? settings.aboutTeamHeading;
  settings.aboutOfficeKicker = req.body.aboutOfficeKicker ?? settings.aboutOfficeKicker;
  settings.aboutRegisteredOfficeTitle = req.body.aboutRegisteredOfficeTitle ?? settings.aboutRegisteredOfficeTitle;
  settings.aboutRegisteredOfficeAddress = req.body.aboutRegisteredOfficeAddress ?? settings.aboutRegisteredOfficeAddress;
  settings.aboutCorporateOfficeTitle = req.body.aboutCorporateOfficeTitle ?? settings.aboutCorporateOfficeTitle;
  settings.aboutCorporateOfficeAddress = req.body.aboutCorporateOfficeAddress ?? settings.aboutCorporateOfficeAddress;

  if (req.body.aboutTeams != null) {
    let parsedTeams = req.body.aboutTeams;

    if (typeof parsedTeams === "string") {
      try {
        parsedTeams = JSON.parse(parsedTeams);
      } catch {
        parsedTeams = null;
      }
    }

    if (Array.isArray(parsedTeams)) {
      settings.aboutTeams = parsedTeams.map((item) => ({
        role: item?.role ? String(item.role) : "",
        count: item?.count ? String(item.count) : "",
      }));
    }
  }

  if (req.file?.buffer) {
    if (settings.aboutMainImagePublicId) {
      await deleteFromCloudinary(settings.aboutMainImagePublicId);
    }

    const upload = await uploadImageBuffer({
      buffer: req.file.buffer,
      folder: "brandlina/about-page",
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
    });

    settings.aboutMainImage = upload.secure_url;
    settings.aboutMainImagePublicId = upload.public_id;
  }

  await settings.save();

  await recordActivity({
    action: "update",
    module: "settings",
    message: "Updated global settings",
    resourceId: settings._id.toString(),
  });

  res.json(settings);
});
