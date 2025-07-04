document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let audio = new Audio('saksi.mp3');

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 50; 
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;
          }
        });
      }

      if (blownOut > 0) {
        updateCandleCount();
      }

      if (candles.every((candle) => candle.classList.contains("out"))) {
        setTimeout(function () {
          triggerConfetti();
          endlessConfetti();
        }, 200);
        audio.play();
      }
    }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function endlessConfetti() {
  setInterval(function () {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0 }
    });
  }, 1000);
}

document.querySelector(".blow-button").addEventListener('click', function () {
  Swal.fire({
    html: `
      <style>
        .swal2-container .swal2-html-container p {
          text-align: justify;
          text-indent: 2em;
        }
      </style>
      <p>Happiest Birthday, My Love! God knows na sobrang grateful ako for having you in my life. Meeting you was the best thing in my life, & choosing to love you was the best decision I've ever made. Thank you for choosing me as well.</p>
      <p>I appreciate you for being so understanding & for being my biggest supporter. Thank you for loving me even with my flaws. Thank you for being the most strong, hardworking & dedicated person I know. But I know things haven't always been easy for you but I'm proud of you. I hope you never forget to appreciate yourself. Please be gentle and don't be harsh to yourself, learn to rest and don't let small things pressure you. And as I look at you now, I see someone who has come so far, and for that, I'm so proud. You've done a great job despite how tired and drained you are. Again, I'm so proud of you, my love.</p>
      <p>No matter how challenging things get, I genuinely want us to be together. I still have faith in us, regardless of how many storms and miscommunications we encounter. We’ve come this far, and deep down, I still see a future where it's you and me, growing, learning, and holding on together.</p>
      <p>I'm not asking for a perfect relationship, but about choosing each other again & again even on the hard days. & in my heart, that's what I want, you and me, together, stronger than ever. Love, always remember na I love you so much, that even no words can explain how much I deeply value you here in my heart.</p>
    `,
    iconHtml: `
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100" height="100">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#ff6999"/>
      </svg>
    `,
    customClass: {
      icon: 'custom-heart-icon',
      confirmButton: 'custom-confirm-btn',
      container: 'custom-swal-container'
    },
    confirmButtonText: 'Close'
  });
});

