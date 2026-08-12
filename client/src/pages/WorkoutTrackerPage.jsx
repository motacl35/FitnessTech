
import { useEffect, useState } from "react";
import API_BASE from "../api/api";
import "./WorkoutTrackerPage.css";

export default function WorkoutTracker({ token }) {
  const [form, setForm] = useState({
    workoutDate: "",
    workoutType: "",
    exercisePerformed: "",
    duration: "",
    caloriesBurned: "",
    averageHeartRate: "",
    maximumHeartRate: "",
    sets: "",
    repetitions: "",
    weightLifted: "",
    distance: "",
    bodyWeight: "",
    waterIntake: "",
    sleepHours: "",
    notes: "",
  });

  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE}/workouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setEntries(data))
      .catch(() => setMessage("Could not load workout history."));
  }, [token]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("You must be logged in to save workouts.");
      return;
    }

    const res = await fetch(`${API_BASE}/workouts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Workout could not be saved.");
      return;
    }

    setEntries([data, ...entries]);

    setForm({
      workoutDate: "",
      workoutType: "",
      exercisePerformed: "",
      duration: "",
      caloriesBurned: "",
      averageHeartRate: "",
      maximumHeartRate: "",
      sets: "",
      repetitions: "",
      weightLifted: "",
      distance: "",
      bodyWeight: "",
      waterIntake: "",
      sleepHours: "",
      notes: "",
    });

    setMessage("Workout saved successfully.");
  }

  return (
    <main className="tracker-page">
      <section className="tracker-container">

        <div className="tracker-header">
          <p className="tracker-kicker">
            TRACK • REVIEW • IMPROVE
          </p>

          <h1 className="tracker-title">
            WORKOUT <span>TRACKER</span>
          </h1>

          <p className="tracker-description">
            Save your workouts and review your training history.
          </p>
        </div>

        {!token && (
          <p className="tracker-error">
            Log in to save workout history.
          </p>
        )}

        <section className="tracker-card">
          <h2>Add Workout</h2>

          <form onSubmit={handleSubmit} className="workout-form">
            <div className="tracker-form-grid">

              <label>
                Workout Date
                <input
                  name="workoutDate"
                  type="date"
                  value={form.workoutDate}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Workout Type
                <input
                  name="workoutType"
                  placeholder="Workout Type"
                  value={form.workoutType}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Exercise Performed
                <input
                  name="exercisePerformed"
                  placeholder="Exercise Performed"
                  value={form.exercisePerformed}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Duration
                <input
                  name="duration"
                  type="number"
                  placeholder="Duration in minutes"
                  value={form.duration}
                  onChange={handleChange}
                />
              </label>

              <label>
                Calories Burned
                <input
                  name="caloriesBurned"
                  type="number"
                  placeholder="Calories Burned"
                  value={form.caloriesBurned}
                  onChange={handleChange}
                />
              </label>

              <label>
                Average Heart Rate
                <input
                  name="averageHeartRate"
                  type="number"
                  placeholder="Average Heart Rate"
                  value={form.averageHeartRate}
                  onChange={handleChange}
                />
              </label>

              <label>
                Maximum Heart Rate
                <input
                  name="maximumHeartRate"
                  type="number"
                  placeholder="Maximum Heart Rate"
                  value={form.maximumHeartRate}
                  onChange={handleChange}
                />
              </label>

              <label>
                Sets
                <input
                  name="sets"
                  type="number"
                  placeholder="Sets"
                  value={form.sets}
                  onChange={handleChange}
                />
              </label>

              <label>
                Repetitions
                <input
                  name="repetitions"
                  type="number"
                  placeholder="Repetitions"
                  value={form.repetitions}
                  onChange={handleChange}
                />
              </label>

              <label>
                Weight Lifted
                <input
                  name="weightLifted"
                  type="number"
                  placeholder="Weight Lifted in lbs"
                  value={form.weightLifted}
                  onChange={handleChange}
                />
              </label>

              <label>
                Distance
                <input
                  name="distance"
                  type="number"
                  placeholder="Distance in miles"
                  value={form.distance}
                  onChange={handleChange}
                />
              </label>

              <label>
                Body Weight
                <input
                  name="bodyWeight"
                  type="number"
                  placeholder="Body Weight in lbs"
                  value={form.bodyWeight}
                  onChange={handleChange}
                />
              </label>

              <label>
                Water Intake
                <input
                  name="waterIntake"
                  type="number"
                  placeholder="Water Intake in oz"
                  value={form.waterIntake}
                  onChange={handleChange}
                />
              </label>

              <label>
                Sleep Hours
                <input
                  name="sleepHours"
                  type="number"
                  placeholder="Sleep Hours"
                  value={form.sleepHours}
                  onChange={handleChange}
                />
              </label>

            </div>

            <label className="tracker-notes">
              Workout Notes
              <textarea
                name="notes"
                placeholder="Workout Notes"
                value={form.notes}
                onChange={handleChange}
              />
            </label>

            <button type="submit" className="tracker-submit">
              Add Workout
            </button>
          </form>

          {message && (
            <p className="tracker-message">
              {message}
            </p>
          )}
        </section>

        <section className="tracker-card tracker-history">
          <div className="tracker-history-header">
            <h2>Workout History</h2>

            <span className="tracker-count">
              {entries.length} Saved
            </span>
          </div>

          {entries.length === 0 ? (
            <p className="tracker-empty">
              No workouts saved yet.
            </p>
          ) : (
            <div className="tracker-entry-grid">
              {entries.map((entry) => (
                <article className="tracker-entry" key={entry._id}>
                  <h3>{entry.exercisePerformed}</h3>

                  <p>
                    <strong>Date:</strong> {entry.workoutDate}
                  </p>

                  <p>
                    <strong>Workout Type:</strong> {entry.workoutType}
                  </p>

                  <p>
                    <strong>Duration:</strong>{" "}
                    {entry.duration || "N/A"} minutes
                  </p>

                  <p>
                    <strong>Calories Burned:</strong>{" "}
                    {entry.caloriesBurned || "N/A"}
                  </p>

                  <p>
                    <strong>Average Heart Rate:</strong>{" "}
                    {entry.averageHeartRate || "N/A"}
                  </p>

                  <p>
                    <strong>Maximum Heart Rate:</strong>{" "}
                    {entry.maximumHeartRate || "N/A"}
                  </p>

                  <p>
                    <strong>Sets:</strong> {entry.sets || "N/A"}
                  </p>

                  <p>
                    <strong>Repetitions:</strong>{" "}
                    {entry.repetitions || "N/A"}
                  </p>

                  <p>
                    <strong>Weight Lifted:</strong>{" "}
                    {entry.weightLifted || "N/A"}
                  </p>

                  <p>
                    <strong>Distance:</strong>{" "}
                    {entry.distance || "N/A"}
                  </p>

                  <p>
                    <strong>Body Weight:</strong>{" "}
                    {entry.bodyWeight || "N/A"}
                  </p>

                  <p>
                    <strong>Water Intake:</strong>{" "}
                    {entry.waterIntake || "N/A"}
                  </p>

                  <p>
                    <strong>Sleep Hours:</strong>{" "}
                    {entry.sleepHours || "N/A"}
                  </p>

                  <p>
                    <strong>Notes:</strong> {entry.notes || "N/A"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

      </section>
    </main>
  );
}