import { useEffect, useState } from "react";
import API_BASE from "../api/api";

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
    <main className="page workout-tracker-page">
      <section className="card workout-tracker-card">
        <h1>Workout Tracker</h1>

        {!token && <p className="error">Log in to save workout history.</p>}

        <form onSubmit={handleSubmit} className="workout-form">
          <input name="workoutDate" type="date" value={form.workoutDate} onChange={handleChange} required />
          <input name="workoutType" placeholder="Workout Type" value={form.workoutType} onChange={handleChange} required />
          <input name="exercisePerformed" placeholder="Exercise Performed" value={form.exercisePerformed} onChange={handleChange} required />
          <input name="duration" type="number" placeholder="Duration in minutes" value={form.duration} onChange={handleChange} />
          <input name="caloriesBurned" type="number" placeholder="Calories Burned" value={form.caloriesBurned} onChange={handleChange} />
          <input name="averageHeartRate" type="number" placeholder="Average Heart Rate" value={form.averageHeartRate} onChange={handleChange} />
          <input name="maximumHeartRate" type="number" placeholder="Maximum Heart Rate" value={form.maximumHeartRate} onChange={handleChange} />
          <input name="sets" type="number" placeholder="Sets" value={form.sets} onChange={handleChange} />
          <input name="repetitions" type="number" placeholder="Repetitions" value={form.repetitions} onChange={handleChange} />
          <input name="weightLifted" type="number" placeholder="Weight Lifted in lbs" value={form.weightLifted} onChange={handleChange} />
          <input name="distance" type="number" placeholder="Distance in miles" value={form.distance} onChange={handleChange} />
          <input name="bodyWeight" type="number" placeholder="Body Weight in lbs" value={form.bodyWeight} onChange={handleChange} />
          <input name="waterIntake" type="number" placeholder="Water Intake in oz" value={form.waterIntake} onChange={handleChange} />
          <input name="sleepHours" type="number" placeholder="Sleep Hours" value={form.sleepHours} onChange={handleChange} />

          <textarea name="notes" placeholder="Workout Notes" value={form.notes} onChange={handleChange} />

          <button type="submit">Add Workout</button>
        </form>

        {message && <p className="profile-message">{message}</p>}
      </section>

      <section className="card tracker-list">
        <h2>Workout History</h2>

        {entries.length === 0 ? (
          <p>No workouts saved yet.</p>
        ) : (
          entries.map((entry) => (
            <div className="tracker-entry" key={entry._id}>
              <h3>{entry.exercisePerformed}</h3>
              <p><strong>Date:</strong> {entry.workoutDate}</p>
              <p><strong>Workout Type:</strong> {entry.workoutType}</p>
              <p><strong>Duration:</strong> {entry.duration || "N/A"} minutes</p>
              <p><strong>Calories Burned:</strong> {entry.caloriesBurned || "N/A"}</p>
              <p><strong>Average Heart Rate:</strong> {entry.averageHeartRate || "N/A"}</p>
              <p><strong>Maximum Heart Rate:</strong> {entry.maximumHeartRate || "N/A"}</p>
              <p><strong>Sets:</strong> {entry.sets || "N/A"}</p>
              <p><strong>Repetitions:</strong> {entry.repetitions || "N/A"}</p>
              <p><strong>Weight Lifted:</strong> {entry.weightLifted || "N/A"}</p>
              <p><strong>Distance:</strong> {entry.distance || "N/A"}</p>
              <p><strong>Body Weight:</strong> {entry.bodyWeight || "N/A"}</p>
              <p><strong>Water Intake:</strong> {entry.waterIntake || "N/A"}</p>
              <p><strong>Sleep Hours:</strong> {entry.sleepHours || "N/A"}</p>
              <p><strong>Notes:</strong> {entry.notes || "N/A"}</p>
            </div>
          ))
        )}
      </section>
    </main>
  );
}