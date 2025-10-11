const inputTo = document.getElementById('inputTo');
const inputFrom = document.getElementById('inputFrom');
const inputDate = document.getElementById('inputDate');
const inputContent = document.getElementById('inputContent');

const previewDate = document.getElementById('previewDate');
const previewTo = document.getElementById('previewTo');
const previewContent = document.getElementById('previewContent');
const previewFrom = document.getElementById('previewFrom').querySelector('p:last-child');

const messageBox = document.getElementById('messageBox');
const letterPreviewArea = document.getElementById('letterPreviewArea');


function updatePreview() {
    const toValue = inputTo.value.trim();
    const fromValue = inputFrom.value.trim();
    const dateValue = inputDate.value.trim() || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const contentValue = inputContent.value;

    previewDate.textContent = dateValue;
    previewTo.textContent = toValue || 'My Dearest [Recipient],';
    previewFrom.textContent = fromValue || '[Your Name]';
    previewContent.textContent = contentValue;
}


function showMessage(text, type = 'info') {
    const typeClasses = {
        success: 'success',
        error: 'error',
        info: 'info'
    };

    messageBox.className = `message-box mt-4 p-3 ${typeClasses[type]}`;
    messageBox.textContent = text;
    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}


function generateFullText() {
    const date = previewDate.textContent;
    const to = inputTo.value.trim();
    const from = inputFrom.value.trim();
    const content = inputContent.value;

    const recipientLine = to || 'My Dearest [Recipient],';
    const signatureLine = from ? `\nWith all my love,\n${from}` : '\nWith all my love,\n[Your Name]';

    return `${date}\n\n${recipientLine}\n\n${content}${signatureLine}`;
}

function copyDocumentToClipboard() {
    const fullText = generateFullText();

    const textArea = document.createElement('textarea');
    textArea.value = fullText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showMessage('💖 Letter text copied to clipboard! 💖', 'success');
        } else {
            showMessage('💔 Failed to copy. Please try manually. 💔', 'error');
        }
    } catch (err) {
        showMessage('💔 Error copying to clipboard. Browser restrictions may apply. 💔', 'error');
        console.error('Copy failed:', err);
    } finally {
        document.body.removeChild(textArea);
    }
}


async function exportAsPng() {
    showMessage('⏳ Generating PNG... Please wait! ⏳', 'info');


  
    const tempPrintableArea = document.createElement('div');
    tempPrintableArea.className = 'printable-letter-area'; 
    tempPrintableArea.innerHTML = `
                <span class="heart-decoration heart-top-left">❤️</span>
                <span class="heart-decoration heart-bottom-right">❤️</span>
                <div class="text-sm mb-6 text-right">${previewDate.textContent}</div>
                <div class="mb-4">${previewTo.textContent}</div>
                <div class="text-base">${previewContent.textContent}</div>
                <div class="mt-12 pt-4 border-t border-dotted border-pink-400">
                    <p class="text-sm italic">With all my love,</p>
                    <p class="font-bold">${previewFrom.textContent}</p>
                </div>
            `;
    document.body.appendChild(tempPrintableArea);

    try {
        const canvas = await html2canvas(tempPrintableArea, {
            scale: 2, 
            useCORS: true, 
            backgroundColor: null 
        });

        const image = canvas.toDataURL('image/png');
        const filename = (inputTo.value.trim() || 'my_love_letter') + '.png';

        const a = document.createElement('a');
        a.href = image;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        showMessage(`💌 '${filename}' has been downloaded! 💌`, 'success');

    } catch (error) {
        console.error('Error generating PNG:', error);
        showMessage('💔 Failed to generate PNG. Please try again. 💔', 'error');
    } finally {
        document.body.removeChild(tempPrintableArea);
    }
}


window.onload = () => {
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    inputDate.value = today;

    inputTo.value = 'My Sweetheart';
    inputFrom.value = 'Your Secret Admirer';
    inputContent.value = "My Dearest,\n\nEvery pixel of my world shines brighter when you're in it. My heart beats in 8-bit rhythms for you, a nostalgic melody only we can hear.\n\nLike a classic arcade game, our love is an endless adventure, filled with thrilling quests and precious power-ups. With every level, my affection for you grows stronger, reaching for that high score of eternal bliss.\n\nYou are my Player Two, my ultimate companion in this magnificent journey. Thank you for making every moment feel like a cherished memory.\n\nWith all my love, forever and always.";

    updatePreview();
};
