var app;

document.addEventListener("DOMContentLoaded", function () {
    console.log("ready!");
    app = document.getElementById("app");
 window.addEventListener("message", (event) => {
if(event.data.message ==="ready"){
    console.log(event.data.message,"event data received in script.js");
 document.getElementById("header").style.display = "flex";
 document.getElementById("main").style.display = "flex";
}
 })
    // Initialize CarConfigurator
    class CarConfigurator {
        constructor() {
            this.currentStep = 0;
            this.totalSteps = 4;
            this.autoPlayInterval = null;
            this.autoPlayDelay = 4000;
            this.isAutoPlaying = false;
            this.currentMainCategory = "";
            this.activeDropdown = null;
            this.imageNavButtons = document.querySelectorAll(".image-nav-button");
            this.prevArrow = document.getElementById("prev-step");
            this.nextArrow = document.getElementById("next-step");
            this.modelTitle = document.getElementById("model-title");
            this.carouselWrapper = document.querySelector(".carousel-wrapper");
            this.modelHeading = document.getElementById("model-heading");
            this.carImage = document.getElementById("car-image");
            this.rightConfigPanel = document.getElementById("right-config-panel");
            this.panelHeader = document.getElementById("panel-header");
            this.panelContent = document.getElementById("panel-content");
            this.interiorButton = document.getElementById("interior-button");
            this.exteriorButton = document.getElementById("exterior-button");
            this.iframe = document.getElementById("app");
            this.modelTitles = ["Jetour", "Range Rover Defender", "Toyota Land Cruiser", "Nissan Patrol"];
            this.modelImages = [
                "./Images/car-model.png",
                "./Images/car-model.png",
                "./Images/car-model.png",
                "./Images/car-model.png"
            ];
            this.grillsAndPaintsIds = ["Main Front Grille", "Body Paint"];
            this.leftIds = ["left1", "left2", "left3", "left4", "left5", "Roof Access Ladder", "Side-Mounted Ladder", "Foldable Ladder", "Off-Road Utility Ladder"];
            this.rightIds = ["right1", "right2", "right3", "right4", "right5", "Rear Ladder"];
            this.init();
        }
        init() {
            this.bindEvents();
            this.bindPanelEvents();
            this.exteriorButton.classList.remove("active");
            this.interiorButton.classList.remove("active");
            this.hideConfigPanel();
            this.carouselWrapper.classList.remove("show");
        }
        bindEvents() {
            this.imageNavButtons.forEach((btn, index) => {
                btn.addEventListener("click", () => {
                    this.goToStep(index);
                });
            });
            this.prevArrow.addEventListener("click", () => {
                console.log("Clicked prev-step");
                this.iframe.contentWindow.postMessage("prev-step", 'https://playcanv.as');
                this.goToPrevious();
            });
            this.nextArrow.addEventListener("click", () => {
                console.log("Clicked next-step");
                this.iframe.contentWindow.postMessage("next-step", 'https://playcanv.as');
                this.goToNext();
            });
            document.addEventListener("keydown", (e) => {
                if (e.key === "ArrowLeft") {
                    console.log("Keydown prev-step");
                    this.iframe.contentWindow.postMessage("prev-step", 'https://playcanv.as');
                    this.goToPrevious();
                } else if (e.key === "ArrowRight") {
                    console.log("Keydown next-step");
                    this.iframe.contentWindow.postMessage("next-step", 'https://playcanv.as');
                    this.goToNext();
                }
            });
            const carouselContainer = document.querySelector(".carousel-container");
            if (carouselContainer) {
                carouselContainer.addEventListener("mouseenter", () => {
                    if (this.isAutoPlaying) this.pauseAutoPlay();
                });
                carouselContainer.addEventListener("mouseleave", () => { });
            }
            this.modelHeading.addEventListener("click", () => {
                this.carouselWrapper.classList.toggle("show");
                this.updateDisplay();
                if (this.carouselWrapper.classList.contains("show")) {
                    this.startAutoPlay();
                    this.hideConfigPanel();
                    document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
                } else {
                    this.pauseAutoPlay();
                    if (this.currentMainCategory) {
                        this.updateCategoryDisplay(this.currentMainCategory);
                    }
                }
            });
            this.exteriorButton.addEventListener("click", () => {
                console.log("Clicked exterior-button");
                this.iframe.contentWindow.postMessage("exterior-button", 'https://playcanv.as');
                this.updateCategoryDisplay("exterior");
            });
            this.interiorButton.addEventListener("click", () => {
                console.log("Clicked interior-button");
                this.iframe.contentWindow.postMessage("interior-button", 'https://playcanv.as');
                this.updateCategoryDisplay("interior");
            });
        }
        bindPanelEvents() {
            // Bind toggle and postMessage for banner buttons
            this.panelHeader.querySelectorAll('button').forEach(button => {
                button.addEventListener("click", () => {
                    console.log(`Clicked panel button: ${button.dataset.dropdownId}`);
                    if (button.dataset.dropdownId=='exterior-grills') {
                        const mediaQuery = window.matchMedia("(max-width: 768px)");
                        
                        if (mediaQuery.matches) {
                            this.iframe.contentWindow.postMessage('mobile-exterior-grills', 'https://playcanv.as');    
                        }else{
                            this.iframe.contentWindow.postMessage(button.dataset.dropdownId, 'https://playcanv.as');
                        }
                    }else{
                        this.iframe.contentWindow.postMessage(button.dataset.dropdownId, 'https://playcanv.as');

                    }
                    this.togglePanelDropdown(button.dataset.dropdownId);
                });
            });

            // Bind toggle for config dropdown headers
            document.querySelectorAll('.config-dropdown-header').forEach(header => {
                header.addEventListener("click", () => {
                    this.toggleDropdown(header.dataset.dropdownId);
                });
            });

            // Bind select for option items
            document.querySelectorAll('.option-item').forEach(item => {
                item.addEventListener("click", (e) => {
                    if (!e.target.closest('.color-swatch') && !e.target.closest('.custom-color-picker')) {
                        this.selectConfigOption(item, item.closest('.config-dropdown').querySelector('.config-dropdown-header').dataset.dropdownId, item.dataset.optionId);
                    }
                });
            });

            // Bind color swatches
            document.querySelectorAll('.color-swatch:not(.custom-color-indicator)').forEach(swatch => {
                swatch.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const item = e.target.closest('.option-item');
                    const swatchId = e.target.id;
                    console.log(`Selected swatch: ${swatchId}`);
                    item.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                    e.target.classList.add('selected');
                    this.iframe.contentWindow.postMessage(swatchId, 'https://playcanv.as');
                });
            });

            // Bind custom color apply buttons
            document.querySelectorAll('.custom-color-apply-btn').forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const item = e.target.closest('.option-item');
                    const customInput = item.querySelector('.custom-color-input');
                    const dropdownId = item.closest('.config-dropdown').querySelector('.config-dropdown-header').dataset.dropdownId;
                    const customColor = customInput.value;
                    
                    console.log('Button clicked!');
                    console.log('DropdownId:', dropdownId);
                    console.log('Custom color:', customColor);
                    
                    item.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
                    let customIndicator = item.querySelector('.custom-color-indicator');
                    if (!customIndicator) {
                        customIndicator = document.createElement('div');
                        customIndicator.className = 'color-swatch custom-color-indicator';
                        customIndicator.title = 'Custom Color';
                        const swatches = item.querySelector('.color-swatches');
                        swatches.insertBefore(customIndicator, item.querySelector('.custom-color-picker'));
                    }
                    customIndicator.style.backgroundColor = customColor;
                    customIndicator.classList.add('selected');
                    customIndicator.dataset.color = customColor;
                    
                    // Send message with 'id' instead of 'dropdownId' to match PlayCanvas script
                    const messageData = { id: dropdownId, color: customColor };
                    console.log('Sending message:', messageData);
                    this.iframe.contentWindow.postMessage(messageData, 'https://playcanv.as');
                });
            });
        }
        goToStep(step) {
            if (step < 0) step = this.totalSteps - 1;
            else if (step >= this.totalSteps) step = 0;
            this.currentStep = step;
            this.updateDisplay();
            this.startAutoPlay();
        }
        goToNext() {
            this.goToStep(this.currentStep + 1);
        }
        goToPrevious() {
            this.goToStep(this.currentStep - 1);
        }
        updateDisplay() {
            this.modelTitle.textContent = this.modelTitles[this.currentStep];
            this.carImage.src = this.modelImages[this.currentStep];
            this.imageNavButtons.forEach((btn, index) => {
                btn.classList.remove("active", "prev-preview", "next-preview", "far-preview");
                if (index === this.currentStep) {
                    btn.classList.add("active");
                } else if (index === (this.currentStep - 1 + this.totalSteps) % this.totalSteps) {
                    btn.classList.add("prev-preview");
                } else if (index === (this.currentStep + 1) % this.totalSteps) {
                    btn.classList.add("next-preview");
                } else {
                    btn.classList.add("far-preview");
                }
            });
        }
        startAutoPlay() {
            this.pauseAutoPlay();
            this.isAutoPlaying = true;
            this.autoPlayInterval = setInterval(() => {
                this.goToNext();
            }, this.autoPlayDelay);
        }
        pauseAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
                this.isAutoPlaying = false;
            }
        }
        hideConfigPanel() {
            this.rightConfigPanel.classList.remove("show");
        }
        showConfigPanel() {
            this.rightConfigPanel.classList.add("show");
        }
        updateCategoryDisplay(category) {
            if (this.currentMainCategory === category && this.rightConfigPanel.classList.contains("show")) {
                this.hideConfigPanel();
                document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
                this.currentMainCategory = "";
                this.activeDropdown = null;
                return;
            }
            this.currentMainCategory = category;
            document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
            if (category === "interior") {
                this.interiorButton.classList.add("active");
            } else if (category === "exterior") {
                //  document.getElementById("app").contentWindow.postMessage('mobile-exterior-grills', '*');
                this.exteriorButton.classList.add("active");
                document.querySelector('[data-dropdown-id="Stargazer Grill"]').click()
                document.querySelector('[data-dropdown-id="BackLightCover"]').click()
                document.querySelector('[data-dropdown-id="GrilledBox"]').click()
            }
            if (this.carouselWrapper.classList.contains("show")) {
                this.carouselWrapper.classList.remove("show");
                this.pauseAutoPlay();
            }
            this.hideConfigPanel();
            setTimeout(() => {
                this.renderPanelContent(category);
                // Set default active button and open its dropdown
                const defaultDropdownId = category === "exterior" ? "exterior-paints" : "interior-seats";
                this.activeDropdown = defaultDropdownId;
                this.panelHeader.querySelectorAll('button').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.dropdownId === defaultDropdownId) {
                        btn.classList.add('active');
                    }
                });
                const targetContainer = this.panelContent.querySelector(`[data-dropdown-id="${defaultDropdownId}"]`);
                if (targetContainer) {
                    targetContainer.style.display = 'block';
                }
                this.showConfigPanel();
            }, 150);
        }
        renderPanelContent(category) {
            this.panelHeader.querySelectorAll('button').forEach(btn => {
               if (['exterior-plastic', 'exterior-left'].includes(btn.dataset.dropdownId)) {
        btn.style.display = 'none';
        return; // skip further logic for this button
    }
                btn.style.display = (btn.dataset.category === category) ? 'flex' : 'none';
            });
            this.panelContent.querySelectorAll('.main-dropdown-container').forEach(cont => {
                cont.style.display = 'none';
            });
        }
        togglePanelDropdown(dropdownId) {
            this.panelContent.querySelectorAll('.main-dropdown-container').forEach(container => {
                container.style.display = 'none';
            });
            this.panelHeader.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active');
            });
            const targetContainer = this.panelContent.querySelector(`[data-dropdown-id="${dropdownId}"]`);
            const targetButton = this.panelHeader.querySelector(`[data-dropdown-id="${dropdownId}"]`);
            if (this.activeDropdown === dropdownId) {
                this.activeDropdown = null;
            } else {
                if (targetContainer) {
                    targetContainer.style.display = 'block';
                }
                if (targetButton) {
                    targetButton.classList.add('active');
                }
                this.activeDropdown = dropdownId;
            }
        }
        toggleDropdown(dropdownId) {
            const header = document.querySelector(`.config-dropdown-header[data-dropdown-id="${dropdownId}"]`);
            const content = document.getElementById(`dropdown-content-${dropdownId}`);
            if (header && content) {
                const isOpen = content.classList.contains("open");
                // Remove active and open classes from all dropdowns
                document.querySelectorAll('.config-dropdown').forEach(c => {
                    c.classList.remove("active");
                });
                document.querySelectorAll('.config-dropdown-header').forEach(h => {
                    h.classList.remove("active", "open");
                });
                document.querySelectorAll('.config-dropdown-content').forEach(c => {
                    c.classList.remove("open");
                });
                // Send postMessage for rightIds or non-grills/paints/left dropdowns on both open and close
                if (this.rightIds.includes(dropdownId) || (!this.grillsAndPaintsIds.includes(dropdownId) && !this.leftIds.includes(dropdownId))) {
                    console.log(`Sending dropdown ID: ${dropdownId} (click)`);
                    this.iframe.contentWindow.postMessage(dropdownId, 'https://playcanv.as');
                }
                if (!isOpen) {
                    // Open the clicked dropdown and mark it active
                    content.classList.add("open");
                    header.classList.add("active", "open");
                    const container = header.closest('.config-dropdown');
                    container.classList.add("active");
                    console.log(`Active dropdown: ${dropdownId}, container has active class: ${container.classList.contains('active')}`);
                    // Send postMessage for grills/paints/left only when opening
                    if (this.grillsAndPaintsIds.includes(dropdownId) || this.leftIds.includes(dropdownId)) {
                        this.iframe.contentWindow.postMessage(dropdownId, 'https://playcanv.as');
                    }
                }
            }
        }
        selectConfigOption(clickedItem, dropdownKey, optionId) {
            clickedItem.closest('.config-dropdown-content').querySelectorAll('.option-item').forEach(item => {
                item.classList.remove('selected');
            });
            clickedItem.classList.add('selected');
            console.log(`Selected ${dropdownKey} option: ${optionId}`);
        }
    }

    // Instantiate CarConfigurator
    new CarConfigurator();

    function goBack() {
        window.history.back();
    }
});

