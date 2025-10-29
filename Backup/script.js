
function goBack() {
    window.history.back();
}
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
        this.configData = {
            exterior: {
                bannerOptions: [
                    { id: "plastic", icon: "./Images/plastic.png", name: "" },
                    { id: "left", icon: "./Images/car_left.png", name: "" },
                    { id: "right", icon: "./Images/car_right.png", name: "" },
                    { id: "grills", icon: "./Images/grill.png", name: "" },
                    { id: "paints", icon: "./Images/car-paintingn.png", name: "" }
                ],
                dropdowns: {
                    plastic: {
                        "Front Bumper Trim": [
                            {
                                id: "plastic_1", image: "./Images/pholder.png", name: "Gloss Black", colors: [
                                    { color: "#000000", name: "Gloss Black", id: "sport-grille-gloss-black" },
                                    { color: "#333333", name: "Matte Black", id: "sport-grille-matte-black" },
                                    { color: "#AAAAAA", name: "Chrome", id: "sport-grille-chrome" }
                                ]
                            }
                        ],
                       
                    },
                    left: {
                        left1: [
                            {
                                id: "wheels_1", image: "./Images/pholder.png", name: "Silver", colors: [
                                    { color: "#C0C0C0", name: "Silver", id: "alloy-wheels-left-silver" },
                                    { color: "#000000", name: "Black", id: "alloy-wheels-left-black" },
                                    { color: "#FFD700", name: "Gold", id: "alloy-wheels-left-gold" }
                                ]
                            }
                        ],
                        left2: [
                            {
                                id: "roof_1", image: "./Images/pholder.png", name: "Black", colors: [
                                    { color: "#000000", name: "Black", id: "roof-rack-left-black" },
                                    { color: "#CCCCCC", name: "Silver", id: "roof-rack-left-silver" },
                                    { color: "#8B4513", name: "Brown", id: "roof-rack-left-brown" }
                                ]
                            }
                        ],
                        left3: [
                            {
                                id: "side_1", image: "./Images/pholder.png", name: "Graphite", colors: [
                                    { color: "#333333", name: "Graphite", id: "side-steps-left-graphite" },
                                    { color: "#DDDDDD", name: "Brushed Steel", id: "side-steps-left-brushed-steel" },
                                    { color: "#000000", name: "Matte Black", id: "side-steps-left-matte-black" }
                                ]
                            }
                        ],
                        left4: [
                            {
                                id: "protection_1", image: "./Images/pholder.png", name: "Steel Grey", colors: [
                                    { color: "#333333", name: "Steel Grey", id: "bull-bar-left-steel-grey" },
                                    { color: "#000000", name: "Black", id: "bull-bar-left-black" },
                                    { color: "#DDDDDD", name: "Chrome", id: "bull-bar-left-chrome" }
                                ]
                            }
                        ],
                        left5: [
                            {
                                id: "utility_1", image: "./Images/pholder.png", name: "Red", colors: [
                                    { color: "#FF0000", name: "Red", id: "tow-hook-left-red" },
                                    { color: "#000000", name: "Black", id: "tow-hook-left-black" },
                                    { color: "#FFFF00", name: "Yellow", id: "tow-hook-left-yellow" }
                                ]
                            }
                        ]
                    },
                    right: {
                        "Rear Ladder": [
                            {
                                id: "right_1", image: "./Images/pholder.png", name: "Silver", colors: [
                                    { color: "#C0C0C0", name: "Silver", id: "alloy-wheels-right-silver" },
                                    { color: "#000000", name: "Black", id: "alloy-wheels-right-black" },
                                    { color: "#FFD700", name: "Gold", id: "alloy-wheels-right-gold" }
                                ]
                            }
                        ],
                        "Roof Access Ladder": [
                            {
                                id: "right_2", image: "./Images/pholder.png", name: "Black", colors: [
                                    { color: "#000000", name: "Black", id: "roof-rack-right-black" },
                                    { color: "#CCCCCC", name: "Silver", id: "roof-rack-right-silver" },
                                    { color: "#8B4513", name: "Brown", id: "roof-rack-right-brown" }
                                ]
                            }
                        ],
                        "Side-Mounted Ladder": [
                            {
                                id: "right_3", image: "./Images/pholder.png", name: "Graphite", colors: [
                                    { color: "#333333", name: "Graphite", id: "side-steps-right-graphite" },
                                    { color: "#DDDDDD", name: "Brushed Steel", id: "side-steps-right-brushed-steel" },
                                    { color: "#000000", name: "Matte Black", id: "side-steps-right-matte-black" }
                                ]
                            }
                        ],
                        "Foldable Ladder": [
                            {
                                id: "right_4", image: "./Images/pholder.png", name: "Steel Grey", colors: [
                                    { color: "#333333", name: "Steel Grey", id: "bull-bar-right-steel-grey" },
                                    { color: "#000000", name: "Black", id: "bull-bar-right-black" },
                                    { color: "#DDDDDD", name: "Chrome", id: "bull-bar-right-chrome" }
                                ]
                            }
                        ],
                        "Off-Road Utility Ladder": [
                            {
                                id: "right_5", image: "./Images/pholder.png", name: "Red", colors: [
                                    { color: "#FF0000", name: "Red", id: "tow-hook-right-red" },
                                    { color: "#000000", name: "Black", id: "tow-hook-right-black" },
                                    { color: "#FFFF00", name: "Yellow", id: "tow-hook-right-yellow" }
                                ]
                            }
                        ]
                    },
                    grills: {
                        "Main Front Grille": [
                            {
                                id: "grills_1", image: "./Images/pholder.png", name: "Silver", colors: [
                                    { color: "#C0C0C0", name: "Silver", id: "activateClosedBox" },
                                    { color: "#000000", name: "Black", id: "activateGrilledBox" },
                                    { color: "#FFD700", name: "Gold", id: "flipLadder" }
                                ]
                            }
                        ],
                        "Lower Bumper Grille": [
                            {
                                id: "grills_2", image: "./Images/pholder.png", name: "Black", colors: [
                                    { color: "#000000", name: "Black", id: "roof-rack-grills-black" },
                                    { color: "#CCCCCC", name: "Silver", id: "roof-rack-grills-silver" },
                                    { color: "#8B4513", name: "Brown", id: "roof-rack-grills-brown" }
                                ]
                            }
                        ],
                        "Fog Light Grilles": [
                            {
                                id: "grills_3", image: "./Images/pholder.png", name: "Graphite", colors: [
                                    { color: "#333333", name: "Graphite", id: "side-steps-grills-graphite" },
                                    { color: "#DDDDDD", name: "Brushed Steel", id: "side-steps-grills-brushed-steel" },
                                    { color: "#000000", name: "Matte Black", id: "side-steps-grills-matte-black" }
                                ]
                            }
                        ],
                        "Hood Vent Grille": [
                            {
                                id: "grills_4", image: "./Images/pholder.png", name: "Steel Grey", colors: [
                                    { color: "#333333", name: "Steel Grey", id: "bull-bar-grills-steel-grey" },
                                    { color: "#000000", name: "Black", id: "bull-bar-grills-black" },
                                    { color: "#DDDDDD", name: "Chrome", id: "bull-bar-grills-chrome" }
                                ]
                            }
                        ],
                        "Side Fender Grilles": [
                            {
                                id: "grills_5", image: "./Images/pholder.png", name: "Red", colors: [
                                    { color: "#FF0000", name: "Red", id: "tow-hook-grills-red" },
                                    { color: "#000000", name: "Black", id: "tow-hook-grills-black" },
                                    { color: "#FFFF00", name: "Yellow", id: "tow-hook-grills-yellow" }
                                ]
                            }
                        ]
                    },
                    paints: {
                        "Body Paint": [
                            {
                                id: "bodyColor", image: "./Images/pholder.png", name: "Silver", colors: [
                                    { color: "#C0C0C0", name: "Silver", id: "SilverColor" },
                                    { color: "#000000", name: "Black", id: "BlackColor" },
                                    { color: "#FFD700", name: "Gold", id: "GoldColor" }
                                ]
                            }
                        ],
                     
                    }
                }
            },


            interior: {
                bannerOptions: [
                    { id: "seats", icon: "./Images/seats.png", name: "" },
                    { id: "plastic", icon: "./Images/plastic.png", name: "" }
                ],
                dropdowns: {
                    seats: {
                        "Front Leather Seats": [
                            {
                                id: "seat1_1", image: "./Images/pholder.png", name: "Front Leather Seats", colors: [
                                    { color: "#2F2F2F", name: "Carbon Black", id: "front-leather-seats-carbon-black" },
                                    { color: "#8B0000", name: "Deep Red", id: "front-leather-seats-deep-red" },
                                    { color: "#F5F5F5", name: "Cream White", id: "front-leather-seats-cream-white" }
                                ]
                            }
                        ],
                        "Rear Leather Seats": [
                            {
                                id: "seat2_1", image: "./Images/pholder.png", name: "Rear Leather Seats", colors: [
                                    { color: "#2F2F2F", name: "Carbon Black", id: "rear-leather-seats-carbon-black" },
                                    { color: "#8B0000", name: "Deep Red", id: "rear-leather-seats-deep-red" },
                                    { color: "#F5F5F5", name: "Cream White", id: "rear-leather-seats-cream-white" }
                                ]
                            }
                        ],
                        "Seat Belts": [
                            {
                                id: "seat3_1", image: "./Images/pholder.png", name: "Seat Belts", colors: [
                                    { color: "#2F2F2F", name: "Carbon Black", id: "seat-belts-carbon-black" },
                                    { color: "#8B0000", name: "Deep Red", id: "seat-belts-deep-red" },
                                    { color: "#F5F5F5", name: "Cream White", id: "seat-belts-cream-white" }
                                ]
                            }
                        ],
                        "Headrests": [
                            {
                                id: "seat4_1", image: "./Images/pholder.png", name: "Headrests", colors: [
                                    { color: "#2F2F2F", name: "Carbon Black", id: "headrests-carbon-black" },
                                    { color: "#8B0000", name: "Deep Red", id: "headrests-deep-red" },
                                    { color: "#F5F5F5", name: "Cream White", id: "headrests-cream-white" }
                                ]
                            }
                        ],
                        "Armrests": [
                            {
                                id: "seat5_1", image: "./Images/pholder.png", name: "Armrests", colors: [
                                    { color: "#2F2F2F", name: "Carbon Black", id: "armrests-carbon-black" },
                                    { color: "#8B0000", name: "Deep Red", id: "armrests-deep-red" },
                                    { color: "#F5F5F5", name: "Cream White", id: "armrests-cream-white" }
                                ]
                            }
                        ]
                    },
                    plastic: {
                        "Dash Trim": [
                            {
                                id: "plastic1_1", image: "./Images/pholder.png", name: "Dash Trim", colors: [
                                    { color: "#333333", name: "Matte Black", id: "dash-trim-matte-black" },
                                    { color: "#666666", name: "Dark Grey", id: "dash-trim-dark-grey" },
                                    { color: "#999999", name: "Light Grey", id: "dash-trim-light-grey" }
                                ]
                            }
                        ],
                        "Door Panels": [
                            {
                                id: "plastic2_1", image: "./Images/pholder.png", name: "Door Panels", colors: [
                                    { color: "#1C2526", name: "Gloss Black", id: "door-panels-gloss-black" },
                                    { color: "#4682B4", name: "Metallic Blue", id: "door-panels-metallic-blue" },
                                    { color: "#2F4F4F", name: "Dark Slate", id: "door-panels-dark-slate" }
                                ]
                            }
                        ],
                        "Center Console": [
                            {
                                id: "plastic3_1", image: "./Images/pholder.png", name: "Center Console", colors: [
                                    { color: "#1C2526", name: "Gloss Black", id: "center-console-gloss-black" },
                                    { color: "#4682B4", name: "Metallic Blue", id: "center-console-metallic-blue" },
                                    { color: "#2F4F4F", name: "Dark Slate", id: "center-console-dark-slate" }
                                ]
                            }
                        ],
                        "Steering Wheel": [
                            {
                                id: "plastic4_1", image: "./Images/pholder.png", name: "Steering Wheel", colors: [
                                    { color: "#1C2526", name: "Gloss Black", id: "steering-wheel-gloss-black" },
                                    { color: "#4682B4", name: "Metallic Blue", id: "steering-wheel-metallic-blue" },
                                    { color: "#2F4F4F", name: "Dark Slate", id: "steering-wheel-dark-slate" }
                                ]
                            }
                        ],
                        "Gear Shifter": [
                            {
                                id: "plastic5_1", image: "./Images/pholder.png", name: "Gear Shifter", colors: [
                                    { color: "#1C2526", name: "Gloss Black", id: "gear-shifter-gloss-black" },
                                    { color: "#4682B4", name: "Metallic Blue", id: "gear-shifter-metallic-blue" },
                                    { color: "#2F4F4F", name: "Dark Slate", id: "gear-shifter-dark-slate" }
                                ]
                            }
                        ]
                    }
                }
            }
        };
        this.init();
    }
    init() {
        this.bindEvents();
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
        this.prevArrow.addEventListener("click", () => this.goToPrevious());
        this.nextArrow.addEventListener("click", () => this.goToNext());
        document.addEventListener("keydown", (e) => {
            if (e.key === "ArrowLeft") this.goToPrevious();
            else if (e.key === "ArrowRight") this.goToNext();
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
        this.exteriorButton.addEventListener("click", () => this.updateCategoryDisplay("exterior"));
        this.interiorButton.addEventListener("click", () => this.updateCategoryDisplay("interior"));
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
            this.showConfigPanel();
        }, 150);
    }


    /////////////////////////


    renderPanelContent(category) {
        const categoryData = this.configData[category];
        if (!categoryData) return;
        this.panelHeader.innerHTML = '';
        this.panelContent.innerHTML = '';
        this.activeDropdown = null;

        categoryData.bannerOptions.forEach(option => {
            const button = document.createElement("button");
            button.innerHTML = `<img src="${option.icon}" style="width: 20px; height: 20px;"> ${option.name}`;
            button.dataset.dropdownId = option.id;
            button.addEventListener("click", () => {
                this.togglePanelDropdown(option.id);
            });
            this.panelHeader.appendChild(button);
        });

        for (const mainDropdownKey in categoryData.dropdowns) {
            const mainDropdownData = categoryData.dropdowns[mainDropdownKey];
            const mainContainer = document.createElement("div");
            mainContainer.classList.add("main-dropdown-container");
            mainContainer.dataset.dropdownId = mainDropdownKey;
            mainContainer.style.display = "none";

            for (const subDropdownKey in mainDropdownData) {
                const subDropdownOptions = mainDropdownData[subDropdownKey];
                const subDropdownName = subDropdownKey.toUpperCase();

                const dropdownDiv = document.createElement("div");
                dropdownDiv.classList.add("config-dropdown", "show");

                const dropdownHeader = document.createElement("div");
                dropdownHeader.classList.add("config-dropdown-header");
                dropdownHeader.innerHTML = `<span>${subDropdownName}</span> <img src="./Images/down-arrow.png" style="width: 15px; height: 15px;">`;
                dropdownHeader.dataset.dropdownId = subDropdownKey;

                const dropdownContent = document.createElement("div");
                dropdownContent.classList.add("config-dropdown-content");
                dropdownContent.id = `dropdown-content-${subDropdownKey}`;

                //////////////////////////


                subDropdownOptions.forEach(option => {
                    const item = document.createElement("div");
                    item.classList.add("option-item");
                    item.dataset.optionId = option.id;

                    let itemContent = `
        <div class="color-swatches">
            ${option.colors.map(color => `
                <div class="color-swatch"
                     style="background-color: ${color.color}"
                     title="${color.name}"
                     id="${color.id}"
                     data-color="${color.color}">
                </div>
            `).join('')}
            <div class="custom-color-picker">
                <label>Custom:</label>
                <input type="color" value="#000000" id="custom-color-${option.name.toLowerCase().replace(/\s+/g, '-')}" class="custom-color-input">
                <button class="custom-color-apply-btn" id="custom-apply-${option.name.toLowerCase().replace(/\s+/g, '-')}">Apply</button>
            </div>
        </div>
    `;

                    ////////////////////////

                    item.innerHTML = itemContent;

                    item.addEventListener("click", (e) => {
                        if (!e.target.closest('.color-swatch') && !e.target.closest('.custom-color-picker')) {
                            this.selectConfigOption(item, subDropdownKey, option.id);
                        }
                    });

                    item.querySelectorAll('.color-swatch').forEach(swatch => {
                        swatch.addEventListener("click", (e) => {
                            e.stopPropagation();

                            // Swatch ka ID le lo (ye aapke config me already unique set hai)
                            const swatchId = e.target.id;               // e.g. SilverColor, BlackColor, GoldColor

                            // UI selection update
                            item.querySelectorAll('.color-swatch').forEach(s => {
                                s.classList.remove('selected');
                            });
                            e.target.classList.add('selected');

                            // Console me log
                            console.log(`Selected swatch: ${swatchId}`);

                            // Post message me sirf swatch ka ID bhejo
                            this.iframe.contentWindow.postMessage(swatchId, 'https://playcanv.as');
                        });
                    });



                    ///////////////////////////////////


                    const customColorInput = item.querySelector('.custom-color-input');
                    const applyBtn = item.querySelector('.custom-color-apply-btn');

                    if (customColorInput && applyBtn) {
                        applyBtn.addEventListener("click", (e) => {
                            e.stopPropagation();
                            const closestItem = e.target.closest('.option-item');
                            const optionId = closestItem.dataset.optionId;
                            const customColor = customColorInput.value;

                            item.querySelectorAll('.color-swatch').forEach(s => {
                                s.classList.remove('selected');
                            });

                            let customIndicator = item.querySelector('.custom-color-indicator');
                            if (!customIndicator) {
                                customIndicator = document.createElement('div');
                                customIndicator.className = 'color-swatch custom-color-indicator';
                                customIndicator.title = 'Custom Color';
                                customIndicator.id = `custom-color-indicator-${option.name.toLowerCase().replace(/\s+/g, '-')}`;
                                item.querySelector('.color-swatches').insertBefore(customIndicator, item.querySelector('.custom-color-picker'));
                            }

                            customIndicator.style.backgroundColor = customColor;
                            customIndicator.classList.add('selected');
                            customIndicator.dataset.color = customColor;

                            console.log(`Applied custom color ${customColor} for option ${optionId}`);
                            this.iframe.contentWindow.postMessage(`${optionId}:${customColor}`, 'https://playcanv.as');
                        });
                    }

                    dropdownContent.appendChild(item);
                });
                ///////////////////////

                dropdownDiv.appendChild(dropdownHeader);
                dropdownDiv.appendChild(dropdownContent);
                mainContainer.appendChild(dropdownDiv);

                dropdownHeader.addEventListener("click", () => {
                    this.toggleDropdown(subDropdownKey);
                });
            }

            this.panelContent.appendChild(mainContainer);
        }
    }



    /////////////////////////////////////////////////////////////
    
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
        const header = this.panelContent.querySelector(`.config-dropdown-header[data-dropdown-id="${dropdownId}"]`);
        const content = document.getElementById(`dropdown-content-${dropdownId}`);

        if (header && content) {
            const isOpen = content.classList.contains("open");

            document.querySelectorAll('.config-dropdown-content.open').forEach(openContent => {
                openContent.classList.remove("open");
                openContent.previousElementSibling.classList.remove("open");
            });

            if (!isOpen) {
                content.classList.add("open");
                header.classList.add("open");
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
document.addEventListener("DOMContentLoaded", () => {
    new CarConfigurator();
});


///////////////////////////////////////////////



