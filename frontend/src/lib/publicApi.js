import { apiClient } from "./apiClient";

export async function fetchHomepage() {
  const { data } = await apiClient.get("/homepage");
  return data;
}

export async function fetchServices() {
  const { data } = await apiClient.get("/services");
  return data;
}

export async function fetchServiceById(id) {
  const { data } = await apiClient.get(`/services/${id}`);
  return data;
}

export async function fetchProjects() {
  const { data } = await apiClient.get("/projects");
  return data;
}

export async function fetchProjectById(id) {
  const { data } = await apiClient.get(`/projects/${id}`);
  return data;
}

export async function fetchBlogs() {
  const { data } = await apiClient.get("/blogs");
  return data;
}

export async function fetchBlogById(id) {
  const { data } = await apiClient.get(`/blogs/${id}`);
  return data;
}

export async function submitContact(payload) {
  const { data } = await apiClient.post("/contact", payload);
  return data;
}

export async function fetchSettings() {
  const { data } = await apiClient.get("/settings");
  return data;
}

export async function fetchCareerJobs() {
  const { data } = await apiClient.get("/careers/jobs");
  return data;
}

export async function submitCareerApplication(payload) {
  const { data } = await apiClient.post("/careers/applications", payload);
  return data;
}