/////////////////////////////////////////////////////////////
 function customAction1() {
            const iframe = document.getElementById('app');
            iframe.contentWindow.postMessage({ action: 'customAction1', buttonId: 'inwwor' }, '*');
        }

        function customAction2() {
            const iframe = document.getElementById('app');
            iframe.contentWindow.postMessage({ action: 'customAction2', buttonId: 'Day' }, '*');
        }

        function customAction3() {
            const iframe = document.getElementById('app');
            iframe.contentWindow.postMessage({ action: 'customAction3', buttonId: 'Night' }, '*');
        }

        function customAction4() {
            const iframe = document.getElementById('app');
            iframe.contentWindow.postMessage({ action: 'customAction4', buttonId: 'Studio' }, '*');
        }

        function goBack() {
            window.history.back();
        }

        //////////////////////////////////////////////////////////////

// var app;

// document.addEventListener("DOMContentLoaded", function () {
//     console.log("ready!");
//     app = document.getElementById("app");

//     // Initialize CarConfigurator
//     class CarConfigurator {
//         constructor() {
//             this.currentStep = 0;
//             this.totalSteps = 4;
//             this.autoPlayInterval = null;
//             this.autoPlayDelay = 4000;
//             this.isAutoPlaying = false;
//             this.currentMainCategory = "";
//             this.activeDropdown = null;
//             this.imageNavButtons = document.querySelectorAll(".image-nav-button");
//             this.prevArrow = document.getElementById("prev-step");
//             this.nextArrow = document.getElementById("next-step");
//             this.modelTitle = document.getElementById("model-title");
//             this.carouselWrapper = document.querySelector(".carousel-wrapper");
//             this.modelHeading = document.getElementById("model-heading");
//             this.carImage = document.getElementById("car-image");
//             this.rightConfigPanel = document.getElementById("right-config-panel");
//             this.panelHeader = document.getElementById("panel-header");
//             this.panelContent = document.getElementById("panel-content");
//             this.interiorButton = document.getElementById("interior-button");
//             this.exteriorButton = document.getElementById("exterior-button");
//             this.iframe = document.getElementById("app");
//             this.modelTitles = ["Jetour", "Range Rover Defender", "Toyota Land Cruiser", "Nissan Patrol"];
//             this.modelImages = [
//                 "./Images/car-model.png",
//                 "./Images/car-model.png",
//                 "./Images/car-model.png",
//                 "./Images/car-model.png"
//             ];
//             this.grillsAndPaintsIds = ["Main Front Grille", "Body Paint"];
//             this.leftIds = ["left1", "left2", "left3", "left4", "left5", "Roof Access Ladder", "Side-Mounted Ladder", "Foldable Ladder", "Off-Road Utility Ladder"];
//             this.rightIds = ["right1", "right2", "right3", "right4", "right5", "Rear Ladder"];
//             this.init();
//         }
//         init() {
//             this.bindEvents();
//             this.bindPanelEvents();
//             this.exteriorButton.classList.remove("active");
//             this.interiorButton.classList.remove("active");
//             this.hideConfigPanel();
//             this.carouselWrapper.classList.remove("show");
//         }
//         bindEvents() {
//             this.imageNavButtons.forEach((btn, index) => {
//                 btn.addEventListener("click", () => {
//                     this.goToStep(index);
//                 });
//             });
//             this.prevArrow.addEventListener("click", () => {
//                 console.log("Clicked prev-step");
//                 this.iframe.contentWindow.postMessage("prev-step", 'https://playcanv.as');
//                 this.goToPrevious();
//             });
//             this.nextArrow.addEventListener("click", () => {
//                 console.log("Clicked next-step");
//                 this.iframe.contentWindow.postMessage("next-step", 'https://playcanv.as');
//                 this.goToNext();
//             });
//             document.addEventListener("keydown", (e) => {
//                 if (e.key === "ArrowLeft") {
//                     console.log("Keydown prev-step");
//                     this.iframe.contentWindow.postMessage("prev-step", 'https://playcanv.as');
//                     this.goToPrevious();
//                 } else if (e.key === "ArrowRight") {
//                     console.log("Keydown next-step");
//                     this.iframe.contentWindow.postMessage("next-step", 'https://playcanv.as');
//                     this.goToNext();
//                 }
//             });
//             const carouselContainer = document.querySelector(".carousel-container");
//             if (carouselContainer) {
//                 carouselContainer.addEventListener("mouseenter", () => {
//                     if (this.isAutoPlaying) this.pauseAutoPlay();
//                 });
//                 carouselContainer.addEventListener("mouseleave", () => { });
//             }
//             this.modelHeading.addEventListener("click", () => {
//                 this.carouselWrapper.classList.toggle("show");
//                 this.updateDisplay();
//                 if (this.carouselWrapper.classList.contains("show")) {
//                     this.startAutoPlay();
//                     this.hideConfigPanel();
//                     document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
//                 } else {
//                     this.pauseAutoPlay();
//                     if (this.currentMainCategory) {
//                         this.updateCategoryDisplay(this.currentMainCategory);
//                     }
//                 }
//             });
//             this.exteriorButton.addEventListener("click", () => {
//                 console.log("Clicked exterior-button");
//                 this.iframe.contentWindow.postMessage("exterior-button", 'https://playcanv.as');
//                 this.updateCategoryDisplay("exterior");
//             });
//             this.interiorButton.addEventListener("click", () => {
//                 console.log("Clicked interior-button");
//                 this.iframe.contentWindow.postMessage("interior-button", 'https://playcanv.as');
//                 this.updateCategoryDisplay("interior");
//             });
//         }
//         bindPanelEvents() {
//             // Bind toggle and postMessage for banner buttons
//             this.panelHeader.querySelectorAll('button').forEach(button => {
//                 button.addEventListener("click", () => {
//                     console.log(`Clicked panel button: ${button.dataset.dropdownId}`);
//                     this.iframe.contentWindow.postMessage(button.dataset.dropdownId, 'https://playcanv.as');
//                     this.togglePanelDropdown(button.dataset.dropdownId);
//                 });
//             });

