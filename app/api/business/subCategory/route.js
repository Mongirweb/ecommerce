import { NextResponse } from "next/server";
import auth from "../../../../middleware/auth";
import business from "../../../../middleware/business";
import SubCategory from "../../../../models/SubCategory";
import db from "../../../../utils/db";
import slugify from "slugify";

// Middleware to check authentication and business role
async function checkAuthAndBusiness(req) {
  await auth(req);
  await business(req);
}

// POST: Create a new SubCategory
export async function POST(req) {
  try {
    await checkAuthAndBusiness(req);

    const { name, parent } = await req.json(); // Using `req.json()` for App Router
    await db.connectDb();
    const test = await SubCategory.findOne({ name });
    if (test) {
      return NextResponse.json(
        { message: "SubCategory already exists, Try a different name" },
        { status: 400 }
      );
    }

    await new SubCategory({ name, parent, slug: slugify(name) }).save();
    const subCategories = await SubCategory.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();

    return NextResponse.json({
      message: `SubCategory ${name} has been created successfully.`,
      subCategories,
    });
  } catch (error) {
    await db.disconnectDb();
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// DELETE: Remove a SubCategory by ID
export async function DELETE(req) {
  try {
    await checkAuthAndBusiness(req);

    const { id } = await req.json();
    await db.connectDb();
    await SubCategory.findByIdAndDelete(id);
    const subCategories = await SubCategory.find({}).sort({ updatedAt: -1 });
    await db.disconnectDb();

    return NextResponse.json({
      message: "SubCategory has been deleted successfully",
      subCategories,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// PUT: Update an existing SubCategory
export async function PUT(req) {
  try {
    await checkAuthAndBusiness(req);

    const { id, name, parent } = await req.json();
    await db.connectDb();
    await SubCategory.findByIdAndUpdate(id, {
      name,
      parent,
      slug: slugify(name),
    });
    const subCategories = await SubCategory.find({}).sort({ createdAt: -1 });
    await db.disconnectDb();

    return NextResponse.json({
      message: "SubCategory has been updated successfully",
      subCategories,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// GET: Fetch subcategories for a specific category
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    if (!category) {
      return NextResponse.json([]);
    }

    await db.connectDb();
    const results = await SubCategory.find({ parent: category }).select("name");
    await db.disconnectDb();

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
