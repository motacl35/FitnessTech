import { useEffect, useState } from "react";
import API_BASE from "../api/api";

export default function HomePage({ token }) {
  /* Product List */
  const [products, setProducts] = useState([]);

  /* Product Form */
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
  });

  /* Error Message */
  const [error, setError] = useState("");

  /* Load Products */
  const loadProducts = async () => {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    setProducts(data);
  };

  /* Load Products When Page Opens */
  useEffect(() => {
    loadProducts();
  }, []);

  /* Submit Product Form */
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

    /* Display Error Message */
    if (!res.ok) {
      setError(data.error || "Product could not be added");
      return;
    }

    /* Clear Product Form */
    setForm({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
    });

    /* Reload Product List */
    loadProducts();
  };

  return (
    <main className="page">
      {/* Hero Section */}
      <section className="hero">
        <div>
          {/* Website Heading */}
          <h1>
            Fitness<span className="tech-green">Tech</span>
          </h1>

          {/* Website Description */}
          <p>
            Fitness<span className="tech-green">Tech</span> is a fitness
            website where users can view memberships, browse gym products,
            contact the gym, and manage their profile.
          </p>
        </div>
      </section>
    </main>
  );
}