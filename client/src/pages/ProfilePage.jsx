import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";

export default function ProfilePage({ token }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
    email: "",
    sex: "",
    profilePicture: "",
    currentPassword: "",
    newPassword: "",
    membershipTier: "",
    paymentMethod: {
      type: "",
      cardholderName: "",
      lastFour: "",
      expirationMonth: "",
      expirationYear: "",
      billingZipCode: "",
    },
  });

  const [paymentForm, setPaymentForm] = useState({
    paymentMethodType: "",
    cardholderName: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    billingZipCode: "",
  });

  const [memberships, setMemberships] = useState([]);
  const [message, setMessage] = useState("");
  const [membershipMessage, setMembershipMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showMemberships, setShowMemberships] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        setFormData({
          username: user.username || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          zipCode: user.zipCode || "",
          phone: user.phone || "",
          email: user.email || "",
          sex: user.sex || "",
          profilePicture: user.profilePicture || "",
          membershipTier: user.membershipTier || "",
          paymentMethod: user.paymentMethod || {
            type: "",
            cardholderName: "",
            lastFour: "",
            expirationMonth: "",
            expirationYear: "",
            billingZipCode: "",
          },
          currentPassword: "",
          newPassword: "",
        });
      })
      .catch(() => setMessage("Could not load profile."));
  }, [token, navigate]);

  useEffect(() => {
    fetch(`${API_BASE}/memberships`)
      .then((res) => res.json())
      .then((data) => setMemberships(data))
      .catch(() => setMembershipMessage("Could not load memberships."));
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function handlePaymentChange(event) {
    setPaymentForm({
      ...paymentForm,
      [event.target.name]: event.target.value,
    });
  }

  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = function () {
      setFormData((prevData) => ({
        ...prevData,
        profilePicture: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleTogglePasswordFields() {
    setShowPasswordFields((prev) => !prev);

    if (showPasswordFields) {
      setFormData((prevData) => ({
        ...prevData,
        currentPassword: "",
        newPassword: "",
      }));
    }
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setMessage("");

    const profileData = {
      username: formData.username,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipCode: formData.zipCode,
      phone: formData.phone,
      email: formData.email,
      sex: formData.sex,
      profilePicture: formData.profilePicture,
    };

    if (showPasswordFields && formData.newPassword.trim() !== "") {
      if (formData.currentPassword.trim() === "") {
        setMessage("Please enter your current password.");
        return;
      }

      profileData.currentPassword = formData.currentPassword;
      profileData.newPassword = formData.newPassword;
    }

    const res = await fetch(`${API_BASE}/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Profile update failed.");
      return;
    }

    setFormData({
      ...formData,
      ...data,
      currentPassword: "",
      newPassword: "",
    });

    setShowPasswordFields(false);
    setIsEditing(false);
    setMessage("Profile updated successfully.");
  }

  async function handleMembershipUpgrade(membershipName) {
    setMembershipMessage("");

    const res = await fetch(`${API_BASE}/users/me/membership`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        membershipTier: membershipName,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMembershipMessage(data.error || "Membership update failed.");
      return;
    }

    setFormData({
      ...formData,
      membershipTier: data.membershipTier,
    });

    setMembershipMessage(`Membership updated to ${data.membershipTier}.`);
    setShowMemberships(false);
  }

  async function handlePaymentSubmit(event) {
    event.preventDefault();
    setPaymentMessage("");

    const res = await fetch(`${API_BASE}/users/me/payment`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentForm),
    });

    const data = await res.json();

    if (!res.ok) {
      setPaymentMessage(data.error || "Payment method update failed.");
      return;
    }

    setFormData({
      ...formData,
      paymentMethod: data.paymentMethod,
    });

    setPaymentForm({
      paymentMethodType: "",
      cardholderName: "",
      cardNumber: "",
      expirationMonth: "",
      expirationYear: "",
      billingZipCode: "",
    });

    setShowPaymentForm(false);
    setPaymentMessage("Payment method updated successfully.");
  }

  const availableMemberships = memberships.filter(
    (membership) => membership.name !== formData.membershipTier
  );

  return (
    <main className="page profile-page">
      <section className="profile-card">
        <h1>My Profile</h1>

        {formData.profilePicture ? (
          <img
            src={formData.profilePicture}
            alt="Profile"
            className="profile-preview"
          />
        ) : (
          <div className="profile-placeholder">No Image</div>
        )}

        {!isEditing && (
          <>
            <h2>{formData.username}</h2>

            <p>
              {formData.firstName} {formData.lastName}
            </p>

            <p>{formData.email}</p>
            <p>{formData.phone}</p>

            <p>
              {formData.address} {formData.city} {formData.state}{" "}
              {formData.zipCode}
            </p>

            <p>
              Current Membership:{" "}
              <strong>
                {formData.membershipTier || "No membership selected"}
              </strong>
            </p>

            <p>
              Payment Method:{" "}
              <strong>
                {formData.paymentMethod?.lastFour
                  ? `${formData.paymentMethod.type} ending in ${formData.paymentMethod.lastFour}`
                  : "No payment method on file"}
              </strong>
            </p>

            <div className="profile-actions">
              <button onClick={() => setIsEditing(true)}>Update Profile</button>

              <button
                type="button"
                onClick={() => setShowMemberships(!showMemberships)}
              >
                Update Membership
              </button>

              <button
                type="button"
                onClick={() => setShowPaymentForm(!showPaymentForm)}
              >
                Update Payment Method
              </button>
            </div>
          </>
        )}

        {isEditing && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />

            <input
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
            />

            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            <input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />

            <input
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleChange}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <select name="sex" value={formData.sex} onChange={handleChange}>
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input type="file" accept="image/*" onChange={handleImageChange} />

            <button type="button" onClick={handleTogglePasswordFields}>
              {showPasswordFields
                ? "Cancel Password Change"
                : "Change Password"}
            </button>

            {showPasswordFields && (
              <>
                <input
                  name="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />

                <input
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </>
            )}

            <button type="submit">Save Profile Changes</button>

            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        )}

        {showMemberships && (
          <section className="membership-upgrade-section">
            <h2>Update Membership</h2>

            <p className="membership-required">
              Membership required to use gym.
            </p>

            {availableMemberships.length === 0 ? (
              <p>No membership upgrades available.</p>
            ) : (
              <div className="membership-options">
                {availableMemberships.map((membership) => (
                  <div className="membership-choice" key={membership._id}>
                    <h3>{membership.name}</h3>
                    <h4>{membership.price}</h4>
                    <p>{membership.description}</p>

                    <ul>
                      {membership.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={() => handleMembershipUpgrade(membership.name)}
                    >
                      Choose {membership.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="membership-disclaimer">
              <p>
                <strong>**</strong> All accompanying guests are required to enter
                the gym with a valid member whose account is in good standing.
              </p>

              <p>
                <strong>**</strong> All members are responsible for their
                accompanying guests, including their actions.
              </p>
            </div>
          </section>
        )}

        {showPaymentForm && (
          <section className="payment-section">
            <h2>Update Payment Method</h2>

            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <select
                name="paymentMethodType"
                value={paymentForm.paymentMethodType}
                onChange={handlePaymentChange}
                required
              >
                <option value="">Select Payment Type</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
              </select>

              <input
                name="cardholderName"
                placeholder="Cardholder Name"
                value={paymentForm.cardholderName}
                onChange={handlePaymentChange}
                required
              />

              <input
                name="cardNumber"
                placeholder="Card Number"
                value={paymentForm.cardNumber}
                onChange={handlePaymentChange}
                required
              />

              <input
                name="expirationMonth"
                placeholder="Expiration Month"
                value={paymentForm.expirationMonth}
                onChange={handlePaymentChange}
                required
              />

              <input
                name="expirationYear"
                placeholder="Expiration Year"
                value={paymentForm.expirationYear}
                onChange={handlePaymentChange}
                required
              />

              <input
                name="billingZipCode"
                placeholder="Billing Zip Code"
                value={paymentForm.billingZipCode}
                onChange={handlePaymentChange}
                required
              />

              <button type="submit">Save Payment Method</button>

              <button
                type="button"
                onClick={() => setShowPaymentForm(false)}
              >
                Cancel
              </button>
            </form>

            <p className="payment-note">
              For this class project, only the last four digits are stored.
              Do not store full card numbers or CVV codes.
            </p>
          </section>
        )}

        {message && <p className="profile-message">{message}</p>}
        {membershipMessage && <p className="profile-message">{membershipMessage}</p>}
        {paymentMessage && <p className="profile-message">{paymentMessage}</p>}
      </section>
    </main>
  );
}