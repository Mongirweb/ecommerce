import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const subSchema2 = new mongoose.Schema({
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
    ref: "SubCategory",
    required: true,
  },
});

subSchema2.index({ name: "text" });

const SubCategory2 =
  mongoose.models.SubCategory2 || mongoose.model("SubCategory2", subSchema2);

export default SubCategory2;
