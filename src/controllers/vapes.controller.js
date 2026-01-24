import { supabase } from "../supabaseClient.js";
import path from "path";
export const createVape = async (req, res) => {
  try {
    const { name, price, description, brand, flavor, strength, stock, puffs } =
      req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Нет названия или цены" });
    }

    let imageURL = null;

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `${Date.now()}${ext}`;

      const { error } = await supabase.storage
        .from("vapes")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (error) {
        return res.status(500).json({ message: error.message });
      }
      imageURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/vapes/${fileName}`;
    }
    const { data, error } = await supabase
      .from("vapes")
      .insert([
        {
          name,
          price: Number(price),
          description: description || "",
          brand: brand || "",
          flavor: flavor || "",
          strength: strength || "",
          stock: Number(stock) || 0,
          puffs: Number(puffs) || 0,
          image: imageURL,
        },
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error("CREATE VAPE CRASH:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteVape = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("vapes").delete().eq("id", id);
  if (error) {
    return res.status(500).json({ message: error.message });
  }
  res.json({ ok: true });
};
export const getVapes = async (req, res) => {
  const { data, error } = await supabase.from("vapes").select("*");

  if (error) {
    return res.status(500).json({ message: error.message });
  }
  res.json(data);
};

export const updateVape = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const { error } = await supabase.from("vapes").update(updates).eq("id", id);

  if (error) {
    return res.status(500).json({ message: error.message });
  }
  res.json({ ok: true });
};
