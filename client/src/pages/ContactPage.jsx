import { useState } from "react";

/* ContactPage Component */
function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    reason: "",
    contact_method: "email",
    message: ""
  });

  /* Form validation errors and thank you message */
  const [errors, setErrors] = useState({});
  const [thankYou, setThankYou] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value
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
      message: ""
    });
  }

  /* Render the contact page */
  return (
    <main className="page-content contatct-page">
      <section id="contact" className="section-block">
        <h2 className="section-heading">Contact Us</h2>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input
              type="text"
              name="name"
              placeholder=" "
              value={formData.name}
              onChange={handleChange}
            />
            <label>Full Name</label>
            <div className="error-message">{errors.name}</div>
          </div>

          <div className="input-group">
            <input
              type="text"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
            />
            <label>Email</label>
            <div className="error-message">{errors.email}</div>
          </div>

          <div className="input-group">
            <input
              type="tel"
              name="phone"
              placeholder=" "
              value={formData.phone}
              onChange={handleChange}
            />
            <label>Phone Number</label>
            <div className="error-message">{errors.phone}</div>
          </div>
          <div className="input-group select-group">
            <select
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
            <label>Reason for Contact</label>
            <div className="error-message">{errors.reason}</div>
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

          <div className="input-group">
            <textarea
              name="message"
              placeholder=" "
              rows="4"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            <label>Message</label>
            <div className="error-message">{errors.message}</div>
          </div>

          <div className="thank-you">{thankYou}</div>

          <input type="submit" value="Send Message" />
        </form>
      </section>
    </main>
  );
}

export default ContactPage;