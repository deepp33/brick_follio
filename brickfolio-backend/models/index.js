import mongoose from "mongoose";
import { FormulaSchema } from "./formula/model.js";
import { ProjectSchema } from "./project/model.js";
import { UserSchema } from "./user/model.js";
import { OnboardingSchema } from "./onboarding/model.js";
import { newsSchema } from "./news/model.js";
import { WishlistSchema } from "./wishlist/model.js";

export const Project = mongoose.model("Project", ProjectSchema);
export const Formula = mongoose.model("Formula", FormulaSchema);
export const User = mongoose.model("User", UserSchema);
export const Onboarding = mongoose.model("Onboarding", OnboardingSchema);
export const News = mongoose.model("News", newsSchema);
export const Wishlist = mongoose.model("Wishlist", WishlistSchema);