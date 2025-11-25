// Firebase SDK modullari
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDm5joBc7dicQrPvrmtH_v-RMhkQrIPcxY",
  authDomain: "nexalum-1.firebaseapp.com",
  projectId: "nexalum-1",
  storageBucket: "nexalum-1.firebasestorage.app",
  messagingSenderId: "418037039727",
  appId: "1:418037039727:web:8f0d8ed7c00cdf613f039a",
  measurementId: "G-F848CDBJ7W"
};

// Firebase init
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Qurilma ID yaratamiz
let device = localStorage.getItem("device_id");
if (!device) {
    device = "dev_" + Math.random().toString(36).substring(2,10);
    localStorage.setItem("device_id", device);
}

// Balansni o‘qish
export function onBalanceChange(callback) {
    onValue(ref(db, "users/"+device+"/balance"), snap => {
        callback(snap.val() || 0);
    });
}

// Balansga qo‘shish
export function addBalance(amount) {
    return runTransaction(ref(db, "users/"+device+"/balance"), bal => (bal||0)+amount);
}

// Boshlang'ich balans
set(ref(db,"users/"+device+"/balance"),0.0);

export { db, device };