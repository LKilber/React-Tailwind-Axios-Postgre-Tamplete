// src/services/userService.js
import { getData, postData } from './api';

export const getUserProfile = async () => {
  try {
    const response = await getData('/user/profile');
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await postData('/user/profile', profileData);
    return response;
  } catch (error) {
    throw error;
  }
};
