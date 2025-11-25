let adCount = 0;
let isFlying = false;
let flyTime = 15 * 60;
let flyInterval = null;

async function showAd() {
    return new Promise(resolve => {
        if (!window.Adsgram) {
            alert("AdsGram SDK yuklanmagan!");
            resolve(false);
            return;
        }

        const AdController = window.Adsgram.init({ blockId: "int-18178" });
        AdController.show()
            .then(result => {
                console.log("AdsGram result:", result);
                resolve(result.done && !result.error);
            })
            .catch(err => {
                console.error("AdsGram error:", err);
                resolve(false);
            });
    });
}

async function handleLaunchButton() {
    if (isFlying) return;

    let ok = await showAd();
    if (!ok) return;

    adCount++;
    document.getElementById("adCount").innerText = `${adCount}/2`;

    if (adCount >= 2) {
        startFly();
    }
}

function startFly() {
    if (isFlying) return;

    isFlying = true;
    adCount = 0;
    document.getElementById("adCount").innerText = "0/2";

    let time = flyTime;
    const timerEl = document.getElementById("timer");
    const rocketEl = document.getElementById("rocket");

    timerEl.innerText = "Raketa ishga tushdi!";

    let direction = 1;
    flyInterval = setInterval(() => {
        rocketEl.style.transform = `translateY(${direction * -10}px)`;
        direction *= -1;

        let m = Math.floor(time / 60);
        let s = time % 60;
        timerEl.innerText = `${m}:${s < 10 ? "0"+s : s}`;

        // Balansga qo‘shish
        addBalance(0.005 / flyTime);

        time--;
        if (time < 0) {
            clearInterval(flyInterval);
            isFlying = false;
            timerEl.innerText = "Uchish tugadi";
            rocketEl.style.transform = "translateY(0)";
        }
    }, 1000);
}

document.getElementById("launchButton").addEventListener("click", handleLaunchButton);
