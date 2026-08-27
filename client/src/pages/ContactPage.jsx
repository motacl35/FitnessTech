
import { useState } from "react";


function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    contact_method: "email",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [thankYou, setThankYou] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function validate() {
    const newErrors = {};

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) {
      newErrors.name = "Full name is required.";
    } else if (!/^[A-Za-z]+(?:[ '-][A-Za-z]+)+$/.test(trimmedName)) {
      newErrors.name = "Enter a valid full name.";
    }

    if (!trimmedEmail) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9\-()+ ]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!formData.reason) {
      newErrors.reason = "Please select a reason for contact.";
    }

    if (!trimmedMessage) {
      newErrors.message = "Message cannot be empty.";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setThankYou("");
      return;
    }

    setErrors({});
    setThankYou("Thank you for your message! I will respond soon.");

    setFormData({
      name: "",
      email: "",
      phone: "",
      reason: "",
      contact_method: "email",
      message: "",
    });
  }

  return (
    <main className="contact-page">
      <section className="contact-container">

        <div className="contact-header">
          <p className="contact-kicker">
            QUESTIONS • SUPPORT • FEEDBACK
          </p>

          <h1 className="contact-title">
            CONTACT <span>US</span>
          </h1>

          <p className="contact-description">
            Have a question or need help? Fill out the form below and
            the FitnessTech team will get back to you.
          </p>
        </div>

        <section className="contact-card">
          <form
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
          >

            <div className="contact-form-grid">

              <div className="contact-field">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />

                {errors.name && (
                  <div className="contact-error">
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="contact-field">
                <label htmlFor="email">Email</label>

                <input
                  id="email"
                  type="text"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <div className="contact-error">
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="contact-field">
                <label htmlFor="phone">Phone Number</label>

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />

                {errors.phone && (
                  <div className="contact-error">
                    {errors.phone}
                  </div>
                )}
              </div>

              <div className="contact-field">
                <label htmlFor="reason">Reason for Contact</label>

                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                >
                  <option value="">Select a reason</option>
                  <option value="question">Question</option>
                  <option value="general">General Inquiry</option>
                  <option value="project">Project Collaboration</option>
                  <option value="feedback">Website Feedback</option>
                </select>

                {errors.reason && (
                  <div className="contact-error">
                    {errors.reason}
                  </div>
                )}
              </div>

            </div>

            <fieldset className="contact-preference">
              <legend>Preferred Contact Method</legend>

              <div className="radio-group">

                <label
                  className={
                    formData.contact_method === "email"
                      ? "radio-option selected-option"
                      : "radio-option"
                  }
                >
                  <input
                    type="radio"
                    name="contact_method"
                    value="email"
                    checked={formData.contact_method === "email"}
                    onChange={handleChange}
                  />

                  Email
                </label>

                <label
                  className={
                    formData.contact_method === "phone"
                      ? "radio-option selected-option"
                      : "radio-option"
                  }
                >
                  <input
                    type="radio"
                    name="contact_method"
                    value="phone"
                    checked={formData.contact_method === "phone"}
                    onChange={handleChange}
                  />

                  Phone
                </label>

              </div>
            </fieldset>

            <div className="contact-field">
              <label htmlFor="message">Message</label>

              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Tell us how we can help"
                value={formData.message}
                onChange={handleChange}
              ></textarea>

              {errors.message && (
                <div className="contact-error">
                  {errors.message}
                </div>
              )}
            </div>

            {thankYou && (
              <div className="contact-success">
                {thankYou}
              </div>
            )}

            <button
              type="submit"
              className="contact-submit"
            >
              Send Message
            </button>

          </form>
        </section>

      </section>
    </main>
  );
}

export default ContactPage;