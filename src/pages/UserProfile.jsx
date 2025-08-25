import { useEffect, useState } from 'react'
import { Button, Card, Form, Input, Modal, message, Spin, Select } from 'antd'
import axios from '../api/axiosInstance'

const UserProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editField, setEditField] = useState(null)
  const [modalValue, setModalValue] = useState('')
  const [saving, setSaving] = useState(false)

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/customers/')
        setProfile(res.data.profileCustomer)
      } catch (err) {
        message.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleEdit = (field) => {
    setEditField(field)
    setModalValue(profile[field])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await axios.patch('/customers/', { [editField]: modalValue })
      setProfile(res.data.updatedCustomer)
      message.success('Profile updated')
    } catch (err) {
      message.error('Failed to update profile')
    } finally {
      setEditField(null)
      setModalValue('')
      setSaving(false)
    }
  }

  if (loading || !profile) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-[#F6F7F9]">
        <Spin size="large" />
      </main>
    )
  }

  return (
    <main className="flex items-center justify-center max-h-screen w-full bg-[#F6F7F9] dark:bg-[#080808]">
      <Card
        title={<span className="text-2xl font-bold">User Profile</span>}
        bordered={false}
        style={{ width: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
        className="rounded-2xl"
      >
        <div className="space-y-6">
          <div>
            <label className="font-semibold text-gray-600">Name:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.name}</span>
              <Button type="link" onClick={() => handleEdit('name')}>Edit</Button>
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
            <label className="font-semibold text-gray-600">Phone:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.phone}</span>
              <Button type="link" onClick={() => handleEdit('phone')}>Edit</Button>
            </div>
          </div>
          <div>
            <label className="font-semibold text-gray-600">Date of Birth:</label>
            <div className="flex items-center justify-between">
              <span className="text-lg">{profile.dob?.slice(0, 10)}</span>
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
        confirmLoading={saving}
      >
        <Form layout="vertical">
          <Form.Item label={editField && editField.charAt(0).toUpperCase() + editField.slice(1)}>
            {editField === 'gender' ? (
              <Select
                value={modalValue}
                onChange={value => setModalValue(value)}
              >
                <Select.Option value="male">Male</Select.Option>
                <Select.Option value="female">Female</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            ) : (
              <Input
                value={modalValue}
                onChange={e => setModalValue(e.target.value)}
                autoFocus
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </main>
  )
}

export default UserProfile