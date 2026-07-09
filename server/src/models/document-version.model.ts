import mongoose, { type Document as MongooseDocument, Schema, Types } from "mongoose";

export interface IDocumentVersion extends MongooseDocument {
  document: Types.ObjectId;
  versionNumber: number;
  title: string;
  content: string;
  savedBy: Types.ObjectId;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const documentVersionSchema = new Schema<IDocumentVersion>(
  {
    document: {
      type: Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    savedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      default: "Document updated",
    },
  },
  {
    timestamps: true,
  },
);

documentVersionSchema.index({ document: 1, versionNumber: -1 }, { unique: true });

export const DocumentVersionModel = mongoose.model<IDocumentVersion>(
  "DocumentVersion",
  documentVersionSchema,
);
