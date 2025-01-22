// pages/AdminUsersPage.jsx

import React, { useState, useEffect } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../services/api";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // For creating or editing a user in a modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Form fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [password, setPassword] = useState("");

  // Error & Success Messages
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all users initially
  useEffect(() => {
    fetchUsers("");
  }, []);

  // Re-fetch if searchTerm changes (debounce optional)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchUsers = async (search) => {
    try {
      setError("");
      const response = await getAllUsers(search);
      setUsers(response.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to fetch users.");
    }
  };

  // Open the modal in CREATE mode
  const openCreateModal = () => {
    setIsModalOpen(true);
    setIsEditMode(false);
    setSelectedUserId(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("student");
    setError("");
    setMessage("");
  };

  // Open the modal in EDIT mode
  const openEditModal = (user) => {
    setIsModalOpen(true);
    setIsEditMode(true);
    setSelectedUserId(user._id);
    setUsername(user.username);
    setEmail(user.email);
    setRole(user.role);
    // For security, we do not pre-fill password
    setPassword("");
    setError("");
    setMessage("");
  };

  // Handle Create/Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Prepare payload
    const payload = {
      username,
      email,
      role,
    };
    // Only include 'password' if the admin set one
    if (password) {
      payload.password = password;
    }

    try {
      if (isEditMode) {
        // Update existing user
        await updateUser(selectedUserId, payload);
        setMessage("User updated successfully!");
      } else {
        // Create new user
        await createUser(payload);
        setMessage("User created successfully!");
      }
      setIsModalOpen(false);
      fetchUsers(searchTerm);
    } catch (err) {
      console.error("Failed to save user:", err);
      setError("Failed to save user.");
    }
  };

  // Handle Delete
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      setError("");
      setMessage("");
      await deleteUser(userId);
      setMessage("User deleted successfully!");
      fetchUsers(searchTerm);
    } catch (err) {
      console.error("Failed to delete user:", err);
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users (Admin)</h2>

      {/* Search + Create User Button */}
      <div className="mb-4 flex space-x-2">
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={() => fetchUsers(searchTerm)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
        <button
          onClick={openCreateModal}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create New User
        </button>
      </div>

      {/* Error & Success Messages */}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4 capitalize">{user.role}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded p-6 relative">
            <h3 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit User" : "Create User"}
            </h3>

            {/* Error / Success inside modal (optional) */}
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {message && <p className="text-green-600 mb-2">{message}</p>}

            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Username</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Role */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">Role</label>
                <select
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Password (only if creating new user or resetting) */}
              <div className="mb-4">
                <label className="block mb-1 font-semibold">
                  {isEditMode ? "Reset Password?" : "Password"}
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEditMode ? "Leave blank to keep current password" : ""}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isEditMode ? "Save Changes" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersPage;
