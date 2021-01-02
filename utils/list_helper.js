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

const favoriteBlog = (blogs) => {
    const likes = blogs.map(b => b.likes)
    const top = likes.reduce( (a, b) => {
        return Math.max(a,b)
    })

    const favorite = blogs.filter(b => b.likes === top)
    return favorite[0]
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}