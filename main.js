var typed = new Typed(".text", {
    strings:["WebDev Enthusiast","Problem solver","Quick Learner"],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
});

/* --- SCROLL SECTION ACTIVE LINK --- */
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.navbar a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
            });
            // Match the href exactly with the id
            let targetLink = document.querySelector('.navbar a[href*=' + id + ']');
            if (targetLink) {
                targetLink.classList.add('active');
            }
        };
    });

    /* --- STICKY NAVBAR --- */
    let header = document.querySelector('.header');
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 100);
    }

    /* --- REMOVE TOGGLE ICON AND NAVBAR WHEN CLICK NAVBAR LINK (SCROLL) --- */
    if (typeof menuIcon !== 'undefined' && typeof navbar !== 'undefined') {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    }
};

/* --- TOGGLE NAVBAR --- */
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

/* --- CONTACT FORM AJAX SUBMISSION --- */
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-box');
            const originalBtnValue = submitBtn.value || submitBtn.textContent;
            
            // Show sending state
            submitBtn.value = "Sending...";
            submitBtn.disabled = true;
            
            // Remove existing alert messages
            const existingMsg = contactForm.querySelector('.form-message');
            if (existingMsg) existingMsg.remove();
            
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Safe fallback check: FormSubmit blocks direct requests from file:// protocols
            if (window.location.protocol === 'file:') {
                setTimeout(() => {
                    submitBtn.value = originalBtnValue;
                    submitBtn.disabled = false;
                    
                    const msgDiv = document.createElement('div');
                    msgDiv.className = 'form-message warning-message';
                    msgDiv.innerHTML = `
                        <p><strong>Local Environment Notice:</strong> FormSubmit.co requires forms to be served from a web server (e.g., http://localhost or http://127.0.0.1) and rejects submissions from local file origins (file:// protocol).</p>
                        <p>To test it live, serve this project via a local web server (like VS Code Live Server). You can also <a href="mailto:aniluppari851@gmail.com?subject=${encodeURIComponent(data.subject || 'Portfolio Contact')}&body=${encodeURIComponent('Hi Anil,\\n\\n' + (data.message || ''))}" class="mailto-fallback">Click here to send this message via your email client</a>.</p>
                    `;
                    contactForm.appendChild(msgDiv);
                }, 800);
                return;
            }
            
            // Set up a 5-second timeout controller to handle connection timeouts
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            // AJAX POST submission with abort signal
            fetch('https://formsubmit.co/ajax/aniluppari851@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error('CORS or activation pending error');
                }
                return response.json();
            })
            .then(res => {
                submitBtn.value = originalBtnValue;
                submitBtn.disabled = false;
                
                const msgDiv = document.createElement('div');
                msgDiv.className = 'form-message success-message';
                msgDiv.textContent = "Thank you! Your message has been sent successfully.";
                contactForm.appendChild(msgDiv);
                
                contactForm.reset();
                
                setTimeout(() => {
                    msgDiv.remove();
                }, 6000);
            })
            .catch(error => {
                clearTimeout(timeoutId);
                submitBtn.value = originalBtnValue;
                submitBtn.disabled = false;
                
                const msgDiv = document.createElement('div');
                msgDiv.className = 'form-message error-message';
                
                if (error.name === 'AbortError') {
                    msgDiv.innerHTML = `
                        <p><strong>Connection Timeout:</strong> The request timed out. Please check your internet connection or FormSubmit status.</p>
                        <p>You can send the message directly instead: <a href="mailto:aniluppari851@gmail.com?subject=${encodeURIComponent(data.subject || 'Portfolio Contact')}&body=${encodeURIComponent('Hi Anil,\n\n' + (data.message || ''))}" class="mailto-fallback">Click here to send via mail client</a>.</p>
                    `;
                } else {
                    msgDiv.innerHTML = `
                        <p><strong>Submission Alert:</strong> FormSubmit requires email activation first. If this is your first time using this email, check your inbox (and spam folder) for the confirmation link sent by FormSubmit.co.</p>
                        <p>Alternatively, you can <a href="mailto:aniluppari851@gmail.com?subject=${encodeURIComponent(data.subject || 'Portfolio Contact')}&body=${encodeURIComponent(data.message || '')}" class="mailto-fallback">click here to send via mail client</a>.</p>
                    `;
                }
                contactForm.appendChild(msgDiv);
            });
        });
    }
});