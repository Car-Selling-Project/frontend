import React from "react";
import useCarData from "../../hooks/useCarData";
import CarCard from "../../components/CarCard";
import CarList from "../../components/CarList";
import { useNavigate, useSearchParams } from "react-router-dom";
import SidebarFilter from "../../components/SidebarFilter";
import SearchInput from "../../components/filters/SearchInput";
import ViewToggle from "../../components/ViewToggle"; // ✅ IMPORT COMPONENT
import { Pagination } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const Category = () => {
  const { cars, loading, total, page, limit, viewMode } = useCarData();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSearch = (searchTerm) => {
    console.log("Search term:", searchTerm);
  };

  const handleViewAll = () => {
    navigate("/customers/cars");
    setSearchParams({ page: "1", viewMode }); // Chỉ giữ page và viewMode, reset filter
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams); // Sao chép tham số hiện tại
    params.set("page", String(newPage));
    setSearchParams(params); // Giữ nguyên các filter khác
  };

  const handleToggleView = (mode) => {
    const params = new URLSearchParams(searchParams); // Sao chép tham số hiện tại
    params.set("page", "1");
    params.set("viewMode", mode);
    setSearchParams(params); // Giữ nguyên các filter khác
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex">
      <SidebarFilter />
      <main className="flex-1 p-6">
        <SearchInput onSearch={handleSearch} />

        {/* Header */}
        <div className="flex justify-between items-center mt-6 mb-4">
          <h1 className="text-2xl font-bold dark:text-white">Available Cars</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleViewAll}
              className="text-blue-600 hover:text-blue-400 px-4 py-2 rounded-md text-base underline font-medium"
            >
              View All
            </button>
            <ViewToggle viewMode={viewMode} setViewMode={handleToggleView} />
          </div>
        </div>

        {/* Car Cards */}
        {cars.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {viewMode === "grid"
              ? cars.map((car) => (
                  <CarCard key={car._id} car={car} />
                ))
              : cars.map((car) => (
                  <CarList key={car._id} car={car} />
                ))}
          </div>
        ) : (
          <p className="dark:text-white">No cars match your filters.</p>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            showSizeChanger={false}
            onChange={handlePageChange}
            itemRender={(page, type, originalElement) => {
              if (type === "prev") {
                return (
                  <button className="rounded bg-transparent text-white">
                    <LeftOutlined />
                  </button>
                );
              }
              if (type === "next") {
                return (
                  <button className="rounded bg-transparent text-white">
                    <RightOutlined />
                  </button>
                );
              }
              return originalElement;
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default Category;