import { db } from './firebase.js';
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function initGallery() {
    const galleryContainer = document.getElementById('gallery-grid');
    if (!galleryContainer) return;

    try {
        const q = query(collection(db, "galleryItems"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const items = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });

        if (items.length === 0) {
            galleryContainer.innerHTML = `
                <div class="gallery-empty">
                    <p>Gallery is being updated. Check back soon!</p>
                </div>
            `;
            return;
        }

        galleryContainer.innerHTML = items.map(item => `
            <div class="gallery-item reveal-item" data-reveal style="cursor: pointer;">
                <div class="gallery-img-wrapper" data-img="${item.imageUrl}" data-title="${item.title || 'Work'}" data-desc="${item.description}">
                    <img src="${item.imageUrl}" alt="${item.title || 'ATS Work'}">
                </div>
                <div class="gallery-content">
                    <div class="gallery-meta">
                        <h3>${item.title || 'Project'}</h3>
                        <span class="gallery-date">${item.workDate ? new Date(item.workDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
                    </div>
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');

        // Initialize Lightbox listeners
        setupLightbox();

        // Trigger reveal for new items
        window.dispatchEvent(new CustomEvent('galleryReady'));

    } catch (error) {
        console.error("Error loading gallery:", error);
        galleryContainer.innerHTML = `<p style="text-align:center; color:red;">Unable to load gallery items.</p>`;
    }
}

function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    const closeBtn = document.getElementById('lightbox-close');

    if (!lightbox) return;

    // Open lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const wrapper = item.querySelector('.gallery-img-wrapper');
            const src = wrapper.getAttribute('data-img');
            const title = wrapper.getAttribute('data-title');
            const desc = wrapper.getAttribute('data-desc');

            lightboxImg.src = src;
            lightboxTitle.innerText = title;
            lightboxDesc.innerText = desc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });
    });

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Handle Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
