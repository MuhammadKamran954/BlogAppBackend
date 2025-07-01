function validateEmail(email,password){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!emailRegex.test(email)) {
        return { status: false, message: 'Invalid email format' };
    }

    if (!passwordRegex.test(password)) {
        return { status: false, message: 'Password must be at least 8 characters long and contain at least one letter and one number' };
    }

    return { status: true };
}

function validateName(firstName, lastName){
    const nameRegex = /^[a-zA-Z]{3,10}$/;

    if (!firstName || !nameRegex.test(firstName)) {
        return {
            success: false,
            message: "First name must be 3 to 10 alphabetic characters.",
            data: null
        };
    }
    if (!lastName || !nameRegex.test(lastName)) {
        return {
            success: false,
            message: "Last name must be 3 to 10 alphabetic characters.",
            data: null
        };
    }

    return { status: true };

}

module.exports = { validateEmail ,validateName};