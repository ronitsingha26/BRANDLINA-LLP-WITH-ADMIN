import Contact from "../models/Contact.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { recordActivity } from "../utils/recordActivity.js";

export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, company, phone, message, inquiryType, sourcePage } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ message: "Name, email and message are required" });
    return;
  }

  const normalizedInquiryType = inquiryType === "book_call" ? "book_call" : "contact";

  const contact = await Contact.create({
    name,
    email,
    company,
    phone,
    message,
    inquiryType: normalizedInquiryType,
    sourcePage,
    status: "pending",
  });

  await recordActivity({
    action: "create",
    module: "contacts",
    message: `${normalizedInquiryType === "book_call" ? "New call booking" : "New contact"} received from ${name}`,
    resourceId: contact._id.toString(),
  });

  res.status(201).json({
    message: normalizedInquiryType === "book_call" ? "Call booked successfully" : "Contact submitted successfully",
    contactId: contact._id,
  });
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["pending", "done"].includes(status)) {
    res.status(400).json({ message: "Status must be pending or done" });
    return;
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404).json({ message: "Contact not found" });
    return;
  }

  contact.status = status;
  await contact.save();

  await recordActivity({
    action: "update",
    module: "contacts",
    message: `Marked lead ${contact.name} as ${status}`,
    resourceId: contact._id.toString(),
  });

  res.json(contact);
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    res.status(404).json({ message: "Contact not found" });
    return;
  }

  await Contact.deleteOne({ _id: contact._id });

  await recordActivity({
    action: "delete",
    module: "contacts",
    message: `Deleted lead from ${contact.name}`,
    resourceId: contact._id.toString(),
  });

  res.json({ message: "Lead deleted" });
});
