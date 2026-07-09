import mongoose, { type Document as MongooseDocument, Schema, Types } from "mongoose";

export type CollaboratorRole = "editor" | "viewer";

export interface ICollaborator {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  email: string;
  name: string;
  role: CollaboratorRole;
}

export interface IDocument extends MongooseDocument {
  title: string;
  description: string;
  content: string;
  owner: Types.ObjectId;
  collaborators: ICollaborator[];
  createdAt: Date;
  updatedAt: Date;
}

const collaboratorSchema = new Schema<ICollaborator>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["editor", "viewer"],
      required: true,
    },
  },
  { _id: true },
);

const documentSchema = new Schema<IDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    collaborators: {
      type: [collaboratorSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

documentSchema.index({ "collaborators.userId": 1 });

export const DocumentModel = mongoose.model<IDocument>("Document", documentSchema);
