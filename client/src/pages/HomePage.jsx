import { useEffect, useState } from "react";
import API_BASE from "../api/api";

export default function HomePage({ token }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });
  const [error, setError] = useState("");

  const loadProducts = async () => {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_BASE}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Product could not be added");
      return;
    }

    setForm({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
    });

    loadProducts();
  };

  return (
    <main className="page">
      <section className="hero">
        <div>
          <h1>Fitness Tech</h1>
          <p>
            A fitness website where users can view memberships, browse gym
            products, contact the gym, and manage their profile.
          </p>
        </div>
      </section>
    </main>
  );
}