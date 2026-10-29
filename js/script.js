import { dataTracking } from "./data.js"

const trackingButton = document.getElementById("tracking");

if (trackingButton) {
    trackingButton.addEventListener("click", tracking);
}

function tracking(event) {
    event.preventDefault();

    const resi = document.getElementById("resi").value;
    const data = dataTracking[resi];

    if (!data) {
        document.getElementById("resiTrack").classList.add("hide");
        return alert("Data Pengiriman Tidak Ditemukan");
    }
    renderTrackingDetails(data);
}

function renderTrackingDetails(data) {
    document.getElementById("nomorDO").textContent = data.nomorDO || "-";
    document.getElementById("nim").textContent = data.nim || "-";
    document.getElementById("ekspedisi").textContent = data.ekspedisi;
    document.getElementById("tanggalKirim").textContent = data.tanggalKirim;
    document.getElementById("status").textContent = data.status;
    document.getElementById("nama").textContent = data.nama;
    document.getElementById("paket").textContent = data.paketNama
        ? `${data.paket} - ${data.paketNama}`
        : data.paket;
    document.getElementById("total").textContent = typeof data.total === "number"
        ? `Rp ${data.total.toLocaleString("id-ID")}`
        : data.total;

    renderTracking(data.perjalanan);

    document.getElementById("resiTrack").classList.remove("hide");
}

function renderTracking(perjalanan) {
    const container = document.getElementById("tracking-history");
    container.replaceChildren();

    perjalanan.forEach((item, index) => {
        const listProgress = document.createElement("div");
        listProgress.classList.add("list-progress");

        const dotTrack = document.createElement("div");
        dotTrack.classList.add("dot-track");

        const detailDot = document.createElement("div");
        detailDot.classList.add("detail-dot");

        const detailLine = document.createElement("div");
        detailLine.classList.add("detail-line");

        const textContainer = document.createElement("div");
        textContainer.classList.add("text-container");

        const label = document.createElement("p");
        label.classList.add("label");
        label.textContent = item.waktu;

        const value = document.createElement("p");
        value.classList.add("value");
        value.textContent = item.keterangan;

        dotTrack.append(detailDot, detailLine);
        textContainer.append(label, value);
        listProgress.append(dotTrack, textContainer);

        container.appendChild(listProgress);
    });
}