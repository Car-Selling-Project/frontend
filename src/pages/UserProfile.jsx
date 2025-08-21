import React, { useState } from 'react'
import { Button, Card, Form, Input, Modal } from 'antd'

const initialProfile = {
  fullName: 'Nguyen Van A',
  email: 'nguyenvana@example.com',
  phone: '0123456789',
  dob: '1990-01-01',
  gender: 'Male',
  address: '123 Main St, City, Country',
  citizenId: '123456789'
}

const UserProfile = () => {
  const [profile, setProfile] = useState(initialProfile)
  const [editField, setEditField] = useState(null)
  const [modalValue, setModalValue] = useState('')

  const handleEdit = (field) => {
    setEditField(field)
    setModalValue(profile[field])
  }

  const handleSave = () => {
    setProfile({ ...profile, [editField]: modalValue })
    setEditField(null)
    setModalValue('')
  }

  return (
    <main className="flex items-center justify-center min-h-screen w-full bg-[#F6F7F9]">
      <Card
        title={<span className="text-2xl font-bold">User Profile</span>}
        style={{ width: '900px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
        className="rounded-2xl flex flex-col"
      >
        <div className="space-y-6">
          <div>
            <label className="font-semibold text-gray-600">Full Name:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.fullName}</span>
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Email:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.email}</span>
              <Button type="link" onClick={() => handleEdit('email')}>Edit</Button>
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Phone Number:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.phone}</span>
              <Button type="link" onClick={() => handleEdit('phone')}>Edit</Button>
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Date Of Birth:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.dob}</span>
              <Button type="link" onClick={() => handleEdit('dob')}>Edit</Button>
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Gender:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.gender}</span>
              <Button type="link" onClick={() => handleEdit('gender')}>Edit</Button>
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Address:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.address}</span>
              <Button type="link" onClick={() => handleEdit('address')}>Edit</Button>
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Citizen ID:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.citizenId}</span>
              <Button type="link" onClick={() => handleEdit('citizenId')}>Edit</Button>
            </div>
          </div>
        </div>
      </Card>
      <Modal
        open={!!editField}
        title={`Edit ${editField && editField.charAt(0).toUpperCase() + editField.slice(1)}`}
        onCancel={() => setEditField(null)}
        onOk={handleSave}
        okText="Save"
      >
        <Form layout="vertical">
          <Form.Item label={editField && editField.charAt(0).toUpperCase() + editField.slice(1)}>
            <Input
              value={modalValue}
              onChange={e => setModalValue(e.target.value)}
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>
    </main>
  )
}

export default UserProfile