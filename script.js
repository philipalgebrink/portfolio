const sections = document.querySelectorAll(".section");
const options = {
    root: null,
    threshold: 0.6,
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("active");
        } else {
            entry.target.classList.remove("active");
        }
    });
}, options);

sections.forEach((section) => observer.observe(section));

const slider = document.querySelector('#repos-container');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

let currentIndex = 0;

async function fetchRepos() {
    try {
        const response = await fetch('https://api.github.com/users/philipalgebrink/repos');
        const repos = await response.json();

        const filteredRepos = repos.filter(repo => repo.description);
        displayRepos(filteredRepos);
    } catch (error) {
        console.error('Kunde inte hämta repos:', error);
    }
}

function displayRepos(repos) {
    slider.innerHTML = '';
    repos.forEach((repo, index) => {
        const repoCard = document.createElement('div');
        repoCard.classList.add('repo-card');
        if (index === 0) repoCard.classList.add('active'); // Gör det första kortet aktivt
        repoCard.innerHTML = `
            <h3>${repo.name}</h3>
            <p>${repo.description || "Ingen beskrivning tillgänglig."}</p>
            <a href="${repo.html_url}" target="_blank">Se på GitHub</a>
        `;
        slider.appendChild(repoCard);
    });

    updateSlider();
}

function updateSlider() {
    const cards = document.querySelectorAll('.repo-card');
    cards.forEach((card, index) => {
        if (index === currentIndex) {
            card.classList.add('active'); // Visa bara det aktiva kortet
        } else {
            card.classList.remove('active'); // Dölj alla andra kort
        }
    });
}

leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
});

rightBtn.addEventListener('click', () => {
    const totalRepos = document.querySelectorAll('.repo-card').length;
    if (currentIndex < totalRepos - 1) {
        currentIndex++;
        updateSlider();
    }
});

fetchRepos();
