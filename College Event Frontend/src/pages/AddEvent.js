import React, { useState } from "react";

const AddEvent = () => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("⚠️ Please login first!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/events/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Auth header
        },
        body: JSON.stringify({
          event_name: eventName,
          description,
          location,
          event_date: eventDate,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Event created successfully!");
        setEventName("");
        setDescription("");
        setLocation("");
        setEventDate("");
      } else {
        setMessage(`❌ ${data.message || "Failed to create event"}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("⚠️ Something went wrong.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />
        <button type="submit">Add Event</button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default AddEvent;
