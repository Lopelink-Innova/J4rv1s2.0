function iniciarEscucha() {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
        const mensaje = event.results[0][0].transcript;
        document.getElementById("respuesta").innerHTML = `<strong>Tú:</strong> ${mensaje}<br><em>Jarvis está pensando...</em>`;
        fetch("/preguntar", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({mensaje})
        })
        .then(res => res.json())
        .then(data => {
            const respuesta = data.respuesta;
            document.getElementById("respuesta").innerHTML += `<br><strong>Jarvis:</strong> ${respuesta}`;
            hablar(respuesta);
        });
    };

    recognition.onerror = function(event) {
        alert("Error al reconocer la voz: " + event.error);
    };
}

function hablar(texto) {
    const synth = window.speechSynthesis;
    const utter = new SpeechSynthesisUtterance(texto);
    utter.lang = "es-ES";
    utter.pitch = 1;
    utter.rate = 1;
    synth.speak(utter);
}