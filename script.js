// Split TXT file
document.getElementById('splitTxtButton').addEventListener('click', function () {
    const file = document.getElementById('txtFileInput').files[0];
    const numbersPerFile = parseInt(document.getElementById('numbersPerFile').value, 10);
    const baseFileName = document.getElementById('txtSplitFileNameInput').value.trim() || 'split';

    if (!file || isNaN(numbersPerFile) || numbersPerFile <= 0) {
        alert('Masukkan file TXT dan jumlah nomor per file yang valid!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

        const totalParts = Math.ceil(lines.length / numbersPerFile);
        const txtSplitFilesDiv = document.getElementById('txtSplitFiles');
        txtSplitFilesDiv.innerHTML = '';

        for (let i = 0; i < totalParts; i++) {
            const start = i * numbersPerFile;
            const part = lines.slice(start, start + numbersPerFile).join('\n');
            const blob = new Blob([part], { type: 'text/plain' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${baseFileName}_${i + 1}.txt`;
            link.textContent = `Download ${baseFileName}_${i + 1}.txt`;

            txtSplitFilesDiv.appendChild(link);
        }

        console.log('File TXT berhasil dipotong');
    };

    reader.readAsText(file);
});

// VCF to TXT converter
document.getElementById('vcfToTxtButton').addEventListener('click', function () {
    const file = document.getElementById('vcfFileInput').files[0];

    if (!file) {
        alert('Pilih file VCF terlebih dahulu!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const lines = content.split(/\r?\n/);
        const numbers = [];

        lines.forEach(line => {
            if (line.startsWith("TEL")) {
                const parts = line.split(":");
                if (parts[1]) {
                    let phone = parts[1].trim();
                    if (!phone.startsWith("+") && !phone.startsWith("0")) {
                        phone = "+" + phone;
                    }
                    numbers.push(phone);
                }
            }
        });

        const outputText = numbers.join("\n");
        const blob = new Blob([outputText], { type: 'text/plain' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "converted.txt";
        link.textContent = "Download converted.txt";

        const outputDiv = document.getElementById('vcfToTxtOutput');
        outputDiv.innerHTML = '';
        outputDiv.appendChild(link);
    };

    reader.readAsText(file);
});
