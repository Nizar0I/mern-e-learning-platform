// AdminDashboard.js
import React, { useEffect, useState } from 'react';
// Import your function
import { getAdminDashboardStats } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    coursesCount: 0,
    instructorsCount: 0,
    studentsCount: 0,
    boughtCoursesCount: 0,
    coursesPerProfessor: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Call your imported helper function
        const response = await getAdminDashboardStats();

        // If your API returns an object like { success: true, data: { ... } }
        // you may need `response.data` instead of just `response`.
        // Adjust as needed:
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          // If the shape is different, adapt accordingly
          setStats(response);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h2>Courses</h2>
          <p>{stats.coursesCount}</p>
        </div>
        <div className="stat-card">
          <h2>Instructors</h2>
          <p>{stats.instructorsCount}</p>
        </div>
        <div className="stat-card">
          <h2>Students</h2>
          <p>{stats.studentsCount}</p>
        </div>
        <div className="stat-card">
          <h2>Purchased Courses</h2>
          <p>{stats.boughtCoursesCount}</p>
        </div>
        <div className="stat-card">
          <h2>Avg Courses per Professor</h2>
          <p>{stats.coursesPerProfessor}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
