
function loadXMLDoc(filename) {
    return fetch(filename)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .catch(error => {
            console.error('Error loading XML:', error);
        });
}
function generateSectionsFromXML(xmlDoc) {
    const sectionsContainer = document.createElement('div');
    const sections = xmlDoc.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        const title = section.querySelector('title').textContent;
        const products = section.querySelectorAll('product');
        
        const sectionHTML = `
            <section class="top-section">
                <div class="section-header">
                    <div class="section-line"></div>
                    <h2 class="section-title">${title}</h2>
                    <div class="section-line"></div>
                </div>
                
                <div class="products-grid ${sectionId === 'weekly' ? 'products-grid-3' : ''}">
                    ${Array.from(products).map(product => {
                        const link = product.querySelector('link').textContent;
                        const image = product.querySelector('image').textContent;
                        const name = product.querySelector('name').textContent;
                        
                        return `
                            <a href="${link}" class="${sectionId === 'weekly' ? 'product-itemt' : 'product-item'}">
                                <img src="${image}" class="product-image" alt="${name}">
                                <div class="product-overlay">
                                    <h3>${name}</h3>
                                </div>
                            </a>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
        
        sectionsContainer.insertAdjacentHTML('beforeend', sectionHTML);
    });
    const svgPhoto = document.querySelector('.svgphoto');
    const footer = document.querySelector('footer.contact');
    svgPhoto.insertAdjacentElement('afterend', sectionsContainer);
    
    animateOnScroll();
}

document.addEventListener('DOMContentLoaded', function() {
    loadXMLDoc('js/Home.xml').then(xmlDoc => {
        if (xmlDoc) {
            generateSectionsFromXML(xmlDoc);
        }
    });
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const verticalMenu = document.getElementById('verticalMenu');
    const closeMenu = document.querySelector('.close-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        verticalMenu.style.display = 'block';
        setTimeout(() => {
            verticalMenu.classList.add('active');
        }, 10);
    });
    
    closeMenu.addEventListener('click', function() {
        verticalMenu.classList.remove('active');
        setTimeout(() => {
            verticalMenu.style.display = 'none';
        }, 300);
    });
    
    document.querySelectorAll('.vertical-menu a').forEach(link => {
        link.addEventListener('click', function() {
            verticalMenu.classList.remove('active');
            setTimeout(() => {
                verticalMenu.style.display = 'none';
            }, 300);
        });
    });
});

function animateOnScroll() {
    const sections = document.querySelectorAll('.top-section, .contact');
    const productItems = document.querySelectorAll('.product-item, .product-itemt');
    
    function isElementInViewport(el) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight * 0.8) &&
            rect.bottom >= (window.innerHeight * 0.2)
        );
    }
    
    function handleScroll() {
        sections.forEach(section => {
            if (section && !section.classList.contains('visible') && isElementInViewport(section)) {
                section.classList.add('visible');
            }
        });
        productItems.forEach(item => {
            if (item && !item.classList.contains('visible') && isElementInViewport(item)) {
                item.classList.add('visible');
            }
        });
    }
    
    sections.forEach(section => {
        section.classList.add('scroll-animate');
    });
    
    productItems.forEach(item => {
        item.classList.add('scroll-animate');
    });
    
    handleScroll();
    window.addEventListener('scroll', handleScroll);
}
