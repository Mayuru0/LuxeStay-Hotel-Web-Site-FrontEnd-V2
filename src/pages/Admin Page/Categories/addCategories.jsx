import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const AddCategories = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: "",
    price: "",
    description: "",
    features: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);


//loading




// form submit
 const handlesubmit = async (e) => {
  e.preventDefault();
  
  setIsLoading(true);
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/auth/login");
    return;
  }

  try {
    const { name, price, description, features, image } = formData;

    const featuresArray = features.split(",")
      
    

    const formPayload = new FormData();
    formPayload.append("name", name);           
    formPayload.append("price", price);
    formPayload.append("description", description);
    formPayload.append("features", featuresArray);
    formPayload.append("image", image);

    const response = await axios.post(
      `${BACKEND_URL}/api/category/create`,
      formPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);
    toast.success("Category created successfully!");
    setIsLoading(false);
    navigate("/admin/categories");
  } catch (error) {
    console.error("Error submitting form:", error);
    toast.error("Failed to create category");
  }
};



  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-20">
        <button
          onClick={() => navigate("/admin/categories/")}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
        >
          <BiArrowBack size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-100">Add Category</h1>
      </div>

      {/* Form */}
      <div className=" rounded-lg  p-6 max-w-4xl mx-auto shadow-2xl ">
        <form
          onSubmit={handlesubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter category name"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Price
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="Enter price"
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
                Features
              </label>
              <input
                type="text"
                required
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                placeholder="Enter features (comma-separated)"
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                required
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
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer flex items-center "
              >

                {
                  isLoading?
                  //   loader 
                <div className="border-t-2 border-white min-w-[20px] min-h-[20px] rounded-full animate-spin"> </div>
                :
                //text 
                <span className="ml-2">Add Category</span>
                }

              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;
