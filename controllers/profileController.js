import { check, validationResult } from "express-validator";
import normalizeUrl from "normalize-url";
import Profile from "../models/ProfileModel.js";
import UserModel from "../models/UsersModel.js";
import checkObjectId from "../middleware/checkObjectId.js";
import axios from "axios";
import axiosObject from "../utils/axiosObject.js";

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
        socialFields[key] = normalizeUrl(value, { forceHttps: true });
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

// we will use the token and get the profile detials.
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name"]
    );
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile" });
    }
    res.json(profile);
  } catch (err) {}
};

const getProfileData = async (eledata) => {
  const profiles = await Profile.findOne({ user: eledata._id });
  console.log("profile", profiles);
};
// should retrieve the all profiles.
const getProfiles = async (req, res) => {
  try {
    const profileData = await Profile.find();
    //const profileData = [];
    // userData.forEach((ele) => {
    //   const profiles = getProfileData(ele);
    //   if (profiles) {
    //     profileData.push(profiles);
    //   }
    //});
    // res.json(profileData);
    // console.log(profileData);
    res.render("profile/pages/profiles/allProfiles", {
      profileData: profileData,
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("Server Error");
  }
};
// to retrieve  profile on the basis of userid.
const getProfileByUserId = async ({ params: { user_id } }, res) => {
  res.json({ user_id });
};
const getProfileByGithub = async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      "user-agent": "nodejs",
      Authorization: `token=${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}`,
    };
    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: "No Github profile found" });
  }
};

const getProfilePage = async (req, res) => {
  const data = { user: req.user };
  await axiosObject
    .get("/profile/me", {
      headers: { Cookie: `jwtToken=${req.cookies.jwtToken}` },
    })
    .then((response) => {
      data.profile = response.data;
    })
    .catch((err) => {
      data.profile = null;
    });

  res.render("profile/pages/profile", { profileData: data });
};
export {
  createProfile,
  getProfile,
  getProfiles,
  getProfileByUserId,
  getProfileByGithub,
  getProfilePage,
};

// when we will delte the profile then user details should be deleted .
// for current user
// /all : delete all profiles.
