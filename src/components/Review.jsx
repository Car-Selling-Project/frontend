import { useEffect, useState } from "react";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import api from "../api/axiosInstance"; 

const ReviewSection = ({ carId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get("/reviews");
        // Lọc review chỉ cho xe hiện tại
        const carReviews = res.data.reviews.filter(r => r.car && r.car._id === carId);
        setReviews(carReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [carId]);

  if (loading) return <div className="text-center py-4">Loading reviews...</div>;
  if (reviews.length === 0) return <p className="text-gray-500">Chưa có đánh giá nào</p>;

  return (
    <div>
      {reviews.map((review) => (
        <div key={review._id} className="p-4 rounded-lg flex flex-row items-start justify-between border-b">
          <div className="flex flex-row gap-4">
            <img src="/user.png" alt={review.customer.name} className="w-12 h-12 rounded-full object-cover" />
            <div className="text-left">
              <h3 className="font-bold text-xl">{review.customer.name}</h3>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) =>
                  i < review.rating ? (
                    <StarFilled key={i} className="text-yellow-400" />
                  ) : (
                    <StarOutlined key={i} className="text-gray-400" />
                  )
                )}
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
            </div>
          </div>
          <div className="text-sm text-gray-400">{review.date}</div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;