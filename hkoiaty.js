const letters = "أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ"; // الأحرف الساقطة
const body = document.body;

// إنشاء الأحرف الساقطة
setInterval(() => {
    const letter = document.createElement('div'); // إنشاء عنصر حرف جديد
    letter.className = 'letter'; // تعيين الفئة
    letter.textContent = letters.charAt(Math.floor(Math.random() * letters.length)); // اختيار حرف عشوائي
    letter.style.left = Math.random() * 100 + 'vw'; // تعيين موضع حرف عشوائي
    letter.style.animationDuration = Math.random() * 3 + 2 + 's'; // تعيين مدة الحركة
    letter.style.transform = `rotate(${Math.random() * 360}deg)`; // تعيين دوران عشوائي
    body.appendChild(letter); // إضافة الحرف إلى الجسم
    setTimeout(() => {
        letter.remove(); // إزالة الحرف بعد 5 ثوانٍ
    }, 5000);
}, 300); // تكرار كل 300 مللي ثانية

let selectedStoryType = ''; // متغير لتخزين نوع القصة
let selectedStoryLength = ''; // متغير لتخزين مدة القصة
const apiKey = "AIzaSyBd6RLj-4yrtQvVyoK205H-SYiJLP-8sbA"; // استبدل بمفتاح API الخاص بك
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`; // رابط API

// إضافة حدث عند الضغط على زر توليد القصة
document.getElementById('generateButton').addEventListener('click', () => {
    const characterName = document.getElementById('characterName').value; // الحصول على اسم الشخصية
    if (characterName.trim() === '') {
        alert('يرجى أدخال عنوان أو موضوع للقصة.'); // تنبيه إذا لم يتم إدخال اسم
        return;
    }
    document.getElementById('popupBackground').style.display = 'block'; // إظهار الخلفية
    document.getElementById('storyTypePopup').style.display = 'block'; // إظهار بوب أب اختيار نوع القصة
    document.getElementById('storyOutput').style.display = 'none'; // إخفاء منطقة القصة
});

// وظيفة اختيار نوع القصة
function selectStoryType(type) {
    selectedStoryType = type; // تخزين نوع القصة المحدد
    document.getElementById('storyTypePopup').style.display = 'none'; // إخفاء بوب أب نوع القصة
    document.getElementById('storyLengthPopup').style.display = 'block'; // إظهار بوب أب مدة القصة
}

// وظيفة اختيار مدة القصة
function selectStoryLength(length) {
    selectedStoryLength = length; // تخزين مدة القصة المحددة
    document.getElementById('storyLengthPopup').style.display = 'none'; // إخفاء بوب أب مدة القصة
    generateStory(); // استدعاء وظيفة توليد القصة
}

// وظيفة توليد القصة
function generateStory() {
    const characterName = document.getElementById('characterName').value; // الحصول على اسم الشخصية
    const requestBody = {
        contents: [
            {
                parts: [
                    {
                        text: `أريد قصة ${selectedStoryLength} عن ${characterName} في قصة ${selectedStoryType}.`
                    }
                ]
            }
        ]
    };

    // إظهار رسالة التحميل
    document.getElementById('loading').style.display = 'block'; // إظهار رسالة التحميل
    document.getElementById('storyText').innerText = ""; // إفراغ النص السابق
    document.getElementById('storyTitle').style.display = 'none'; // إخفاء العنوان
    document.getElementById('inputContainer').style.display = 'none'; // إخفاء خانة الإدخال
    document.getElementById('storyOutput').style.display = 'none'; // إخفاء منطقة القصة
    document.getElementById('welcomeMessage').style.display = 'none'; // إخفاء الرسالة الترحيبية

    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // تعيين نوع المحتوى
        },
        body: JSON.stringify(requestBody) // تحويل البيانات إلى JSON
    })
    .then(response => response.json()) // تحويل الاستجابة إلى JSON
    .then(data => {
        console.log(data); // اطبع الاستجابة لرؤية البيانات

        const generatedText = data.candidates[0]?.content?.parts[0]?.text || "نص غير متوفر"; // الحصول على النص المولد
        const storyTitle = characterName; // استخدام اسم المدخل كعنوان

        // عرض العنوان والنص في منطقة القصة
        document.getElementById('storyTitle').innerText = storyTitle;
        document.getElementById('storyTitle').style.display = 'block'; // إظهار العنوان
        document.getElementById('storyText').innerText = generatedText;

        document.getElementById('storyOutput').style.display = 'block'; // إظهار منطقة القصة
        document.getElementById('loading').style.display = 'none'; // إخفاء رسالة التحميل
        hidePopup(); // إخفاء البوب أب
        document.getElementById('storyOutput').scrollTop = 0; // إعادة التمرير إلى الأعلى
    })
    .catch(error => {
        console.error("Error fetching data:", error); // طباعة الأخطاء في وحدة التحكم
        document.getElementById('storyText').innerText = "حدث خطأ أثناء استرجاع القصة."; // عرض رسالة خطأ
        document.getElementById('storyOutput').style.display = 'block'; // إظهار منطقة القصة
        document.getElementById('loading').style.display = 'none'; // إخفاء رسالة التحميل
        hidePopup(); // إخفاء البوب أب
    });
}

// وظيفة تمييز النص عند الضغط المزدوج
function highlightText(event) {
    const selectedText = window.getSelection().toString(); // الحصول على النص المحدد
    if (selectedText) {
        const highlightedText = `<span class="highlight">${selectedText}</span>`; // تمييز النص
        document.getElementById('storyText').innerHTML = document.getElementById('storyText').innerHTML.replace(selectedText, highlightedText); // استبدال النص المحدد
    }
}

// إضافة حدث عند الضغط المزدوج على النص
document.getElementById('storyText').addEventListener('dblclick', highlightText);

// إضافة حدث عند اللمس مرتين (للأجهزة المحمولة)
let lastTouchEnd = 0;

document.getElementById('storyText').addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        highlightText(event); // استدعاء وظيفة التمييز
    }
    lastTouchEnd = now;
});

// إضافة حدث عند الضغط على زر إنشاء قصة جديدة
document.getElementById('newStoryButton').addEventListener('click', () => {
    document.getElementById('inputContainer').style.display = 'none'; // إخفاء خانة الإدخال
    generateStory(); // استدعاء وظيفة توليد القصة مباشرة
});

// إضافة حدث عند الضغط على زر مشاركة النص
document.getElementById('shareButton').addEventListener('click', () => {
    const text = document.getElementById('storyText').innerText; // الحصول على نص القصة
    if (text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('تم نسخ النص إلى الحافظة!'); // تأكيد النسخ
        });
    } else {
        alert('لا توجد قصة لمشاركتها.'); // تنبيه إذا لم توجد قصة
    }
});

// إضافة حدث عند الضغط على زر إخفاء القصة
document.getElementById('hideStoryButton').addEventListener('click', () => {
    document.getElementById('storyOutput').style.display = 'none'; // إخفاء منطقة القصة
    document.getElementById('storyText').innerText = ""; // إفراغ النص السابق
    document.getElementById('storyTitle').style.display = 'none'; // إخفاء عنوان القصة
    document.getElementById('inputContainer').style.display = 'flex'; // إظهار خانة الإدخال
    document.getElementById('welcomeMessage').style.display = 'block'; // إظهار الرسالة الترحيبية
});

// إضافة حدث عند الضغط على زر المساعدة
document.getElementById('helpButton').addEventListener('click', () => {
    document.getElementById('helpPopup').style.display = 'block'; // إظهار بوب أب المساعدة
});

// وظيفة إخفاء البوب أب
function hidePopup() {
    document.getElementById('popupBackground').style.display = 'none'; // إخفاء الخلفية
    document.getElementById('storyTypePopup').style.display = 'none'; // إخفاء بوب أب نوع القصة
    document.getElementById('storyLengthPopup').style.display = 'none'; // إخفاء بوب أب مدة القصة
    document.getElementById('loading').style.display = 'none'; // إخفاء رسالة التحميل
}

// وظيفة إخفاء بوب أب المساعدة
function hideHelpPopup() {
    document.getElementById('helpPopup').style.display = 'none'; // إخفاء بوب أب المساعدة
}