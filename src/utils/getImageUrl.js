export const getImageUrl = (image) => {
    if (!image) return `${import.meta.env.VITE_API_ORIGIN}/uploads/default.png`;
    if (image.startsWith('http') || image.startsWith('data:image')) return image;
    return `${import.meta.env.VITE_API_ORIGIN}/uploads/${image}`;
  };