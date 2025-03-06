import auth from "../../../../middleware/auth";
import admin from "../../../../middleware/admin";
import Category from "../../../../models/Category";
import db from "../../../../utils/db";
import slugify from "slugify";

// POST: Create a new category
export async function POST(req) {
  try {
    const { name } = await req.json();
    await auth(req);
    await admin(req);

    await db.connectDb();
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return new Response(
        JSON.stringify({
          message: "Category already exists. Try a different name.",
        }),
        { status: 400 }
      );
    }

    await new Category({ name, slug: slugify(name) }).save();
    const categories = await Category.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();

    return new Response(
      JSON.stringify({
        message: `Category ${name} has been created successfully.`,
        categories,
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

// DELETE: Delete an existing category
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await auth(req);
    await admin(req);

    await db.connectDb();
    await Category.findByIdAndDelete(id);
    const categories = await Category.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();

    return new Response(
      JSON.stringify({
        message: "Category has been deleted successfully.",
        categories,
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

// PUT: Update an existing category
export async function PUT(req) {
  try {
    const { id, name } = await req.json();
    await auth(req);
    await admin(req);

    await db.connectDb();
    await Category.findByIdAndUpdate(id, { name });
    const categories = await Category.find({}).sort({ createdAt: -1 });
    await db.disconnectDb();

    return new Response(
      JSON.stringify({
        message: "Category has been updated successfully.",
        categories,
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
