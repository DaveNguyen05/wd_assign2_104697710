/*filename: script.js
author: Dave Nguyen
description: All JavaScript for DineOut Melbourne.
Sections: 1. Shared utilities
        2. Registration form validation  (register.html)
        3. Reservation page setup        (reservation.html)
        4. Reservation form validation   (reservation.html)
        5. Recommendation engine         (recommend.html)
        6. Page initialisation*/

/*shared utilities*/
/*showError — marks an input as invalid and displays its error message*/
function showError(inputId, errorId) {
    var input = document.getElementById(inputId); /*find the input element by id*/
    var msg   = document.getElementById(errorId); /*find the matching error span by id*/
    if (input) input.classList.add("invalid"); /*add red-border class to the input*/
    if (msg)   msg.style.display = "block"; /*make the error message visible*/
}

/*clearError — removes the invalid state and hides the error message*/
function clearError(inputId, errorId) {
    var input = document.getElementById(inputId); /*find the input element by id*/
    var msg   = document.getElementById(errorId); /*find the matching error span by id*/
    if (input) input.classList.remove("invalid"); /*remove red-border class from the input*/
    if (msg)   msg.style.display = "none"; /*hide the error message*/
}

/*isValidEmail — returns true if the string matches a basic email format*/
function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; /* regex: chars @ chars . 2+ chars*/
    return re.test(email.trim()); /*test the trimmed email string*/
}

/*Registration Form Validation*/
/*validateRegisterForm — checks every field on register.html and shows
   or hides error messages. Success banner appears only when all rules pass*/
