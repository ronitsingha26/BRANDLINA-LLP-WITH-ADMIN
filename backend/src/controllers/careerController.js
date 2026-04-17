import CareerApplication from "../models/CareerApplication.js";
import CareerJob from "../models/CareerJob.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";

function mapJob(item) {
  return {
    _id: item._id,
    title: item.title,
    employmentType: item.employmentType,
    location: item.location,
    description: item.description,
    status: item.status,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export const getPublicCareerJobs = asyncHandler(async (req, res) => {
  const items = await CareerJob.find({ status: "open" }).sort({ createdAt: -1 });
  res.json(items.map(mapJob));
});

export const getAdminCareerJobs = asyncHandler(async (req, res) => {
  const items = await CareerJob.find().sort({ createdAt: -1 });
  res.json(items.map(mapJob));
});

export const createCareerJob = asyncHandler(async (req, res) => {
  const { title, employmentType, location, description, status } = req.body;

  if (!title || !location) {
    res.status(400).json({ message: "Title and location are required" });
    return;
  }

  const item = await CareerJob.create({
    title,
    employmentType: employmentType || "Full Time",
    location,
    description: description || "",
    status: status === "closed" ? "closed" : "open",
  });

  await recordActivity({
    action: "create",
    module: "careers",
    message: `Created career opening: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.status(201).json(mapJob(item));
});

export const updateCareerJob = asyncHandler(async (req, res) => {
  const item = await CareerJob.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Career opening not found" });
    return;
  }

  item.title = req.body.title ?? item.title;
  item.employmentType = req.body.employmentType ?? item.employmentType;
  item.location = req.body.location ?? item.location;
  item.description = req.body.description ?? item.description;

  if (["open", "closed"].includes(req.body.status)) {
    item.status = req.body.status;
  }

  await item.save();

  await recordActivity({
    action: "update",
    module: "careers",
    message: `Updated career opening: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.json(mapJob(item));
});

export const deleteCareerJob = asyncHandler(async (req, res) => {
  const item = await CareerJob.findById(req.params.id);

  if (!item) {
    res.status(404).json({ message: "Career opening not found" });
    return;
  }

  await CareerJob.deleteOne({ _id: item._id });

  await recordActivity({
    action: "delete",
    module: "careers",
    message: `Deleted career opening: ${item.title}`,
    resourceId: item._id.toString(),
  });

  res.json({ message: "Career opening deleted" });
});

export const submitCareerApplication = asyncHandler(async (req, res) => {
  const { jobId, name, email, phone, experience } = req.body;

  if (!jobId || !name || !email || !experience) {
    res.status(400).json({ message: "Job, name, email and experience are required" });
    return;
  }

  const job = await CareerJob.findById(jobId);

  if (!job || job.status !== "open") {
    res.status(400).json({ message: "Selected job is not available" });
    return;
  }

  const application = await CareerApplication.create({
    job: job._id,
    jobTitle: job.title,
    name,
    email,
    phone,
    experience,
    status: "pending",
    sourcePage: "careers_page",
  });

  await recordActivity({
    action: "create",
    module: "careers",
    message: `New application from ${name} for ${job.title}`,
    resourceId: application._id.toString(),
  });

  res.status(201).json({
    message: "Application submitted successfully",
    applicationId: application._id,
  });
});

export const getCareerApplications = asyncHandler(async (req, res) => {
  const applications = await CareerApplication.find()
    .sort({ createdAt: -1 })
    .populate("job", "title status location employmentType");

  res.json(applications);
});

export const updateCareerApplicationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "done"].includes(status)) {
    res.status(400).json({ message: "Status must be pending or done" });
    return;
  }

  const application = await CareerApplication.findById(req.params.id);

  if (!application) {
    res.status(404).json({ message: "Application not found" });
    return;
  }

  application.status = status;
  await application.save();

  await recordActivity({
    action: "update",
    module: "careers",
    message: `Marked application ${application.name} as ${status}`,
    resourceId: application._id.toString(),
  });

  res.json(application);
});

export const deleteCareerApplication = asyncHandler(async (req, res) => {
  const application = await CareerApplication.findById(req.params.id);

  if (!application) {
    res.status(404).json({ message: "Application not found" });
    return;
  }

  await CareerApplication.deleteOne({ _id: application._id });

  await recordActivity({
    action: "delete",
    module: "careers",
    message: `Deleted application from ${application.name}`,
    resourceId: application._id.toString(),
  });

  res.json({ message: "Application deleted" });
});
