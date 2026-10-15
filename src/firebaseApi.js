// Firebase Firestore API Service
// Replaces all server.js /api/* routes — directly talks to Firestore
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// ── Helper ──────────────────────────────────────────────────────────
const getAll = async (col) => {
  const snap = await getDocs(collection(db, col));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

// ── MEMBERS ─────────────────────────────────────────────────────────
export const fetchMembers = () => getAll("members");

export const saveMember = async (memberData) => {
  if (!memberData.id) memberData.id = "mem-" + Date.now();
  memberData.updatedAt = Date.now();
  if (!memberData.createdAt) memberData.createdAt = Date.now();
  await setDoc(doc(db, "members", memberData.id), memberData, { merge: true });
  return memberData;
};

export const deleteMember = async (id) => {
  await deleteDoc(doc(db, "members", id));
  return { success: true, id };
};

export const updatePresence = async (memberId, isOnline) => {
  await setDoc(
    doc(db, "members", memberId),
    { isOnline, lastActiveTimestamp: Date.now() },
    { merge: true }
  );
};

// ── PROJECTS ─────────────────────────────────────────────────────────
export const fetchProjects = () => getAll("projects");

export const saveProject = async (projData) => {
  if (!projData.id) projData.id = "proj-" + Date.now();
  projData.updatedAt = Date.now();
  if (!projData.createdAt) projData.createdAt = Date.now();
  await setDoc(doc(db, "projects", projData.id), projData, { merge: true });
  return projData;
};

export const deleteProject = async (id) => {
  await deleteDoc(doc(db, "projects", id));
  return { success: true, id };
};

// ── ACHIEVEMENTS ─────────────────────────────────────────────────────
export const fetchAchievements = () => getAll("achievements");

export const saveAchievement = async (achData) => {
  if (!achData.id) achData.id = "ach-" + Date.now();
  achData.updatedAt = Date.now();
  if (!achData.createdAt) achData.createdAt = Date.now();
  await setDoc(doc(db, "achievements", achData.id), achData, { merge: true });
  return achData;
};

export const deleteAchievement = async (id) => {
  await deleteDoc(doc(db, "achievements", id));
  return { success: true, id };
};

// ── CONTACT MESSAGES ─────────────────────────────────────────────────
export const fetchContactMessages = () => getAll("contactmessages");

export const saveContactMessage = async (msgData) => {
  if (!msgData.id) msgData.id = "msg-" + Date.now();
  msgData.createdAt = Date.now();
  if (!msgData.date) msgData.date = new Date().toLocaleString();
  await setDoc(doc(db, "contactmessages", msgData.id), msgData, { merge: true });
  return msgData;
};

export const deleteContactMessage = async (id) => {
  await deleteDoc(doc(db, "contactmessages", id));
  return { success: true, id };
};

// ── DIRECT MESSAGES ──────────────────────────────────────────────────
export const fetchDirectMessages = () => getAll("directmessages");

export const saveDirectMessage = async (msgData) => {
  if (!msgData.id) msgData.id = "dm-" + Date.now();
  if (!msgData.createdAt) msgData.createdAt = Date.now();
  if (!msgData.timestamp) {
    msgData.timestamp =
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " • " +
      new Date().toLocaleDateString();
  }
  msgData.status = msgData.status || "unread";
  await setDoc(doc(db, "directmessages", msgData.id), msgData, { merge: true });
  return msgData;
};

export const deleteDirectMessage = async (id) => {
  await deleteDoc(doc(db, "directmessages", id));
  return { success: true, id };
};

// ── ACCESS REQUESTS ──────────────────────────────────────────────────
export const fetchAccessRequests = () => getAll("accessrequests");

export const saveAccessRequest = async (requestData) => {
  if (!requestData.id) requestData.id = "req-" + Date.now();
  requestData.createdAt = Date.now();
  if (!requestData.requestedAt) {
    requestData.requestedAt =
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      ", " +
      new Date().toLocaleDateString();
  }
  requestData.status = requestData.status || "pending";
  await setDoc(doc(db, "accessrequests", requestData.id), requestData, { merge: true });
  return requestData;
};

export const updateAccessRequest = async (id, updateData) => {
  await setDoc(doc(db, "accessrequests", id), { ...updateData, updatedAt: Date.now() }, { merge: true });
  return { id, ...updateData };
};