//             // Bind toggle for config dropdown headers
//             document.querySelectorAll('.config-dropdown-header').forEach(header => {
//                 header.addEventListener("click", () => {
//                     this.toggleDropdown(header.dataset.dropdownId);
//                 });
//             });

//             // Bind select for option items
//             document.querySelectorAll('.option-item').forEach(item => {
//                 item.addEventListener("click", (e) => {
//                     if (!e.target.closest('.color-swatch') && !e.target.closest('.custom-color-picker')) {
//                         this.selectConfigOption(item, item.closest('.config-dropdown').querySelector('.config-dropdown-header').dataset.dropdownId, item.dataset.optionId);
//                     }
//                 });
//             });

//             // Bind color swatches
//             document.querySelectorAll('.color-swatch:not(.custom-color-indicator)').forEach(swatch => {
//                 swatch.addEventListener("click", (e) => {
//                     e.stopPropagation();
//                     const item = e.target.closest('.option-item');
//                     const swatchId = e.target.id;
//                     console.log(`Selected swatch: ${swatchId}`);
//                     item.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
//                     e.target.classList.add('selected');
//                     this.iframe.contentWindow.postMessage(swatchId, 'https://playcanv.as');
//                 });
//             });

//             // Bind custom color apply buttons
//             document.querySelectorAll('.custom-color-apply-btn').forEach(btn => {
//                 btn.addEventListener("click", (e) => {
//                     e.stopPropagation();
//                     const item = e.target.closest('.option-item');
//                     const customInput = item.querySelector('.custom-color-input');
//                     const dropdownId = item.closest('.config-dropdown').querySelector('.config-dropdown-header').dataset.dropdownId;
//                     const customColor = customInput.value;
                    
