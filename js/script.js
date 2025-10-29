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
                    this.iframe.contentWindow.postMessage(button.dataset.dropdownId, 'https://playcanv.as');
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
                this.exteriorButton.classList.add("active");
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




