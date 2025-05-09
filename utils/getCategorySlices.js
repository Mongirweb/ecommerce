import { Types } from "mongoose";
import Product from "../models/Product";

/**
 * Return one array with `limit` random products per category,
 * excluding banned words and zero‑stock items.
 */
export async function getCategorySlices(
  ids,
  limit = 5,
  specialId = "66b683b6c2bd5f4688ba3e67",
  specialSub = "672be34173a386d9e158d4ef"
) {
  const facets = {};
  const banned =
    /(man|men| hombre|calavera|rata|placa|cenicero|DARCCO|hachuela|flameador|cuchillo|condones|sujetador|sierra| preservativos| cucarachas|BERETTA|manopla|Daga|DAGA|candela|condon|condones|flameador)/i;

  ids.forEach((id, idx) => {
    const baseMatch =
      id === specialId
        ? { subCategories: new Types.ObjectId(specialSub) }
        : { category: new Types.ObjectId(id) };

    facets[`cat${idx}`] = [
      { $sample: { size: limit } }, // random pick
    ];
  });

  const [result] = await Product.find({});

  // flatten & shuffle
  const flat = Object.values(result).flat();
  for (let i = flat.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [flat[i], flat[j]] = [flat[j], flat[i]];
  }
  return flat;
}