//                     console.log('Button clicked!');
//                     console.log('DropdownId:', dropdownId);
//                     console.log('Custom color:', customColor);
                    
//                     item.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
//                     let customIndicator = item.querySelector('.custom-color-indicator');
//                     if (!customIndicator) {
//                         customIndicator = document.createElement('div');
//                         customIndicator.className = 'color-swatch custom-color-indicator';
//                         customIndicator.title = 'Custom Color';
//                         const swatches = item.querySelector('.color-swatches');
//                         swatches.insertBefore(customIndicator, item.querySelector('.custom-color-picker'));
//                     }
//                     customIndicator.style.backgroundColor = customColor;
//                     customIndicator.classList.add('selected');
//                     customIndicator.dataset.color = customColor;
                    
//                     // Send message with 'id' instead of 'dropdownId' to match PlayCanvas script
//                     const messageData = { id: dropdownId, color: customColor };
//                     console.log('Sending message:', messageData);
//                     this.iframe.contentWindow.postMessage(messageData, 'https://playcanv.as');
//                 });
//             });
//         }
//         goToStep(step) {
//             if (step < 0) step = this.totalSteps - 1;
//             else if (step >= this.totalSteps) step = 0;
//             this.currentStep = step;
//             this.updateDisplay();
//             this.startAutoPlay();
//         }
//         goToNext() {
//             this.goToStep(this.currentStep + 1);
//         }
//         goToPrevious() {
//             this.goToStep(this.currentStep - 1);
//         }
//         updateDisplay() {
//             this.modelTitle.textContent = this.modelTitles[this.currentStep];
//             this.carImage.src = this.modelImages[this.currentStep];
//             this.imageNavButtons.forEach((btn, index) => {
//                 btn.classList.remove("active", "prev-preview", "next-preview", "far-preview");
//                 if (index === this.currentStep) {
//                     btn.classList.add("active");
//                 } else if (index === (this.currentStep - 1 + this.totalSteps) % this.totalSteps) {
//                     btn.classList.add("prev-preview");
//                 } else if (index === (this.currentStep + 1) % this.totalSteps) {
//                     btn.classList.add("next-preview");
//                 } else {
//                     btn.classList.add("far-preview");
//                 }
//             });
//         }
//         startAutoPlay() {
//             this.pauseAutoPlay();
//             this.isAutoPlaying = true;
//             this.autoPlayInterval = setInterval(() => {
//                 this.goToNext();
//             }, this.autoPlayDelay);
//         }
//         pauseAutoPlay() {
//             if (this.autoPlayInterval) {
//                 clearInterval(this.autoPlayInterval);
//                 this.autoPlayInterval = null;
//                 this.isAutoPlaying = false;
//             }
//         }
//         hideConfigPanel() {
//             this.rightConfigPanel.classList.remove("show");
//         }
//         showConfigPanel() {
//             this.rightConfigPanel.classList.add("show");
//         }
//         updateCategoryDisplay(category) {
//             if (this.currentMainCategory === category && this.rightConfigPanel.classList.contains("show")) {
//                 this.hideConfigPanel();
//                 document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
//                 this.currentMainCategory = "";
//                 return;
//             }
//             this.currentMainCategory = category;
//             document.querySelectorAll('.category-button').forEach(btn => btn.classList.remove('active'));
//             if (category === "interior") {
//                 this.interiorButton.classList.add("active");
//             } else if (category === "exterior") {
//                 this.exteriorButton.classList.add("active");
//             }
//             if (this.carouselWrapper.classList.contains("show")) {
//                 this.carouselWrapper.classList.remove("show");
//                 this.pauseAutoPlay();
//             }
//             this.hideConfigPanel();
//             setTimeout(() => {
//                 this.renderPanelContent(category);
//                 this.showConfigPanel();
//             }, 150);
//         }
//         renderPanelContent(category) {
//             this.panelHeader.querySelectorAll('button').forEach(btn => {
//                 btn.style.display = (btn.dataset.category === category) ? 'flex' : 'none';
//                 btn.classList.remove('active');
//             });
//             this.panelContent.querySelectorAll('.main-dropdown-container').forEach(cont => {
//                 cont.style.display = (cont.dataset.category === category) ? 'none' : 'none';
//             });
//             this.activeDropdown = null;
//         }
//         togglePanelDropdown(dropdownId) {
//             this.panelContent.querySelectorAll('.main-dropdown-container').forEach(container => {
//                 container.style.display = 'none';
//             });
//             this.panelHeader.querySelectorAll('button').forEach(btn => {
//                 btn.classList.remove('active');
//             });
//             const targetContainer = this.panelContent.querySelector(`[data-dropdown-id="${dropdownId}"]`);
//             const targetButton = this.panelHeader.querySelector(`[data-dropdown-id="${dropdownId}"]`);
//             if (this.activeDropdown === dropdownId) {
//                 this.activeDropdown = null;
//             } else {
//                 if (targetContainer) {
//                     targetContainer.style.display = 'block';
//                 }
//                 if (targetButton) {
//                     targetButton.classList.add('active');
//                 }
//                 this.activeDropdown = dropdownId;
//             }
//         }
//         toggleDropdown(dropdownId) {
//             const header = document.querySelector(`.config-dropdown-header[data-dropdown-id="${dropdownId}"]`);
//             const content = document.getElementById(`dropdown-content-${dropdownId}`);
//             if (header && content) {
//                 const isOpen = content.classList.contains("open");
//                 // Remove active and open classes from all dropdowns
//                 document.querySelectorAll('.config-dropdown').forEach(c => {
//                     c.classList.remove("active");
//                 });
//                 document.querySelectorAll('.config-dropdown-header').forEach(h => {
//                     h.classList.remove("active", "open");
//                 });
//                 document.querySelectorAll('.config-dropdown-content').forEach(c => {
//                     c.classList.remove("open");
//                 });
//                 // Send postMessage for rightIds or non-grills/paints/left dropdowns on both open and close
//                 if (this.rightIds.includes(dropdownId) || (!this.grillsAndPaintsIds.includes(dropdownId) && !this.leftIds.includes(dropdownId))) {
//                     console.log(`Sending dropdown ID: ${dropdownId} (click)`);
//                     this.iframe.contentWindow.postMessage(dropdownId, 'https://playcanv.as');
//                 }
//                 if (!isOpen) {
//                     // Open the clicked dropdown and mark it active
//                     content.classList.add("open");
//                     header.classList.add("active", "open");
//                     const container = header.closest('.config-dropdown');
//                     container.classList.add("active");
//                     console.log(`Active dropdown: ${dropdownId}, container has active class: ${container.classList.contains('active')}`);
//                     // Send postMessage for grills/paints/left only when opening
//                     if (this.grillsAndPaintsIds.includes(dropdownId) || this.leftIds.includes(dropdownId)) {
//                         this.iframe.contentWindow.postMessage(dropdownId, 'https://playcanv.as');
//                     }
//                 }
//             }
//         }
//         selectConfigOption(clickedItem, dropdownKey, optionId) {
//             clickedItem.closest('.config-dropdown-content').querySelectorAll('.option-item').forEach(item => {
//                 item.classList.remove('selected');
//             });
//             clickedItem.classList.add('selected');
//             console.log(`Selected ${dropdownKey} option: ${optionId}`);
//         }
//     }

