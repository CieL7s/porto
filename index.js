        const JSON_URL = 'https://raw.githubusercontent.com/CieL7s/porto/refs/heads/main/porto.js'; 
        async function loadProjects() {
            const container = document.getElementById('project-container');
            try {
                const response = await fetch(JSON_URL);
                const rawText = await response.text();
                let projects;
                try {
                    const cleanJson = rawText.includes('=') ? rawText.split('=')[1].trim().replace(/;$/, '') : rawText;
                    projects = JSON.parse(cleanJson);
                } catch (e) {
                    console.warn("Mencoba fallback parsing untuk porto.js");
                    projects = eval(rawText.replace(/export const projects = /, ''));
                }
                container.innerHTML = '';
                projects.forEach((project, index) => {
                    const card = `
                        <a href="${project.link || '#'}" target="_blank" class="border-2 border-swiss-black p-8 group hover:bg-swiss-black transition-all duration-500 flex flex-col justify-between">
                            <div>
                                <div class="flex justify-between items-start mb-4">
                                    <span class="text-swiss-red font-bold tracking-widest text-[10px] uppercase">${project.type || 'Backend Project'}</span>
                                    <span class="text-[10px] font-mono text-swiss-gray group-hover:text-swiss-white/50">#0${index + 1}</span>
                                </div>
                                <h3 class="text-3xl font-black uppercase tracking-tighter mb-4 group-hover:text-swiss-white">${project.title}</h3>
                                <div class="font-mono text-[10px] mb-6 p-2 bg-black/5 group-hover:bg-white/5 text-swiss-gray group-hover:text-swiss-white/40 leading-tight">
                                    ${(project.code_preview || 'GET /v1/status HTTP/1.1').replace(/\n/g, '<br>')}
                                </div>
                                <p class="text-sm text-swiss-gray group-hover:text-swiss-white/70 mb-8 line-clamp-3">${project.description}</p>
                            </div>
                            <div class="flex flex-wrap gap-2 group-hover:opacity-80">
                                ${(project.tech || []).map(t => `<span class="px-2 py-1 bg-swiss-black text-swiss-white group-hover:bg-swiss-red text-[8px] font-bold uppercase tracking-widest transition-colors">${t}</span>`).join('')}
                            </div>
                        </a>
                    `;
                    container.innerHTML += card;
                });
            } catch (err) {
                console.error("Gagal memuat proyek:", err);
                container.innerHTML = `
                    <div class="col-span-full border-2 border-dashed border-red-500 p-8 text-center uppercase font-bold text-red-500">
                        Gagal memuat data dari GitHub. Pastikan format porto.js benar.
                    </div>
                `;
            }
        }
        let scene, camera, renderer, geometryGroup;
        function initThree() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.z = 5;
            renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('bg-canvas'), antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            geometryGroup = new THREE.Group();
            const geometry = new THREE.IcosahedronGeometry(3, 1);
            const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, transparent: true, opacity: 0.2 });
            geometryGroup.add(new THREE.Mesh(geometry, material));
            scene.add(geometryGroup);
            animate();
        }
        function animate() {
            if (geometryGroup) {
                geometryGroup.rotation.x += 0.001;
                geometryGroup.rotation.y += 0.002;
            }
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }
        window.onload = () => {
            initThree();
            loadProjects();
            if (typeof anime !== 'undefined') {
                anime.timeline({ easing: 'easeOutExpo' })
                    .add({ targets: '.hero-anim', translateY: [50, 0], opacity: [0, 1], duration: 1200, delay: 300 })
                    .add({ targets: '.hero-sub-anim', translateY: [20, 0], opacity: [0, 1], duration: 1000 }, '-=800');
            }
        };