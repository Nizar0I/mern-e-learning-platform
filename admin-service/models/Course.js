// models/Course.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const LectureSchema = new Schema({
  title: String,
  videoUrl: String,
  duration: Number,
  resources: [String],
});

const SectionSchema = new Schema({
  sectionTitle: String,
  lectures: [LectureSchema],
});

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    instructorId: { type: Schema.Types.ObjectId, required: true },
    price: { type: Number, default: 0 },
    categories: [String],
    content: [SectionSchema],
    ratings: [
      {
        userId: Schema.Types.ObjectId,
        rating: Number,
        comment: String,
      },
    ],

    // <-- ADD THIS: We store a Base64 string
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', CourseSchema);