//     // Instantiate CarConfigurator
//     new CarConfigurator();

//     function goBack() {
//         window.history.back();
//     }
// });

document.querySelectorAll('.exteriorKit .color-swatch').forEach((div)=>{
    div.addEventListener('click',()=>{
        document.getElementById('materialNames').textContent=div.dataset.divText.toUpperCase()
        
    })
})
document.querySelectorAll('.interiorKit .color-swatch').forEach((div)=>{
    div.addEventListener('click',()=>{
        document.getElementById('materialNamesInt').textContent=div.dataset.divText.toUpperCase()
        
    })
})

 

window.addEventListener("resize", () => {
 let iframe = document.getElementById("app");
 
 const dropdown = document.querySelector('[data-dropdown-id="exterior-grills"]');
     if (dropdown.classList.contains("active")) {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        
        if (mediaQuery.matches) {
            iframe.contentWindow.postMessage('mobile-exterior-grills', 'https://playcanv.as');    
        }else{
            iframe.contentWindow.postMessage('exterior-grills', 'https://playcanv.as');
        }
    }else{
        this.iframe.contentWindow.postMessage(button.dataset.dropdownId, 'https://playcanv.as');

    }
});

// var ToggleMeshes = pc.createScript('ToggleMeshes');

// // ---------- Initialize ----------
// ToggleMeshes.prototype.initialize = function () {
//     var self = this;
//     window.parent.postMessage({ message: "ready" }, '*');


//     // Mesh entities
//     this.byDefault = this.app.root.findByName('ByDefault');
//     this.stargazer = this.app.root.findByName('Stargazer3');
//     this.blackWarrior = this.app.root.findByName('Black Warrior');
//     this.defender = this.app.root.findByName('Defender');

//     this.grilledBox = this.app.root.findByName('GrilledBox3');
//     this.closedBox = this.app.root.findByName('ClosedBox');
//     this.ladder = this.app.root.findByName('ladder');
//     this.BackLightCover = this.app.root.findByName('Lights_Cover_Product');
//     this.Jetour = this.app.root.findByName('Jetour');

//     // Camera entities (using tags)
//     this.CameraExt = this.app.root.findByTag('CameraExt')[0];
//     this.CameraInt = this.app.root.findByTag('CameraInt')[0];
//     this.CameraIntMat = this.app.root.findByTag('CameraIntMat')[0];
//     this.CameraGrill = this.app.root.findByTag('CameraGrill')[0];
//     this.CameraBLCover = this.app.root.findByTag('CameraBLCover')[0];
//     this.CameraBags = this.app.root.findByTag('CameraBags')[0];
//     this.CameraLadder = this.app.root.findByTag('CameraLadder')[0];
//     this.CameraIntSeat = this.app.root.findByTag('CameraIntSeat')[0];
//     this.CameraIntRSeat = this.app.root.findByTag('CameraIntRSeat')[0];


//     // Begin play → enable external camera by default
//     this.activateCameraExt();

//     // Listen for messages from outside (UI / iframe)
//     window.addEventListener("message", function (event) {
//         console.log("Received message:", event.data);

//         switch (event.data) {
//             case "ClosedBox":
//                 self.activateClosedBox();
//                 break;
//             case "GrilledBox":
//                 self.activateGrilledBox();
//                 break;
//             case "Ladder":
//                 self.flipLadder();
//                 break;
//             case "Default Grill":
//                 self.activateByDefault();
//                 break;
//             case "Stargazer Grill":
//                 self.activateStargazer();
//                 break;
//             case "BlackWarrior Grill":
//                 self.activateBlackWarrior();
//                 break;
//             case "Defender Grill":
//                 self.activateDefender();
//                 break;
//             case "BackLightCover":
//                 self.flipBackLightCover();
//                 break;
//             case "interior-button":
//                 self.activateCameraInt();
//                 break;
//             case "exterior-button":
//                 self.activateCameraExt();
//                 break;
//             case "exterior-grills":
//                 self.activateCameraGrill();
//                 break;
//             case "mobile-exterior-grills":
//                 self.mobileActivateCameraGrill();
//                 break;
//             case "exterior-plastic":
//                 self.activateCameraBLCover();
//                 break;
//             case "exterior-left":
//                 self.activateCameraBags();
//                 break;
//             case "exterior-right":
//                 self.activateCameraLadder();
//                 break;
//             case "exterior-paints":
//                 self.activateCameraExt();
//                 break;
//             case "interior-seats":
//                 self.activateCameraIntSeat();
//                 break;
//             case "interior-plastic":
//                 self.activateCameraInt();
//                 break;
//             case "Rear Leather Seats":
//                 self.activateCameraIntSeatRear();
//                 break;
//             case "Front Leather Seats":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Seat Belts":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Headrests":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Armrests":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Material_Int":
//                 self.activateCameraIntMat();
//                 break;

//             default: console.warn("Unhandled message:", event.data);
//         }
//     });

//     // Example: if entity is a UI button
//     if (this.entity.element && this.entity.element.on) {
//         this.entity.element.on('click', this.flipLadder, this);
//     }
// };

// // ---------- Utility Functions ----------
// ToggleMeshes.prototype.disableMesh = function (mesh) {
//     if (mesh && mesh.enabled) mesh.enabled = false;
// };

// ToggleMeshes.prototype.exclusiveEnable = function (activeMesh, meshGroup) {
//     meshGroup.forEach(mesh => {
//         if (mesh !== activeMesh) this.disableMesh(mesh);
//     });
//     if (activeMesh) activeMesh.enabled = true;
// };

// // ---------- Box Toggles ----------
// ToggleMeshes.prototype.activateClosedBox = function () {
//     this.exclusiveEnable(this.closedBox, [this.grilledBox]);
//     console.log("ClosedBox enabled.");
// };

// ToggleMeshes.prototype.activateGrilledBox = function () {
//     this.exclusiveEnable(this.grilledBox, [this.closedBox]);
//     console.log("GrilledBox enabled.");
// };

// // ---------- Ladder ----------
// ToggleMeshes.prototype.showLadder = function () {
//     if (this.ladder && !this.ladder.enabled) {
//         this.ladder.enabled = true;
//         console.log("Ladder shown.");
//     }
// };

// ToggleMeshes.prototype.hideLadder = function () {
//     if (this.ladder && this.ladder.enabled) {
//         this.ladder.enabled = false;
//         console.log("Ladder hidden.");
//     }
// };

