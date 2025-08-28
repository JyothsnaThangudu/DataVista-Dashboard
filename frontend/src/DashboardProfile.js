
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardProfile.css';

function DashboardProfile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', username: '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [avatar, setAvatar] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem('access');
  const res = await axios.get('/api/profile/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(res.data);
        setForm({
          name: res.data.name || '',
          email: res.data.email || '',
          username: res.data.username || '',
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      } catch (err) {
        setMessage('Failed to load profile.');
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = e => {
    setAvatar(e.target.files[0]);
  };

  const handleSave = async e => {
    e.preventDefault();
    setMessage('');
    try {
      const token = localStorage.getItem('access');
      // Profile update
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      if (avatar) formData.append('avatar', avatar);
      formData.append('username', form.username);
      // If password fields are filled, call password change endpoint
      if (form.currentPassword && form.newPassword && form.confirmNewPassword) {
        if (form.newPassword !== form.confirmNewPassword) {
          setMessage('New passwords do not match.');
          return;
        }
        await axios.post('/api/change-credentials/', {
          username: form.username,
          current_password: form.currentPassword,
          new_password: form.newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('Username/password updated!');
      }
      // Profile update as before
      const res = await axios.put('/api/profile/', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfile(res.data);
      setEditMode(false);
      setMessage('Profile updated!');
    } catch (err) {
      setMessage('Failed to update profile or credentials.');
    }
  };

  return (
    <div className="profile-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ flex: 1 }} />
      <div className="profile-card">
        <div className="profile-header">Profile</div>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#888', fontSize: '1.1rem', margin: '32px 0' }}>Loading...</div>
        ) : (
          <>
            <div className="profile-avatar-row">
              <img
                className="profile-avatar"
                src={profile.avatar ? `/media/${profile.avatar}` : 'https://ui-avatars.com/api/?name=' + (profile.username || 'U')}
                alt="avatar"
              />
              <div className="profile-info">
                <div className="profile-username">{profile.username}</div>
                <div className="profile-updated">Last updated: {profile.last_updated ? new Date(profile.last_updated).toLocaleString() : '-'}</div>
              </div>
            </div>
            {editMode && (
              <>
                <div className="profile-modal-overlay" onClick={() => setEditMode(false)} />
                <div className="profile-modal">
                  <form className="profile-modal-form" onSubmit={handleSave}>
                    <div className="profile-modal-columns-grid">
                      <div className="profile-modal-col">
                        <div className="profile-field">
                          <label className="profile-label" htmlFor="name">Name</label>
                          <input className="profile-input" id="name" type="text" name="name" value={form.name} onChange={handleChange} />
                        </div>
                        <div className="profile-field">
                          <label className="profile-label" htmlFor="email">Email</label>
                          <input className="profile-input" id="email" type="email" name="email" value={form.email} onChange={handleChange} />
                        </div>
                        <div className="profile-field">
                          <label className="profile-label" htmlFor="username">Username</label>
                          <input className="profile-input" id="username" type="text" name="username" value={form.username} onChange={handleChange} />
                        </div>
                        <div className="profile-field">
                          <label className="profile-label" htmlFor="avatar">Avatar</label>
                          <input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} style={{ marginTop: 4 }} />
                        </div>
                      </div>
                      <div className="profile-modal-col">
                        <div className="profile-field">
                          <label className="profile-label" htmlFor="currentPassword">Current Password</label>
                          <input className="profile-input" id="currentPassword" type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} />
                        </div>
                        <div className="profile-field">
                          <label className="profile-label" htmlFor="newPassword">New Password</label>
                          <input className="profile-input" id="newPassword" type="password" name="newPassword" value={form.newPassword} onChange={handleChange} />
                        </div>
                        <div className="profile-field">
                          <label className="profile-label" htmlFor="confirmNewPassword">Confirm New Password</label>
                          <input className="profile-input" id="confirmNewPassword" type="password" name="confirmNewPassword" value={form.confirmNewPassword} onChange={handleChange} />
                        </div>
                      </div>
                    </div>
                    <div className="profile-btn-row">
                      <button type="submit" className="profile-btn">Save</button>
                      <button type="button" className="profile-btn profile-btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                    </div>
                    {message && (
                      <div className={`profile-message ${message.includes('Failed') ? 'profile-message-error' : 'profile-message-success'}`}>{message}</div>
                    )}
                  </form>
                </div>
              </>
            )}
            {!editMode && (
              <div className="profile-view">
                <div><span className="profile-label">Name:</span> {profile.name || '-'}</div>
                <div><span className="profile-label">Email:</span> {profile.email || '-'}</div>
                <button className="profile-btn" style={{ marginTop: 12 }} onClick={() => setEditMode(true)}>Edit Profile</button>
              </div>
            )}
          </>
        )}
      </div>
      <div style={{ flex: 2 }} />
    </div>
  );
}

export default DashboardProfile;
