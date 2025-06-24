// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="index.html">A Few Words</a></li><li class="chapter-item expanded affix "><li class="part-title">Software Projects</li><li class="chapter-item expanded "><a href="topics/project.html"><strong aria-hidden="true">1.</strong> Project in github or gitlab</a></li><li class="chapter-item expanded "><a href="topics/vscode.html"><strong aria-hidden="true">2.</strong> Using vscode</a></li><li class="chapter-item expanded "><a href="topics/winmsi.html"><strong aria-hidden="true">3.</strong> Windows MSI installer</a></li><li class="chapter-item expanded "><a href="topics/jupyter.html"><strong aria-hidden="true">4.</strong> Jupyter Notebook</a></li><li class="chapter-item expanded affix "><li class="part-title">Frontend Development</li><li class="chapter-item expanded "><a href="topics/fronend.html"><strong aria-hidden="true">5.</strong> Frontend code development</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/markdown.html"><strong aria-hidden="true">5.1.</strong> Markdown editor</a></li><li class="chapter-item expanded "><a href="topics/flexbox.html"><strong aria-hidden="true">5.2.</strong> Using Flexbox</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Backend Development</li><li class="chapter-item expanded "><a href="topics/ssr.html"><strong aria-hidden="true">6.</strong> Server side and/or Headless rendering</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/firebase.html"><strong aria-hidden="true">6.1.</strong> Firebase matters</a></li><li class="chapter-item expanded "><a href="topics/firestore.html"><strong aria-hidden="true">6.2.</strong> Firestore matters</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">App with html</li><li class="chapter-item expanded "><a href="topics/crspltapp.html"><strong aria-hidden="true">7.</strong> Cross Platform Apps</a></li><li class="chapter-item expanded "><a href="topics/svelte.html"><strong aria-hidden="true">8.</strong> Svelte</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/svelte-app.html"><strong aria-hidden="true">8.1.</strong> Svelte Desktop and mobile app</a></li><li class="chapter-item expanded "><a href="topics/sveltekit.html"><strong aria-hidden="true">8.2.</strong> Sveltekit</a></li><li class="chapter-item expanded "><a href="topics/sapper.html"><strong aria-hidden="true">8.3.</strong> Sapper, a server side framework with Svelte</a></li></ol></li><li class="chapter-item expanded "><a href="topics/angular.html"><strong aria-hidden="true">9.</strong> Angular, bootstrap, firebase</a></li><li class="chapter-item expanded "><a href="topics/flutter.html"><strong aria-hidden="true">10.</strong> Flutter Apps</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/fluttersignin.html"><strong aria-hidden="true">10.1.</strong> Flutter Sign-in for your users</a></li><li class="chapter-item expanded "><a href="topics/flutterreading.html"><strong aria-hidden="true">10.2.</strong> Flutter matters</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Content Management</li><li class="chapter-item expanded "><a href="topics/text-content.html"><strong aria-hidden="true">11.</strong> Textual Contents</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/mdbook.html"><strong aria-hidden="true">11.1.</strong> Mdbook</a></li><li class="chapter-item expanded "><a href="topics/hugo.html"><strong aria-hidden="true">11.2.</strong> Hugo</a></li><li class="chapter-item expanded "><a href="topics/jekyll.html"><strong aria-hidden="true">11.3.</strong> Jekyll</a></li></ol></li><li class="chapter-item expanded "><a href="topics/gen-content.html"><strong aria-hidden="true">12.</strong> Beyond Textual Contents</a></li><li class="chapter-item expanded "><a href="topics/community.html"><strong aria-hidden="true">13.</strong> Community portal</a></li><li class="chapter-item expanded affix "><li class="part-title">Programming Languages</li><li class="chapter-item expanded "><a href="topics/go.html"><strong aria-hidden="true">14.</strong> Go language</a></li><li class="chapter-item expanded "><a href="topics/java.html"><strong aria-hidden="true">15.</strong> Java development</a></li><li class="chapter-item expanded "><a href="topics/jslib.html"><strong aria-hidden="true">16.</strong> Javascript library</a></li><li class="chapter-item expanded "><a href="topics/rust.html"><strong aria-hidden="true">17.</strong> Rust language</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/rust-wsl.html"><strong aria-hidden="true">17.1.</strong> Rust setup in wsl</a></li><li class="chapter-item expanded "><a href="topics/rust-plugin.html"><strong aria-hidden="true">17.2.</strong> Rust Plugins</a></li><li class="chapter-item expanded "><a href="topics/rust-thread.html"><strong aria-hidden="true">17.3.</strong> Rust Multithreading</a></li></ol></li><li class="chapter-item expanded "><a href="topics/powershell.html"><strong aria-hidden="true">18.</strong> Powershell Scripts</a></li><li class="chapter-item expanded "><a href="topics/python.html"><strong aria-hidden="true">19.</strong> Python</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/pythonlib.html"><strong aria-hidden="true">19.1.</strong> Python library</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">Transpiling</li><li class="chapter-item expanded "><a href="topics/java2go.html"><strong aria-hidden="true">20.</strong> Java to Go language</a></li><li class="chapter-item expanded "><a href="topics/java2js.html"><strong aria-hidden="true">21.</strong> Java to Javascript language</a></li><li class="chapter-item expanded "><a href="topics/py2go.html"><strong aria-hidden="true">22.</strong> Python to Go language</a></li><li class="chapter-item expanded "><a href="topics/py2js.html"><strong aria-hidden="true">23.</strong> Python to Javascript language</a></li><li class="chapter-item expanded affix "><li class="part-title">Crafting Compilers</li><li class="chapter-item expanded "><a href="topics/parse.html"><strong aria-hidden="true">24.</strong> Compilers/Parsers</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/peg.html"><strong aria-hidden="true">24.1.</strong> Peg Parsers</a></li><li class="chapter-item expanded "><a href="topics/earley.html"><strong aria-hidden="true">24.2.</strong> Earley parsers</a></li></ol></li><li class="chapter-item expanded "><li class="part-title">System Development</li><li class="chapter-item expanded "><a href="topics/lfs.html"><strong aria-hidden="true">25.</strong> Linux from scratch</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/lfs1.html"><strong aria-hidden="true">25.1.</strong> LFS (Part 1)</a></li><li class="chapter-item expanded "><a href="topics/lfs2.html"><strong aria-hidden="true">25.2.</strong> LFS (Part 2)</a></li><li class="chapter-item expanded "><a href="topics/lfs3.html"><strong aria-hidden="true">25.3.</strong> LFS (Part 3)</a></li></ol></li><li class="chapter-item expanded "><a href="topics/cross.html"><strong aria-hidden="true">26.</strong> Cross Compiling</a></li><li class="chapter-item expanded "><a href="topics/os.html"><strong aria-hidden="true">27.</strong> Custom O/S</a></li><li class="chapter-item expanded affix "><li class="part-title">Raspberry Pi</li><li class="chapter-item expanded "><a href="topics/raspberrypi.html"><strong aria-hidden="true">28.</strong> Using Raspberry Pi</a></li><li class="chapter-item expanded "><a href="topics/crosspi.html"><strong aria-hidden="true">29.</strong> Cross Compiling for Pi</a></li><li class="chapter-item expanded "><a href="topics/pirust.html"><strong aria-hidden="true">30.</strong> Rust in Raspberry Pi</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/rust-native.html"><strong aria-hidden="true">30.1.</strong> Native library for Rust in Raspberry Pi</a></li></ol></li><li class="chapter-item expanded "><a href="topics/dbuspi.html"><strong aria-hidden="true">31.</strong> Using dbus in pi</a></li><li class="chapter-item expanded "><a href="topics/embedded.html"><strong aria-hidden="true">32.</strong> Building Embedded System</a></li><li class="chapter-item expanded affix "><li class="part-title">Distro setup</li><li class="chapter-item expanded "><a href="topics/ubuntu.html"><strong aria-hidden="true">33.</strong> Ubuntu</a></li><li class="chapter-item expanded affix "><li class="part-title">Machine Learning</li><li class="chapter-item expanded "><a href="topics/ai.html"><strong aria-hidden="true">34.</strong> Artificial Intelligence</a></li><li class="chapter-item expanded affix "><li class="part-title">3D Related</li><li class="chapter-item expanded "><a href="topics/3d.html"><strong aria-hidden="true">35.</strong> Developing 3D models</a></li><li class="chapter-item expanded "><a href="topics/cloth.html"><strong aria-hidden="true">36.</strong> Cloth Simulation</a></li><li class="chapter-item expanded affix "><li class="part-title">Media Topics</li><li class="chapter-item expanded "><a href="topics/audio.html"><strong aria-hidden="true">37.</strong> Audio Processing</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/sfsynth.html"><strong aria-hidden="true">37.1.</strong> Understanding Soundfont Synthesis</a></li></ol></li><li class="chapter-item expanded "><a href="topics/broadcasting.html"><strong aria-hidden="true">38.</strong> Broadcasting</a></li><li class="chapter-item expanded "><a href="topics/movie.html"><strong aria-hidden="true">39.</strong> Movie production tools</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="topics/animation.html"><strong aria-hidden="true">39.1.</strong> Animation</a></li></ol></li><li class="chapter-item expanded "><a href="topics/music.html"><strong aria-hidden="true">40.</strong> Music</a></li><li class="chapter-item expanded "><a href="topics/dvd2mp4.html"><strong aria-hidden="true">41.</strong> Converting old DVDs/cd into mp4/mp3</a></li><li class="chapter-item expanded affix "><li class="part-title">AI Topics</li><li class="chapter-item expanded "><a href="topics/tts.html"><strong aria-hidden="true">42.</strong> Text to Speech</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
