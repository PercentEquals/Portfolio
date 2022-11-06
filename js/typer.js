let typer = undefined;
const typerFps = 20;

const thingsILike = [
    'to code',
    'javascript',
    'space',
    'web development',
    'c# and .net',
];

const fuzzyChars = "x0123456789?!@$\\%&=/+-";

let currentThingILike = 0;
let currentStep = 0;
let currentStepProgress = 0;
let currentString = thingsILike[currentThingILike];
let nextString = thingsILike[(currentThingILike + 1) % thingsILike.length];

const randomIndex = (max) => {
    return Math.floor(Math.random() * max);
}

const fuzzy = (current) => {
    let randomCharToReplace = randomIndex(current.length);

    while (fuzzyChars.includes(current[randomCharToReplace])) {
        randomCharToReplace = randomIndex(current.length);
    }

    let randomFuzzy = fuzzyChars[randomIndex(fuzzyChars.length)];

    while (current.includes(randomFuzzy)) {
        randomFuzzy = fuzzyChars[randomIndex(fuzzyChars.length)];
    }

    return current.substring(0, randomCharToReplace) + randomFuzzy + current.substring(randomCharToReplace + 1);
}

const midfuzzy = (current, next) => {
    if (current.length > next.length) {
        return current.substring(0, current.length - 1);
    } else if (current.length < next.length) {
        let randomFuzzy = fuzzyChars[randomIndex(fuzzyChars.length)];

        while (current.includes(randomFuzzy)) {
            randomFuzzy = fuzzyChars[randomIndex(fuzzyChars.length)];
        }

        return current + randomFuzzy;
    }

    return current;
}

const defuzzy = (current, next) => {
    let randomCharToReplace = randomIndex(current.length);

    while (!fuzzyChars.includes(current[randomCharToReplace])) {
        randomCharToReplace = randomIndex(current.length);
    }

    return current.substring(0, randomCharToReplace) + next[randomCharToReplace] + current.substring(randomCharToReplace + 1);
}

const typerFrame = () => {
    if (currentStep === 0) {
        currentString = fuzzy(currentString);
        currentStepProgress++;

        if (currentStepProgress === currentString.length) {
            currentStep = 1;
            currentStepProgress = 0;
        }
    } else if (currentStep === 1) {
        currentString = midfuzzy(currentString, nextString);
        currentStepProgress++;

        if (currentString.length === nextString.length) {
            currentStep = 2;
            currentStepProgress = 0;
        }
    } else if (currentStep === 2) {
        currentString = defuzzy(currentString, nextString);
        currentStepProgress++;

        if (currentStepProgress === nextString.length) {
            currentStep = 3;
            currentStepProgress = 0;
            currentThingILike = (currentThingILike + 1) % thingsILike.length;
            nextString = thingsILike[(currentThingILike + 1) % thingsILike.length];
        }
    } else if (currentStep === 3) {
        // Wait for a bit
        currentStepProgress++;

        if (currentStepProgress === typerFps) {
            currentStep = 0;
            currentStepProgress = 0;
        }
    }

    typer.textContent = currentString;

    setTimeout(typerFrame, 1000 / typerFps);       
}

(function() {
    typer = document.getElementById('typer');
    typerFrame();
})();