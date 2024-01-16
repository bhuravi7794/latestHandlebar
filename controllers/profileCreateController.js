import { check, validationResult } from "express-validator";
import normalizeUrl from "normalize-url";
import Profile from "../models/ProfileModel.js";
import checkObjectId from "../middleware/checkObjectId.js";
import axios from "axios";

const createProfile =
  (check("status", "Status is required").notEmpty(),
  check("skills", "Skills is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body;
    // build a profile
    const profileFields = {
      user: req.user.id,
      website:
        website && website !== ""
          ? normalizeUrl(website, { forceHttps: true })
          : "",
      skills: skills.split(",").map((skill) => " " + skill.trim()),
      ...rest,
    };

    // Build socialFields object
    const socialFields = { youtube, twitter, instagram, linkedin, facebook };

    // normalize social fields to ensure valid url
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true });
    }
    // add to profileFields
    profileFields.social = socialFields;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  });

const getProfileByUserId = async ({ params: { user_id } }, res) => {
  console.log(user_id);
  try {
    const profile = await Profile.findOne({ user: user_id });
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};

const addExperience =
  (check("status", "Status is required").notEmpty(),
  check("experience", "experience is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile.experience.unshift(req.body);
        await profile.save();
        res.redirect("/dashboard");
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  });

const addEducation =
  (check("status", "Status is required").notEmpty(),
  check("school", "school is required").notEmpty(),
  check("fieldsofstudy", "fieldsofstudy is required").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        profile.education.unshift(req.body);
        await profile.save();
        res.redirect("/dashboard");
      }
    } catch (err) {
      console.error(err.message);
      return res.status(500).send("Server Error");
    }
  });

export { createProfile, getProfileByUserId, addExperience, addEducation };

// when we will delte the profile then user details should be deleted .
// for current user
// /all : delete all profiles.
