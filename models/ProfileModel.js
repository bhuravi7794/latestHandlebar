import mongoose from "mongoose";
import { encryptPassword, validatePassword } from "../utils/passwordUtils.js";

const ProfileSchema = new mongoose.Schema({
  // userid
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
  company: {
    type: String,
  },
  website: {
    type: String,
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  bio: {
    type: String,
  },
  githubusername: {
    type: String,
  },
  social: {
    youtube: { type: String },
    twitter: { type: String },
    facebook: { type: String },
    linkedin: { type: String },
    instagram: { type: String },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String, required: true },
      from: { type: Date, required: true },
      to: { type: Date },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  education: [
    {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      fieldsofstudy: { type: String },
      from: { type: Date, required: true },
      to: { type: Date },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
});
const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
