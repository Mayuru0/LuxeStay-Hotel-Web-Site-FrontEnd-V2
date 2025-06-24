import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const UpdateGallery = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.state === null) {
    window.location.href = "/admin/gallery";
  }
  console.log(location.state);

  const [formData, setFormData] = React.useState({
    name: location.state.name || "",
    description: location.state.description || "",
    image: location.state.image || "",
  });
  const [previewImage, setPreviewImage] = React.useState(location.state.image);
  const [isLoading, setIsLoading] = React.useState(false);

  // Form submit
  const handlesubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/login");
      return;
    }

    try {
      const { name, price, description, image } = formData;

      const formPayload = new FormData();
      formPayload.append("name", name);
      formPayload.append("description", description);
      formPayload.append("image", image);

      const response = await axios.put(
        `${BACKEND_URL}/api/gallery/update/${location.state._id}`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      toast.success("Gallery item Updated successfully!");
      setIsLoading(false);
      navigate("/admin/gallery");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to Update gallery item");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-20">
        <button
          onClick={() => navigate("/admin/gallery")}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition duration-300"
        >
          <BiArrowBack size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-100">
          Update {location.state.name} Gallery Item
        </h1>
      </div>

      {/* Form */}
      <div className="rounded-lg p-6 max-w-4xl mx-auto shadow-2xl">
        <form
          onSubmit={handlesubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                required
                
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter gallery item name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter description"
                rows="3"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 relative">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                //required
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, image: file });
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {previewImage && (
                <div className="mt-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                </div>
              )}
            </div>

            <div className="flex bottom-0 right-0 absolute">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer flex items-center"
              >
                {isLoading ? (
                  <div className="border-t-2 border-white min-w-[20px] min-h-[20px] rounded-full animate-spin"></div>
                ) : (
                  <span className="ml-2">Update Gallery Item</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGallery;
