import SubCategory from "../../../../models/SubCategory";
import slugify from "slugify";
import auth from "../../../../middleware/auth";
import admin from "../../../../middleware/admin";
import db from "../../../../utils/db";

// POST: Create a new subcategory
export async function POST(req) {
  try {
    const { name, parent } = await req.json();

    await auth(req);
    await admin(req);

    await db.connectDb();
    const existingSubCategory = await SubCategory.findOne({ name });

    if (existingSubCategory) {
      return new Response(
        JSON.stringify({
          message: "SubCategory already exists. Try a different name.",
        }),
        { status: 400 }
      );
    }

    await new SubCategory({
      name,
      parent,
      slug: slugify(name),
    }).save();

    const subCategories = await SubCategory.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();

    return new Response(
      JSON.stringify({
        message: `SubCategory ${name} has been created successfully.`,
        subCategories,
      }),
      { status: 200 }
    );
  } catch (error) {
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// DELETE: Delete an existing subcategory
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await auth(req);
    await admin(req);

    await db.connectDb();
    await SubCategory.findByIdAndDelete(id);
    const subCategories = await SubCategory.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();

    return new Response(
      JSON.stringify({
        message: "SubCategory has been deleted successfully.",
        subCategories,
      }),
      { status: 200 }
    );
  } catch (error) {
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// PUT: Update an existing subcategory
export async function PUT(req) {
  try {
    const { id, name, parent } = await req.json();
    await auth(req);
    await admin(req);

    await db.connectDb();
    await SubCategory.findByIdAndUpdate(id, {
      name,
      parent,
      slug: slugify(name),
    });
    const subCategories = await SubCategory.find({}).sort({ createdAt: -1 });
    await db.disconnectDb();

    return new Response(
      JSON.stringify({
        message: "SubCategory has been updated successfully.",
        subCategories,
      }),
      { status: 200 }
    );
  } catch (error) {
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}

// GET: Retrieve subcategories for a specific category
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");

    if (!category) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    await db.connectDb();
    const results = await SubCategory.find({ parent: category }).select("name");
    await db.disconnectDb();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (error) {
    await db.disconnectDb();
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
    });
  }
}
