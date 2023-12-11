import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;
