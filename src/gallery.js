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
            <div class="gallery-item reveal-item" data-reveal>
                <div class="gallery-img-wrapper">
                    <img src="${item.imageUrl}" alt="ATS Work">
                </div>
                <div class="gallery-content">
                    <p>${item.description}</p>
                </div>
            </div>
        `).join('');

        // Trigger reveal for new items
        window.dispatchEvent(new CustomEvent('galleryReady'));

    } catch (error) {
        console.error("Error loading gallery:", error);
        galleryContainer.innerHTML = `<p style="text-align:center; color:red;">Unable to load gallery items.</p>`;
    }
}
