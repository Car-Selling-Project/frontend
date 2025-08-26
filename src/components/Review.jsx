import { useEffect, useState } from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import axios from "../api/axiosInstance";

const ReviewSection = ({ carId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!carId) return;
    setLoading(true);
    setError("");
    axios.get(`/customers/reviewss/${carId}`)
      .then(res => {
        setReviews(res.data.reviews || []);
      })
      .catch(err => {
        setError("Không thể tải đánh giá");
        setReviews([]);
      })
      .finally(() => setLoading(false));
  }, [carId]);

  if (loading) return <div className="text-center py-4">Đang tải đánh giá...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (!reviews.length) return <p className="text-gray-500">Chưa có đánh giá nào cho xe này.</p>;

  return (
    <section className="space-y-6 bg-white p-5">
      <h2 className="text-xl font-bold mb-2">Review from customer</h2>
      {reviews.map((review) => (
        <article key={review._id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
          <img
            src="/user.png"
            alt={review.customer?.name || "User"}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">{review.customer?.name || "Ẩn danh"}</span>
              <span className="text-xs text-gray-400">{review.date}</span>
            </div>
            <div className="flex gap-1 mt-1">
              {[...Array(5)].map((_, i) =>
                i < Math.round(review.rating)
                  ? <StarFilled key={i} className="text-yellow-400" />
                  : <StarOutlined key={i} className="text-gray-300" />
              )}
              <span className="ml-2 text-sm text-gray-600">{review.rating}/5</span>
            </div>
            <p className="mt-2 text-gray-700 whitespace-pre-line">{review.comment}</p>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ReviewSection;