// ToggleMeshes.prototype.flipLadder = function () {
//     if (!this.ladder) return;
//     this.ladder.enabled ? this.hideLadder() : this.showLadder();
// };

// // ---------- Grilles ----------
// ToggleMeshes.prototype.activateByDefault = function () {
//     this.Jetour.enabled = false;
//     this.exclusiveEnable(this.byDefault, [
//         this.stargazer, this.blackWarrior, this.defender
//     ]);
//     console.log("ByDefault enabled.");
// };

// ToggleMeshes.prototype.activateStargazer = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.stargazer, [
//         this.byDefault, this.blackWarrior, this.defender
//     ]);
//     console.log("Stargazer enabled.");
// };

// ToggleMeshes.prototype.activateBlackWarrior = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.blackWarrior, [
//         this.byDefault, this.stargazer, this.defender
//     ]);
//     console.log("Black Warrior enabled.");
// };

// ToggleMeshes.prototype.activateDefender = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.defender, [
//         this.byDefault, this.stargazer, this.blackWarrior
//     ]);
//     console.log("Defender enabled.");
// };

// // ---------- BackLightCover ----------
// ToggleMeshes.prototype.showBackLightcover = function () {
//     if (this.BackLightCover && !this.BackLightCover.enabled) {
//         this.BackLightCover.enabled = true;
//         console.log("BackLightCover shown.");
//     }
// };

// ToggleMeshes.prototype.hideBackLightcover = function () {
//     if (this.BackLightCover && this.BackLightCover.enabled) {
//         this.BackLightCover.enabled = false;
//         console.log("BackLightCover hidden.");
//     }
// };

// ToggleMeshes.prototype.flipBackLightCover = function () {
//     if (!this.BackLightCover) return;
//     this.BackLightCover.enabled ? this.hideBackLightcover() : this.showBackLightcover();
// };

// // ---------- Cameras ----------
// ToggleMeshes.prototype.activateCameraExt = function () {
//     if (this.CameraExt) this.CameraExt.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraInt = function () {
//     if (this.CameraInt) this.CameraInt.enabled = true;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
//     // console.log("aaaaaaaaa.");
// };

// ToggleMeshes.prototype.activateCameraGrill = function () {
//     if (this.CameraGrill) {
//         this.CameraGrill.enabled = true;
//          const pos = this.CameraGrill.getLocalPosition();
//         this.CameraGrill.setLocalPosition(1, pos.y, 5);
//         console.log("desktop zoom")
// }
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
// };
// ToggleMeshes.prototype.mobileActivateCameraGrill = function () {
//     if (this.CameraGrill) {
//         this.CameraGrill.enabled = true;
//         const pos = this.CameraGrill.getLocalPosition();
//         this.CameraGrill.setLocalPosition(3, pos.y, 11);
//         console.log("mobile zoom")
       
//     }
    
    


    

//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
// };

