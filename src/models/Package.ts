import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPackageMedia {
  url: string;
  publicId?: string;
  alt?: string;
  type?: "image" | "video";
}

export interface IPackageSeo {
  h1?: string;
  h2?: string;
  metaDescription?: string;
}

export interface IPackage extends Document {
  name: string;
  slug: string;
  category: string;
  basePrice: number;
  depositPrice?: number;
  durationHours?: number;
  maxGuests?: number;
  shortDescription?: string;
  description: string;
  highlights: string[];
  media: IPackageMedia[];
  seo?: IPackageSeo;
  seoTitle?: string;
  seoDescription?: string;
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageMediaSchema = new Schema<IPackageMedia>(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    alt: { type: String, trim: true },
    type: { type: String, enum: ["image", "video"], default: "image" },
  },
  { _id: false }
);

const PackageSeoSchema = new Schema<IPackageSeo>(
  {
    h1: { type: String, trim: true },
    h2: { type: String, trim: true },
    metaDescription: { type: String, trim: true, maxlength: 165 },
  },
  { _id: false }
);

const PackageSchema = new Schema<IPackage>(
  {
    name: {
      type: String,
      required: [true, "El nombre del paquete es obligatorio"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "El slug es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      default: "Eventos",
      trim: true,
      index: true,
    },
    basePrice: {
      type: Number,
      required: [true, "El precio base es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    depositPrice: {
      type: Number,
      min: [0, "El anticipo no puede ser negativo"],
    },
    durationHours: {
      type: Number,
      min: [0, "La duración no puede ser negativa"],
    },
    maxGuests: {
      type: Number,
      min: [0, "La capacidad no puede ser negativa"],
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 220,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    media: {
      type: [PackageMediaSchema],
      default: [],
    },
    seo: {
      type: PackageSeoSchema,
      default: () => ({}),
    },
    seoTitle: {
      type: String,
      trim: true,
      maxlength: 70,
    },
    seoDescription: {
      type: String,
      trim: true,
      maxlength: 165,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

PackageSchema.pre("validate", function (next) {
  if (!this.slug) {
    const baseSource = this.seo?.h1 || this.name;
    if (baseSource) {
      this.slug = baseSource
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
  }
  next();
});

const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);

export default Package;