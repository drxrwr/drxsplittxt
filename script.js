// Fungsi untuk memecah file TXT
document.getElementById('splitButton').addEventListener('click', function () {
    const file = document.getElementById('txtFileInput').files[0];
    const contactsPerFile = parseInt(document.getElementById('contactsPerFile').value, 10);
    const startNumber = parseInt(document.getElementById('startNumberInput').value, 10) || 1;
    let fileName = document.getElementById('splitFileNameInput').value.trim();
    const additionalFileName = document.getElementById('additionalFileNameInput').value.trim();

    const fileNameParts = fileName.split('§').map((part) => part.trim());

    if (!file || isNaN(contactsPerFile) || contactsPerFile <= 0) {
        alert('Masukkan file TXT dan jumlah nomor per file yang valid!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        // Pisah tiap baris dan filter yang tidak kosong
        const lines = content.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

        if (lines.length === 0) {
            alert('File TXT tidak berisi nomor yang valid!');
            return;
        }

        const splitFiles = [];
        for (let i = 0; i < lines.length; i += contactsPerFile) {
            const chunk = lines.slice(i, i + contactsPerFile).join('\n');
            const blob = new Blob([chunk], { type: 'text/plain' });
            splitFiles.push(blob);
        }

        const splitTxtFilesDiv = document.getElementById('splitTxtFiles');
        splitTxtFilesDiv.innerHTML = '';

        splitFiles.forEach((blob, index) => {
            const currentIndex = startNumber + index;
            const link = document.createElement('a');

            let generatedFileName;
            if (fileNameParts.length > 1) {
                generatedFileName = `${fileNameParts[0]} ${currentIndex}`;
            } else if (fileNameParts[0]) {
                generatedFileName = `${fileNameParts[0]}${currentIndex}`;
            } else {
                generatedFileName = `${currentIndex}`;
            }

            if (additionalFileName) {
                generatedFileName += ` ${additionalFileName}`;
            }

            generatedFileName += '.txt';

            link.href = URL.createObjectURL(blob);
            link.download = generatedFileName;
            link.textContent = `Download ${generatedFileName}`;
            splitTxtFilesDiv.appendChild(link);
            splitTxtFilesDiv.appendChild(document.createElement('br'));
        });

        console.log('Memecah file TXT selesai');
    };
    reader.readAsText(file);
});

// Fungsi untuk mengonversi VCF ke TXT (tetap sama)
document.getElementById('convertButton').addEventListener('click', function () {
    const file = document.getElementById('vcfFileInputTxt').files[0];
    const outputTextArea = document.getElementById('outputTextArea');
    const outputFileName = document.getElementById('outputFileNameInput').value.trim();

    if (!file) {
        alert('Silakan pilih file VCF untuk dikonversi!');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const contacts = content.split('END:VCARD').map((contact) => contact.trim()).filter((contact) => contact.length > 0);
        let phoneNumbers = contacts
            .map((contact) => {
                const match = contact.match(/TEL:(.+)/);
                return match ? match[1] : null;
            })
            .filter(Boolean);

        outputTextArea.value = phoneNumbers.join('\n');
        document.getElementById('totalContacts').innerText = `Total contacts: ${phoneNumbers.length}`;

        const blob = new Blob([outputTextArea.value], { type: 'text/plain' });
        const txtDownloadLink = document.getElementById('txtDownloadLink');
        txtDownloadLink.innerHTML = '';

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = outputFileName ? `${outputFileName}.txt` : 'output.txt';
        link.textContent = 'Download TXT';
        txtDownloadLink.appendChild(link);
    };
    reader.readAsText(file);
});
