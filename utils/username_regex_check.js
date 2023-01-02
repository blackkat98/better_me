const regex = /[a-zA-Z0-9]+[a-zA-Z0-9_.@]+/
const check = (string) => {
    return regex.test(string)
}

module.exports = check
