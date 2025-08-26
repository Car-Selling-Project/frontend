
import React, { useState } from "react";
import useCarData from "../hooks/useCarData";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";

const CreateReview = () => {
  const { cars, loading } = useCarData();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    carId: "",
    rating: 5,
    comment: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post("/customers/reviews", formData);
      toast.success("Review posted successfully!");
      setFormData({
        carId: "",
        rating: 5,
        comment: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post review");
      console.error(err.response);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create a Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Select Car</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={formData.carId}
            onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
            required
            disabled={loading}
          >
            <option value="">-- Choose a car --</option>
            {cars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Rating</label>
          <input
            type="number"
            min={1}
            max={5}
            step={0.1}
            className="w-full border rounded px-3 py-2"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Comment</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={4}
            placeholder="Share your experience..."
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={submitting || loading}
        >
          {submitting ? "Submitting..." : "Post Review"}
        </button>
      </form>
    </div>
  );
};

export default CreateReview;