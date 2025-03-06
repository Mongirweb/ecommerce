import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const subSchema3 = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, "must be atleast 2 charcters"],
    maxlength: [52, "must be atleast 2 charcters"],
  },
  slug: {
    type: String,
    lowercase: true,
    index: true,
  },
  parent: {
    type: ObjectId,
    ref: "SubCategory2",
    required: true,
  },
});

subSchema3.index({ name: "text" });

const SubCategory3 =
  mongoose.models.SubCategory3 || mongoose.model("SubCategory3", subSchema3);

export default SubCategory3;
