import React, { useState, useEffect } from "react";
import axios from "axios";
import "./home.css";
import HomeHeader from "../Others/Header/homeHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [user, setUser] = useState({});
  const [patientInfo, setPatientInfo] = useState(null);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [assignedPatients, setAssignedPatients] = useState([]);
  const [availableAttendants, setAvailableAttendants] = useState([]);
  const [selectedAttendants, setSelectedAttendants] = useState({});
  const [patientAssignments, setPatientAssignments] = useState({});
  const [responseMessage, setResponseMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [attendantPatients, setAttendantPatients] = useState([]);
  const [checkboxStates, setCheckboxStates] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    address: "",
    disease: "",
    history: "",
    doctor: "",
  });

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("userdata"));
    if (localUser) {
      setUser(localUser);
    }
    const storedAssignments = localStorage.getItem("patientAssignments");
    if (storedAssignments) {
      setPatientAssignments(JSON.parse(storedAssignments));
    }
    const storedCheckboxStates = localStorage.getItem("checkboxStates");
    if (storedCheckboxStates) {
      setCheckboxStates(JSON.parse(storedCheckboxStates));
    }
    fetchAvailableDoctors();
  }, []);

  useEffect(() => {
    if (user && user._id && user.role === "Patient") {
      checkPatientInfo(user._id);
    }
    if (user && user.role === "Doctor") {
      fetchAssignedPatients();
      fetchAvailableAttendants();
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id && user.role === "Attendant") {
      fetchAttendantPatients();
    }
  }, [user]);

  useEffect(() => {
    fetchChatMessages();
    const interval = setInterval(fetchChatMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchChatMessages = async () => {
    try {
      const response = await axios.get("http://localhost:7071/getChat");
      if (response.data && response.data.messages) {
        setChatMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const payload = {
      sender: user._id,
      role: user.role,
      message: chatInput,
    };
    try {
      await axios.post("http://localhost:7071/postChat", payload);
      setChatInput("");
      fetchChatMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchAttendantPatients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7071/getAttendantPatients?attendantId=${user._id}`
      );
      if (response.data && response.data.patients) {
        setAttendantPatients(response.data.patients);
      }
    } catch (error) {
      console.error("Error fetching attendant patients:", error);
    }
  };

  const fetchAvailableDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:7071/getDoctors");
      if (response.data && response.data.doctors) {
        setAvailableDoctors(response.data.doctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const fetchAssignedPatients = async () => {
    try {
      const response = await axios.get(
        `http://localhost:7071/getDoctorPatients?doctorId=${user._id}`
      );
      setAssignedPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const fetchAvailableAttendants = async () => {
    try {
      const response = await axios.get("http://localhost:7071/getAttendants");
      if (response.data && response.data.attendants) {
        setAvailableAttendants(response.data.attendants);
      }
    } catch (error) {
      console.error("Error fetching attendants:", error);
    }
  };

  const checkPatientInfo = async (userId) => {
    try {
      const response = await axios.post("http://localhost:7071/addPatientInfo", {
        userId,
      });
      if (response.data && response.data.patientInfo) {
        setPatientInfo(response.data.patientInfo);
      }
    } catch (error) {
      console.error("Error checking patient info:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, age, gender, address, disease, history, doctor } = formData;
    if (!name || !age || !gender || !address || !disease || !history || !doctor) {
      setResponseMessage("All fields are required");
      setShowModal(true);
      return;
    }
    const patientData = {
      userId: user._id,
      name,
      age,
      gender,
      address,
      disease,
      medicalhistory: history,
      assignedDoctor: doctor,
    };
    try {
      const response = await axios.post("http://localhost:7071/addPatientInfo", patientData);
      if (response.data) {
        setResponseMessage(response.data.message);
        setPatientInfo(response.data.patientInfo);
        setFormData({
          name: "",
          age: "",
          gender: "",
          address: "",
          disease: "",
          history: "",
          doctor: "",
        });
      }
    } catch (error) {
      setResponseMessage("Error saving patient information: " + error.message);
    }
    setShowModal(true);
  };

  const getDoctorName = (doctorId) => {
    const doctor = availableDoctors.find((doc) => doc._id === doctorId);
    return doctor ? doctor.name : "Unknown Doctor";
  };

  const handleAssignTask = async (e, patientId) => {
    e.preventDefault();
    const attendantId = selectedAttendants[patientId];
    if (!attendantId) {
      alert("Please select an attendant");
      return;
    }
    const patient = assignedPatients.find((p) => p._id === patientId);
    if (!patient) {
      alert("Patient not found");
      return;
    }
    try {
      const response = await axios.post("http://localhost:7071/assignTaskToAttendant", {
        patientId,
        patientName: patient.name,
        patientAge: patient.age,
        patientGender: patient.gender,
        patientAddress: patient.address,
        patientDisease: patient.disease,
        patientMedicalHistory: patient.medicalhistory,
        attendantId,
        doctorId: user._id,
      });
      alert(response.data.message);
      const updatedAssignments = { ...patientAssignments, [patientId]: attendantId };
      setPatientAssignments(updatedAssignments);
      localStorage.setItem("patientAssignments", JSON.stringify(updatedAssignments));
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Error assigning task: " + error.message);
    }
  };

  const getAttendantName = (attendantId) => {
    const attendant = availableAttendants.find((att) => att._id === attendantId);
    return attendant ? attendant.name : "Unknown Attendant";
  };

  const handleCheckboxChange = (patientId, day, task, checked) => {
    const patientState = checkboxStates[patientId] || {
      day1: {},
      day2: {},
      day3: {},
    };
    patientState[day] = { ...patientState[day], [task]: checked };
    const newStates = { ...checkboxStates, [patientId]: patientState };
    setCheckboxStates(newStates);
    localStorage.setItem("checkboxStates", JSON.stringify(newStates));
  };

  return (
    <>
      <HomeHeader />
      <div id="welcomeMsg">
        <p># Welcome to the MedAttire - Ensuring Quality Care and Seamless Patient Management</p>
      </div>
      <div id="overview">
        <h3>Overview of MedAttire</h3>
        <p>
          MedAttire is a smart hospital attendant system designed to streamline patient care and staff coordination in healthcare facilities. It acts as a bridge between hospital administrators, attendants, and medical professionals, ensuring efficient task management, real-time communication, and improved patient care.
        </p>
        <hr />
        <span>
          With MedAttire, hospitals can:
          <h4>
            <FontAwesomeIcon icon={faCheck} /> Assign attendants to patients based on availability and expertise.
          </h4>
          <h4>
            <FontAwesomeIcon icon={faCheck} /> Track daily tasks such as medication reminders, hygiene care, and monitoring.
          </h4>
          <h4>
            <FontAwesomeIcon icon={faCheck} /> Enable real-time communication between attendants, nurses, and doctors.
          </h4>
        </span>
        <hr />
        <p id="para2">
          MedAttire simplifies hospital workflow, reduces administrative burden, and enhances patient satisfaction by ensuring timely and efficient care.
        </p>
      </div>

      {/* PATIENT SECTION */}
      {user.role === "Patient" && !patientInfo && (
        <div id="patientFormContainer">
          <h2>Patient Information Form</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name:</label>
            <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
            <label htmlFor="age">Age:</label>
            <input type="number" id="age" name="age" min="0" required value={formData.age} onChange={handleChange} />
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" required value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <label htmlFor="address">Address:</label>
            <textarea id="address" name="address" rows="3" required value={formData.address} onChange={handleChange} />
            <label htmlFor="disease">Current Disease:</label>
            <input type="text" id="disease" name="disease" required value={formData.disease} onChange={handleChange} />
            <label htmlFor="history">Past Medical History:</label>
            <textarea id="history" name="history" rows="4" required value={formData.history} onChange={handleChange} />
            <label htmlFor="doctor">Available Doctors:</label>
            <select id="doctor" name="doctor" required value={formData.doctor} onChange={handleChange}>
              <option value="">Select</option>
              {availableDoctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {user.role === "Patient" && patientInfo && (
        <div id="savedPatientInfo">
          <h2>Your Patient Information</h2>
          <p>Your information has been stored with the name: <strong>{patientInfo.name}</strong></p>
          <p>Age: {patientInfo.age}</p>
          <p>Gender: {patientInfo.gender}</p>
          <p>Address: {patientInfo.address}</p>
          <p>Disease: {patientInfo.disease}</p>
          <p>Medical History: {patientInfo.medicalhistory}</p>
          {patientInfo.assignedDoctor && <p>Assigned Doctor: {getDoctorName(patientInfo.assignedDoctor)}</p>}
        </div>
      )}

      {/* Modal for response messages */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{responseMessage}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* DOCTOR DASHBOARD */}
      {user.role === "Doctor" && (
        <div id="doctorDashboard">
          <aside id="sidebar">
            <h2>Doctor Panel</h2>
            <p>Welcome, <strong>{user.name}</strong></p>
          </aside>
          <main id="doctorDashContent">
            <h2>Patient List</h2>
            {assignedPatients.map((patient) => (
              <div key={patient._id} id="patientCard">
                <h3>Patient Name: <span>{patient.name}</span></h3>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Disease:</strong> {patient.disease}</p>
                <p><strong>Medical History:</strong> {patient.medicalhistory}</p>
                {patientAssignments[patient._id] ? (
                  <div className="assignmentMessage">
                    Patient task assigned to: <strong>{getAttendantName(patientAssignments[patient._id])}</strong>
                  </div>
                ) : (
                  <form className="assignTaskForm" onSubmit={(e) => handleAssignTask(e, patient._id)}>
                    <label htmlFor={`attendant-${patient._id}`}>Choose Attendant:</label>
                    <select
                      id={`attendant-${patient._id}`}
                      value={selectedAttendants[patient._id] || ""}
                      onChange={(e) =>
                        setSelectedAttendants({
                          ...selectedAttendants,
                          [patient._id]: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Select</option>
                      {availableAttendants.map((attendant) => (
                        <option key={attendant._id} value={attendant._id}>
                          {attendant.name}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="assignTaskBtn">Assign Task to Attendant</button>
                  </form>
                )}
              </div>
            ))}

            {/* Doctor Chat Section */}
            <div id="chatSection">
              <h3>Doctor-Attendant Communication</h3>
              <div id="chatBox">
                {chatMessages.map((msg) => (
                  <div key={msg._id} className="chatMessage">
                    <strong id="chatsender">
                      {msg.role} {msg.sender && msg.sender.name ? msg.sender.name : "Unknown"}:
                    </strong>{" "}
                    {msg.message}
                  </div>
                ))}
              </div>
              <div id="chatInputContainer">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  id="chatInput"
                />
                <button onClick={sendChatMessage} id="sendBtn">Send</button>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ATTENDANT DASHBOARD */}
      {user.role === "Attendant" && (
        <div id="attendantDashboardContainer">
          <aside id="attendantSideBar">
            <h2>Attendant Panel</h2>
            <p>Welcome, <strong>{user.name}</strong></p>
          </aside>
          <main id="attendantDashboardMain">
            <h2>Assigned Patients</h2>
            {attendantPatients.length > 0 ? (
              attendantPatients.map((patient) => (
                <div key={patient._id} id="attendantPatientCard">
                  <h3>Patient Name: <span>{patient.patientName}</span></h3>
                  <p>
                    <strong>Age:</strong> {patient.patientAge} | <strong>Gender:</strong> {patient.patientGender}
                  </p>
                  <p><strong>Disease:</strong> {patient.patientDisease}</p>
                  <h4>Daily Tasks:</h4>
                  <div id="taskContainer">
                    {/* Day 1 Tasks */}
                    <div id="taskDay">
                      <h5>Day 1</h5>
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id={`day1-hygiene-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day1 &&
                                checkboxStates[patient._id].day1.hygiene) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day1", "hygiene", e.target.checked)
                            }
                          />
                          <label htmlFor={`day1-hygiene-${patient._id}`}>Hygiene</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id={`day1-medication-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day1 &&
                                checkboxStates[patient._id].day1.medication) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day1", "medication", e.target.checked)
                            }
                          />
                          <label htmlFor={`day1-medication-${patient._id}`}>Medication</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id={`day1-monitoring-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day1 &&
                                checkboxStates[patient._id].day1.monitoring) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day1", "monitoring", e.target.checked)
                            }
                          />
                          <label htmlFor={`day1-monitoring-${patient._id}`}>Monitoring</label>
                        </li>
                      </ul>
                    </div>
                    {/* Day 2 Tasks */}
                    <div id="taskDay">
                      <h5>Day 2</h5>
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id={`day2-hygiene-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day2 &&
                                checkboxStates[patient._id].day2.hygiene) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day2", "hygiene", e.target.checked)
                            }
                          />
                          <label htmlFor={`day2-hygiene-${patient._id}`}>Hygiene</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id={`day2-medication-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day2 &&
                                checkboxStates[patient._id].day2.medication) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day2", "medication", e.target.checked)
                            }
                          />
                          <label htmlFor={`day2-medication-${patient._id}`}>Medication</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id={`day2-monitoring-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day2 &&
                                checkboxStates[patient._id].day2.monitoring) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day2", "monitoring", e.target.checked)
                            }
                          />
                          <label htmlFor={`day2-monitoring-${patient._id}`}>Monitoring</label>
                        </li>
                      </ul>
                    </div>
                    {/* Day 3 Tasks */}
                    <div id="taskDay">
                      <h5>Day 3</h5>
                      <ul>
                        <li>
                          <input
                            type="checkbox"
                            id={`day3-hygiene-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day3 &&
                                checkboxStates[patient._id].day3.hygiene) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day3", "hygiene", e.target.checked)
                            }
                          />
                          <label htmlFor={`day3-hygiene-${patient._id}`}>Hygiene</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id={`day3-medication-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day3 &&
                                checkboxStates[patient._id].day3.medication) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day3", "medication", e.target.checked)
                            }
                          />
                          <label htmlFor={`day3-medication-${patient._id}`}>Medication</label>
                        </li>
                        <li>
                          <input
                            type="checkbox"
                            id={`day3-monitoring-${patient._id}`}
                            checked={
                              (checkboxStates[patient._id] &&
                                checkboxStates[patient._id].day3 &&
                                checkboxStates[patient._id].day3.monitoring) || false
                            }
                            onChange={(e) =>
                              handleCheckboxChange(patient._id, "day3", "monitoring", e.target.checked)
                            }
                          />
                          <label htmlFor={`day3-monitoring-${patient._id}`}>Monitoring</label>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No patients assigned.</p>
            )}

            {/* Attendant Chat Section */}
            <div id="attendantChatSection">
              <h3>Doctor-Attendant Communication</h3>
              <div id="attendantChatBox">
                {chatMessages.map((msg) => (
                  <div key={msg._id} className="chatMessage">
                    <strong id="chatsender2">
                      {msg.role} {msg.sender && msg.sender.name ? msg.sender.name : "Unknown"}:
                    </strong>{" "}
                    {msg.message}
                  </div>
                ))}
              </div>
              <div id="attendantChatInputContainer">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  id="attendantChatInput"
                />
                <button onClick={sendChatMessage} id="attendantChatBtn">Send</button>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default Home;
