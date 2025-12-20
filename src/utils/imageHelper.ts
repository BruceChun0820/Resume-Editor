export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const maxSize = 500 * 1024; // 500KB

    if (file.size > maxSize) {
      reject(new Error("图片体积过大（需小于 500KB），请压缩后再上传。"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};