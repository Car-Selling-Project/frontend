import { useState, useEffect } from "react";
import {
  DeleteOutlined,
  InfoCircleOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import { toast } from "react-toastify";
import { Pagination, Modal, Tag, Descriptions, Image, Spin, Form, Input, Button } from "antd";
import AddCar from "../../components/AddCar";
import useCarData from "../../hooks/useCarData";
import api from '../../api/axiosInstance';
import AdminSidebar from "../../components/AdminSidebar"


const CarDetailModal = ({ car, open, onClose }) => {
  if (!car) return null;
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <div className="flex items-center gap-2">
          <InfoCircleOutlined className="text-blue-500" />
          <span>Car Detail</span>
        </div>
      }
      width={700}
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Image
            src={car.images?.[0]}
            alt={car.title}
            width={180}
            height={120}
            className="rounded-lg object-scale-down"
            fallback="https://via.placeholder.com/180x120?text=No+Image"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {(car.images || []).slice(1).map((img, idx) => (
              <Image
                key={idx}
                src={img}
                width={50}
                height={40}
                className="rounded object-scale-down"
                fallback="https://via.placeholder.com/50x40?text=No+Image"
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <Descriptions
            column={1}
            size="small"
            labelStyle={{ fontWeight: 600, width: 120 }}
            contentStyle={{ color: "#222" }}
          >
            <Descriptions.Item label="Title">{car.title}</Descriptions.Item>
            <Descriptions.Item label="Description">{car.description}</Descriptions.Item>
            <Descriptions.Item label="Brand">
              {typeof car.brandId === 'object' ? car.brandId?.name : car.brandId}
            </Descriptions.Item>
            <Descriptions.Item label="Model">{car.model}</Descriptions.Item>
            <Descriptions.Item label="Price">${car.price}</Descriptions.Item>
            <Descriptions.Item label="Fuel Type">{car.fuelType}</Descriptions.Item>
            <Descriptions.Item label="Transmission">{car.tranmission}</Descriptions.Item>
            <Descriptions.Item label="Seats">{car.seat}</Descriptions.Item>
            <Descriptions.Item label="Car Type">{car.carType}</Descriptions.Item>
            <Descriptions.Item label="Exterior Color">
              {(car.exteriorColor || []).map((color, idx) => (
                <Tag key={idx} color="blue">{color}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Registration Year">{car.registrationYear}</Descriptions.Item>
            <Descriptions.Item label="Dimension">
              {car.dimension
                ? `${car.dimension.length} x ${car.dimension.width} x ${car.dimension.height} mm`
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Engine">
              {car.engine
                ? `Power: ${car.engine.power}, Fuel: ${car.engine.fuelconsumsion}`
                : "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Stock">{car.stock}</Descriptions.Item>
            <Descriptions.Item label="Rating">{car.rating} / 5</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={car.status === "active" ? "green" : "red"}>
                {car.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      </div>
    </Modal>
  );
};

const EditCarModal = ({ car, open, onClose, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (car) {
      form.setFieldsValue({
        title: car.title,
        model: car.model,
        price: car.price,
        stock: car.stock,
      });
      setNewImages([]);
    }
  }, [car, form]);

  const handleImageChange = (e) => {
    setNewImages(Array.from(e.target.files));
  };

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      newImages.forEach((file) => formData.append("images", file));
      await api.patch(`/admins/cars/${car?._id || car?.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Car updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update car");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!car) return null; // <-- Prevent rendering if car is null

  return (
    
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title="Edit Car"
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Form.Item label="Title" name="title">
          <Input />
        </Form.Item>
        <Form.Item label="Model" name="model">
          <Input />
        </Form.Item>
        <Form.Item label="Price" name="price">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Stock" name="stock">
          <Input type="number" />
        </Form.Item>
        <Form.Item label="Add Images">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
      <div>
        <strong>Current Images:</strong>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {(car.images || []).map((img, idx) => (
            <Image
              key={idx}
              src={img}
              width={50}
              height={40}
              style={{ borderRadius: 4, objectFit: "cover" }}
              fallback="https://via.placeholder.com/50x40?text=No+Image"
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};

const ListCars = () => {
  const { cars, loading, refetch } = useCarData();
  const [editCar, setEditCar] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const total = cars?.length || 0;

  // Checkbox state
  const [checkedIds, setCheckedIds] = useState([]);
  const [modalCar, setModalCar] = useState(null);

  useEffect(() => {
    // Reset checkedIds if cars change
    setCheckedIds([]);
  }, [cars]);

  const handleCheck = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleCheckAll = () => {
    if (checkedIds.length === pagedData.length) {
      setCheckedIds([]);
    } else {
      setCheckedIds(pagedData.map((car) => car._id || car.id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCheckedIds([]); // Optionally clear checks on page change
  };

  const handleEditCar = (car) => {
    setEditCar(car);
    setEditModalOpen(true);
  };

  const handleUpdateCar = () => {
    if (refetch) refetch();
  };

  const refreshCars = () => {
    setCurrentPage(1); // Always show first page after any change
    if (refetch) refetch();
  };

  const handleDeleteCar = async (id) => {
    try {
      await api.delete(`/admins/cars/${id}`);
      toast.success("Car deleted successfully");
      if (refetch) refetch();
      refreshCars();
    } catch (error) {
      toast.error("Failed to delete car");
      console.error(error);
    }
  };

  // Slice data for current page
  const pagedData = cars ? cars.slice((currentPage - 1) * pageSize, currentPage * pageSize) : [];

  return (
    <div className="flex min-h-screen items-center bg-[#F6F7F9] ">
      <div className="flex-1 flex flex-col px-8 py-6">
        <div className="w-full bg-white rounded-2xl shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <AddCar onAdd={refreshCars} />
          </div>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Spin size="large" />
              </div>
            ) : (
              <table className="w-full text-left bg-white rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-gray-50 text-[#222] text-sm font-semibold border-b">
                    <th className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          pagedData.length > 0 &&
                          checkedIds.length === pagedData.length
                        }
                        ref={(el) => {
                          if (el)
                            el.indeterminate =
                              checkedIds.length > 0 &&
                              checkedIds.length < pagedData.length;
                        }}
                        onChange={handleCheckAll}
                        className="accent-blue-600 w-5 h-5 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3">Name of car</th>
                    <th className="px-4 py-3">Brand</th>
                    <th className="px-4 py-3">Model</th>
                    <th className="px-4 py-3">Registration Year</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedData.map((car, idx) => (
                    <tr
                      key={car._id || car.id}
                      className={`border-b last:border-b-0 text-base transition-colors ${checkedIds.includes(car._id || car.id)
                        ? "bg-blue-50"
                        : idx % 2 === 0
                          ? "bg-white"
                          : "bg-gray-50"
                        } hover:bg-blue-100`}
                    >
                      <td className="px-4 py-4 align-middle">
                        <input
                          type="checkbox"
                          checked={checkedIds.includes(car._id || car.id)}
                          onChange={() => handleCheck(car._id || car.id)}
                          className="accent-blue-600 w-5 h-5 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-4 flex items-center gap-3">
                        <span className="font-semibold text-[#222]">
                          {car.title}
                        </span>
                        <button
                          className="ml-2 text-blue-600 hover:text-blue-800"
                          onClick={() => setModalCar(car)}
                          title="View Details"
                        >
                          <InfoCircleOutlined className="cursor-pointer" />
                        </button>
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {typeof car.brandId === 'object' ? car.brandId?.name : car.brandId}
                      </td>
                      <td className="px-4 py-4 text-gray-700">{car.model}</td>
                      <td className="px-4 py-4 text-gray-700">{car.registrationYear}</td>
                      <td className="px-4 py-4 text-gray-700">
                        {typeof car.locationId === 'object' ? car.locationId?.name : car.locationId}
                      </td>
                      <td className="px-4 py-4 text-gray-700">{car.stock}</td>
                      <td className="px-4 py-4">
                        <button
                          className="hover:bg-blue-200 text-blue-600 rounded-full p-2 mx-2 transition cursor-pointer"
                          onClick={() => handleEditCar(car)}
                          title="Edit Car"
                        >
                          <EllipsisOutlined />
                        </button>
                        <button
                          className="hover:bg-blue-200 text-red-600 rounded-full p-2 mx-2 transition cursor-pointer"
                          onClick={() => handleDeleteCar(car._id || car.id)}
                          title="Delete Car"
                        >
                          <DeleteOutlined />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {/* Ant Design Pagination */}
          <div className="flex items-center justify-between mt-6">
            <span className="text-gray-400 text-sm">
              Showing {(currentPage - 1) * pageSize + 1}-
              {Math.min(currentPage * pageSize, total)} from {total} data
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="flex"
            />
          </div>
        </div>
        {/* Car Detail Modal */}
        <CarDetailModal
          car={modalCar}
          open={!!modalCar}
          onClose={() => setModalCar(null)}
        />
        {/* Edit Car Modal */}
        <EditCarModal
          car={editCar}
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          onUpdate={handleUpdateCar}
        />
      </div>
    </div>
  );
};

export default ListCars;