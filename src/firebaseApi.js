// Firebase Firestore API Service
// Falls back gracefully if Firebase is not configured
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const getAll = async (col) => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, col));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    console.warn(`[Firebase] getAll(${col}) failed:`, e.message);
    return [];
  }
};

// ── MEMBERS ─────────────────────────────────────────────────────────
export const fetchMembers = () => getAll("members");

export const saveMember = async (memberData) => {
  if (!db) return memberData;
  if (!memberData.id) memberData.id = "mem-" + Date.now();
  memberData.updatedAt = Date.now();
  if (!memberData.createdAt) memberData.createdAt = Date.now();
  try {
    await setDoc(doc(db, "members", memberData.id), memberData, { merge: true });
  } catch (e) {
    console.warn("[Firebase] saveMember failed:", e.message);
  }
  return memberData;
};

export const deleteMember = async (id) => {
  if (!db) return { success: true, id };
  try {
    await deleteDoc(doc(db, "members", id));
  } catch (e) {
    console.warn("[Firebase] deleteMember failed:", e.message);
  }
  return { success: true, id };
};

export const updatePresence = async (memberId, isOnline) => {
  if (!db) return;
  try {
    await setDoc(doc(db, "members", memberId), { isOnline, lastActiveTimestamp: Date.now() }, { merge: true });
  } catch (e) {
    console.warn("[Firebase] updatePresence failed:", e.message);
  }
};

// ── PROJECTS ─────────────────────────────────────────────────────────
export const fetchProjects = () => getAll("projects");

export const saveProject = async (projData) => {
  if (!db) return projData;
  if (!projData.id) projData.id = "proj-" + Date.now();
  projData.updatedAt = Date.now();
  if (!projData.createdAt) projData.createdAt = Date.now();
  try {
    await setDoc(doc(db, "projects", projData.id), projData, { merge: true });
  } catch (e) {
    console.warn("[Firebase] saveProject failed:", e.message);
  }
  return projData;
};

export const deleteProject = async (id) => {
  if (!db) return { success: true, id };
  try {
    await deleteDoc(doc(db, "projects", id));
  } catch (e) {
    console.warn("[Firebase] deleteProject failed:", e.message);
  }
  return { success: true, id };
};

// ── ACHIEVEMENTS ─────────────────────────────────────────────────────
export const fetchAchievements = () => getAll("achievements");

export const saveAchievement = async (achData) => {
  if (!db) return achData;
  if (!achData.id) achData.id = "ach-" + Date.now();
  achData.updatedAt = Date.now();
  if (!achData.createdAt) achData.createdAt = Date.now();
  try {
    await setDoc(doc(db, "achievements", achData.id), achData, { merge: true });
  } catch (e) {
    console.warn("[Firebase] saveAchievement failed:", e.message);
  }
  return achData;
};

export const deleteAchievement = async (id) => {
  if (!db) return { success: true, id };
  try { await deleteDoc(doc(db, "achievements", id)); } catch (e) {}
  return { success: true, id };
};

// ── CONTACT MESSAGES ─────────────────────────────────────────────────
export const saveContactMessage = async (msgData) => {
  if (!db) return msgData;
  if (!msgData.id) msgData.id = "msg-" + Date.now();
  msgData.createdAt = Date.now();
  if (!msgData.date) msgData.date = new Date().toLocaleString();
  try {
    await setDoc(doc(db, "contactmessages", msgData.id), msgData, { merge: true });
  } catch (e) {
    console.warn("[Firebase] saveContactMessage failed:", e.message);
  }
  return msgData;
};

// ── DIRECT MESSAGES ──────────────────────────────────────────────────
export const saveDirectMessage = async (msgData) => {
  if (!db) return msgData;
  if (!msgData.id) msgData.id = "dm-" + Date.now();
  if (!msgData.createdAt) msgData.createdAt = Date.now();
  msgData.status = msgData.status || "unread";
  try {
    await setDoc(doc(db, "directmessages", msgData.id), msgData, { merge: true });
  } catch (e) {
    console.warn("[Firebase] saveDirectMessage failed:", e.message);
  }
  return msgData;
};
