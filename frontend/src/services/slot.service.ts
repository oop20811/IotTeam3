import axios from 'axios';

const SLOTS_API_URL = 'http://localhost:8080/api/slots';
const PRODUCTS_API_URL = 'http://localhost:8080/api/products'; // products API URL 추가

export const getSlots = async () => {
  try {
    const response = await axios.get(SLOTS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch slots:', error);
    throw error;
  }
};

export const occupySlot = async (slotNumber: number) => {
  try {
    await axios.post(`${SLOTS_API_URL}/${slotNumber}/occupy`);
  } catch (error) {
    console.error('Failed to occupy slot:', error);
    throw error;
  }
};

export const addProduct = async (formData: FormData) => {
  try {
    await axios.post(PRODUCTS_API_URL, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.error('Failed to add product:', error);
    throw error;
  }
};
