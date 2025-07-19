import API from './api' 

export async function getAllDonors() {
  const res = await API.get("/donor/");
  return res.data;
}