// ToggleMeshes.prototype.activateCameraBLCover = function () {
//     if (this.CameraBLCover) this.CameraBLCover.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraBags = function () {
//     if (this.CameraBags) this.CameraBags.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraLadder = function () {
//     if (this.CameraLadder) this.CameraLadder.enabled = true;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraIntSeat = function () {
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraIntSeatRear = function () {
//     if (this.CameraIntRSeat) this.CameraIntRSeat.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };


// ToggleMeshes.prototype.activateCameraIntMat = function () {

//     if (this.CameraIntMat) this.CameraIntMat.enabled = true;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     console.log("CameraIntMat");
// };





// var ToggleMeshes = pc.createScript('ToggleMeshes');

// // ---------- Initialize ----------
// ToggleMeshes.prototype.initialize = function () {
//     var self = this;
//     window.parent.postMessage({ message: "ready" }, '*');


//     // Mesh entities
//     this.byDefault = this.app.root.findByName('ByDefault');
//     this.stargazer = this.app.root.findByName('Stargazer3');
//     this.blackWarrior = this.app.root.findByName('Black Warrior');
//     this.defender = this.app.root.findByName('Defender');

//     this.grilledBox = this.app.root.findByName('GrilledBox3');
//     this.closedBox = this.app.root.findByName('ClosedBox');
//     this.ladder = this.app.root.findByName('ladder');
//     this.BackLightCover = this.app.root.findByName('Lights_Cover_Product');
//     this.Jetour = this.app.root.findByName('Jetour');

//     // Camera entities (using tags)
//     this.CameraExt = this.app.root.findByTag('CameraExt')[0];
//     this.CameraInt = this.app.root.findByTag('CameraInt')[0];
//     this.CameraIntMat = this.app.root.findByTag('CameraIntMat')[0];
//     this.CameraGrill = this.app.root.findByTag('CameraGrill')[0];
//     this.CameraBLCover = this.app.root.findByTag('CameraBLCover')[0];
//     this.CameraBags = this.app.root.findByTag('CameraBags')[0];
//     this.CameraLadder = this.app.root.findByTag('CameraLadder')[0];
//     this.CameraIntSeat = this.app.root.findByTag('CameraIntSeat')[0];
//     this.CameraIntRSeat = this.app.root.findByTag('CameraIntRSeat')[0];


//     // Begin play → enable external camera by default
//     this.activateCameraExt();

//     // Listen for messages from outside (UI / iframe)
//     window.addEventListener("message", function (event) {
//         console.log("Received message:", event.data);

//         switch (event.data) {
//             case "ClosedBox":
//                 self.activateClosedBox();
//                 break;
//             case "GrilledBox":
//                 self.activateGrilledBox();
//                 break;
//             case "Ladder":
//                 self.flipLadder();
//                 break;
//             case "Default Grill":
//                 self.activateByDefault();
//                 break;
//             case "Stargazer Grill":
//                 self.activateStargazer();
//                 break;
//             case "BlackWarrior Grill":
//                 self.activateBlackWarrior();
//                 break;
//             case "Defender Grill":
//                 self.activateDefender();
//                 break;
//             case "BackLightCover":
//                 self.flipBackLightCover();
//                 break;
//             case "interior-button":
//                 self.activateCameraInt();
//                 break;
//             case "exterior-button":
//                 self.activateCameraExt();
//                 break;
//             case "exterior-grills":
//                 self.activateCameraGrill();
//                 break;
//             case "mobile-exterior-grills":
//                 self.mobileActivateCameraGrill();
//                 break;
//             case "exterior-plastic":
//                 self.activateCameraBLCover();
//                 break;
//             case "exterior-left":
//                 self.activateCameraBags();
//                 break;
//             case "exterior-right":
//                 self.activateCameraLadder();
//                 break;
//             case "exterior-paints":
//                 self.activateCameraExt();
//                 break;
//             case "interior-seats":
//                 self.activateCameraIntSeat();
//                 break;
//             case "interior-plastic":
//                 self.activateCameraInt();
//                 break;
//             case "Rear Leather Seats":
//                 self.activateCameraIntSeatRear();
//                 break;
//             case "Front Leather Seats":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Seat Belts":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Headrests":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Armrests":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Material_Int":
//                 self.activateCameraIntMat();
//                 break;

//             default: console.warn("Unhandled message:", event.data);
//         }
//     });

//     // Example: if entity is a UI button
//     if (this.entity.element && this.entity.element.on) {
//         this.entity.element.on('click', this.flipLadder, this);
//     }
// };

// // ---------- Utility Functions ----------
// ToggleMeshes.prototype.disableMesh = function (mesh) {
//     if (mesh && mesh.enabled) mesh.enabled = false;
// };

// ToggleMeshes.prototype.exclusiveEnable = function (activeMesh, meshGroup) {
//     meshGroup.forEach(mesh => {
//         if (mesh !== activeMesh) this.disableMesh(mesh);
//     });
//     if (activeMesh) activeMesh.enabled = true;
// };

// // ---------- Box Toggles ----------
// ToggleMeshes.prototype.activateClosedBox = function () {
//     this.exclusiveEnable(this.closedBox, [this.grilledBox]);
//     console.log("ClosedBox enabled.");
// };

// ToggleMeshes.prototype.activateGrilledBox = function () {
//     this.exclusiveEnable(this.grilledBox, [this.closedBox]);
//     console.log("GrilledBox enabled.");
// };

// // ---------- Ladder ----------
// ToggleMeshes.prototype.showLadder = function () {
//     if (this.ladder && !this.ladder.enabled) {
//         this.ladder.enabled = true;
//         console.log("Ladder shown.");
//     }
// };

// ToggleMeshes.prototype.hideLadder = function () {
//     if (this.ladder && this.ladder.enabled) {
//         this.ladder.enabled = false;
//         console.log("Ladder hidden.");
//     }
// };

// ToggleMeshes.prototype.flipLadder = function () {
//     if (!this.ladder) return;
//     this.ladder.enabled ? this.hideLadder() : this.showLadder();
// };

// // ---------- Grilles ----------
// ToggleMeshes.prototype.activateByDefault = function () {
//     this.Jetour.enabled = false;
//     this.exclusiveEnable(this.byDefault, [
//         this.stargazer, this.blackWarrior, this.defender
//     ]);
//     console.log("ByDefault enabled.");
// };

// ToggleMeshes.prototype.activateStargazer = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.stargazer, [
//         this.byDefault, this.blackWarrior, this.defender
//     ]);
//     console.log("Stargazer enabled.");
// };

// ToggleMeshes.prototype.activateBlackWarrior = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.blackWarrior, [
//         this.byDefault, this.stargazer, this.defender
//     ]);
//     console.log("Black Warrior enabled.");
// };

// ToggleMeshes.prototype.activateDefender = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.defender, [
//         this.byDefault, this.stargazer, this.blackWarrior
//     ]);
//     console.log("Defender enabled.");
// };

// // ---------- BackLightCover ----------
// ToggleMeshes.prototype.showBackLightcover = function () {
//     if (this.BackLightCover && !this.BackLightCover.enabled) {
//         this.BackLightCover.enabled = true;
//         console.log("BackLightCover shown.");
//     }
// };

// ToggleMeshes.prototype.hideBackLightcover = function () {
//     if (this.BackLightCover && this.BackLightCover.enabled) {
//         this.BackLightCover.enabled = false;
//         console.log("BackLightCover hidden.");
//     }
// };

// ToggleMeshes.prototype.flipBackLightCover = function () {
//     if (!this.BackLightCover) return;
//     this.BackLightCover.enabled ? this.hideBackLightcover() : this.showBackLightcover();
// };

// // ---------- Cameras ----------
// ToggleMeshes.prototype.activateCameraExt = function () {
//     if (this.CameraExt) this.CameraExt.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraInt = function () {
//     if (this.CameraInt) this.CameraInt.enabled = true;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
//     // console.log("aaaaaaaaa.");
// };

// ToggleMeshes.prototype.activateCameraGrill = function () {
//     if (this.CameraGrill) {
//         this.CameraGrill.enabled = true;
//          const pos = this.CameraGrill.getLocalPosition();
//         this.CameraGrill.setLocalPosition(1, pos.y, 5);
//         console.log("desktop zoom")
// }
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
// };
// ToggleMeshes.prototype.mobileActivateCameraGrill = function () {
//     if (this.CameraGrill) {
//         this.CameraGrill.enabled = true;
//         const pos = this.CameraGrill.getLocalPosition();
//         this.CameraGrill.setLocalPosition(2, pos.y, 8);
//         console.log("mobile zoom")
       
//     }
    
    


    

//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
// };

// ToggleMeshes.prototype.activateCameraBLCover = function () {
//     if (this.CameraBLCover) this.CameraBLCover.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraBags = function () {
//     if (this.CameraBags) this.CameraBags.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraLadder = function () {
//     if (this.CameraLadder) this.CameraLadder.enabled = true;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraIntSeat = function () {
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraIntSeatRear = function () {
//     if (this.CameraIntRSeat) this.CameraIntRSeat.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };


// ToggleMeshes.prototype.activateCameraIntMat = function () {

//     if (this.CameraIntMat) this.CameraIntMat.enabled = true;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     console.log("CameraIntMat");
// };













// var ToggleMeshes = pc.createScript('ToggleMeshes');

// // ---------- Initialize ----------
// ToggleMeshes.prototype.initialize = function () {
//     var self = this;
//     window.parent.postMessage({ message: "ready" }, '*');


//     // Mesh entities
//     this.byDefault = this.app.root.findByName('ByDefault');
//     this.stargazer = this.app.root.findByName('Stargazer3');
//     this.blackWarrior = this.app.root.findByName('Black Warrior');
//     this.defender = this.app.root.findByName('Defender');

//     this.grilledBox = this.app.root.findByName('GrilledBox3');
//     this.closedBox = this.app.root.findByName('ClosedBox');
//     this.ladder = this.app.root.findByName('ladder');
//     this.BackLightCover = this.app.root.findByName('Lights_Cover_Product');
//     this.Jetour = this.app.root.findByName('Jetour');

//     // Camera entities (using tags)
//     this.CameraExt = this.app.root.findByTag('CameraExt')[0];
//     this.CameraInt = this.app.root.findByTag('CameraInt')[0];
//     this.CameraIntMat = this.app.root.findByTag('CameraIntMat')[0];
//     this.CameraGrill = this.app.root.findByTag('CameraGrill')[0];
//     this.CameraBLCover = this.app.root.findByTag('CameraBLCover')[0];
//     this.CameraBags = this.app.root.findByTag('CameraBags')[0];
//     this.CameraLadder = this.app.root.findByTag('CameraLadder')[0];
//     this.CameraIntSeat = this.app.root.findByTag('CameraIntSeat')[0];
//     this.CameraIntRSeat = this.app.root.findByTag('CameraIntRSeat')[0];


//     // Begin play → enable external camera by default
//     this.activateCameraExt();

//     // Listen for messages from outside (UI / iframe)
//     window.addEventListener("message", function (event) {
//         console.log("Received message:", event.data);

//         switch (event.data) {
//             case "ClosedBox":
//                 self.activateClosedBox();
//                 break;
//             case "GrilledBox":
//                 self.activateGrilledBox();
//                 break;
//             case "Ladder":
//                 self.flipLadder();
//                 break;
//             case "Default Grill":
//                 self.activateByDefault();
//                 break;
//             case "Stargazer Grill":
//                 self.activateStargazer();
//                 break;
//             case "BlackWarrior Grill":
//                 self.activateBlackWarrior();
//                 break;
//             case "Defender Grill":
//                 self.activateDefender();
//                 break;
//             case "BackLightCover":
//                 self.flipBackLightCover();
//                 break;
//             case "interior-button":
//                 self.activateCameraInt();
//                 break;
//             case "exterior-button":
//                 self.activateCameraExt();
//                 break;
//             case "exterior-grills":
//                 self.activateCameraGrill();
//                 break;
//             case "mobile-exterior-grills":
//                 self.mobileActivateCameraGrill();
//                 break;
//             case "exterior-plastic":
//                 self.activateCameraBLCover();
//                 break;
//             case "exterior-left":
//                 self.activateCameraBags();
//                 break;
//             case "exterior-right":
//                 self.activateCameraLadder();
//                 break;
//             case "exterior-paints":
//                 self.activateCameraExt();
//                 break;
//             case "interior-seats":
//                 self.activateCameraIntSeat();
//                 break;
//             case "interior-plastic":
//                 self.activateCameraInt();
//                 break;
//             case "Rear Leather Seats":
//                 self.activateCameraIntSeatRear();
//                 break;
//             case "Front Leather Seats":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Seat Belts":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Headrests":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Armrests":
//                 self.activateCameraIntSeat();
//                 break;
//             case "Material_Int":
//                 self.activateCameraIntMat();
//                 break;

//             default: console.warn("Unhandled message:", event.data);
//         }
//     });

//     // Example: if entity is a UI button
//     if (this.entity.element && this.entity.element.on) {
//         this.entity.element.on('click', this.flipLadder, this);
//     }
// };

// // ---------- Utility Functions ----------
// ToggleMeshes.prototype.disableMesh = function (mesh) {
//     if (mesh && mesh.enabled) mesh.enabled = false;
// };

// ToggleMeshes.prototype.exclusiveEnable = function (activeMesh, meshGroup) {
//     meshGroup.forEach(mesh => {
//         if (mesh !== activeMesh) this.disableMesh(mesh);
//     });
//     if (activeMesh) activeMesh.enabled = true;
// };

// // ---------- Box Toggles ----------
// ToggleMeshes.prototype.activateClosedBox = function () {
//     this.exclusiveEnable(this.closedBox, [this.grilledBox]);
//     console.log("ClosedBox enabled.");
// };

// ToggleMeshes.prototype.activateGrilledBox = function () {
//     this.exclusiveEnable(this.grilledBox, [this.closedBox]);
//     console.log("GrilledBox enabled.");
// };

// // ---------- Ladder ----------
// ToggleMeshes.prototype.showLadder = function () {
//     if (this.ladder && !this.ladder.enabled) {
//         this.ladder.enabled = true;
//         console.log("Ladder shown.");
//     }
// };

// ToggleMeshes.prototype.hideLadder = function () {
//     if (this.ladder && this.ladder.enabled) {
//         this.ladder.enabled = false;
//         console.log("Ladder hidden.");
//     }
// };

// ToggleMeshes.prototype.flipLadder = function () {
//     if (!this.ladder) return;
//     this.ladder.enabled ? this.hideLadder() : this.showLadder();
// };

// // ---------- Grilles ----------
// ToggleMeshes.prototype.activateByDefault = function () {
//     this.Jetour.enabled = false;
//     this.exclusiveEnable(this.byDefault, [
//         this.stargazer, this.blackWarrior, this.defender
//     ]);
//     console.log("ByDefault enabled.");
// };

// ToggleMeshes.prototype.activateStargazer = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.stargazer, [
//         this.byDefault, this.blackWarrior, this.defender
//     ]);
//     console.log("Stargazer enabled.");
// };

// ToggleMeshes.prototype.activateBlackWarrior = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.blackWarrior, [
//         this.byDefault, this.stargazer, this.defender
//     ]);
//     console.log("Black Warrior enabled.");
// };

// ToggleMeshes.prototype.activateDefender = function () {
//     // this.Jetour.enabled = true;
//     this.exclusiveEnable(this.defender, [
//         this.byDefault, this.stargazer, this.blackWarrior
//     ]);
//     console.log("Defender enabled.");
// };

// // ---------- BackLightCover ----------
// ToggleMeshes.prototype.showBackLightcover = function () {
//     if (this.BackLightCover && !this.BackLightCover.enabled) {
//         this.BackLightCover.enabled = true;
//         console.log("BackLightCover shown.");
//     }
// };

// ToggleMeshes.prototype.hideBackLightcover = function () {
//     if (this.BackLightCover && this.BackLightCover.enabled) {
//         this.BackLightCover.enabled = false;
//         console.log("BackLightCover hidden.");
//     }
// };

// ToggleMeshes.prototype.flipBackLightCover = function () {
//     if (!this.BackLightCover) return;
//     this.BackLightCover.enabled ? this.hideBackLightcover() : this.showBackLightcover();
// };

// // ---------- Cameras ----------
// ToggleMeshes.prototype.activateCameraExt = function () {
//     if (this.CameraExt) this.CameraExt.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraInt = function () {
//     if (this.CameraInt) this.CameraInt.enabled = true;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
//     // console.log("aaaaaaaaa.");
// };

// ToggleMeshes.prototype.activateCameraGrill = function () {
//     if (this.CameraGrill) {
//         this.CameraGrill.enabled = true;
//          const pos = this.CameraGrill.getLocalPosition();
//         this.CameraGrill.setLocalPosition(1, pos.y, 5);
//         console.log("desktop zoom")
// }
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
// };
// ToggleMeshes.prototype.mobileActivateCameraGrill = function () {
//     if (this.CameraGrill) {
//         this.CameraGrill.enabled = true;
//         const pos = this.CameraGrill.getLocalPosition();
//         this.CameraGrill.setLocalPosition(1, pos.y, 6);
//         console.log("mobile zoom")
       
//     }
    

//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraInt enabled, CameraExt disabled.");
// };

// ToggleMeshes.prototype.activateCameraBLCover = function () {
//     if (this.CameraBLCover) this.CameraBLCover.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraBags = function () {
//     if (this.CameraBags) this.CameraBags.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraLadder = function () {
//     if (this.CameraLadder) this.CameraLadder.enabled = true;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraIntSeat = function () {
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };

// ToggleMeshes.prototype.activateCameraIntSeatRear = function () {
//     if (this.CameraIntRSeat) this.CameraIntRSeat.enabled = true;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntMat) this.CameraIntMat.enabled = false;
//     console.log("CameraExt enabled, CameraInt disabled.");
// };


// ToggleMeshes.prototype.activateCameraIntMat = function () {

//     if (this.CameraIntMat) this.CameraIntMat.enabled = true;
//     if (this.CameraInt) this.CameraInt.enabled = false;
//     if (this.CameraBags) this.CameraBags.enabled = false;
//     if (this.CameraLadder) this.CameraLadder.enabled = false;
//     if (this.CameraExt) this.CameraExt.enabled = false;
//     if (this.CameraGrill) this.CameraGrill.enabled = false;
//     if (this.CameraBLCover) this.CameraBLCover.enabled = false;
//     if (this.CameraIntSeat) this.CameraIntSeat.enabled = false;
//     console.log("CameraIntMat");
// };
