const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likess = blogs.map(b => b.likes)
    const reducer = (sum, item) => {
        return sum + item
    }

    return likess.reduce(reducer)
}

module.exports = {
    dummy,
    totalLikes
}