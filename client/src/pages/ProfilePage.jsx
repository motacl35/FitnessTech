import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../api/api";

export default function ProfilePage({ token }) {
  /* Navigation */
  const navigate = useNavigate();

  /* Profile Form Data */
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
    heightFeet: "",
    heightInches: "",
    weight: "",
    bmi: "",
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

  /* Payment Form Data */
  const [paymentForm, setPaymentForm] = useState({
    paymentMethodType: "",
    cardholderName: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    billingZipCode: "",
  });

  /* Membership Data */
  const [memberships, setMemberships] = useState([]);

  /* Profile Messages */
  const [message, setMessage] = useState("");
  const [membershipMessage, setMembershipMessage] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  /* Profile Editing State */
  const [isEditing, setIsEditing] = useState(false);

  /* Password Field State */
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  /*
    Active Profile Section

    Possible values:
    "" = No section open
    "membership" = Membership section open
    "payment" = Payment section open
  */
  const [activeSection, setActiveSection] = useState("");

  /* Load User Profile */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = await res.json();

        if (!res.ok) {
          setMessage(user.error || "Could not load profile.");
          return;
        }

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
          heightFeet: user.heightFeet ?? "",
          heightInches: user.heightInches ?? "",
          weight: user.weight ?? "",
          bmi: user.bmi ?? "",
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
      } catch (error) {
        console.error("Profile loading error:", error);
        setMessage("Could not load profile.");
      }
    }

    loadProfile();
  }, [token, navigate]);

  /* Load Membership Tiers */
  useEffect(() => {
    async function loadMemberships() {
      try {
        const res = await fetch(`${API_BASE}/memberships`);
        const data = await res.json();

        if (!res.ok) {
          setMembershipMessage(
            data.error || "Could not load memberships."
          );
          return;
        }

        setMemberships(data);
      } catch (error) {
        console.error("Membership loading error:", error);
        setMembershipMessage("Could not load memberships.");
      }
    }

    loadMemberships();
  }, []);

  /* Handle Profile Input Change */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  /* Handle Payment Input Change */
  function handlePaymentChange(event) {
    const { name, value } = event.target;

    setPaymentForm((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  /* Handle Profile Image Change */
  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    /* Validate Image Size */
    if (file.size > 2 * 1024 * 1024) {
      setMessage("Please choose an image smaller than 2MB.");
      return;
    }

    /* Read Selected Image */
    const reader = new FileReader();

    reader.onloadend = function () {
      setFormData((previousData) => ({
        ...previousData,
        profilePicture: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }

  /* Toggle Password Fields */
  function handleTogglePasswordFields() {
    setShowPasswordFields((previousValue) => {
      const newValue = !previousValue;

      /* Clear Password Fields When Closing */
      if (!newValue) {
        setFormData((previousData) => ({
          ...previousData,
          currentPassword: "",
          newPassword: "",
        }));
      }

      return newValue;
    });
  }

  /* Open Profile Editing */
  function handleOpenProfileEdit() {
    setIsEditing(true);
    setActiveSection("");
    setMessage("");
  }

  /* Cancel Profile Editing */
  function handleCancelProfileEdit() {
    setIsEditing(false);
    setShowPasswordFields(false);

    setFormData((previousData) => ({
      ...previousData,
      currentPassword: "",
      newPassword: "",
    }));
  }

  /* Toggle Membership Section */
  function handleToggleMembershipSection() {
    setActiveSection((previousSection) =>
      previousSection === "membership" ? "" : "membership"
    );

    setMembershipMessage("");
  }

  /* Toggle Payment Section */
  function handleTogglePaymentSection() {
    setActiveSection((previousSection) =>
      previousSection === "payment" ? "" : "payment"
    );

    setPaymentMessage("");
  }

  /* Submit Profile Changes */
  async function handleProfileSubmit(event) {
    event.preventDefault();

    setMessage("");

    /* Build Profile Update Data */
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
      heightFeet: formData.heightFeet,
      heightInches: formData.heightInches,
      weight: formData.weight,
      profilePicture: formData.profilePicture,
    };

    /* Validate Password Change */
    if (showPasswordFields && formData.newPassword.trim() !== "") {
      if (formData.currentPassword.trim() === "") {
        setMessage("Please enter your current password.");
        return;
      }

      profileData.currentPassword = formData.currentPassword;
      profileData.newPassword = formData.newPassword;
    }

    try {
      /* Send Profile Update Request */
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();

      /* Handle Profile Update Error */
      if (!res.ok) {
        setMessage(data.error || "Profile update failed.");
        return;
      }

      /* Update Profile State */
      setFormData((previousData) => ({
        ...previousData,
        ...data,
        currentPassword: "",
        newPassword: "",
      }));

      /* Close Profile Editing */
      setShowPasswordFields(false);
      setIsEditing(false);

      /* Display Success Message */
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage("Unable to connect to the server.");
    }
  }

  /* Update Membership */
  async function handleMembershipUpgrade(membershipName) {
    setMembershipMessage("");

    try {
      /* Send Membership Update Request */
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

      /* Handle Membership Update Error */
      if (!res.ok) {
        setMembershipMessage(
          data.error || "Membership update failed."
        );
        return;
      }

      /* Update Membership State */
      setFormData((previousData) => ({
        ...previousData,
        membershipTier: data.membershipTier,
      }));

      /* Display Success Message */
      setMembershipMessage(
        `Membership updated to ${data.membershipTier}.`
      );

      /* Close Membership Section */
      setActiveSection("");
    } catch (error) {
      console.error("Membership update error:", error);
      setMembershipMessage("Unable to connect to the server.");
    }
  }

  /* Submit Payment Method */
  async function handlePaymentSubmit(event) {
    event.preventDefault();

    setPaymentMessage("");

    try {
      /* Send Payment Update Request */
      const res = await fetch(`${API_BASE}/users/me/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentForm),
      });

      const data = await res.json();

      /* Handle Payment Update Error */
      if (!res.ok) {
        setPaymentMessage(
          data.error || "Payment method update failed."
        );
        return;
      }

      /* Update Payment Method State */
      setFormData((previousData) => ({
        ...previousData,
        paymentMethod: data.paymentMethod,
      }));

      /* Clear Payment Form */
      setPaymentForm({
        paymentMethodType: "",
        cardholderName: "",
        cardNumber: "",
        expirationMonth: "",
        expirationYear: "",
        billingZipCode: "",
      });

      /* Close Payment Section */
      setActiveSection("");

      /* Display Success Message */
      setPaymentMessage("Payment method updated successfully.");
    } catch (error) {
      console.error("Payment update error:", error);
      setPaymentMessage("Unable to connect to the server.");
    }
  }

  /* Available Membership Tiers */
  const availableMemberships = memberships.filter(
    (membership) => membership.name !== formData.membershipTier
  );

  return (
    <main className="page profile-page">
      {/* Profile Card */}
      <section className="profile-card">
        {/* Profile Heading */}
        <h1>My Profile</h1>

        {/* Profile Picture */}
        {formData.profilePicture ? (
          <img
            src={formData.profilePicture}
            alt="Profile"
            className="profile-preview"
          />
        ) : (
          <div className="profile-placeholder">No Image</div>
        )}

        {/* Profile Information */}
        {!isEditing && (
          <>
            {/* Username */}
            <h2>{formData.username}</h2>

            {/* Full Name */}
            <p>
              {formData.firstName} {formData.lastName}
            </p>

            {/* Email */}
            <p>{formData.email}</p>

            {/* Phone Number */}
            <p>{formData.phone}</p>

            {/* Address */}
            <p>
              {formData.address} {formData.city} {formData.state}{" "}
              {formData.zipCode}
            </p>

            {/* Current Membership */}
            <p>
              Current Membership:{" "}
              <strong>
                {formData.membershipTier || "No membership selected"}
              </strong>
            </p>

            {/* Current Payment Method */}
            <p>
              Payment Method:{" "}
              <strong>
                {formData.paymentMethod?.lastFour
                  ? `${formData.paymentMethod.type} ending in ${formData.paymentMethod.lastFour}`
                  : "No payment method on file"}
              </strong>
            </p>

            {/* Profile Action Buttons */}
            <div className="profile-actions">
              {/* Update Profile Button */}
              <button
                type="button"
                onClick={handleOpenProfileEdit}
              >
                Update Profile
              </button>

              {/* Update Membership Button */}
              <button
                type="button"
                onClick={handleToggleMembershipSection}
              >
                {activeSection === "membership"
                  ? "Close Membership"
                  : "Update Membership"}
              </button>

              {/* Update Payment Method Button */}
              <button
                type="button"
                onClick={handleTogglePaymentSection}
              >
                {activeSection === "payment"
                  ? "Close Payment Method"
                  : "Update Payment Method"}
              </button>
            </div>
          </>
        )}

        {/* Profile Editing Form */}
        {isEditing && (
          <form
            onSubmit={handleProfileSubmit}
            className="profile-form"
          >
            {/* Username Input */}
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            {/* First Name Input */}
            <input
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />

            {/* Last Name Input */}
            <input
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />

            {/* Address Input */}
            <input
              name="address"
              placeholder="Street Address"
              value={formData.address}
              onChange={handleChange}
            />

            {/* City Input */}
            <input
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />

            {/* State Input */}
            <input
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
            />

            {/* Zip Code Input */}
            <input
              name="zipCode"
              placeholder="Zip Code"
              value={formData.zipCode}
              onChange={handleChange}
            />

            {/* Phone Number Input */}
            <input
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
            />

            {/* Email Input */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Sex Selection */}
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {/* Height Feet Input */}
              <input
                 name="heightFeet"
                 type="number"
                 min="3"
                 max="8"
                 placeholder="Height (feet)"
                 value={formData.heightFeet}
                 onChange={handleChange}
              />

{/* Height Inches Input */}
<input
  name="heightInches"
  type="number"
  min="0"
  max="11"
  placeholder="Height (inches)"
  value={formData.heightInches}
  onChange={handleChange}
/>

{/* Weight Input */}
<input
  name="weight"
  type="number"
  min="60"
  max="700"
  step="0.1"
  placeholder="Weight (lb)"
  value={formData.weight}
  onChange={handleChange}
/>
            {/* Profile Picture Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {/* Password Change Button */}
            <button
              type="button"
              onClick={handleTogglePasswordFields}
            >
              {showPasswordFields
                ? "Cancel Password Change"
                : "Change Password"}
            </button>

            {/* Password Fields */}
            {showPasswordFields && (
              <>
                {/* Current Password Input */}
                <input
                  name="currentPassword"
                  type="password"
                  placeholder="Current Password"
                  value={formData.currentPassword}
                  onChange={handleChange}
                />

                {/* New Password Input */}
                <input
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </>
            )}

            {/* Save Profile Button */}
            <button type="submit">
              Save Profile Changes
            </button>

            {/* Cancel Profile Button */}
            <button
              type="button"
              onClick={handleCancelProfileEdit}
            >
              Cancel
            </button>
          </form>
        )}

        {/* Membership Update Section */}
        {activeSection === "membership" && !isEditing && (
          <section className="membership-upgrade-section">
            {/* Membership Heading */}
            <h2>Update Membership</h2>

            {/* Membership Requirement */}
            <p className="membership-required">
              Membership required to use gym.
            </p>

            {/* Membership Options */}
            {availableMemberships.length === 0 ? (
              <p>No membership upgrades available.</p>
            ) : (
              <div className="membership-options">
                {availableMemberships.map((membership) => (
                  <div
                    className="membership-choice"
                    key={membership._id}
                  >
                    {/* Membership Name */}
                    <h3>{membership.name}</h3>

                    {/* Membership Price */}
                    <h4>{membership.price}</h4>

                    {/* Membership Description */}
                    <p>{membership.description}</p>

                    {/* Membership Benefits */}
                    <ul>
                      {(membership.benefits || []).map(
                        (benefit, index) => (
                          <li key={index}>{benefit}</li>
                        )
                      )}
                    </ul>

                    {/* Choose Membership Button */}
                    <button
                      type="button"
                      onClick={() =>
                        handleMembershipUpgrade(membership.name)
                      }
                    >
                      Choose {membership.name}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Membership Disclaimer */}
            <div className="membership-disclaimer">
              <p>
                <strong>**</strong> All accompanying guests are
                required to enter the gym with a valid member whose
                account is in good standing.
              </p>

              <p>
                <strong>**</strong> All members are responsible for
                their accompanying guests, including their actions.
              </p>
            </div>

            {/* Cancel Membership Button */}
            <button
              type="button"
              onClick={() => setActiveSection("")}
            >
              Cancel
            </button>
          </section>
        )}

        {/* Payment Method Section */}
        {activeSection === "payment" && !isEditing && (
          <section className="payment-section">
            {/* Payment Method Heading */}
            <h2>Update Payment Method</h2>

            {/* Payment Method Form */}
            <form
              onSubmit={handlePaymentSubmit}
              className="payment-form"
            >
              {/* Payment Type Selection */}
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

              {/* Cardholder Name Input */}
              <input
                name="cardholderName"
                placeholder="Cardholder Name"
                value={paymentForm.cardholderName}
                onChange={handlePaymentChange}
                required
              />

              {/* Card Number Input */}
              <input
                name="cardNumber"
                inputMode="numeric"
                placeholder="Card Number"
                value={paymentForm.cardNumber}
                onChange={handlePaymentChange}
                required
              />

              {/* Expiration Month Input */}
              <input
                name="expirationMonth"
                inputMode="numeric"
                placeholder="Expiration Month"
                value={paymentForm.expirationMonth}
                onChange={handlePaymentChange}
                required
              />

              {/* Expiration Year Input */}
              <input
                name="expirationYear"
                inputMode="numeric"
                placeholder="Expiration Year"
                value={paymentForm.expirationYear}
                onChange={handlePaymentChange}
                required
              />

              {/* Billing Zip Code Input */}
              <input
                name="billingZipCode"
                inputMode="numeric"
                placeholder="Billing Zip Code"
                value={paymentForm.billingZipCode}
                onChange={handlePaymentChange}
                required
              />

              {/* Save Payment Method Button */}
              <button type="submit">
                Save Payment Method
              </button>

              {/* Cancel Payment Method Button */}
              <button
                type="button"
                onClick={() => setActiveSection("")}
              >
                Cancel
              </button>
            </form>

            {/* Payment Security Note */}
            <p className="payment-note">
              For this class project, only the last four digits are
              stored. Do not store full card numbers or CVV codes.
            </p>
          </section>
        )}

        {/* Profile Message */}
        {message && (
          <p className="profile-message">{message}</p>
        )}

        {/* Membership Message */}
        {membershipMessage && (
          <p className="profile-message">
            {membershipMessage}
          </p>
        )}

        {/* Payment Message */}
        {paymentMessage && (
          <p className="profile-message">{paymentMessage}</p>
        )}
      </section>
    </main>
  );
}