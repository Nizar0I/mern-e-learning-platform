const Course = require('../models/Course');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Controller function to fetch dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Fetch counts for courses, instructors, and students
    const coursesCount = await Course.countDocuments();
    const instructorsCount = await User.countDocuments({ role: 'instructor' });
    const studentsCount = await User.countDocuments({ role: 'student' });

    // Fetch total number of completed payments (paid courses)
    const completedPayments = await Payment.countDocuments({ status: 'paid' });

    // Calculate average number of courses per instructor
    const coursesPerInstructor = instructorsCount > 0
      ? (coursesCount / instructorsCount).toFixed(2)
      : 0;

    // Combine all data into an object
    const stats = {
      coursesCount,
      instructorsCount,
      studentsCount,
      completedPayments,
      coursesPerInstructor,
    };

    // Send the statistics as the response
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard statistics:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics.',
    });
  }
};

module.exports = { getDashboardStats };
