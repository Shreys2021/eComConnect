
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        },
    }],
});

userSchema.methods.isValidPassword = async function (password) {
    try {
        console.log(password);
        console.log(this.password)
        const isPasswordValid = await bcrypt.compareSync(password, this.password);
        console.log(isPasswordValid);
        console.log(isPasswordValid)
        return isPasswordValid;
    } catch (error) {
        throw error;
    }
};

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log(`the surrent password is ${this.password}`);
        this.password = await bcrypt.hash(this.password, 10);
        console.log(`the surrent password is ${this.password}`);
    }
    next();
})


const User = mongoose.model('User', userSchema);


module.exports = User;