import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [galleryIsLoading, setGalleryIsLoading] = useState(true);
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      setGalleryIsLoading(false);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth/login");
        return;
      }

      try {
        if (!galleryLoaded) {
          const response = await axios.get(`${BACKEND_URL}/api/gallery/get`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(response.data);
          setGallery(response.data.data);
          setGalleryLoaded(true);
        }
      } catch (error) {
        console.log(error);
        setGalleryIsLoading(false);
        setGallery([]);
      } finally {
        setGalleryIsLoading(false);
      }
    };
    fetchGallery();
  }, [galleryLoaded, navigate]);


  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this gallery item: ${name}?`
    );

    if (!confirmDelete) return;

    const token = localStorage.getItem("token");

    try {
      if (!token) {
        navigate("/auth/login");
        return;
      }

      const response = await axios.delete(
        `${BACKEND_URL}/api/gallery/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(response.data);
      toast.success("Gallery item deleted successfully!");
      setGalleryLoaded(false);
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete gallery item.");
    }
  };

  return (
    <div className="w-full p-6">
      <div className="flex justify-between mb-20">
        <h1 className="text-3xl font-bold mb-6 text-gray-100">Gallery</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => navigate("/admin/gallery/addgallery")}
        >
          Add Gallery Item +
        </button>
      </div>

      {galleryIsLoading ? (
        <p className="text-gray-600">Loading gallery items...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded shadow">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4 border">Image</th>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Price</th>
                <th className="py-2 px-4 border">Description</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {gallery.length > 0 ? (
                gallery.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border px-4 py-2 text-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt="Gallery"
                          className="w-12 h-12 object-cover rounded mx-auto"
                        />
                      ) : (
                        "No image"
                      )}
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {item.id || item._id}
                    </td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.price}</td>
                    <td className="border px-4 py-2">{item.description}</td>
                    <td className="border px-4 py-2 text-center">
                      <Link
                        to={`/admin/gallery/updategallery`}
                        state={item}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2 hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-600">
                    No gallery items available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Gallery;
