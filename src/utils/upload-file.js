// Firebase storage import
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // importing services
import { storage } from "../firebase";

// File upload function
/**
 *
 * @param {File} file - The file to be uploaded
 * @param {String} folderName - The folder name in which the file will be uploaded
 * @returns {String} - The URL of the uploaded file
 * @description - This function uploads the file to the firebase storage and returns the URL of the uploaded file
 */
export const uploadFile = async (file, folderName) => {
  // If file is null, return null
  if (file == null) {
    return null;
  }

  //   Check if file is a string and return the file as it is
  //   It means the file is already uploaded and we are just updating the data
  if (typeof file === "string") {
    return file;
  }

  //   Check if file is an array and get the first file
  if (typeof file === "object" && Array.isArray(file) && file?.length > 0) {
    file = file[0];
  }

  const randomId = uuidv4();
  const fileName = `${randomId}-${file.name}`;
  const filePath = `${folderName}/${fileName}`;

  const storageRef = ref(storage, filePath);
  const snapshot = await uploadBytes(storageRef, file);

  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

// Upload multiple images
/**
 *
 * @param {Array} files - The files to be uploaded
 * @param {String} folderName - The folder name in which the files will be uploaded
 * @returns {Array} - The URLs of the uploaded files
 * @description - This function uploads the files to the firebase storage and returns the URLs of the uploaded files
 */
export const uploadMultipleFiles = async (files, folderName) => {
  const uploadPromises = files.map((file) => uploadFile(file, folderName));
  const urls = await Promise.all(uploadPromises);
  return urls;
};
