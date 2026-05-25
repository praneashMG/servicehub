import { useState } from 'react';
import api from '../services/api';
import { UploadCloud, CheckCircle, XCircle } from 'lucide-react';

const UploadImage = ({ onUploadSuccess, label = "Upload Image" }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    // Create a local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      onUploadSuccess(res.data.url);
      setIsUploading(false);
    } catch (err) {
      console.error(err);
      setError("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-500/30 border-dashed rounded-xl cursor-pointer bg-slate-900/50 hover:bg-slate-800/50 hover:border-blue-500/60 transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mb-2"></div>
            ) : preview ? (
              <img src={preview} alt="Preview" className="h-20 w-20 object-cover rounded-lg mb-2 border border-blue-500/50" />
            ) : (
              <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-400 mb-2 transition-colors" />
            )}
            <p className="mb-2 text-sm text-slate-400 group-hover:text-blue-300">
              {isUploading ? "Uploading..." : <><span className="font-semibold text-blue-500">Click to upload</span> or drag and drop</>}
            </p>
            <p className="text-xs text-slate-500">SVG, PNG, JPG, or GIF (MAX. 800x400px)</p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </div>
      {error && (
        <div className="mt-2 text-red-500 text-sm flex items-center gap-1">
          <XCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {preview && !isUploading && !error && (
        <div className="mt-2 text-green-400 text-sm flex items-center gap-1">
          <CheckCircle className="w-4 h-4" /> Upload successful!
        </div>
      )}
    </div>
  );
};

export default UploadImage;
