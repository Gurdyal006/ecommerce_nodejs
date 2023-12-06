import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
  },
  { timestamps: true }
);

const categories = mongoose.model("Category", categorySchema);
export default categories;
