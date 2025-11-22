// Supabase init
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://cqjilskroiylmunpavjy.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxamlsc2tyb2l5bG11bnBhdmp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjExNTgsImV4cCI6MjA3OTI5NzE1OH0.e8wFwakbu9R0iE6bxCc0kguZkUT3T89y9RV-36iP3uE"
);

// Elementlar
const balanceEl = document.getElementById("balance");
const claimBtn = document.getElementById("claim");
const bonusBtn = document.getElementById("bonus");

let balance = 0;
let lastBonus = null;

// Telegram user ID
const userId = Telegram.WebApp.initDataUnsafe.user.id;

// AdsGram init
const AdController = window.Adsgram.init({
    blockId: "int-17980"
});

// Supabase’dan balansni olish
async function loadBalance() {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (!data) {
        await supabase.from("users").insert({
            id: userId,
            balance: 0,
            last_bonus: null
        });

        balance = 0;
        lastBonus = null;
    } else {
        balance = data.balance;
        lastBonus = data.last_bonus ? new Date(data.last_bonus) : null;
    }

    updateUI();
}

function updateUI() {
    balanceEl.textContent = balance.toFixed(2);
}

// --- Reklama orqali pul berish
async function giveReward() {
    balance += 0.02;
    updateUI();

    await supabase
        .from("users")
        .update({ balance })
        .eq("id", userId);

    alert("💲 0.02 ₽ qo‘shildi!");
}

// CLAIM tugmasi
claimBtn.addEventListener("click", () => {
    AdController.show()
        .then((result) => {
            if (result.done && !result.error) {
                giveReward();
            }
        })
        .catch((err) => console.log(err));
});

// --- DAILY BONUS (24 soat)
bonusBtn.addEventListener("click", async () => {
    const now = new Date();

    if (lastBonus && (now - lastBonus) < 24 * 60 * 60 * 1000) {
        const qoldi = 24 - Math.floor((now - lastBonus) / (1000 * 60 * 60));
        return alert(`Bonus ${qoldi} soatdan keyin!`);
    }

    balance += 0.10;
    lastBonus = now;
    updateUI();

    await supabase
        .from("users")
        .update({
            balance,
            last_bonus: now.toISOString(),
        })
        .eq("id", userId);

    alert("🎁 0.10 ₽ kunlik bonus berildi!");
});

// Start
loadBalance();
