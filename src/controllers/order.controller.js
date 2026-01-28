import { supabase } from "../supabaseClient.js";

export const createOrder = async (req, res) => {
  const { items, contact, contactType, isPickup, address } = req.body;

  if (!items?.length) {
    return res.status(400).json({ message: "Корзина пуста" });
  }

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = {
    items,
    total_price: totalPrice,
    contact,
    contact_type: contactType,
    is_pickup: isPickup,
    address: isPickup === "Доставка" ? address : null,
    status: "Новый",
  };

  const { error } = await supabase.from("orders").insert(order);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ success: true });
};

export const getOrders = async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
};

export const deleteOrder = async (req, res) => {
    const {id} = req.params;
    const {error} = await supabase
    .from("orders")
    .delete()
    .eq("id", id);
    if(error){
        return res.status(500).json({message: error.message});
    }
    res.json({ok: true});
}