function validateRegisterForm() {
    var valid = true; /*tracks whether the whole form is valid; set to false on any failure*/

    /*Username*/
    /*Rule: min 5 characters, letters / numbers / underscores only*/
    var usernameInput = document.getElementById("reg-username"); /*find the username input*/
    var username      = usernameInput.value.trim(); /*read and trim its value*/
    if (/^[a-zA-Z0-9_]{5,}$/.test(username)) { /*test against the allowed pattern*/
        clearError("reg-username", "err-username"); /*valid — clear any existing error*/
    } else {
        showError("reg-username", "err-username"); /*invalid — show error message*/
        valid = false; /*mark form as invalid*/
    }

    /*Email*/
    /*Rule: must be a valid email format*/
    var emailInput = document.getElementById("reg-email"); /*find the email input*/
    var email = emailInput.value.trim(); /*read and trim its value*/
    if (isValidEmail(email)) { /*test using the shared helper*/
        clearError("reg-email", "err-email"); /*valid — clear any existing error*/
    } else {
        showError("reg-email", "err-email"); /*invalid — show error message*/
        valid = false; /*mark form as invalid*/
    }

    /*Phone Number*/
    /*Rule: digits only, between 8 and 15 digits*/
    var phoneInput = document.getElementById("reg-phone"); /*find the phone input*/
    var phone = phoneInput.value.trim(); /*read and trim its value*/

    if (/^\d{8,15}$/.test(phone)) { /*test for digits only, 8–15 length*/
        clearError("reg-phone", "err-phone"); /*valid — clear any existing error*/
    } else {
        showError("reg-phone", "err-phone"); /*invalid — show error message*/
        valid = false; /*mark form as invalid*/
    }

    /*Password*/
    /*Rule: min 10 chars; must include uppercase, lowercase, digit, special character*/
    var passwordInput = document.getElementById("reg-password"); /* find the password input */
    var password = passwordInput.value; /*read its value (no trim — spaces may be intentional) */
    var pwRe = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};':",.<>?/\\|]).{10,}$/; /*regex uses lookaheads to check each requirement*/

    if (pwRe.test(password)) { /*test all password rules at once*/
        clearError("reg-password", "err-password"); /*valid — clear any existing error*/
    } else {
        showError("reg-password", "err-password"); /*invalid — show error message*/
        valid = false; /*mark form as invalid*/
    }

    /*Confirm Password*/
    /*Rule: must exactly match the password field*/
    var confirmInput = document.getElementById("reg-confirm"); /*find the confirm password input*/
    var confirm = confirmInput.value; /*read its value*/

    if (confirm === password && confirm.length > 0) { /*check match and non-empty*/
        clearError("reg-confirm", "err-confirm"); /*valid — clear any existing error*/
    } else {
        showError("reg-confirm", "err-confirm"); /*invalid — show error message*/
        valid = false; /*mark form as invalid*/
    }

    /*Gender*/
    /*Rule: at least one radio button must be selected*/
    var genderSelected = document.querySelector("input[name='gender']:checked"); /*find checked radio button*/
    var genderError = document.getElementById("err-gender"); /*find the error span*/

    if (genderSelected) { /*a radio is checked*/
        genderError.style.display = "none"; /*hide the error message*/
    } else {
        genderError.style.display = "block"; /*no radio checked — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Dietary Preferences*/
    /*Rule: at least one checkbox must be ticked*/
    var dietChecked = document.querySelectorAll("input[name='dietary']:checked"); /*find all checked boxes*/
    var dietError   = document.getElementById("err-dietary"); /*find the error span*/

    if (dietChecked.length > 0) { /*at least one checkbox is ticked*/
        dietError.style.display = "none"; /*hide the error message*/
    } else {
        dietError.style.display = "block"; /*none ticked — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Country / Region*/
    /*Rule: must not be the blank placeholder option*/
    var countrySelect = document.getElementById("reg-country"); /*find the country select*/
    var country       = countrySelect.value; /*read its selected value*/

    if (country !== "") { /*a real option has been selected*/
        clearError("reg-country", "err-country"); /*valid — clear any existing error*/
    } else {
        showError("reg-country", "err-country"); /*still on placeholder — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Result*/
    var successBox = document.getElementById("register-success"); /*find the success banner*/

    if (valid) {
        successBox.classList.remove("hidden"); /*all rules passed — show banner*/
        successBox.scrollIntoView({ behavior: "smooth", block: "center" }); /*scroll to it*/
    } else {
        successBox.classList.add("hidden"); /*rules failed — keep banner hidden*/
    }
}


/*Reservation Page Functions*/
/*initReservationPage — runs on page load; sets the date minimum, pre-fills the restaurant dropdown from the URL, 
and updates the deposit panel*/
function initReservationPage() {
    var restaurantSelect = document.getElementById("res-restaurant"); /*find the restaurant dropdown*/
    if (!restaurantSelect) return; /*not on reservation.html — exit immediately*/

    /*Set the minimum selectable date to today*/
    var today  = new Date(); /*get today's date*/
    var yyyy   = today.getFullYear(); /*extract the year*/
    var mm     = String(today.getMonth() + 1).padStart(2, "0"); /*extract month, zero-padded*/
    var dd     = String(today.getDate()).padStart(2, "0"); /*extract day, zero-padded*/
    var todayStr = yyyy + "-" + mm + "-" + dd; /*build "YYYY-MM-DD" string*/
    var dateInput = document.getElementById("res-date"); /*find the date input*/
    if (dateInput) dateInput.setAttribute("min", todayStr); /*set minimum date to today*/

    /*Read the ?restaurant= query parameter from the URL*/
    var params    = new URLSearchParams(window.location.search); /*parse the URL query string*/
    var preselect = params.get("restaurant"); /*get the "restaurant" value*/

    if (preselect) { /*a restaurant name was passed*/
        var options = restaurantSelect.options; /*get all dropdown options*/
        var i;
        for (i = 0; i < options.length; i++) { /*loop through each option*/
            if (options[i].value.toLowerCase() === preselect.toLowerCase()) { /*case-insensitive match*/
                restaurantSelect.selectedIndex = i; /*select the matching option*/
                break; /*stop looping once found*/
            }
        }
    }

    updateDeposit(); /*update the deposit panel to reflect the now-selected restaurant*/
}

/*updateDeposit — reads the data-deposit attribute of the selected restaurant
  option and updates the deposit display panel and hidden input*/
function updateDeposit() {
    var select = document.getElementById("res-restaurant"); /*find the restaurant dropdown*/
    var display = document.getElementById("deposit-display"); /*find the deposit info panel*/
    var hidden = document.getElementById("res-deposit"); /*find the hidden deposit input*/

    if (!select || !display) return; /*elements not found — exit*/

    var selected = select.options[select.selectedIndex]; /*get the currently selected option*/
    var deposit = selected ? selected.getAttribute("data-deposit") : null; /*read its deposit amount*/

    if (deposit) { /*a restaurant with a deposit is selected*/
        display.innerHTML =
            "A deposit of <strong>$" + deposit +
            "</strong> is required to confirm your booking at <strong>" +
            selected.value + "</strong>."; /*display the deposit message*/
        if (hidden) hidden.value = deposit; /*store the amount in the hidden input*/
    } else {
        display.innerHTML = "&#8505; Select a restaurant above to see the required deposit.";
        if (hidden) hidden.value = ""; /*clear the hidden input*/
    }
}

/*togglePaymentFields — shows the voucher section or credit card section
  depending on which deposit method radio button is selected*/
function togglePaymentFields() {
    var method = document.querySelector("input[name='deposit-method']:checked"); /*find checked radio*/
    var voucherSection = document.getElementById("voucher-section"); /*find the voucher div*/
    var cardSection = document.getElementById("card-section"); /*find the card div*/

    if (!method || !voucherSection || !cardSection) return; /*elements not found — exit*/
    if (method.value === "voucher") { /*voucher was selected*/
        voucherSection.classList.remove("hidden"); /*show the voucher input*/
        cardSection.classList.add("hidden"); /*hide the card inputs*/
    } else if (method.value === "online") { /*online payment was selected*/
        cardSection.classList.remove("hidden"); /*show the card inputs*/
        voucherSection.classList.add("hidden"); /*hide the voucher input*/
    }
}

/*updateCardPlaceholder — adjusts maxlength and placeholder of the card number
  input based on the selected card type (Amex=15 digits, others=16 digits)*/
function updateCardPlaceholder() {
    var cardType = document.getElementById("res-card-type"); /*find the card type select*/
    var cardNumber = document.getElementById("res-card-number"); /*find the card number input*/

    if (!cardType || !cardNumber) return; /*elements not found — exit*/
    if (cardType.value === "amex") { /*American Express selected*/
        cardNumber.setAttribute("maxlength", "15"); /*amex uses 15 digits*/
        cardNumber.setAttribute("placeholder", "15-digit Amex card number"); /*update placeholder*/
    } else { /*Visa or Mastercard selected*/
        cardNumber.setAttribute("maxlength", "16"); /*visa/mc use 16 digits*/
        cardNumber.setAttribute("placeholder", "16-digit card number"); /*update placeholder*/
    }
    cardNumber.value = ""; /*clear any previously entered value when card type changes*/
}

/*copyEmail — copies the main email into the billing email field when the
  "Same as email address" checkbox is ticked, and reverses this when unticked*/
function copyEmail() {
    var checkbox = document.getElementById("same-email"); /*find the checkbox*/
    var emailField = document.getElementById("res-email"); /*find the main email input*/
    var billingField = document.getElementById("res-billing-email"); /*find the billing email input*/

    if (!checkbox || !emailField || !billingField) return; /*elements not found — exit*/
    if (checkbox.checked) { /*checkbox is ticked*/
        billingField.value = emailField.value; /*copy email value across*/
        billingField.readOnly = true; /*prevent manual editing*/
        billingField.style.backgroundColor = "#f0f0f0"; /*grey background to signal readonly*/
    } else { /*checkbox is unticked*/
        billingField.value = ""; /*clear the billing email field*/
        billingField.readOnly = false; /*restore editability*/
        billingField.style.backgroundColor = ""; /*restore normal background*/
    }
}

/*Reservation Form Validation — reservation.html*/
/*validateReservationForm — validates all fields on reservation.html.
  Returns true to allow the form to POST; returns false to block submission.*/
function validateReservationForm() {
    var valid = true; /*tracks overall validity; set to false on any failure*/

    /*Full Name — must not be empty*/
    var nameInput = document.getElementById("res-name"); /*find the name input*/
    var name = nameInput.value.trim(); /*read and trim its value*/

    if (name.length > 0) { /*field is not empty*/
        clearError("res-name", "err-res-name"); /*valid — clear any existing error*/
    } else {
        showError("res-name", "err-res-name"); /*empty — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Email — must be a valid email format*/
    var resEmailInput = document.getElementById("res-email"); /*find the email input*/
    var resEmail = resEmailInput.value.trim(); /*read and trim its value*/

    if (isValidEmail(resEmail)) { /*test using the shared helper*/
        clearError("res-email", "err-res-email"); /*valid — clear any existing error*/
    } else {
        showError("res-email", "err-res-email"); /*invalid — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Phone Number — digits only, at least 10 digits*/
    var resPhoneInput = document.getElementById("res-phone"); /*find the phone input*/
    var resPhone = resPhoneInput.value.trim(); /*read and trim its value*/

    if (/^\d{10,}$/.test(resPhone)) { /*test for digits only, 10+ length*/
        clearError("res-phone", "err-res-phone"); /*valid — clear any existing error*/
    } else {
        showError("res-phone", "err-res-phone"); /*invalid — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Restaurant — must not be the blank placeholder option*/
    var restaurantSelect = document.getElementById("res-restaurant"); /*find the dropdown*/
    var restaurant = restaurantSelect.value; /*read selected value*/

    if (restaurant !== "") { /*a restaurant has been selected*/
        clearError("res-restaurant", "err-res-restaurant"); /*valid — clear any existing error*/
    } else {
        showError("res-restaurant", "err-res-restaurant"); /*still on placeholder — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Reservation Date — must not be empty and must not be in the past*/
    var dateInput = document.getElementById("res-date"); /*find the date input*/
    var dateVal = dateInput.value; /*read its value ("YYYY-MM-DD")*/
    var today = new Date(); /*get the current date and time*/
    today.setHours(0, 0, 0, 0); /*reset time to midnight for date-only comparison*/

    if (dateVal && new Date(dateVal) >= today) { /*date is present and not in the past*/
        clearError("res-date", "err-res-date"); /*valid — clear any existing error*/
    } else {
        showError("res-date", "err-res-date"); /*invalid — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Reservation Time — must not be empty*/
    var timeInput = document.getElementById("res-time"); /*find the time input*/
    var timeVal = timeInput.value; /*read its value*/

    if (timeVal) { /*a time has been entered*/
        clearError("res-time", "err-res-time"); /*valid — clear any existing error*/
    } else {
        showError("res-time", "err-res-time"); /*empty — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Number of People — must be a whole number greater than 0*/
    var peopleInput = document.getElementById("res-people"); /*find the number input*/
    var people = parseInt(peopleInput.value, 10); /*parse as integer*/

    if (!isNaN(people) && people > 0) { /*valid integer greater than zero*/
        clearError("res-people", "err-res-people"); /*valid — clear any existing error*/
    } else {
        showError("res-people", "err-res-people"); /*invalid — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Deposit Method — at least one radio button must be selected*/
    var method = document.querySelector("input[name='deposit-method']:checked"); /*find checked radio*/
    var methodError = document.getElementById("err-deposit-method"); /*find the error span*/

    if (method) { /*a method has been selected*/
        methodError.style.display = "none"; /*hide the error message*/

        /*Voucher Code — only checked when Voucher is selected; must be exactly 12 characters*/
        if (method.value === "voucher") {
            var voucherInput = document.getElementById("res-voucher"); /*find the voucher input*/
            var voucher = voucherInput.value.trim(); /*read and trim its value*/

            if (voucher.length === 12) { /*exactly 12 characters entered*/
                clearError("res-voucher", "err-voucher"); /*valid — clear any existing error*/
            } else {
                showError("res-voucher", "err-voucher"); /*wrong length — show error*/
                valid = false; /*mark form as invalid*/
            }
        }

        /*Credit Card — only checked when Online Payment is selected*/
        if (method.value === "online") {

            /*Card type must be selected*/
            var cardTypeSelect = document.getElementById("res-card-type"); /*find card type select*/
            var cardType = cardTypeSelect.value; /*read selected value*/

            if (cardType !== "") { /*a card type has been chosen*/
                clearError("res-card-type", "err-card-type"); /*valid — clear any existing error*/
            } else {
                showError("res-card-type", "err-card-type"); /*still on placeholder — show error*/
                valid = false; /*mark form as invalid*/
            }

            /*Card number must have the correct digit count for the chosen card type*/
            var cardNumberInput = document.getElementById("res-card-number"); /*find card number input*/
            var cardNumber = cardNumberInput.value.trim(); /*read and trim its value*/
            var requiredLen = (cardType === "amex") ? 15 : 16; /*amex=15, others=16*/
            var cardRe = new RegExp("^\\d{" + requiredLen + "}$"); /*build regex dynamically*/

            if (cardRe.test(cardNumber)) { /*correct number of digits*/
                clearError("res-card-number", "err-card-number"); /*valid — clear any existing error*/
            } else {
                showError("res-card-number", "err-card-number"); /*wrong length or non-digits — show error*/
                valid = false; /*mark form as invalid*/
            }
        }
    } else { /*no deposit method selected*/
        methodError.style.display = "block"; /*show error message*/
        valid = false; /*mark form as invalid*/
    }

    /*Billing Email — must be a valid email format*/
    var billingInput = document.getElementById("res-billing-email"); /*find the billing email input*/
    var billingEmail = billingInput.value.trim(); /*read and trim its value*/

    if (isValidEmail(billingEmail)) { /*test using the shared helper*/
        clearError("res-billing-email", "err-billing-email"); /*valid — clear any existing error*/
    } else {
        showError("res-billing-email", "err-billing-email"); /*invalid — show error*/
        valid = false; /*mark form as invalid*/
    }

    /*Scroll to first error if validation failed*/
    if (!valid) {
        var firstError = document.querySelector(".error-msg[style='display: block;']"); /*find first visible error*/
        if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" }); /*scroll to it*/
        }
    }
    return valid; /*true allows the form to POST; false blocks submission*/
}

/*Recommendation Engine — recommend.html*/
/*Restaurant database — each object holds the name, cuisine, description,
  deposit amount, and tags used for scoring against the user's preferences*/
var restaurants = [
    {
        name: "Supernormal",
        cuisine: "Modern Asian Fusion",
        description: "Inventive Asian flavours in a sleek CBD setting — great for a stylish night out.",
        deposit: 25,
        tags: ["moderate", "date", "business", "gluten-free"]
    },

    {
        name: "Vue de monde",
        cuisine: "Fine Dining French",
        description: "Melbourne's most iconic fine-dining experience, perfect for memorable occasions.",
        deposit: 50,
        tags: ["premium", "date", "business"]
    },

    {
        name: "Chin Chin",
        cuisine: "Southeast Asian",
        description: "Bold, punchy Southeast Asian street food — ideal for sharing with a lively crowd.",
        deposit: 20,
        tags: ["moderate", "casual", "street", "vegan", "vegetarian", "halal", "gluten-free"]
    },

    {
        name: "Tipo 00",
        cuisine: "Italian Pasta Bar",
        description: "Hand-made Italian pasta in an intimate setting — a comforting and satisfying dinner.",
        deposit: 20,
        tags: ["moderate", "casual", "date", "vegetarian"]
    },

    {
        name: "Flower Drum",
        cuisine: "Cantonese Chinese",
        description: "A Melbourne institution — elegant Cantonese dining with impeccable service.",
        deposit: 30,
        tags: ["premium", "moderate", "business", "casual", "halal"]
    },

    {
        name: "Mamasita",
        cuisine: "Mexican",
        description: "Vibrant Mexican street food and cocktails — fun, flavourful, and great value.",
        deposit: 15,
        tags: ["budget", "casual", "street", "vegan", "vegetarian", "halal", "gluten-free"]
    }
];

/*getRecommendations — scores every restaurant against the user's three
  preferences, sorts by score, and renders the top matches as result cards*/
function getRecommendations() {
    /*Read user selections from the form*/
    var dietSelect = document.getElementById("diet"); /*find the diet select*/
    var diet = dietSelect.value; /*read selected diet value*/
    var budgetEl = document.querySelector("input[name='budget']:checked"); /*find checked budget radio*/
    var budget = budgetEl ? budgetEl.value : "budget"; /*read budget value, default to "budget"*/
    var purposeSelect = document.getElementById("purpose"); /*find the purpose select*/
    var purpose = purposeSelect.value; /*read selected purpose value*/

    /*Score every restaurant — +3 diet match, +2 budget match, +2 purpose match*/
    var scored = restaurants.map(function(r) {
        var score = 0; /*start each restaurant at zero*/
        if (diet !== "none" && r.tags.indexOf(diet) !== -1) { /*diet is set and restaurant supports it*/
            score += 3; /*add diet match points*/
        }
        if (r.tags.indexOf(budget) !== -1) { /*restaurant fits the budget range*/
            score += 2; /*add budget match points*/
        }
        if (r.tags.indexOf(purpose) !== -1) { /*restaurant suits the dining purpose*/
            score += 2; /*add purpose match points*/
        }
        return { restaurant: r, score: score }; /*return the restaurant with its score*/
    });
    scored.sort(function(a, b) { return b.score - a.score; }); /*sort by score descending*/

    var matches = scored.filter(function(item) { return item.score > 0; }).slice(0, 3); /*top 3 matches only*/

    /*Find the result section elements*/
    var resultsSection = document.getElementById("recommendation-results"); /*find the results section*/
    var resultsContainer = document.getElementById("results-container"); /*find the cards container*/
    var resultsSummary = document.getElementById("results-summary"); /*find the summary paragraph*/

    resultsSection.style.display = "block"; /*make the results section visible*/
    resultsContainer.innerHTML = ""; /*clear any previously rendered cards*/

    /*Handle no-match case*/
    if (matches.length === 0) {
        resultsSummary.textContent = ""; /*clear the summary text*/
        resultsContainer.innerHTML =
            "<p>No exact matches found for your preferences. " +
            "Try adjusting your dietary filter or budget, or " +
            "<a href='restaurants.html'>browse all restaurants</a>.</p>";
        return; /*stop here — nothing more to render*/
    }

    /*Build a summary sentence describing the user's selections*/
    var dietLabel = diet === "none" ? "any diet" : diet;
    var budgetLabel = budget === "budget" ? "under $40" : budget === "moderate" ? "$40 – $80" : "$80+";
    var purposeLabel = purpose === "casual" ? "a casual outing" : purpose === "date" ? "a date night" : purpose === "business" ? "a business meal" : "a quick meal";

    resultsSummary.textContent =
        "Based on your preferences (" + dietLabel + ", " + budgetLabel +
        ", " + purposeLabel + "), here are your top matches:"; /*write summary to the page*/

    /*Render each matched restaurant as a card*/
    var i;
    for (i = 0; i < matches.length; i++) { /*loop through each match*/
        var r = matches[i].restaurant; /*get the restaurant object*/
        var card = document.createElement("div"); /*create a new div element*/
        card.className = "recommended-card"; /*assign the card CSS class*/

        var bookUrl = "reservation.html?restaurant=" + encodeURIComponent(r.name); /*build reservation URL*/

        card.innerHTML =
            "<h4>" + r.name +
            " <span style='font-weight:normal; color:#535389; font-size:0.9em;'>" +
            "&mdash; " + r.cuisine + "</span></h4>" +
            "<p>" + r.description + "</p>" +
            "<p style='font-size:13px; color:#555; margin-bottom:10px;'>" +
            "Reservation deposit: <strong>$" + r.deposit + "</strong></p>" +
            "<a href='" + bookUrl + "' class='btn' style='font-size:13px; padding:8px 16px;'>" +
            "Book This Restaurant</a>"; /*build the card's inner HTML*/
        resultsContainer.appendChild(card); /*add the card to the results container*/
    }
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" }); /*scroll to the results*/
}

/*Page Initialisation*/
/*init — links page-specific setup to the window load event*/
function init() {
    initReservationPage(); /*set up the reservation page if the dropdown exists*/
}
window.onload = init; /*execute init once the full page has loaded*/