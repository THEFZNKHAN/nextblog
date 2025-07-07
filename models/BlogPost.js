import mongoose from "mongoose";
import slugify from "slugify";

const BlogPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        excerpt: {
            type: String,
            maxlength: [300, "Excerpt cannot exceed 300 characters"],
        },
        published: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

// Auto-generate slug
BlogPostSchema.pre("validate", function (next) {
    if (this.title && (this.isModified("title") || this.isNew)) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
        });
    }

    if (this.content && !this.excerpt) {
        const plainText = this.content.replace(/<[^>]*>/g, "");
        this.excerpt = plainText.substring(0, 160).trim() + "...";
    }

    next();
});

// Ensure unique slug
BlogPostSchema.pre("save", async function (next) {
    if (this.isModified("slug")) {
        const existingPost = await this.constructor.findOne({
            slug: this.slug,
            _id: { $ne: this._id },
        });

        if (existingPost) {
            let counter = 1;
            let newSlug = `${this.slug}-${counter}`;

            while (await this.constructor.findOne({ slug: newSlug })) {
                counter++;
                newSlug = `${this.slug}-${counter}`;
            }

            this.slug = newSlug;
        }
    }
    next();
});

export default mongoose.models.BlogPost ||
    mongoose.model("BlogPost", BlogPostSchema);
