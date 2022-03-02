function datePreparation(date) {
    const data = new Date(date).toLocaleDateString("pl-PL");
    const rok = data.split(".")[2];
    const miesiac = data.split(".")[1];
    let dzien = data.split(".")[0];
    if (dzien.length !== 2) {
        dzien = "0" + dzien;
    }
    return rok + "-" + miesiac + "-" + dzien;
}

export default datePreparation;
